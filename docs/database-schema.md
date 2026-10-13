# Yaari Social Cafe — Database Schema & RLS Policies

## 1. Connected Supabase Project

- **Project**: `Yaari Social Cafe`
- **Project ID**: `nmdutiisiejzconbdshu`
- **Region**: `ap-south-1`
- **Host**: `db.nmdutiisiejzconbdshu.supabase.co`

---

## 2. Table Definitions

### 2.1 `menu_categories`
Stores digital menu category groupings (e.g., Served Hot, Chai, Pastas, Burgers).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Unique category identifier |
| `name` | `TEXT` | `NOT NULL` | Display category title |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | URL-safe category key |
| `description` | `TEXT` | `NULLABLE` | Optional category tagline |
| `display_order` | `INTEGER` | `NOT NULL DEFAULT 0` | Sequence order on public menu |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT true` | Category visibility toggle |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Auto-updated via trigger |

### 2.2 `menu_items`
Stores authentic cafe menu items with pricing, category linkage, and availability.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Unique item identifier |
| `category_id` | `UUID` | Foreign Key `menu_categories(id)` | Associated category |
| `name` | `TEXT` | `NOT NULL` | Item title |
| `description` | `TEXT` | `NULLABLE` | Ingredients / notes |
| `price` | `NUMERIC(10,2)`| `NOT NULL CHECK (price >= 0)` | Price in INR |
| `image_path` | `TEXT` | `NULLABLE` | Image path in storage or URL |
| `is_available` | `BOOLEAN` | `NOT NULL DEFAULT true` | Stock / availability toggle |
| `popular` | `BOOLEAN` | `NOT NULL DEFAULT false` | Highlight as Signature Pick |
| `display_order` | `INTEGER` | `NOT NULL DEFAULT 0` | Item sequence in category |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Auto-updated via trigger |

### 2.3 `gallery_items`
Curated lifestyle photographs and moments from the Yaari Social backyard.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Unique gallery item identifier |
| `title` | `TEXT` | `NULLABLE` | Photo title |
| `caption` | `TEXT` | `NULLABLE` | Caption text |
| `media_type` | `TEXT` | `CHECK (media_type IN ('image', 'video'))` | Media classification |
| `media_path` | `TEXT` | `NOT NULL` | Supabase storage or asset path |
| `thumbnail_path` | `TEXT`| `NULLABLE` | Compressed thumbnail |
| `alt_text` | `TEXT` | `NULLABLE` | Screen-reader description |
| `display_order` | `INTEGER` | `NOT NULL DEFAULT 0` | Masonry grid order |
| `is_published` | `BOOLEAN` | `NOT NULL DEFAULT true` | Public display toggle |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Update timestamp |

### 2.4 `videos`
Acoustic jamming sessions, crowd singing, and vertical reels.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Video identifier |
| `title` | `TEXT` | `NOT NULL` | Session title |
| `caption` | `TEXT` | `NULLABLE` | Description or lyrics |
| `video_path` | `TEXT` | `NOT NULL` | Video source URL or path |
| `thumbnail_path` | `TEXT`| `NULLABLE` | Poster thumbnail image |
| `placement` | `TEXT` | `CHECK (placement IN ('hero', 'jamming', 'reels'))` | Target website section |
| `display_order` | `INTEGER` | `NOT NULL DEFAULT 0` | Display order |
| `is_published` | `BOOLEAN` | `NOT NULL DEFAULT true` | Public visibility toggle |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Update timestamp |

### 2.5 `site_content`
Dynamic copy for headings, narratives, about stories, and marquee ticker.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Record identifier |
| `section_key` | `TEXT` | `UNIQUE NOT NULL` | Section identifier (`hero`, `about`, etc.) |
| `content_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Structured JSON content |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Update timestamp |

### 2.6 `site_settings`
Global cafe information, operating hours, and section toggles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Record identifier |
| `setting_key` | `TEXT` | `UNIQUE NOT NULL` | Setting key (`cafe_info`, `hours`, etc.) |
| `setting_value` | `JSONB` | `NOT NULL DEFAULT '{}'` | Structured JSON value |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Update timestamp |

### 2.7 `admin_roles`
Authoritative role assignment for administrators.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Role record identifier |
| `user_id` | `UUID` | `UNIQUE NOT NULL REFERENCES auth.users(id)` | Supabase Auth user UUID |
| `role` | `TEXT` | `CHECK (role IN ('admin', 'super_admin'))` | Administrative privilege level |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Role grant timestamp |

---

## 3. Row Level Security Policies

Row Level Security is enabled on **all 7 tables**.

1. **Public Read Access**:
   - `menu_categories`: Visitors can select rows where `is_active = true`.
   - `menu_items`: Visitors can select rows where `is_available = true`.
   - `gallery_items`: Visitors can select rows where `is_published = true`.
   - `videos`: Visitors can select rows where `is_published = true`.
   - `site_content` & `site_settings`: Visitors can select all public copy.
2. **Administrator Write Access**:
   - Evaluated using `public.is_admin()`, which checks `admin_roles` for the authenticated `auth.uid()`.
   - Only admins can perform `INSERT`, `UPDATE`, or `DELETE`.
3. **Storage Access**:
   - Bucket `yaari-media` is marked `public = true` for GET requests.
   - Uploads (`INSERT`), updates, and deletions on `storage.objects` require `public.is_admin()` or the backend service role.
