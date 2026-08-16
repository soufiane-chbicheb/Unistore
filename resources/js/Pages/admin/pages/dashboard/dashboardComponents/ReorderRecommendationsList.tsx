import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReorderItem } from '@/types/dashboardTypes';

interface ReorderRecommendationsListProps {
  items: ReorderItem[];
}

export function ReorderRecommendationsList({ items }: ReorderRecommendationsListProps) {
  const getPriorityColor = (priority: ReorderItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={20} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Reorder Recommendations</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-600 mt-1">{item.category}</p>
              <p className="text-xs text-gray-500 mt-1">
                Current: {item.currentStock} | Reorder: {item.reorderPoint}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
