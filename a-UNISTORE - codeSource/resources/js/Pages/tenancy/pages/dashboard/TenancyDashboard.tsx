import React from 'react';
import { Head } from "@inertiajs/react";
import { LayoutDashboard, Globe, CreditCard, Settings } from "lucide-react";
import { TenancyLayout } from '../../components/layout/TenancyLayout';
import { useTenancyTheme } from '../../hooks/useTenancyTheme';

export default function TenancyDashboard() {
  const { theme } = useTenancyTheme();
  
  const stats = [
    { title: "Total Tenants", value: "24", icon: Globe, color: theme.accent },
    { title: "Active Subscriptions", value: "18", icon: CreditCard, color: "#10b981" },
    { title: "System Health", value: "99.9%", icon: Settings, color: "#f59e0b" },
    { title: "Pending Requests", value: "3", icon: LayoutDashboard, color: "#8b5cf6" },
  ];

  return (
    <>
      <Head title="Tenancy Dashboard" />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text }}>Tenancy Dashboard</h1>
          <p style={{ color: theme.textMuted }}>Manage your multi-tenant ecosystem from here.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-xl border shadow-sm flex items-center gap-4"
              style={{ background: theme.bgSecondary, borderColor: theme.border }}
            >
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textMuted }}>{stat.title}</p>
                <h3 className="text-2xl font-bold" style={{ color: theme.text }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div 
            className="md:col-span-4 p-6 rounded-xl border shadow-sm"
            style={{ background: theme.bgSecondary, borderColor: theme.border }}
          >
            <h3 className="font-semibold mb-4" style={{ color: theme.text }}>Recent Tenant Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: `${theme.bg}80` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                    >
                      S{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.text }}>Store_{i+1} Instance Created</p>
                      <p className="text-xs" style={{ color: theme.textMuted }}>2 hours ago</p>
                    </div>
                  </div>
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ backgroundColor: '#10b98120', color: '#10b981' }}
                  >
                    Success
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="md:col-span-3 p-6 rounded-xl border shadow-sm"
            style={{ background: theme.bgSecondary, borderColor: theme.border }}
          >
            <h3 className="font-semibold mb-4" style={{ color: theme.text }}>Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                className="w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium border"
                style={{ borderColor: theme.border, color: theme.text, background: theme.bg }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = theme.bgSecondary}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = theme.bg}
              >
                + New Tenant Instance
              </button>
              <button 
                className="w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium border"
                style={{ borderColor: theme.border, color: theme.text, background: theme.bg }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = theme.bgSecondary}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = theme.bg}
              >
                Generate Usage Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

TenancyDashboard.layout = (page: React.ReactNode) => <TenancyLayout children={page} />;
