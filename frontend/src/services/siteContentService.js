import { supabase } from './supabaseClient';
import { site as fallbackSite } from '../data/site';

export async function fetchSiteContent() {
  try {
    const [contentRes, settingsRes] = await Promise.all([
      supabase.from('site_content').select('*'),
      supabase.from('site_settings').select('*')
    ]);

    const contentMap = {};
    if (contentRes.data) {
      contentRes.data.forEach(item => {
        contentMap[item.section_key] = item.content_json;
      });
    }

    const settingsMap = {};
    if (settingsRes.data) {
      settingsRes.data.forEach(item => {
        settingsMap[item.setting_key] = item.setting_value;
      });
    }

    return {
      content: contentMap,
      settings: settingsMap,
      site: {
        ...fallbackSite,
        ...(settingsMap.cafe_info ? {
          cafeName: settingsMap.cafe_info.name || fallbackSite.cafeName,
          tagline: settingsMap.cafe_info.tagline || fallbackSite.tagline,
          description: settingsMap.cafe_info.description || fallbackSite.description,
          location: {
            ...fallbackSite.location,
            address: settingsMap.cafe_info.address || fallbackSite.location.address,
            phone: settingsMap.cafe_info.phone || fallbackSite.location.phone
          }
        } : {}),
        hours: settingsMap.hours || fallbackSite.hours,
        visibility: settingsMap.section_visibility || {}
      }
    };
  } catch (err) {
    console.warn('Error fetching live site content from Supabase:', err);
    return {
      content: {},
      settings: {},
      site: fallbackSite
    };
  }
}
