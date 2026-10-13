import { supabaseAdmin, supabase } from '../config/supabase.js';

// Public: Get published videos (optionally filtered by placement: hero, jamming, reels)
export async function getVideos(req, res) {
  try {
    const { placement } = req.query;
    let query = supabase
      .from('videos')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Get all videos
export async function getAllVideos(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { placement } = req.query;
    let query = db
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Create Video
export async function createVideo(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { title, caption, video_path, thumbnail_path, placement, display_order, is_published } = req.body;
    if (!title || !video_path || !placement) {
      return res.status(400).json({ success: false, error: 'Title, video path, and placement (hero, jamming, reels) are required.' });
    }

    if (!['hero', 'jamming', 'reels'].includes(placement)) {
      return res.status(400).json({ success: false, error: 'Invalid placement. Must be hero, jamming, or reels.' });
    }

    const { data, error } = await db
      .from('videos')
      .insert([{
        title,
        caption: caption || null,
        video_path,
        thumbnail_path: thumbnail_path || null,
        placement,
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

// Admin: Update Video
export async function updateVideo(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { title, caption, video_path, thumbnail_path, placement, display_order, is_published } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (caption !== undefined) updates.caption = caption;
    if (video_path !== undefined) updates.video_path = video_path;
    if (thumbnail_path !== undefined) updates.thumbnail_path = thumbnail_path;
    if (placement !== undefined) {
      if (!['hero', 'jamming', 'reels'].includes(placement)) {
        return res.status(400).json({ success: false, error: 'Invalid placement. Must be hero, jamming, or reels.' });
      }
      updates.placement = placement;
    }
    if (display_order !== undefined) updates.display_order = Number(display_order);
    if (is_published !== undefined) updates.is_published = Boolean(is_published);

    const { data, error } = await db
      .from('videos')
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

// Admin: Delete Video
export async function deleteVideo(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { error } = await db
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Video deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
