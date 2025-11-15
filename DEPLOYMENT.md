# Factory Management System - Complete Setup & Deployment Guide

## 📋 Project Overview

A comprehensive factory management application built with:
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **React Hook Form** + **Zod** for form validation
- **TanStack Table** for data tables
- **Zustand** for state management
- **Shadcn UI** for components

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase CLI installed (via Homebrew on macOS)

### Step 1: Project Already Initialized ✅

The project has been fully set up with all dependencies installed:
- Next.js with TypeScript and Tailwind CSS
- Supabase client libraries
- Form handling and validation libraries
- UI component library

### Step 2: Configure Environment Variables

Create or update `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**To get your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### Step 3: Run Database Migrations

The migrations are already created in `supabase/migrations/`. To apply them:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `20241115000001_create_initial_tables.sql`
   - `20241115000002_enable_rls_policies.sql`
   - `20241115000003_create_storage_buckets.sql`

**Option B: Using Supabase CLI (Local Development)**
```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations to remote database
supabase db push

# Or start local Supabase instance
supabase start
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── inventory/
│   │   ├── purchase/
│   │   ├── sales/
│   │   └── mrp/
│   ├── auth/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/              # Main dashboard
│   ├── inventory/              # Inventory management
│   │   ├── new/
│   │   └── [id]/
│   ├── purchase/               # Purchase orders
│   ├── sales/                  # Sales orders
│   ├── mrp/                    # MRP modules
│   │   ├── bom/
│   │   ├── work-orders/
│   │   └── production/
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # Reusable components
│   ├── ui/                     # Shadcn UI components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── upload-button.tsx
├── lib/                        # Utilities and configurations
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   ├── storage.ts              # File upload utilities
│   ├── types/
│   │   └── database.types.ts   # Database types
│   └── utils.ts
├── store/                      # Zustand state management
│   ├── userStore.ts
│   └── appStore.ts
└── middleware.ts               # Next.js middleware
```

## 🗄️ Database Schema

### Tables Created:
1. **users** - User profiles (extends auth.users)
2. **items** - Inventory items
3. **stock_movements** - Stock transaction history
4. **purchase_orders** - Purchase orders
5. **purchase_items** - PO line items
6. **sales_orders** - Sales orders
7. **sales_items** - SO line items
8. **bom** - Bill of Materials
9. **work_orders** - Production work orders
10. **production_logs** - Production tracking logs

### Storage Buckets:
- `inventory/` - Item images
- `purchase/` - Purchase documents
- `sales/` - Sales documents
- `production/` - Production files

## 🔐 Authentication Flow

1. Users register via `/auth/register`
2. Profile automatically created in `users` table
3. Login via `/auth/login`
4. Protected routes automatically redirect to login if not authenticated
5. Middleware handles session management

## 📱 Features Implemented

### ✅ Inventory Management
- List all inventory items
- Add new items with image upload
- Edit existing items
- Delete items
- Low stock alerts
- Search and filter

### ✅ Purchase Orders
- Create purchase orders
- Add multiple items to PO
- Track order status
- Upload purchase documents
- Status management (draft, pending, approved, etc.)

### ✅ Sales Orders
- Create sales orders
- Add multiple items to SO
- Track shipping status
- Customer information management

### ✅ MRP (Material Requirements Planning)
- Bill of Materials (BOM) management
- Work order creation
- Production stage tracking (assembling → finishing → packing)
- Material requirements calculation
- Production logs

### ✅ File Upload
- Reusable upload component
- Supabase Storage integration
- Public URL generation
- Bucket-based organization

## 🚀 Deploying to Vercel

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Factory Management System"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables in Vercel

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 4: Deploy

Click "Deploy" and Vercel will:
- Install dependencies
- Build the Next.js application
- Deploy to production

Your app will be live at `https://your-project.vercel.app`

### Step 5: Configure Supabase for Production

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: 
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/**`

## 🔧 Post-Deployment Configuration

### Enable Email Authentication in Supabase

1. Go to Authentication → Providers
2. Configure Email provider settings
3. Customize email templates if needed

### Set Up Storage CORS (if needed)

In Supabase Dashboard → Storage → Configuration:
```json
[
  {
    "allowedOrigins": ["https://your-project.vercel.app"],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"],
    "maxAge": 3600
  }
]
```

## 🧪 Testing the Application

### Test User Registration
1. Navigate to `/auth/register`
2. Create a test account
3. Verify email (if email confirmation enabled)
4. Login and explore features

### Test Core Features
1. **Inventory**: Add a few test items
2. **Purchase**: Create a sample PO
3. **Sales**: Create a sample SO
4. **BOM**: Define product structure
5. **Work Orders**: Create and track production

## 📊 Monitoring & Maintenance

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Track Web Vitals and user behavior

### Supabase Monitoring
- Check database usage in Supabase Dashboard
- Monitor API requests and storage usage
- Review logs for errors

### Database Backups
- Supabase automatically backs up your database
- Consider setting up additional backup policies for production

## 🔄 Continuous Deployment

Every push to your `main` branch will:
1. Trigger automatic deployment on Vercel
2. Run build checks
3. Deploy if successful
4. Provide preview URLs for branches

## 🐛 Troubleshooting

### Build Errors
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Review build logs in Vercel dashboard

### Authentication Issues
- Verify Supabase URLs are correct
- Check redirect URLs in Supabase settings
- Ensure cookies are enabled

### Storage Upload Failures
- Verify storage buckets exist
- Check RLS policies are correct
- Ensure file size limits are appropriate

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

## 🎉 Success!

Your factory management system is now fully deployed and ready for production use!

### Next Steps:
1. Customize branding and styling
2. Add more features as needed
3. Set up user roles and permissions
4. Configure email notifications
5. Add reporting and analytics
6. Implement data export features

---

**Built with ❤️ using modern web technologies**
