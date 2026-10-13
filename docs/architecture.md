# Yaari Social Cafe — Full-Stack Architecture

## 1. System Overview

Yaari Social Cafe is designed as a decoupled, modern full-stack web application consisting of three main layers:

```
┌────────────────────────────────────────────────────────┐
│               Public Visitor Experience                │
│    (frontend/ - React.js, Vite, Tailwind CSS, Motion)  │
└──────────────────────────┬─────────────────────────────┘
                           │
             Reads live public data
             (RLS-protected Selects)
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               Supabase Cloud Platform                  │
│   • PostgreSQL Database (Yaari Social Cafe project)    │
│   • Row Level Security (Strict Public vs Admin rules)  │
│   • Supabase Storage (yaari-media public bucket)       │
│   • Supabase Auth (Admin identity & token issuance)    │
└──────────────────────────▲─────────────────────────────┘
                           │
             Service Role & Admin Verified
             Mutations & Operations
                           │
┌──────────────────────────┴─────────────────────────────┐
│                 Express Backend API                    │
│      (backend/ - Express.js, Multer, Supabase SDK)      │
└──────────────────────────▲─────────────────────────────┘
                           │
                    Admin Operations
                           │
┌──────────────────────────┴─────────────────────────────┐
│                 Admin Dashboard UI                     │
│    (backend/src/admin/ - Themed React Application)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Component Layers

### 2.1 Public Frontend (`frontend/`)
- **Framework**: React 18, Vite 6, Tailwind CSS 3, Framer Motion 11.
- **Port**: `5173` (Development default).
- **Data Access**: Reads live menu categories, items, videos, gallery moments, and copy dynamically via `src/services/` using the public Supabase Client.
- **Fallback Resilience**: In the event of network disruption or initial setup, the frontend transparently falls back to authentic local datasets (`src/data/menu.js`, `src/data/instagramMedia.js`, `src/data/site.js`) ensuring 100% uptime and zero blank pages.

### 2.2 Express API (`backend/`)
- **Runtime**: Node.js v18+ (ES modules).
- **Port**: `5000` (Configurable via `PORT` environment variable).
- **Responsibilities**:
  - Validating and executing admin CRUD operations for menu items, categories, gallery, and videos.
  - Handling file uploads with validation (size up to 100MB, MIME validation) and uploading directly to Supabase Storage.
  - Verifying incoming Bearer tokens with Supabase Auth and verifying role membership in `admin_roles`.
  - Aggregating database metrics for the admin dashboard.

### 2.3 Themed Admin Panel (`backend/src/admin/`)
- **Design Tokens**: Reuses exact Yaari Social Cafe brand styling:
  - Background: Warm Ivory (`#FBF8F2`, `#F5F0E6`)
  - Typography: Charcoal (`#181614`, `#282522`) and Cormorant Garamond Serif
  - Accents: Coffee brown (`#7E5B42`, `#624431`) and Taupe (`#B4A697`)
- **Port**: `5174` during development; compiled to `backend/src/admin/dist/` and statically served by Express at `/admin` in production.
- **Security**: Supabase Auth with persistent token storage and immediate token verification on all protected actions.

### 2.4 Supabase Cloud Platform
- **Project Name**: `Yaari Social Cafe`
- **Project ID**: `nmdutiisiejzconbdshu`
- **Region**: `ap-south-1` (Mumbai, India — optimal latency for Silvassa)
- **Features**: PostgreSQL database, RLS policies, Storage bucket `yaari-media`.
