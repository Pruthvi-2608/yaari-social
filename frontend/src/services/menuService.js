import { supabase } from './supabaseClient';
import { menu as fallbackMenu, signaturePicks as fallbackSignatures } from '../data/menu';

export async function fetchMenu() {
  try {
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (catError || !categories || categories.length === 0) {
      console.warn('Supabase menu categories unavailable, falling back to local dataset:', catError?.message);
      return fallbackMenu;
    }

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (itemError) {
      console.warn('Supabase menu items error, falling back:', itemError.message);
      return fallbackMenu;
    }

    // Merge categories with their items
    const mergedMenu = categories.map(cat => ({
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

    return mergedMenu.length > 0 ? mergedMenu : fallbackMenu;
  } catch (err) {
    console.warn('Error fetching live menu from Supabase:', err);
    return fallbackMenu;
  }
}

export async function fetchSignaturePicks() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, menu_categories(name)')
      .eq('popular', true)
      .eq('is_available', true)
      .limit(6);

    if (error || !data || data.length === 0) {
      return fallbackSignatures;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.menu_categories?.name || 'Popular',
      price: Number(item.price),
      tag: 'Crowd Favourite',
      description: item.description || 'Specialty house craft item brewed & grilled fresh.'
    }));
  } catch (err) {
    return fallbackSignatures;
  }
}
