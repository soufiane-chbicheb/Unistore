// Single statistic entry
interface OrderStatistic {
  count: number;
  change_percent: number;
}

// Statistics for all statuses
interface OrdersStatistics {
  total: OrderStatistic;
  pending: OrderStatistic;
  out_for_delivery: OrderStatistic;
  delivered: OrderStatistic;
  delivery_failed: OrderStatistic;
  returned: OrderStatistic;
  confirmed: OrderStatistic;
  canceled: OrderStatistic;
}

export interface Order {
  id: number;                        // internal ID, not usually visible
  order_number: string;
  customer: {
      id : number  , 
      name : string  , 
      avatar : string ,
      email : string , 
      phone : string
  };
  order_items: {
    ItemName : string
    ItemImage : string
    ItemId : string
    ItemQuantity: number;
    ItemPrice: number;
  }[];                                // array of products in the order
  address : {
    address_line1 :string | null ;
    address_line2 : string | null ;
    city : string
    state : string | null
    postal_code : number | null
    country :  string
    phone :  string
  }
  total_amount: number;
  currency: "MAD";
  payment_method: 'Card' | 'Paypal' | 'COD';
  status: 'delivered' | 'out_for_delivery' | 'delivery_failed' | 'pending' | 'canceled' | 'returned';
  confirmed: boolean;
  paid: boolean;
  shipping_cost?: number;
  discount_amount?: number;
  tax?: number;
  notes?: string;
  updated_at: string;
  created_at: string;
}
// Paginated orders
interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Full response from backend
export interface OrdersResponse {
  sheetUrl?:string, 
  success?:string;
  orders: PaginatedOrders;
  statistics: OrdersStatistics;
}
