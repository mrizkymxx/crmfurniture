# 🚀 Deploy ke Vercel

## Cara Deploy:

### Opsi 1: Via Website Vercel (Recommended)

1. **Buka Vercel**: https://vercel.com
2. **Login** dengan GitHub account Anda
3. **Klik "Add New Project"**
4. **Import** repository: `mrizkymxx/crmfurniture`
5. **Configure Project**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jvihmztjrrzcryphrsov.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aWhtenRqcnJ6Y3J5cGhyc292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODM4NzQsImV4cCI6MjA3ODc1OTg3NH0.nbZOthjWj6Z-dmS1mbik873Dk0Hp5JzCFCdCtB20ZuE
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aWhtenRqcnJ6Y3J5cGhyc292Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4Mzg3NCwiZXhwIjoyMDc4NzU5ODc0fQ.1Q17hlTWs_wTOH7gt8wLHhGQKHjTOHq_bIS8ntZrZpk
   ```
7. **Klik "Deploy"**

### Opsi 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Setelah Deploy:

1. **Copy URL deployment** (misal: `https://crmfurniture.vercel.app`)
2. **Update Supabase Settings**:
   - Buka: https://jvihmztjrrzcryphrsov.supabase.co
   - Go to: Authentication → URL Configuration
   - Site URL: `https://crmfurniture.vercel.app`
   - Redirect URLs: `https://crmfurniture.vercel.app/**`

## ✅ Selesai!

Aplikasi Anda akan live di URL Vercel dalam beberapa menit!
