import { createClient } from '@supabase/supabase-js';
import { instagramMedia } from '../data/savedMedia';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nmdutiisiejzconbdshu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`
    };
  }
  return {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(await getAuthHeader()),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`API endpoint ${endpoint} returned non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }
  return json;
}

// Admin API client methods with seamless direct Supabase fallbacks
export const api = {
  // Auth
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async logout() {
    await supabase.auth.signOut();
  },
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await request('/admin/dashboard');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API dashboard stats unavailable, querying Supabase directly:', err.message);
    }

    // Direct Supabase fallback
    const [cats, items, availItems, gallery, videos, jamming] = await Promise.all([
      supabase.from('menu_categories').select('id', { count: 'exact', head: true }),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('gallery_items').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('videos').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('videos').select('id', { count: 'exact', head: true }).eq('placement', 'jamming').eq('is_published', true)
    ]);

    return {
      totalMenuItems: items.count || 0,
      availableMenuItems: availItems.count || 0,
      totalCategories: cats.count || 0,
      publishedGallery: gallery.count || 0,
      publishedVideos: videos.count || 0,
      publishedJammingMedia: jamming.count || 0
    };
  },

  // Categories
  async getCategories() {
    try {
      const res = await request('/menu/categories');
      if (res?.data && res.data.length > 0) return res.data;
    } catch (err) {
      console.warn('API getCategories unavailable, querying Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },
  async createCategory(cat) {
    try {
      const res = await request('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(cat)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API createCategory unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .insert([cat])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async updateCategory(id, cat) {
    try {
      const res = await request(`/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(cat)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateCategory unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .update(cat)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async deleteCategory(id) {
    try {
      return await request(`/admin/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API deleteCategory unavailable, using Supabase directly:', err.message);
    }

    const { error } = await supabase.from('menu_categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Menu Items
  async getMenu() {
    try {
      const res = await request('/menu');
      if (res?.data && res.data.length > 0) return res.data;
    } catch (err) {
      console.warn('API getMenu unavailable, querying Supabase directly:', err.message);
    }

    const [catsRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order', { ascending: true }),
      supabase.from('menu_items').select('*').order('display_order', { ascending: true })
    ]);

    const categories = catsRes.data || [];
    const items = itemsRes.data || [];

    return categories.map(cat => ({
      id: cat.id,
      category: cat.name,
      slug: cat.slug,
      description: cat.description,
      items: items
        .filter(item => item.category_id === cat.id)
        .map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          popular: item.popular,
          description: item.description,
          image: item.image_path
        }))
    }));
  },
  async getItems(categoryId) {
    try {
      const query = categoryId ? `?categoryId=${categoryId}` : '';
      const res = await request(`/menu/items${query}`);
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API getItems unavailable, querying Supabase directly:', err.message);
    }

    let q = supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (categoryId && categoryId !== 'All') {
      q = q.eq('category_id', categoryId);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async createItem(item) {
    try {
      const res = await request('/admin/menu', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API createItem unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async updateItem(id, item) {
    try {
      const res = await request(`/admin/menu/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(item)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateItem unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async deleteItem(id) {
    try {
      return await request(`/admin/menu/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API deleteItem unavailable, using Supabase directly:', err.message);
    }

    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Gallery
  async getGallery() {
    try {
      const res = await request('/admin/gallery');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API getGallery unavailable, querying Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },
  async createGalleryItem(item) {
    try {
      const res = await request('/admin/gallery', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API createGalleryItem unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async updateGalleryItem(id, item) {
    try {
      const res = await request(`/admin/gallery/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(item)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateGalleryItem unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async deleteGalleryItem(id) {
    try {
      return await request(`/admin/gallery/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API deleteGalleryItem unavailable, using Supabase directly:', err.message);
    }

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Videos
  async getVideos(placement) {
    try {
      const query = placement ? `?placement=${placement}` : '';
      const res = await request(`/admin/videos${query}`);
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API getVideos unavailable, querying Supabase directly:', err.message);
    }

    let q = supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (placement) {
      q = q.eq('placement', placement);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async createVideo(video) {
    try {
      const res = await request('/admin/videos', {
        method: 'POST',
        body: JSON.stringify(video)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API createVideo unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async updateVideo(id, video) {
    try {
      const res = await request(`/admin/videos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(video)
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateVideo unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('videos')
      .update(video)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async deleteVideo(id) {
    try {
      return await request(`/admin/videos/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API deleteVideo unavailable, using Supabase directly:', err.message);
    }

    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Site Content & Settings
  async getSiteContent() {
    try {
      const res = await request('/site-content');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API getSiteContent unavailable, querying Supabase directly:', err.message);
    }

    const { data, error } = await supabase.from('site_content').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(row => {
      map[row.section_key] = row.content_json;
    });
    return map;
  },
  async updateSiteContent(sectionKey, content) {
    try {
      const res = await request(`/admin/site-content/${sectionKey}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateSiteContent unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        section_key: sectionKey,
        content_json: content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async getSiteSettings() {
    try {
      const res = await request('/site-settings');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API getSiteSettings unavailable, querying Supabase directly:', err.message);
    }

    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(row => {
      map[row.setting_key] = row.setting_value;
    });
    return map;
  },
  async updateSiteSetting(settingKey, value) {
    try {
      const res = await request(`/admin/site-settings/${settingKey}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('API updateSiteSetting unavailable, using Supabase directly:', err.message);
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: settingKey,
        setting_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload to Supabase Storage (tries backend upload, fallback to direct Supabase Storage)
  async uploadMedia(file, folder = 'general') {
    try {
      const authHeaders = await getAuthHeader();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: {
          ...authHeaders
        },
        body: formData
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch {}
      if (res.ok && json?.data) return json.data;
    } catch (err) {
      console.warn('Backend upload endpoint unavailable, uploading directly to Supabase Storage:', err.message);
    }

    // Direct Supabase Storage upload
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('yaari-media')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw new Error(uploadError.message || 'Storage upload failed');

    const { data: urlData } = supabase.storage
      .from('yaari-media')
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      path: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    };
  },

  // Get all saved uploads from storage media library (merges Supabase storage + saved website assets)
  async getMediaLibrary() {
    let backendFiles = null;
    try {
      const res = await request('/admin/media');
      if (res?.data && res.data.length > 0) {
        backendFiles = res.data;
      }
    } catch (err) {
      console.warn('API media library unavailable, building library from Supabase Storage & saved assets:', err.message);
    }

    if (backendFiles) return backendFiles;

    // Fallback: gather from Supabase storage + curated saved media manifest
    const allFiles = [];
    const seenUrls = new Set();

    // 1. Fetch any files from Supabase Storage
    const folders = ['gallery', 'thumbnails', 'videos', 'hero', 'jamming', 'general', 'menu', 'test'];
    await Promise.all(folders.map(async (folder) => {
      try {
        const { data } = await supabase.storage
          .from('yaari-media')
          .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (data) {
          data.forEach(item => {
            if (item.name && !item.name.startsWith('.')) {
              const { data: urlData } = supabase.storage
                .from('yaari-media')
                .getPublicUrl(`${folder}/${item.name}`);

              const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(item.name);
              seenUrls.add(urlData.publicUrl);
              allFiles.push({
                name: item.name,
                folder,
                path: `${folder}/${item.name}`,
                url: urlData.publicUrl,
                type: isVideo ? 'video' : 'image',
                size: item.metadata?.size || item.metadata?.contentLength || 0,
                created_at: item.created_at || new Date().toISOString(),
                source: 'supabase'
              });
            }
          });
        }
      } catch (e) {
        // Folder might not exist yet, ignore
      }
    }));

    // 2. Add all saved website photos and videos from curated dataset
    (instagramMedia || []).forEach(item => {
      const isVideo = item.type === 'video' || (item.src && /\.(mp4|webm|mov|ogg)$/i.test(item.src));
      const url = item.src || item.thumbnail;
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        const fileName = url.split('/').pop() || 'photo.jpg';
        allFiles.push({
          name: fileName,
          folder: item.category || (isVideo ? 'videos' : 'gallery'),
          path: url.startsWith('/') ? url.substring(1) : url,
          url: url,
          type: isVideo ? 'video' : 'image',
          size: 0,
          created_at: item.timestamp || new Date().toISOString(),
          source: 'website'
        });
      }
    });

    // Brand and logo assets
    allFiles.push({
      name: 'yaari-social-logo.png',
      folder: 'brand',
      path: 'brand/yaari-social-logo.png',
      url: '/brand/yaari-social-logo.png',
      type: 'image',
      size: 0,
      created_at: new Date().toISOString(),
      source: 'website'
    });

    allFiles.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return allFiles;
  },

  // Delete media item from storage/library
  async deleteMedia(path, source = 'supabase') {
    try {
      return await request('/admin/media', {
        method: 'DELETE',
        body: JSON.stringify({ path, source })
      });
    } catch (err) {
      console.warn('API deleteMedia unavailable, deleting directly via Supabase Storage:', err.message);
    }

    if (source === 'supabase' || path.includes('/')) {
      const { error } = await supabase.storage
        .from('yaari-media')
        .remove([path]);
      if (error) console.warn('Supabase storage remove notice:', error.message);
    }
    return { success: true };
  }
};
