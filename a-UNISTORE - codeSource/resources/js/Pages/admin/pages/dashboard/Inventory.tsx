import React, { useState, useMemo } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { router } from '@inertiajs/react';
import { useTheme } from "@/contextHooks/useTheme";

interface InventoryProduct {
  id: string | number;
  name: string;
  category: string;
  stockQuantity: number;
  sku: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface InventoryProps {
  products: InventoryProduct[];
  stats: {
    total_products: number;
    out_of_stock: number;
    low_stock: number;
  };
  charts: {
    stock_by_category: any[];
  };
  period: string;
}

export default function Inventory({ products, stats, charts, period }: InventoryProps) {
  const { theme: currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStock = stockFilter === 'all' || product.status === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const getStatusStyles = (status: InventoryProduct['status']) => {
    switch (status) {
      case 'in-stock':
        return { backgroundColor: `${currentTheme.success}20`, color: currentTheme.success };
      case 'low-stock':
        return { backgroundColor: `${currentTheme.warning}20`, color: currentTheme.warning };
      case 'out-of-stock':
        return { backgroundColor: `${currentTheme.error}20`, color: currentTheme.error };
      default:
        return { backgroundColor: `${currentTheme.text}10`, color: currentTheme.textMuted };
    }
  };

  return (
    <div 
      className="space-y-6 p-6 min-h-screen"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm mt-1" style={{ color: currentTheme.textMuted }}>Real-time product stock levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
        >
          <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>Total Products</p>
          <p className="text-2xl font-bold mt-2">{stats.total_products}</p>
        </div>
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
        >
          <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>Out of Stock</p>
          <p className="text-2xl font-bold mt-2" style={{ color: currentTheme.error }}>{stats.out_of_stock}</p>
        </div>
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
        >
          <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>Low Stock Warning</p>
          <p className="text-2xl font-bold mt-2" style={{ color: currentTheme.warning }}>{stats.low_stock}</p>
        </div>
      </div>

      <div 
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: currentTheme.card, borderColor: `${currentTheme.border}40` }}
      >
        <div className="p-4 border-b" style={{ borderColor: `${currentTheme.border}40` }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: currentTheme.textMuted }} />
              <input
                type="text"
                placeholder="Search inventory by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: `${currentTheme.bg} !important`, 
                  borderColor: `${currentTheme.border} !important`,
                  color: currentTheme.text,
                  '--tw-ring-color': currentTheme.accent
                } as React.CSSProperties}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: `${currentTheme.bg} !important`, 
                borderColor: `${currentTheme.border} !important`,
                color: currentTheme.text,
                '--tw-ring-color': currentTheme.accent
              } as React.CSSProperties}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: `${currentTheme.bg} !important`, 
                borderColor: `${currentTheme.border} !important`,
                color: currentTheme.text,
                '--tw-ring-color': currentTheme.accent
              } as React.CSSProperties}
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${currentTheme.text}05`, color: currentTheme.textMuted, borderColor: `${currentTheme.border}40` }}
              >
                <th className="px-6 py-4 text-left">Product Name</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Stock Level</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: `${currentTheme.border}20` }}>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-black/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: currentTheme.textMuted }}>{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{product.stockQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-[10px] font-bold uppercase rounded-full"
                      style={getStatusStyles(product.status)}
                    >
                      {product.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center" style={{ color: currentTheme.textMuted }}>
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

Inventory.layout = (page:any) => <AdminLayout children={page} />
