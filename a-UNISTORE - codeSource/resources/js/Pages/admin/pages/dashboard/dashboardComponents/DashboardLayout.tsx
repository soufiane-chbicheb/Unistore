import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { DollarSign, ShoppingCart, TrendingUp, Users, Package } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your sales, customers, and inventory</p>
        </div>
      </header>

      <Tabs.Root value={activeTab} onValueChange={onTabChange}>
        <div className="bg-white border-b border-gray-200">
          <Tabs.List className="flex px-6 gap-8">
            <Tabs.Trigger
              value="dashboard"
              className="py-4 px-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <TrendingUp size={18} />
              Dashboard
            </Tabs.Trigger>
            <Tabs.Trigger
              value="customers"
              className="py-4 px-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Users size={18} />
              Customers
            </Tabs.Trigger>
            <Tabs.Trigger
              value="inventory"
              className="py-4 px-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Package size={18} />
              Inventory
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <div className="p-6">
          {children}
        </div>
      </Tabs.Root>
    </div>
  );
}
