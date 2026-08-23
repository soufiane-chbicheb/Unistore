import React, { useState } from 'react';
import { 
  DollarSign, ShoppingCart, TrendingUp, Package, 
  ArrowUpRight, Clock, User
} from 'lucide-react';
import { MetricsCard } from './dashboardComponents/MetricsCard';
import { SalesChart } from './dashboardComponents/SalesChart';
import { TopSellingProductsChart } from './dashboardComponents/TopSellingProductsChart';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { router, Link } from '@inertiajs/react';
import { useTheme } from "@/contextHooks/useTheme";

interface OverviewProps {
  kpis: {
    total_revenue: number;
    total_orders: number;
    avg_order_value: number;
  };
  charts: {
    sales_trend: any[];
  };
  top_products: any[];
  recent_orders: any[];
  period: string;
}

export default function Overview({ kpis, charts, top_products, recent_orders, period }: OverviewProps) {
  const { theme: currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = (newPeriod: string) => {
    setLoading(true);
    router.get(route('dashboard.overview'), { period: newPeriod }, {
      preserveState: true,
      onFinish: () => setLoading(false)
    });
  };

  const periods = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const salesTrendData = (charts?.sales_trend || []).map(item => ({
    date: item.date,
    total: parseFloat(item.revenue || 0)
  }));

  return (
    <AdminLayout>
      <div 
        className="min-h-screen p-6 space-y-8"
        style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-2xl shadow-lg"
              style={{ backgroundColor: currentTheme.accent, boxShadow: `0 10px 15px -3px ${currentTheme.accent}33` }}
            >
              <Package size={24} style={{ color: currentTheme.textInverse }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>Welcome back! Here's what's happening today.</p>
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2 p-1.5 border rounded-2xl"
            style={{ backgroundColor: `${currentTheme.text}05`, borderColor: `${currentTheme.border}40` }}
          >
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                disabled={loading}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all`}
                style={{ 
                  backgroundColor: period === p.value ? currentTheme.accent : 'transparent',
                  color: period === p.value ? currentTheme.textInverse : currentTheme.textMuted,
                  boxShadow: period === p.value ? `0 4px 6px -1px ${currentTheme.accent}40` : 'none'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard 
            title="Total Revenue" 
            value={formatCurrency(kpis.total_revenue)} 
            icon={<DollarSign size={20} style={{ color: currentTheme.accent }} />}
          />
          <MetricsCard 
            title="Total Orders" 
            value={kpis.total_orders} 
            icon={<ShoppingCart size={20} style={{ color: currentTheme.info }} />}
          />
          <MetricsCard 
            title="Avg. Order Value" 
            value={formatCurrency(kpis.avg_order_value)} 
            icon={<TrendingUp size={20} style={{ color: currentTheme.success }} />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div 
            className="lg:col-span-2 p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Sales Trend</h3>
              <ArrowUpRight size={20} style={{ color: currentTheme.accent }} />
            </div>
            <div className="h-[350px]">
              <SalesChart data={salesTrendData} />
            </div>
          </div>

          <div 
            className="p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <h3 className="text-lg font-bold">Top Products</h3>
            <div className="h-[300px]">
              <TopSellingProductsChart products={top_products} />
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div 
          className="p-6 rounded-3xl border space-y-6"
          style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <Link 
              href={route('orders.index')} 
              className="text-sm font-bold hover:underline"
              style={{ color: currentTheme.accent }}
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr 
                  className="text-xs uppercase border-b"
                  style={{ color: currentTheme.textMuted, borderColor: `${currentTheme.border}40` }}
                >
                  <th className="pb-4 font-bold">Order #</th>
                  <th className="pb-4 font-bold">Customer</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: `${currentTheme.border}40` }}>
                {recent_orders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-4 font-bold">{order.order_number}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${currentTheme.text}05` }}
                        >
                          <User size={14} style={{ color: currentTheme.textMuted }} />
                        </div>
                        <span>{order.user?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold">{formatCurrency(order.total_amount)}</td>
                    <td className="py-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase`}
                        style={{ 
                          backgroundColor: order.order_status === 'delivered' ? `${currentTheme.success}20` :
                                           order.order_status === 'pending' ? `${currentTheme.accent}20` :
                                           `${currentTheme.text}10`,
                          color: order.order_status === 'delivered' ? currentTheme.success :
                                 order.order_status === 'pending' ? currentTheme.accent :
                                 currentTheme.textMuted
                        }}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-4 flex items-center gap-1" style={{ color: currentTheme.textMuted }}>
                      <Clock size={12} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
