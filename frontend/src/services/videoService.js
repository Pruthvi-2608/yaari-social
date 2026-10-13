import { supabase } from './supabaseClient';
import { heroMedia as fallbackHero, jammingMedia as fallbackJamming, reelVideos as fallbackReels } from '../data/instagramMedia';

export async function fetchVideosByPlacement(placement) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('placement', placement)
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      if (placement === 'reels') return fallbackReels;
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      caption: item.caption,
      videoSrc: item.video_path,
      src: item.video_path,
      thumbnail: item.thumbnail_path,
      placement: item.placement
    }));
  } catch (err) {
    console.warn(`Error fetching ${placement} videos:`, err);
    if (placement === 'reels') return fallbackReels;
    return [];
  }
}

export async function fetchHeroMedia() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('placement', 'hero')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle();

    if (error || !data) return fallbackHero;

    return {
      video: data.video_path,
      poster: data.thumbnail_path,
      title: data.title,
      subtitle: data.caption
    };
  } catch (err) {
    return fallbackHero;
  }
}

export async function fetchJammingMedia() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('placement', 'jamming')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return fallbackJamming;

    return {
      mainVideo: {
        videoSrc: data[0].video_path,
        thumbnail: data[0].thumbnail_path,
        caption: data[0].caption,
        title: data[0].title
      },
      secondaryVideo: data[1] ? {
        videoSrc: data[1].video_path,
        thumbnail: data[1].thumbnail_path,
        caption: data[1].caption,
        title: data[1].title
      } : fallbackJamming.secondaryVideo,
      eventPoster: fallbackJamming.eventPoster,
      crowdVibe: fallbackJamming.crowdVibe
    };
  } catch (err) {
    return fallbackJamming;
  }
}
