# CRM Furniture

A Customer Relationship Management system for furniture businesses with trial functionality and Supabase integration.

## Features

- 🔐 **Trial Management**: Automatic trial period tracking for new customers
- 🪑 **Furniture Product Management**: Manage furniture products and inventory
- 👥 **Customer Management**: Track customers with trial and subscription status
- 📦 **Order Processing**: Handle orders and order items
- 🗄️ **Supabase Integration**: PostgreSQL database with real-time capabilities

## Trial Functionality

This CRM includes built-in trial management for customers:

- **Automatic Trial Period**: New customers automatically get a trial period (default: 30 days)
- **Trial Status Tracking**: Monitor active trials, expired trials, and convert to paid subscriptions
- **Trial Extension**: Ability to extend trial periods for specific customers
- **Automatic Expiration**: Trials automatically expire after the configured duration

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mrizkymxx/crmfurniture.git
cd crmfurniture
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
TRIAL_DURATION_DAYS=30
```

4. Run the database migration:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and execute the SQL from `supabase/migrations/001_initial_schema.sql`

5. Build and run:
```bash
npm run build
npm start
```

## Usage

### Customer Service

Create a new customer with automatic trial:

```typescript
import { CustomerService } from './services/customerService';

const customerService = new CustomerService();

// Create customer with automatic trial
const customer = await customerService.createCustomer({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Furniture Store Inc'
});

// Check trial status
const trialStatus = await customerService.getTrialStatus(customer.id);
console.log(`Days remaining: ${trialStatus.daysRemaining}`);

// Get all active trial customers
const activeTrials = await customerService.getActiveTrialCustomers();

// Convert trial to paid subscription
await customerService.convertTrialToSubscription(customer.id);

// Extend trial by 15 days
await customerService.extendTrial(customer.id, 15);
```

### Product Service

Manage furniture products:

```typescript
import { ProductService } from './services/productService';

const productService = new ProductService();

// Create a new product
const product = await productService.createProduct({
  name: 'Oak Dining Table',
  description: 'Beautiful handcrafted oak dining table',
  category: 'Tables',
  price: 899.99,
  stock_quantity: 15
});

// Get all products
const products = await productService.getAllProducts();

// Update stock
await productService.updateStock(product.id, 12);
```

## Database Schema

### Tables

- **customers**: Store customer information with trial tracking
  - Trial start and end dates
  - Trial active status
  - Subscription status
  
- **furniture_products**: Furniture product catalog
  - Product details, pricing, and inventory
  
- **orders**: Customer orders
  - Order status tracking
  
- **order_items**: Individual items in orders

## Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

## Project Structure

```
crmfurniture/
├── src/
│   ├── config/          # Configuration files
│   │   └── supabase.ts  # Supabase client setup
│   ├── models/          # TypeScript interfaces
│   │   └── types.ts     # Data models
│   ├── services/        # Business logic
│   │   ├── customerService.ts
│   │   └── productService.ts
│   ├── utils/           # Helper functions
│   │   └── trialHelpers.ts
│   └── index.ts         # Main entry point
├── supabase/
│   └── migrations/      # Database migrations
│       └── 001_initial_schema.sql
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## Configuration

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `TRIAL_DURATION_DAYS`: Default trial duration in days (default: 30)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
