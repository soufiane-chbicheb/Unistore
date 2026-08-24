import { Product } from '@/types/dashboardTypes';
import React from 'react';

interface TopProductsListProps {
  products: Product[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-gray-900">{product.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ${product.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
