import { supabase } from './supabaseClient';
import { galleryMoments as fallbackMoments, instagramMedia } from '../data/instagramMedia';

export async function fetchGallery() {
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackMoments;
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      caption: item.caption,
      type: item.media_type,
      src: item.media_path,
      thumbnail: item.thumbnail_path || item.media_path,
      alt: item.alt_text || item.title || 'Yaari Social Moment'
    }));
  } catch (err) {
    console.warn('Error fetching gallery:', err);
    return fallbackMoments;
  }
}
