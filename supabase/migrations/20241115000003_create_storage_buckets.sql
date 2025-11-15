-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('inventory', 'inventory', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('purchase', 'purchase', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sales', 'sales', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('production', 'production', true);

-- Storage policies for inventory bucket
CREATE POLICY "Authenticated users can upload to inventory"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'inventory');

CREATE POLICY "Anyone can view inventory files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'inventory');

CREATE POLICY "Authenticated users can update inventory files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'inventory');

CREATE POLICY "Authenticated users can delete inventory files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'inventory');

-- Storage policies for purchase bucket
CREATE POLICY "Authenticated users can upload to purchase"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'purchase');

CREATE POLICY "Authenticated users can view purchase files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'purchase');

CREATE POLICY "Authenticated users can update purchase files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'purchase');

CREATE POLICY "Authenticated users can delete purchase files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'purchase');

-- Storage policies for sales bucket
CREATE POLICY "Authenticated users can upload to sales"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'sales');

CREATE POLICY "Authenticated users can view sales files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'sales');

CREATE POLICY "Authenticated users can update sales files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'sales');

CREATE POLICY "Authenticated users can delete sales files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'sales');

-- Storage policies for production bucket
CREATE POLICY "Authenticated users can upload to production"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'production');

CREATE POLICY "Authenticated users can view production files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'production');

CREATE POLICY "Authenticated users can update production files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'production');

CREATE POLICY "Authenticated users can delete production files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'production');
