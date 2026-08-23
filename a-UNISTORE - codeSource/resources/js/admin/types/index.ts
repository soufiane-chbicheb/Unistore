export type AdminRole = "super_admin" | "manager" | "support" | "viewer";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partially_refunded";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type CouponType = "percentage" | "fixed" | "free_shipping";
export type VariantType = "color" | "size" | "material" | "fit";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersChange: number;
  revenueChange: number;
  customersChange: number;
  productsChange: number;
}

export interface SalesChartData {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  sku: string;
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingCountry: string | null;
  shippingPostalCode: string | null;
  notes: string | null;
  createdAt: Date | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: string;
    total: string;
  }>;
}

export interface CustomerWithOrders {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  status: string;
  totalSpent: string;
  orderCount: number;
  createdAt: Date | null;
  orders: Array<{
    id: string;
    orderNumber: string;
    total: string;
    status: OrderStatus;
    createdAt: Date | null;
  }>;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  granularity: "daily" | "weekly" | "monthly";
}
