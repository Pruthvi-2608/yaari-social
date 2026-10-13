# Yaari Social Cafe — Production Deployment Guide

This guide details how to deploy the Yaari Social Cafe full-stack platform across production environments.

---

## 1. Architecture Overview

- **Public Frontend:** React 19 + Vite + Tailwind CSS (Deployable to Vercel, Netlify, or Cloudflare Pages)
- **Backend API & Admin Panel:** Express.js + Vite Admin SPA (Deployable to Render, Railway, Fly.io, or any Node.js VPS)
- **Database & Storage:** Supabase PostgreSQL (`Yaari Social Cafe` / `nmdutiisiejzconbdshu`) with Row Level Security (RLS) and persistent `yaari-media` Storage Bucket.

---

## 2. Supabase Configuration (Dedicated Project)

- **Project Name:** `Yaari Social Cafe`
- **Project ID / Reference:** `nmdutiisiejzconbdshu`
- **Region:** `ap-south-1` (Mumbai, India)
- **Project URL:** `https://nmdutiisiejzconbdshu.supabase.co`

### Essential Settings in Supabase Dashboard
1. **Authentication:**
   - Under **Authentication** > **Providers** > **Email**, ensure email authentication is enabled.
   - To add your first admin, either:
     - Sign up directly through the Admin Panel UI (the very first authenticated user is automatically granted `super_admin` in `admin_roles`), OR
     - In Supabase Dashboard, go to **Authentication** > **Users** > **Add User** (Create user with your email & password), then in SQL Editor run:
       ```sql
       INSERT INTO public.admin_roles (user_id, role, display_name)
       VALUES ('<USER-UUID-FROM-AUTH>', 'super_admin', 'Cafe Administrator')
       ON CONFLICT (user_id) DO NOTHING;
       ```
2. **Storage:**
   - Bucket `yaari-media` is configured as **Public** with a 100MB file size limit.
   - Public images and videos are served via:
     `https://nmdutiisiejzconbdshu.supabase.co/storage/v1/object/public/yaari-media/<file-path>`

---

## 3. Frontend Deployment (Vercel / Netlify)

### Vercel Deployment
1. Import repository on Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Build & Output Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Configure Environment Variables in Vercel project settings:
   ```env
   VITE_SUPABASE_URL=https://nmdutiisiejzconbdshu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI
   VITE_API_URL=https://<your-backend-api-domain>/api
   ```
6. Deploy!

---

## 4. Backend Deployment (Render / Railway / Node.js)

### Railway / Render
1. Create a new Web Service pointing to the repository.
2. Set **Root Directory** to `backend`.
3. Build Command:
   ```bash
   npm install && npm run build:admin
   ```
4. Start Command:
   ```bash
   npm start
   ```
5. Configure Environment Variables:
   ```env
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://<your-frontend-domain>.vercel.app
   SUPABASE_URL=https://nmdutiisiejzconbdshu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key-from-supabase-dashboard>
   ```

*Security Warning: Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend or public repositories.*

---

## 5. Local Development Commands

From root folder:
- `npm run dev:frontend` — Starts the public website on `http://localhost:5173`
- `npm run dev:backend` — Starts the Express API on `http://localhost:5000`
- `npm run dev:admin` — Starts the Vite Admin Dashboard on `http://localhost:5174` (proxies API requests to port 5000)
- `npm run build` — Compiles both frontend and admin panel for production.
