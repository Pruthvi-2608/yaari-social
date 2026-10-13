import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nmdutiisiejzconbdshu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI';

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

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }
  return json;
}

// Admin API client methods
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
    return (await request('/admin/dashboard')).data;
  },

  // Categories
  async getCategories() {
    return (await request('/menu/categories')).data;
  },
  async createCategory(cat) {
    return (await request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    })).data;
  },
  async updateCategory(id, cat) {
    return (await request(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cat)
    })).data;
  },
  async deleteCategory(id) {
    return await request(`/admin/categories/${id}`, { method: 'DELETE' });
  },

  // Menu Items
  async getMenu() {
    return (await request('/menu')).data;
  },
  async getItems(categoryId) {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return (await request(`/menu/items${query}`)).data;
  },
  async createItem(item) {
    return (await request('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(item)
    })).data;
  },
  async updateItem(id, item) {
    return (await request(`/admin/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(item)
    })).data;
  },
  async deleteItem(id) {
    return await request(`/admin/menu/${id}`, { method: 'DELETE' });
  },

  // Gallery
  async getGallery() {
    return (await request('/admin/gallery')).data;
  },
  async createGalleryItem(item) {
    return (await request('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    })).data;
  },
  async updateGalleryItem(id, item) {
    return (await request(`/admin/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(item)
    })).data;
  },
  async deleteGalleryItem(id) {
    return await request(`/admin/gallery/${id}`, { method: 'DELETE' });
  },

  // Videos
  async getVideos(placement) {
    const query = placement ? `?placement=${placement}` : '';
    return (await request(`/admin/videos${query}`)).data;
  },
  async createVideo(video) {
    return (await request('/admin/videos', {
      method: 'POST',
      body: JSON.stringify(video)
    })).data;
  },
  async updateVideo(id, video) {
    return (await request(`/admin/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(video)
    })).data;
  },
  async deleteVideo(id) {
    return await request(`/admin/videos/${id}`, { method: 'DELETE' });
  },

  // Site Content & Settings
  async getSiteContent() {
    return (await request('/site-content')).data;
  },
  async updateSiteContent(sectionKey, content) {
    return (await request(`/admin/site-content/${sectionKey}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    })).data;
  },
  async getSiteSettings() {
    return (await request('/site-settings')).data;
  },
  async updateSiteSetting(settingKey, value) {
    return (await request(`/admin/site-settings/${settingKey}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    })).data;
  },

  // Upload to Supabase Storage via backend
  async uploadMedia(file, folder = 'general') {
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

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json.data;
  },

  // Get all saved uploads from storage media library
  async getMediaLibrary() {
    return (await request('/admin/media')).data;
  },

  // Delete media item from storage/library
  async deleteMedia(path, source = 'supabase') {
    return await request('/admin/media', {
      method: 'DELETE',
      body: JSON.stringify({ path, source })
    });
  }
};
