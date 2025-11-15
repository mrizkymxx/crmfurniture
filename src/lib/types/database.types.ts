export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          item_code: string
          name: string
          description: string | null
          category: string | null
          unit: string
          unit_price: number
          current_stock: number
          min_stock: number
          max_stock: number | null
          image_url: string | null
          is_raw_material: boolean
          is_finished_good: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_code: string
          name: string
          description?: string | null
          category?: string | null
          unit?: string
          unit_price?: number
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          image_url?: string | null
          is_raw_material?: boolean
          is_finished_good?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_code?: string
          name?: string
          description?: string | null
          category?: string | null
          unit?: string
          unit_price?: number
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          image_url?: string | null
          is_raw_material?: boolean
          is_finished_good?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          item_id: string
          movement_type: 'in' | 'out' | 'adjustment'
          quantity: number
          reference_type: string | null
          reference_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          movement_type: 'in' | 'out' | 'adjustment'
          quantity: number
          reference_type?: string | null
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          movement_type?: 'in' | 'out' | 'adjustment'
          quantity?: number
          reference_type?: string | null
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          po_number: string
          supplier_name: string
          supplier_contact: string | null
          order_date: string
          expected_date: string | null
          status: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          notes: string | null
          document_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          po_number: string
          supplier_name: string
          supplier_contact?: string | null
          order_date?: string
          expected_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          total_amount?: number
          notes?: string | null
          document_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          po_number?: string
          supplier_name?: string
          supplier_contact?: string | null
          order_date?: string
          expected_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          total_amount?: number
          notes?: string | null
          document_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchase_items: {
        Row: {
          id: string
          purchase_order_id: string
          item_id: string
          quantity: number
          unit_price: number
          total_price: number
          received_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          purchase_order_id: string
          item_id: string
          quantity: number
          unit_price: number
          received_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          purchase_order_id?: string
          item_id?: string
          quantity?: number
          unit_price?: number
          received_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales_orders: {
        Row: {
          id: string
          so_number: string
          customer_name: string
          customer_contact: string | null
          customer_address: string | null
          order_date: string
          delivery_date: string | null
          status: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          shipping_status: string
          total_amount: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          so_number: string
          customer_name: string
          customer_contact?: string | null
          customer_address?: string | null
          order_date?: string
          delivery_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          shipping_status?: string
          total_amount?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          so_number?: string
          customer_name?: string
          customer_contact?: string | null
          customer_address?: string | null
          order_date?: string
          delivery_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          shipping_status?: string
          total_amount?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_items: {
        Row: {
          id: string
          sales_order_id: string
          item_id: string
          quantity: number
          unit_price: number
          total_price: number
          shipped_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sales_order_id: string
          item_id: string
          quantity: number
          unit_price: number
          shipped_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sales_order_id?: string
          item_id?: string
          quantity?: number
          unit_price?: number
          shipped_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      bom: {
        Row: {
          id: string
          finished_good_id: string
          raw_material_id: string
          quantity_required: number
          unit: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          finished_good_id: string
          raw_material_id: string
          quantity_required: number
          unit?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          finished_good_id?: string
          raw_material_id?: string
          quantity_required?: number
          unit?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      work_orders: {
        Row: {
          id: string
          wo_number: string
          item_id: string
          quantity_to_produce: number
          quantity_produced: number
          production_stage: 'assembling' | 'finishing' | 'packing' | 'completed'
          status: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          start_date: string | null
          target_date: string | null
          completion_date: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wo_number: string
          item_id: string
          quantity_to_produce: number
          quantity_produced?: number
          production_stage?: 'assembling' | 'finishing' | 'packing' | 'completed'
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          start_date?: string | null
          target_date?: string | null
          completion_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wo_number?: string
          item_id?: string
          quantity_to_produce?: number
          quantity_produced?: number
          production_stage?: 'assembling' | 'finishing' | 'packing' | 'completed'
          status?: 'draft' | 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled'
          start_date?: string | null
          target_date?: string | null
          completion_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      production_logs: {
        Row: {
          id: string
          work_order_id: string
          production_stage: 'assembling' | 'finishing' | 'packing' | 'completed'
          quantity_completed: number
          notes: string | null
          logged_by: string | null
          logged_at: string
        }
        Insert: {
          id?: string
          work_order_id: string
          production_stage: 'assembling' | 'finishing' | 'packing' | 'completed'
          quantity_completed: number
          notes?: string | null
          logged_by?: string | null
          logged_at?: string
        }
        Update: {
          id?: string
          work_order_id?: string
          production_stage?: 'assembling' | 'finishing' | 'packing' | 'completed'
          quantity_completed?: number
          notes?: string | null
          logged_by?: string | null
          logged_at?: string
        }
      }
    }
  }
}
