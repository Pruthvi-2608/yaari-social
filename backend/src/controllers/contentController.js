import { supabaseAdmin, supabase } from '../config/supabase.js';

// Public: Get all site content sections
export async function getSiteContent(req, res) {
  try {
    const { sectionKey } = req.params;
    if (sectionKey) {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) throw error;
      return res.json({ success: true, data: data ? data.content_json : {} });
    }

    const { data, error } = await supabase.from('site_content').select('*');
    if (error) throw error;

    // Convert array to map
    const contentMap = {};
    (data || []).forEach(row => {
      contentMap[row.section_key] = row.content_json;
    });

    res.json({ success: true, data: contentMap });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Update Site Content Section
export async function updateSiteContent(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { sectionKey } = req.params;
    const { content } = req.body;

    if (!sectionKey || !content) {
      return res.status(400).json({ success: false, error: 'Section key and content are required.' });
    }

    const { data, error } = await db
      .from('site_content')
      .upsert({
        section_key: sectionKey,
        content_json: content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data: data.content_json });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Public: Get all site settings
export async function getSiteSettings(req, res) {
  try {
    const { settingKey } = req.params;
    if (settingKey) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .maybeSingle();

      if (error) throw error;
      return res.json({ success: true, data: data ? data.setting_value : {} });
    }

    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;

    const settingsMap = {};
    (data || []).forEach(row => {
      settingsMap[row.setting_key] = row.setting_value;
    });

    res.json({ success: true, data: settingsMap });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Update Site Setting
export async function updateSiteSetting(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { settingKey } = req.params;
    const { value } = req.body;

    if (!settingKey || value === undefined) {
      return res.status(400).json({ success: false, error: 'Setting key and value are required.' });
    }

    const { data, error } = await db
      .from('site_settings')
      .upsert({
        setting_key: settingKey,
        setting_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data: data.setting_value });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Get real database dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const [
      totalItemsRes,
      availableItemsRes,
      categoriesRes,
      galleryRes,
      videosRes,
      jammingRes
    ] = await Promise.all([
      db.from('menu_items').select('*', { count: 'exact', head: true }),
      db.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
      db.from('menu_categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
      db.from('gallery_items').select('*', { count: 'exact', head: true }).eq('is_published', true),
      db.from('videos').select('*', { count: 'exact', head: true }).eq('is_published', true),
      db.from('videos').select('*', { count: 'exact', head: true }).eq('placement', 'jamming').eq('is_published', true)
    ]);

    res.json({
      success: true,
      data: {
        totalMenuItems: totalItemsRes.count || 0,
        availableMenuItems: availableItemsRes.count || 0,
        totalCategories: categoriesRes.count || 0,
        publishedGallery: galleryRes.count || 0,
        publishedVideos: videosRes.count || 0,
        publishedJammingMedia: jammingRes.count || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
