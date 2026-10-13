import { supabaseAdmin, supabase } from '../config/supabase.js';

// Public: Get published gallery items
export async function getGallery(req, res) {
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Get all gallery items (published + unpublished)
export async function getAllGallery(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { data, error } = await db
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Create Gallery Item
export async function createGalleryItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { title, caption, media_type, media_path, thumbnail_path, alt_text, display_order, is_published } = req.body;
    if (!media_path || !media_type) {
      return res.status(400).json({ success: false, error: 'Media path and media type are required.' });
    }

    const { data, error } = await db
      .from('gallery_items')
      .insert([{
        title: title || null,
        caption: caption || null,
        media_type: media_type || 'image',
        media_path,
        thumbnail_path: thumbnail_path || media_path,
        alt_text: alt_text || title || null,
        display_order: display_order !== undefined ? Number(display_order) : 0,
        is_published: is_published !== undefined ? Boolean(is_published) : true
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Update Gallery Item
export async function updateGalleryItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { title, caption, media_type, media_path, thumbnail_path, alt_text, display_order, is_published } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (caption !== undefined) updates.caption = caption;
    if (media_type !== undefined) updates.media_type = media_type;
    if (media_path !== undefined) updates.media_path = media_path;
    if (thumbnail_path !== undefined) updates.thumbnail_path = thumbnail_path;
    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (display_order !== undefined) updates.display_order = Number(display_order);
    if (is_published !== undefined) updates.is_published = Boolean(is_published);

    const { data, error } = await db
      .from('gallery_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Delete Gallery Item
export async function deleteGalleryItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { error } = await db
      .from('gallery_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Gallery item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
