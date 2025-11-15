-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for items table
CREATE POLICY "Authenticated users can view items" ON public.items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert items" ON public.items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update items" ON public.items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete items" ON public.items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for stock_movements table
CREATE POLICY "Authenticated users can view stock movements" ON public.stock_movements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert stock movements" ON public.stock_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for purchase_orders table
CREATE POLICY "Authenticated users can view purchase orders" ON public.purchase_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchase orders" ON public.purchase_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchase orders" ON public.purchase_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchase orders" ON public.purchase_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for purchase_items table
CREATE POLICY "Authenticated users can view purchase items" ON public.purchase_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchase items" ON public.purchase_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchase items" ON public.purchase_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchase items" ON public.purchase_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for sales_orders table
CREATE POLICY "Authenticated users can view sales orders" ON public.sales_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales orders" ON public.sales_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales orders" ON public.sales_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales orders" ON public.sales_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for sales_items table
CREATE POLICY "Authenticated users can view sales items" ON public.sales_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales items" ON public.sales_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales items" ON public.sales_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales items" ON public.sales_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for bom table
CREATE POLICY "Authenticated users can view bom" ON public.bom
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert bom" ON public.bom
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update bom" ON public.bom
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete bom" ON public.bom
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for work_orders table
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert work orders" ON public.work_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update work orders" ON public.work_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete work orders" ON public.work_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for production_logs table
CREATE POLICY "Authenticated users can view production logs" ON public.production_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert production logs" ON public.production_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update production logs" ON public.production_logs
  FOR UPDATE USING (auth.role() = 'authenticated');
