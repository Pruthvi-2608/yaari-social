# Yaari Social Cafe & Backyard ☕✨

A cozy, premium, full-stack cafe platform built for **Yaari Social** (Silvassa) featuring:
- **Public Website** (`frontend/`): React 19, Tailwind CSS, Framer Motion, and Lucide React.
- **Backend & Admin Panel** (`backend/`): Express.js REST API with a dedicated Vite React Admin Dashboard.
- **Persistent Database & Storage**: Supabase PostgreSQL (`Yaari Social Cafe`) with Row-Level Security and `yaari-media` Storage Bucket.

![Yaari Social Preview](frontend/public/brand/yaari-social-logo.png)

---

## 🏗️ Architecture & Structure

```
yaari-social/
├── frontend/                     # Public customer-facing website
│   ├── src/
│   │   ├── components/           # Hero, Menu, Jamming, Gallery, Videos, etc.
│   │   ├── services/             # Supabase & backend service layer (with offline fallback)
│   │   └── data/                 # Authentic transcribed menu & Instagram datasets
│   ├── public/                   # Optimized video & brand assets
│   ├── .env                      # Supabase public credentials
│   └── package.json
│
├── backend/                      # Node.js / Express API & Admin Panel
│   ├── src/
│   │   ├── admin/                # Admin Panel SPA (React + Tailwind)
│   │   ├── controllers/          # Menu, Gallery, Video, Content & Upload controllers
│   │   ├── middleware/           # Supabase JWT authentication & admin role guard
│   │   ├── routes/               # /api routes (public reads + admin mutations)
│   │   └── server.js             # Express server on port 5000
│   ├── .env                      # Supabase service role secret & config
│   └── package.json
│
├── supabase/                     # Database migrations & schemas
│   └── migrations/
│       └── 20261012000000_init_yaari_schema.sql
│
└── docs/                         # Architecture, schema, and deployment guides
    ├── architecture.md
    ├── database-schema.md
    └── deployment.md
```

---

## 🌿 Features

### 🌟 Customer Website
- **Cinematic Looping Hero**: Live crowd jamming video with masked typography reveals and audio toggle.
- **Full Digital Menu**: All 14 categories transcribed from physical menus with real-time search, filters, pricing, and live DB sync.
- **Physical Menu Lightbox**: Dual-page zoomable lightbox for original physical menu scans.
- **Jamming at Yaari**: Live music sessions, event flyers, and guest performer spotlights.
- **9:16 Video Rail**: Autoplay preview loops and full-screen video player modal.
- **Moments Gallery**: Authentic Instagram candid polaroid & masonry grids.
- **Visit & Hours**: Accurate address (*Near Lions College, Opp. Sai Nidhi Dosa, Silvassa - 396230*), timings, and direct links.
- **Resilient Fallback**: If offline or Supabase connection is interrupted, automatically falls back to authentic local data so the site never breaks.

### 🛡️ Admin Dashboard (`/admin`)
- **Visual Design**: Themed with Yaari brand tokens (Warm Terracotta, Cream, Charcoal).
- **Menu Management**: Add, edit, reorder items, change prices, toggle availability, upload dish photos.
- **Category Control**: Create, edit, and organize menu categories.
- **Media Hub**: Upload photos and videos directly to the Supabase `yaari-media` storage bucket.
- **Event & Jamming Scheduler**: Update upcoming music nights and performer details.
- **Site Settings & Visibility**: Toggle public sections (Jamming, Gallery, Videos) and update contact details in real time.
- **Secure Supabase Auth**: Role-based access control with automatic first-admin onboarding.

---

## 🗄️ Supabase Project Details

- **Project Name:** `Yaari Social Cafe`
- **Project Reference:** `nmdutiisiejzconbdshu`
- **Region:** `ap-south-1` (Mumbai)
- **Database Tables:** `menu_categories`, `menu_items`, `gallery_items`, `videos`, `site_content`, `site_settings`, `admin_roles`.
- **Storage Bucket:** `yaari-media` (Public, 100MB limit).

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Install Dependencies
```bash
# Install root, frontend, backend and admin dependencies
npm install
npm run install:all
```

### 3. Run Development Servers
You can run services independently or concurrently:

```bash
# Run public website (http://localhost:5173)
npm run dev:frontend

# Run backend API (http://localhost:5000)
npm run dev:backend

# Run admin dashboard dev server (http://localhost:5174)
npm run dev:admin
```

### 4. Build for Production
```bash
npm run build
```

---

## 📍 Location & Contact

- **Address**: Near Lions College (Opp. Sai Nidhi Dosa), SSR Road, Silvassa - 396230
- **Instagram**: [@yaari_social](https://www.instagram.com/yaari_social/)
