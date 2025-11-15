# 📝 Common Commands Reference

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts Next.js development server at http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates optimized production build

### Start Production Server
```bash
npm run start
```
Runs the production build locally

### Run Linting
```bash
npm run lint
```
Checks code for linting errors

### Type Check
```bash
npm run type-check
```
Runs TypeScript compiler without emitting files

---

## Supabase CLI Commands

### Start Local Supabase
```bash
supabase start
```
Starts local Supabase instance (Docker required)

### Stop Local Supabase
```bash
supabase stop
```
Stops local Supabase instance

### Check Supabase Status
```bash
supabase status
```
Shows status of local Supabase services

### Link to Remote Project
```bash
supabase link --project-ref your-project-ref
```
Links local project to remote Supabase project

### Push Migrations
```bash
supabase db push
```
Pushes local migrations to remote database

### Pull Remote Schema
```bash
supabase db pull
```
Pulls remote database schema to local

### Reset Local Database
```bash
supabase db reset
```
Resets local database and re-runs migrations

### Generate TypeScript Types
```bash
supabase gen types typescript --local > src/lib/types/database.types.ts
```
Generates TypeScript types from database schema

---

## Git Commands

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```bash
git remote add origin your-repo-url
git branch -M main
git push -u origin main
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Commit Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Package Management

### Install Dependencies
```bash
npm install
```

### Add New Package
```bash
npm install package-name
```

### Add Dev Dependency
```bash
npm install -D package-name
```

### Update All Packages
```bash
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## Vercel Deployment

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy to Preview
```bash
vercel
```

### Deploy to Production
```bash
vercel --prod
```

### Set Environment Variable
```bash
vercel env add VARIABLE_NAME
```

---

## Useful Development Commands

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Clear All Cache and Reinstall
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Check Port Usage (macOS/Linux)
```bash
lsof -i :3000
```

### Kill Process on Port 3000
```bash
kill -9 $(lsof -t -i:3000)
```

---

## Database Quick Commands

### View Tables in Supabase
Go to Supabase Dashboard → Table Editor

### Run SQL Query
Go to Supabase Dashboard → SQL Editor

### Check RLS Policies
Go to Supabase Dashboard → Authentication → Policies

### View Storage Buckets
Go to Supabase Dashboard → Storage

---

## Debugging Commands

### View Next.js Build Info
```bash
npm run build -- --debug
```

### Check Environment Variables
```bash
# In development (terminal)
node -e "console.log(process.env)"

# In Next.js page/component
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### Test Supabase Connection
```bash
# Add this to a test page and check browser console
const supabase = createClient()
supabase.from('items').select('count').then(console.log)
```

---

## Production Checks

### Analyze Bundle Size
```bash
npm run build
# Check output for bundle sizes
```

### Test Production Build Locally
```bash
npm run build
npm run start
```

### Check TypeScript Errors
```bash
npm run type-check
```

### Run All Checks Before Deploy
```bash
npm run lint && npm run type-check && npm run build
```

---

## Quick Fixes

### Fix TypeScript Errors
```bash
npm run type-check
# Fix reported errors, then rebuild
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Update Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

---

## Monitoring & Logs

### View Vercel Logs
```bash
vercel logs
```

### View Vercel Deployments
```bash
vercel ls
```

### Check Build Logs
Look in `.next/` folder after build

---

**Keep this file handy for quick reference! 📖**
