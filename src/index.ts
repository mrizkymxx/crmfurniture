import { CustomerService } from './services/customerService';
import { ProductService } from './services/productService';
import { config } from './config/supabase';

export { CustomerService, ProductService, config };

export * from './models/types';
export * from './utils/trialHelpers';

// Main entry point for demonstration
async function main() {
  console.log('🪑 CRM Furniture System with Trial Functionality');
  console.log('================================================\n');
  
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.log('⚠️  Supabase credentials not configured.');
    console.log('Please copy .env.example to .env and add your Supabase credentials.\n');
    console.log('To get started:');
    console.log('1. Create a Supabase project at https://supabase.com');
    console.log('2. Copy your project URL and anon key');
    console.log('3. Update the .env file with your credentials');
    console.log('4. Run the migration script in supabase/migrations/001_initial_schema.sql');
    return;
  }
  
  console.log('✅ Supabase configured');
  console.log(`📅 Trial duration: ${config.trialDurationDays} days\n`);
  
  // Example usage
  const customerService = new CustomerService();
  const productService = new ProductService();
  
  console.log('🎯 Services initialized successfully!');
  console.log('\nAvailable services:');
  console.log('- CustomerService: Manage customers with trial functionality');
  console.log('- ProductService: Manage furniture products');
  console.log('\nExample usage:');
  console.log('```typescript');
  console.log('const customerService = new CustomerService();');
  console.log('const customer = await customerService.createCustomer({');
  console.log('  name: "John Doe",');
  console.log('  email: "john@example.com",');
  console.log('  company: "Furniture Store Inc"');
  console.log('});');
  console.log('```\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
