export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  revenue: number;
}

export interface SalesData {
  date: string;
  revenue: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  status: 'active' | 'inactive';
  joinDate: string;
  orders: Order[];
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  reorderPoint?: number;
  turnoverRate?: number;
  lastRestocked?: string;
}

export interface StockByCategory {
  category: string;
  stockLevel: number;
}

export interface ReorderItem {
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  priority: 'low' | 'medium' | 'high';
}

export interface SalesByCategory {
  category: string;
  value: number;
  percentage: number;
  color: string;
}
