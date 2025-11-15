import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
}

// Create a mock client if credentials are not provided, to allow the app to run in demo mode
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  trialDurationDays: parseInt(process.env.TRIAL_DURATION_DAYS || '30', 10),
};
