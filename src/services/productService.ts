import { supabase } from '../config/supabase';
import { FurnitureProduct } from '../models/types';

export class ProductService {
  /**
   * Creates a new furniture product
   */
  async createProduct(productData: Omit<FurnitureProduct, 'id' | 'created_at' | 'updated_at'>): Promise<FurnitureProduct | null> {
    const { data, error } = await supabase
      .from('furniture_products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data;
  }

  /**
   * Gets a product by ID
   */
  async getProduct(id: string): Promise<FurnitureProduct | null> {
    const { data, error } = await supabase
      .from('furniture_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  }

  /**
   * Gets all products
   */
  async getAllProducts(): Promise<FurnitureProduct[]> {
    const { data, error } = await supabase
      .from('furniture_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Updates product stock
   */
  async updateStock(productId: string, quantity: number): Promise<boolean> {
    const { error } = await supabase
      .from('furniture_products')
      .update({ stock_quantity: quantity })
      .eq('id', productId);

    if (error) {
      console.error('Error updating stock:', error);
      return false;
    }

    return true;
  }
}
