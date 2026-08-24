import { useState, useMemo, useEffect } from 'react';
import { Download, Plus, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Stats } from '@/admin/types/ordersTypes';
import { StatsCard } from './ordersComponents/StatsCard';
import { OrderFilters } from './ordersComponents/OrderFilters';
import { Card } from '../../../../components/ui/card';
import { OrdersTable } from './ordersComponents/OrdersTable';
import { OrderDetailsModal } from './ordersComponents/OrderDetailsModal';
import { generateOrders } from '@/admin/data/orders';
import { Button } from '@/components/ui/button';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { SectionHeader } from '@/admin/components/layout/SectionHeader';
import { PaginationTable } from '@/admin/components/layout/Pagination';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { TableMeta } from '@/components/ui/TableMeta';
import { Order, OrdersResponse } from '@/types/orders/ordersTypes';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';


function OrderManager({orders : paginatedOrders , statistics : stats  , sheetUrl } : OrdersResponse) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountPerPage ,setAmountPerPage] = useState(paginatedOrders.per_page) ;
  const [currentPage , setCurrentPage] = useState(paginatedOrders.current_page) ; 
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const {state : {currentTheme}} =  useAdminThemeCtx()
  const allOrders = generateOrders();

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const orderDate = new Date(order.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = orderDate >= fromDate && orderDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, statusFilter, dateFrom, dateTo, allOrders]);
 
  
 
  const handleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  // const handleSelectAll = () => {
  //   setSelectedOrders(
  //     selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0 ? [] : paginatedOrders.map((o) => o.id)
  //   );
  // };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo;


  const handleCreateSheet = async () => {
    if(!sheetUrl || sheetUrl == '' )  globalThis.location.href = '/sheetAuth/google/auth'; 
    else {
        // Sheet exists, open it
        window.open(sheetUrl, '_blank'); // Opens in new tab
    }
  }
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
  };

  const handlePageChange = (action  : 'prev' | 'next' | number) => {

    setCurrentPage(prev => {
    if (typeof action === 'string'  && action === 'prev') return Math.max(1, prev - 1);
    if (typeof action === 'string'  && action === 'next') return Math.min(paginatedOrders.total, prev + 1);
    if(typeof action === 'number' && Number(action)) return action
    return prev ;
  });
  
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <SectionHeader title='Manage Orders'  description="Organize and manage all your orders" >
          {/* actions */}
            <div className='flex gap-4'>
              <Button type="button" variant="outline" className="rounded-lg">
              <Download size={18} />
              Export
            </Button>
            <Button type="button" className="rounded-lg" variant='default'>
              <Plus size={18} />
              Create Order
            </Button>
            <Button onClick={handleCreateSheet}>
              <Plus />
              {sheetUrl ? 'Open sheet' : 'Create Sheet'}
            </Button>
            </div>
        </SectionHeader>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>Last update: 1 Oct 2024</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-lg">
            <RefreshCw size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatsCard
            title="Total Orders"
            value={stats?.total?.count}
            change={stats?.total?.change_percent}
            trend={stats?.total?.change_percent >= 0 ? 'up' : 'down'}
          />

          <StatsCard
            title="Cancelled"
            value={stats?.canceled?.count}
            change={stats?.canceled?.change_percent}
            trend={stats?.canceled?.change_percent >= 0 ? 'up' : 'down'}
          />

          <StatsCard
            title="Pending"
            value={stats?.pending?.count}
            change={stats?.pending?.change_percent}
            trend={stats?.pending?.change_percent >= 0 ? 'up' : 'down'}
          />

          <StatsCard
            title="Returned"
            value={stats?.returned?.count}
            change={stats?.returned?.change_percent}
            trend={stats?.returned?.change_percent >= 0 ? 'up' : 'down'}
          />

          <StatsCard
            title="Delivered"
            value={stats?.delivered?.count}
            change={stats?.delivered?.change_percent}
            trend={stats?.delivered?.change_percent >= 0 ? 'up' : 'down'}
          />

          <StatsCard
            title="Confirmed"
            value={stats?.confirmed?.count}
            change={stats?.confirmed?.change_percent}
            trend={stats?.confirmed?.change_percent >= 0 ? 'up' : 'down'}
          />

        </div>

      
        <OrdersTable
          orders={paginatedOrders.data ?? []}
        />

         {/* pagination */}

         <TableMeta onPerPageChange={(perPage) => setAmountPerPage(Number(perPage))} perPage={amountPerPage} currentPage={paginatedOrders.current_page} totalItems={paginatedOrders.total} >
             <PaginationTable  totalPages={paginatedOrders.total} currentPage={currentPage} onCurrentPageChange={handlePageChange}  />
         </TableMeta>
      </div>

    </div>
  );
}





export default OrderManager;

OrderManager.layout = (page:any) => <AdminLayout children={page} />


