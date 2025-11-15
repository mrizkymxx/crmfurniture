export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  trial_started_at?: Date;
  trial_ends_at?: Date;
  is_trial_active?: boolean;
  subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface FurnitureProduct {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Order {
  id?: string;
  customer_id: string;
  order_date?: Date;
  total_amount: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: Date;
}
