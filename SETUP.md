# Setup Guide

This guide will help you get started with the CRM Furniture application.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Supabase account (free tier available at https://supabase.com)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
TRIAL_DURATION_DAYS=30
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and execute the SQL script

This will create:
- `customers` table with trial tracking fields
- `furniture_products` table for product catalog
- `orders` and `order_items` tables for order management
- Necessary indexes and triggers

### 4. Build the Application

```bash
npm run build
```

### 5. Run the Application

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 6. Run Tests

```bash
npm test
```

## Quick Usage Examples

### Create a Customer with Trial

```typescript
import { CustomerService } from './src/services/customerService';

const customerService = new CustomerService();

const customer = await customerService.createCustomer({
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Furniture Co.'
});

console.log(`Trial ends: ${customer.trial_ends_at}`);
```

### Check Trial Status

```typescript
const trialStatus = await customerService.getTrialStatus(customer.id);
console.log(`Days remaining: ${trialStatus.daysRemaining}`);
```

### Create a Product

```typescript
import { ProductService } from './src/services/productService';

const productService = new ProductService();

const product = await productService.createProduct({
  name: 'Modern Sofa',
  description: 'Contemporary 3-seater sofa',
  category: 'Sofas',
  price: 1299.99,
  stock_quantity: 10
});
```

### Run Example Script

An example script is provided that demonstrates all features:

```bash
npm run dev src/example.ts
```

## Troubleshooting

### "supabaseUrl is required" Error

This means your Supabase credentials are not configured. Make sure:
1. You have created a `.env` file (not just `.env.example`)
2. The file contains valid `SUPABASE_URL` and `SUPABASE_ANON_KEY` values
3. You have run the database migration script

### TypeScript Compilation Errors

Make sure you have installed all dependencies:
```bash
npm install
```

Then rebuild:
```bash
npm run build
```

### Database Connection Issues

1. Verify your Supabase project is active
2. Check that your API keys are correct
3. Ensure your IP is not blocked (check Supabase dashboard)
4. Verify the database schema was created correctly

## Next Steps

- Customize the trial duration in `.env`
- Add more product categories
- Implement order processing logic
- Add email notifications for trial expiration
- Create a frontend application
- Set up automated trial expiration checks

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the code examples in `src/example.ts`
- Consult Supabase documentation at https://supabase.com/docs
