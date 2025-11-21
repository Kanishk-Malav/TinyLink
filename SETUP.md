# 🚀 TinyLink Setup Guide

## Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd tinylink
npm install
```

### Step 2: Set Up Database

#### Option A: Use Neon (Free PostgreSQL - Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free
3. Create a new project
4. Copy the connection string

#### Option B: Use Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for production)

#### Option C: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb tinylink
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Initialize Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment Guide

### Deploy to Vercel (Easiest)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/tinylink.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `DATABASE_URL`: Your Neon/Supabase connection string
     - `NEXT_PUBLIC_APP_URL`: Will be `https://your-project.vercel.app`
   - Click "Deploy"

3. **Run Database Migrations**
```bash
# After first deployment
npx prisma migrate deploy
```

4. **Update Environment Variable**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
   - Redeploy

### Deploy to Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect your GitHub repository

2. **Configure Build**
   - Name: `tinylink`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - `DATABASE_URL`: Your database connection string
   - `NEXT_PUBLIC_APP_URL`: Your Render URL (e.g., `https://tinylink.onrender.com`)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

5. **Run Migrations**
```bash
# In Render Shell or locally with production DATABASE_URL
npx prisma migrate deploy
```

### Deploy to Railway

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo

2. **Add PostgreSQL**
   - Add → Database → PostgreSQL
   - Railway will automatically set `DATABASE_URL`

3. **Configure Service**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - `NEXT_PUBLIC_APP_URL`: Your Railway URL

5. **Deploy**
   - Railway will auto-deploy on push

---

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
- Check your DATABASE_URL is correct
- Ensure database is running
- For Neon/Supabase, check if IP is whitelisted (usually not needed)

### Prisma Issues

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

**Error:** `Migration failed`

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix
```

### Build Errors

**Error:** `Module not found`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working

**Solution:**
- Restart dev server after changing .env
- For production, redeploy after updating env vars
- Ensure NEXT_PUBLIC_ prefix for client-side variables

---

## Testing Checklist

Before submitting, test these features:

- [ ] Create link with auto-generated code
- [ ] Create link with custom code
- [ ] Duplicate code returns 404 error
- [ ] Invalid URL shows error message
- [ ] Short link redirects with 301 status
- [ ] Click count increments on redirect
- [ ] Dashboard shows all links
- [ ] Delete link works
- [ ] Health check returns 200
- [ ] Responsive design on mobile
- [ ] All API endpoints work
- [ ] Loading states show properly
- [ ] Error messages display correctly

---

## Video Walkthrough Script

1. **Introduction (30 seconds)**
   - "Hi, I'm [Name], and this is TinyLink, a URL shortening service"
   - Show the live deployed site

2. **Feature Demo (2 minutes)**
   - Create a short link
   - Show the generated code
   - Test the redirect
   - Show click tracking
   - Delete a link

3. **Code Walkthrough (2 minutes)**
   - Show project structure
   - Explain API routes
   - Show database schema
   - Highlight key features

4. **Technical Decisions (1 minute)**
   - Why Next.js (full-stack in one framework)
   - Why Prisma (type-safe database access)
   - Why Tailwind (rapid UI development)

5. **Challenges & Solutions (30 seconds)**
   - Mention any challenges faced
   - How you solved them

6. **Conclusion (30 seconds)**
   - Thank them for watching
   - Mention you're excited about the opportunity

---

## Next Steps

1. ✅ Complete the setup
2. ✅ Test all features locally
3. ✅ Deploy to production
4. ✅ Test production deployment
5. ✅ Record video walkthrough
6. ✅ Submit GitHub URL and live demo URL

Good luck! 🚀
