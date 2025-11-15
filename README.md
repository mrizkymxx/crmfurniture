# Factory Management System

A complete, production-ready factory management and MRP (Material Requirements Planning) system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Modules

- **Inventory Management**: Complete CRUD for items with image uploads, stock tracking, and low-stock alerts
- **Purchase Orders**: Create and manage purchase orders with multiple items and document uploads
- **Sales Orders**: Track customer orders, shipping status, and order fulfillment
- **MRP System**: 
  - Bill of Materials (BOM) management
  - Work order creation and tracking
  - Production stage management (Assembling → Finishing → Packing → Completed)
  - Material requirements calculation
- **Authentication**: Secure user registration and login with Supabase Auth
- **File Upload**: Integrated storage for product images and documents

### Technical Features

- ✅ Server-Side Rendering (SSR) with Next.js 15
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for responsive design
- ✅ Supabase for backend (Auth, Database, Storage)
- ✅ Row Level Security (RLS) policies
- ✅ React Hook Form with Zod validation
- ✅ Zustand for state management
- ✅ Shadcn UI components
- ✅ Protected routes with middleware
- ✅ RESTful API routes


- ✅ RESTful API routes

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Supabase CLI (optional for local development)

## 🛠️ Quick Start

1. **Configure environment variables**

Update `.env.local` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

2. **Set up database**

Run the SQL migrations in your Supabase project dashboard (SQL Editor):
- Navigate to `supabase/migrations/` folder
- Execute each migration file in order

3. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (inventory, purchase, sales, mrp)
│   ├── auth/               # Login & Register pages
│   ├── dashboard/          # Main dashboard
│   ├── inventory/          # Inventory CRUD
│   ├── purchase/           # Purchase orders
│   ├── sales/              # Sales orders
│   └── mrp/                # MRP modules (BOM, Work Orders)
├── components/             # Reusable UI components
├── lib/                    # Utilities & Supabase config
└── store/                  # Zustand state management
```

## 🚀 Deployment to Vercel

See detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick steps:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 📖 Feature Highlights

### Inventory Management
- Add/edit/delete items
- Upload product images
- Track stock levels
- Low stock alerts

### Purchase & Sales Orders
- Multi-item orders
- Status tracking
- Document uploads
- Customer/supplier management

### MRP System
- Define Bill of Materials
- Create work orders
- Track production stages
- Calculate material requirements

## 🔐 Security

- Protected routes with middleware
- Row Level Security (RLS)
- Secure file storage
- Server-side authentication

## 📄 License

MIT License

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies**

For full documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)
