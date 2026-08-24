import React, { useState } from 'react';
import { 
  Users, UserPlus, MapPin, Globe, 
  TrendingUp, Star, Award, Search,
  Filter, Download, Calendar, Mail,
  ArrowUpRight, ArrowDownRight, CreditCard,
  PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { MetricsCard } from './dashboardComponents/MetricsCard';
import { CustomerGrowthChart } from './dashboardComponents/CustomerGrowthChart';
import { StatusDonutChart } from './dashboardComponents/StatusDonutChart';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { router } from '@inertiajs/react';
import { useTheme } from "@/contextHooks/useTheme";

interface CustomerAnalyticsProps {
  kpis: {
    total_customers: { value: number; change: number };
    repeat_customer_rate: { value: number; change: number };
    new_customers_today: number;
  };
  charts: {
    customer_growth: any[];
    registration_methods: any[];
    geographical_distribution: any[];
  };
  top_spenders: any[];
  period: string;
}

export default function CustomerAnalytics({ kpis, charts, top_spenders, period }: CustomerAnalyticsProps) {
  const { theme: currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = (newPeriod: string) => {
    setLoading(true);
    router.get(route('dashboard.customers_analytics'), { period: newPeriod }, {
      preserveState: true,
      onFinish: () => setLoading(false)
    });
  };

  const periods = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
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

  const registrationData = charts.registration_methods.map(item => ({
    status: item.method,
    count: item.count
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
              style={{ backgroundColor: currentTheme.info, boxShadow: `0 10px 15px -3px ${currentTheme.info}33` }}
            >
              <Users size={24} style={{ color: currentTheme.textInverse }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Customer Analytics</h1>
              <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>Understand your audience and their behavior</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard 
            title="Total Customers" 
            value={kpis.total_customers.value} 
            icon={<Users size={20} style={{ color: currentTheme.info }} />}
            change={kpis.total_customers.change}
          />
          <MetricsCard 
            title="Repeat Customer Rate" 
            value={`${kpis.repeat_customer_rate.value}%`} 
            icon={<Activity size={20} style={{ color: currentTheme.success }} />}
            change={kpis.repeat_customer_rate.change}
          />
          <MetricsCard 
            title="New Customers Today" 
            value={kpis.new_customers_today} 
            icon={<UserPlus size={20} style={{ color: currentTheme.accent }} />}
          />
          <MetricsCard 
            title="Top Spenders Count" 
            value={top_spenders.length} 
            icon={<Award size={20} style={{ color: currentTheme.warning }} />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Growth Chart */}
          <div 
            className="lg:col-span-2 p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Customer Growth</h3>
                <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>New registered users over time</p>
              </div>
              <TrendingUp size={20} style={{ color: currentTheme.info }} />
            </div>
            <div className="h-[350px]">
              <CustomerGrowthChart data={charts.customer_growth} />
            </div>
          </div>

          {/* Registration Methods */}
          <div 
            className="p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Signup Methods</h3>
              <PieChartIcon size={20} style={{ color: currentTheme.warning }} />
            </div>
            <div className="h-[300px]">
              <StatusDonutChart data={registrationData} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Spenders Table */}
          <div 
            className="p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Top Spenders (CLV)</h3>
              <Star size={20} style={{ color: currentTheme.accent }} />
            </div>
            <div className="space-y-4">
              {top_spenders.map((spender, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{ backgroundColor: `${currentTheme.text}05`, borderColor: `${currentTheme.border}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: `${currentTheme.info}20`, color: currentTheme.info }}
                    >
                      {spender.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{spender.user?.name || 'Guest Customer'}</p>
                      <p className="text-xs" style={{ color: currentTheme.textMuted }}>{spender.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: currentTheme.accent }}>{formatCurrency(spender.total_spent)}</p>
                    <p className="text-xs" style={{ color: currentTheme.textMuted }}>{spender.orders_count} orders</p>
                  </div>
                </div>
              ))}
              {top_spenders.length === 0 && (
                <div className="text-center py-8" style={{ color: currentTheme.textMuted }}>No customer data available</div>
              )}
            </div>
          </div>

          {/* Geographical Distribution */}
          <div 
            className="p-6 rounded-3xl border space-y-6"
            style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Top Shipping Cities</h3>
              <MapPin size={20} style={{ color: currentTheme.success }} />
            </div>
            <div className="space-y-4">
              {charts.geographical_distribution.map((city, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{ backgroundColor: `${currentTheme.text}05`, borderColor: `${currentTheme.border}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${currentTheme.success}20`, color: currentTheme.success }}
                    >
                      <Globe size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{city.city}</p>
                      <p className="text-xs" style={{ color: currentTheme.textMuted }}>{city.orders_count} orders</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">{formatCurrency(city.total_revenue)}</p>
                </div>
              ))}
              {charts.geographical_distribution.length === 0 && (
                <div className="text-center py-8" style={{ color: currentTheme.textMuted }}>No geographical data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
