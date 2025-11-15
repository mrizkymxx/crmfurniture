/**
 * Example usage of CRM Furniture system with trial functionality
 * 
 * This file demonstrates how to use the customer and product services
 * to manage a furniture CRM with trial periods.
 */

import { CustomerService } from './services/customerService';
import { ProductService } from './services/productService';

async function runExample() {
  console.log('🚀 Running CRM Furniture Example\n');

  // Initialize services
  const customerService = new CustomerService();
  const productService = new ProductService();

  // Example 1: Create a new customer with automatic trial
  console.log('📝 Creating a new customer with trial...');
  const newCustomer = await customerService.createCustomer({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0123',
    company: 'Modern Furniture Co.'
  });

  if (newCustomer) {
    console.log('✅ Customer created:', newCustomer.name);
    console.log(`   Trial ends: ${newCustomer.trial_ends_at}`);
    console.log(`   Status: ${newCustomer.subscription_status}\n`);

    // Example 2: Check trial status
    console.log('🔍 Checking trial status...');
    const trialStatus = await customerService.getTrialStatus(newCustomer.id!);
    if (trialStatus) {
      console.log(`   Trial active: ${trialStatus.isActive}`);
      console.log(`   Days remaining: ${trialStatus.daysRemaining}\n`);
    }
  }

  // Example 3: Create furniture products
  console.log('🪑 Creating furniture products...');
  const products = [
    {
      name: 'Modern Sofa',
      description: 'Contemporary 3-seater sofa with gray fabric',
      category: 'Sofas',
      price: 1299.99,
      stock_quantity: 8
    },
    {
      name: 'Wooden Coffee Table',
      description: 'Solid oak coffee table with storage',
      category: 'Tables',
      price: 499.99,
      stock_quantity: 15
    },
    {
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support',
      category: 'Chairs',
      price: 349.99,
      stock_quantity: 25
    }
  ];

  for (const productData of products) {
    const product = await productService.createProduct(productData);
    if (product) {
      console.log(`✅ Created: ${product.name} - $${product.price}`);
    }
  }

  // Example 4: List all products
  console.log('\n📋 All products in catalog:');
  const allProducts = await productService.getAllProducts();
  allProducts.forEach(p => {
    console.log(`   - ${p.name} (${p.category}): $${p.price} [Stock: ${p.stock_quantity}]`);
  });

  // Example 5: List customers with active trials
  console.log('\n👥 Customers with active trials:');
  const activeTrials = await customerService.getActiveTrialCustomers();
  activeTrials.forEach(c => {
    console.log(`   - ${c.name} (${c.email})`);
  });

  // Example 6: Extend trial period
  if (newCustomer && newCustomer.id) {
    console.log('\n⏰ Extending trial by 15 days...');
    const extended = await customerService.extendTrial(newCustomer.id, 15);
    if (extended) {
      console.log('✅ Trial extended successfully');
      const updatedStatus = await customerService.getTrialStatus(newCustomer.id);
      if (updatedStatus) {
        console.log(`   New days remaining: ${updatedStatus.daysRemaining}`);
      }
    }
  }

  console.log('\n✨ Example completed!\n');
}

// Run the example
runExample().catch(error => {
  console.error('❌ Error running example:', error);
  process.exit(1);
});
