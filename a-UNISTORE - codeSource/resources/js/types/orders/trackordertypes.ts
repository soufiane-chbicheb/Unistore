export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id: number;
  product_name: string;
  price_snapshot: number;
  subtotal: number;
  quantity: number;
  thumbnail: string | null;
}

export interface OrderAddress {
  id: number;
  order_id: number;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  email: string | null;
  company: string | null;
}

export interface OrderCoupon {
  id: number;
  code: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  coupon_id: number | null;
  customer_avatar: string | null;  // resolved by controller: media URL or null
  status: 'pending' | 'out_for_delivery' | 'delivery_failed' | 'delivered' | 'canceled' | 'returned';
  confirmed: boolean;
  tax: number;
  currency: string;
  payment_method: 'cod' | 'card' | 'paypal';
  shipping_cost: number | null;
  discount_amount: number | null;
  total_amount: number;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
  address: OrderAddress;
  coupon: OrderCoupon | null;
}

export interface ShippingZone {
  id: number;
  name: string;
  price: number;
  estimated_days: number | null;
}

export interface TrackOrderProps {
  order: Order;
  shipping: ShippingZone;
}