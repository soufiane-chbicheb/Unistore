import React, { useState, useMemo, FC, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { Download, Plus, Calendar, RefreshCw, Phone, Mail, Eye, Ban, CheckCircle, Award, Search, X, PersonStanding } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/admin/components/layout/SectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { AvatarImage } from '@/components/ui/avatar';
import { TableMeta } from '@/components/ui/TableMeta';
import { PaginationTable } from '@/admin/components/layout/Pagination';
import MultiSelectDropdownForObject, { AllowedObjectsType } from '@/components/ui/MultiSelectDropdownForObject';
import { usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

// Types
type CustomerStatus = 'active' | 'vip' | 'blocked';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string;
  status: CustomerStatus;
  created_at: string;
  notes: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  address: string;
}

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'icon';
type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'warning';
type Trend = 'up' | 'down';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}


interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  trend: Trend;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomersTableProps {
    searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

interface CustomerDetailsModalProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}









const StatsCard: FC<StatsCardProps> = ({ title, value, change, trend, icon: Icon }) => (
  <Card className="p-6 rounded-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </p>
      </div>
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  </Card>
);


const CustomersTable: FC<CustomersTableProps> = ({
  customers,
  onViewDetails,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  const {
    state: { currentTheme: theme },
  } = useAdminThemeCtx();
  const [perPage, setPerPage] = useState<string>('10');

  return (
    <Card
      className="overflow-hidden"
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.borderRadius,
        boxShadow: theme.shadowLg,
      }}
    >
      {/* ================= HEADER / FILTERS ================= */}
      <CardHeader
        style={{
          background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: theme.textMuted }}
            />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="transition-all focus:scale-[1.02]"
              style={{ border: `2px solid ${theme.border}` }}
            />
          </div>

          {/* Status Filter */}
          <MultiSelectDropdownForObject
            multiple={false}
            label="Status"
            selectedValues={[{
              value: statusFilter,
              label:
                statusFilter === "all"
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1),
            }]}
            onChange={(selected : AllowedObjectsType[]) =>
              onStatusChange(String(selected[0].value))
            }
            options={[
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "VIP", value: "vip" },
              { label: "Blocked", value: "blocked" },
            ]}
          />          
        </div>
      </CardHeader>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: theme.bgSecondary,
                borderBottom: `2px solid ${theme.border}`,
              }}
            >
              {[
                "Customer",
                "Contact",
                "Orders",
                "Total Spent",
                "Last Order",
                "Status",
                "Actions",
              ].map((head) => (
                <TableHead
                  key={head}
                  className={head === "Actions" ? "text-right" : ""}
                  style={{
                    color: theme.textSecondary,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="hover:bg-opacity-50 transition-colors"
                style={{
                  background: theme.bg,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                {/* Customer */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.bgSecondary} 0%, ${theme.border} 100%)`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <PersonStanding
                        size={18}
                        style={{ color: theme.textSecondary }}
                      />
                    </div>

                    <div>
                      <div
                        className="font-medium"
                        style={{ color: theme.text }}
                      >
                        {customer.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: theme.textMuted }}
                      >
                        Joined {customer.created_at}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Phone size={14} style={{ color: theme.textMuted }} />
                    <a href={`tel:${customer.phone}`} className="hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} style={{ color: theme.textMuted }} />
                      <a
                        href={`mailto:${customer.email}`}
                        className="hover:underline"
                      >
                        {customer.email}
                      </a>
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium">
                  {customer.orders_count}
                </TableCell>

                <TableCell className="font-medium">
                  {customer.total_spent} MAD
                </TableCell>

                <TableCell className="text-sm">
                  {customer.last_order_date}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {customer.status === "vip" && (
                    <Badge variant="warning" className="gap-1">
                      <Award size={12} /> VIP
                    </Badge>
                  )}
                  {customer.status === "active" && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle size={12} /> Active
                    </Badge>
                  )}
                  {customer.status === "blocked" && (
                    <Badge variant="destructive" className="gap-1">
                      <Ban size={12} /> Blocked
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(customer)}
                  >
                    <Eye size={16} />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};







export default function CustomersManager() {
  const { customers = [] } = usePage().props as any;
  const {
    state: { currentTheme: theme },
  } = useAdminThemeCtx();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: any) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((c: any) => c.status === 'active').length,
      vip: customers.filter((c: any) => c.status === 'vip').length,
      newThisMonth: customers.filter((c: any) => {
        const joinedDate = new Date(c.created_at);
        const now = new Date();
        return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
      }).length,
    };
  }, [customers]);

  const handleViewDetails = (customer: Customer) => {
    router.visit(route('customers.show', { id: customer.id }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <SectionHeader
          title="Customers Management"
          description="View and manage your store customers"
        >
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Customers"
            value={stats.total}
            change="12% from last month"
            trend="up"
            icon={PersonStanding}
          />
          <StatsCard
            title="Active Customers"
            value={stats.active}
            change="5% from last month"
            trend="up"
            icon={CheckCircle}
          />
          <StatsCard
            title="VIP Customers"
            value={stats.vip}
            change="2% from last month"
            trend="up"
            icon={Award}
          />
          <StatsCard
            title="New Customers"
            value={stats.newThisMonth}
            change="8% from last month"
            trend="up"
            icon={Plus}
          />
        </div>

        <CustomersTable
          customers={filteredCustomers}
          onViewDetails={handleViewDetails}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onClearFilters={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
          hasActiveFilters={searchQuery !== '' || statusFilter !== 'all'}
        />

      </div>
    </AdminLayout>
  );
}

