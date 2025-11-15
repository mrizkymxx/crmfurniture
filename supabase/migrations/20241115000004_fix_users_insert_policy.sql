-- Fix RLS policy for users table to allow registration
-- This allows new users to insert their profile during registration

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
