import { supabaseAdmin, supabase } from '../config/supabase.js';

// Public: Get all active categories with their menu items
export async function getMenu(req, res) {
  try {
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (catError) throw catError;

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (itemError) throw itemError;

    // Group items by category
    const menu = categories.map(cat => ({
      ...cat,
      items: items.filter(i => i.category_id === cat.id)
    }));

    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Public: Get categories list
export async function getCategories(req, res) {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Public: Get items list
export async function getItems(req, res) {
  try {
    const { categoryId } = req.query;
    let query = supabase.from('menu_items').select('*').order('display_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Create Category
export async function createCategory(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { name, slug, description, display_order, is_active } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Name and slug are required.' });
    }

    const { data, error } = await db
      .from('menu_categories')
      .insert([{
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description: description || null,
        display_order: display_order !== undefined ? Number(display_order) : 0,
        is_active: is_active !== undefined ? Boolean(is_active) : true
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Update Category
export async function updateCategory(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { name, slug, description, display_order, is_active } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (description !== undefined) updates.description = description;
    if (display_order !== undefined) updates.display_order = Number(display_order);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const { data, error } = await db
      .from('menu_categories')
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

// Admin: Delete Category
export async function deleteCategory(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { error } = await db
      .from('menu_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Create Item
export async function createItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { category_id, name, description, price, image_path, is_available, popular, display_order } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Item name and price are required.' });
    }

    const { data, error } = await db
      .from('menu_items')
      .insert([{
        category_id: category_id || null,
        name,
        description: description || null,
        price: Number(price),
        image_path: image_path || null,
        is_available: is_available !== undefined ? Boolean(is_available) : true,
        popular: popular !== undefined ? Boolean(popular) : false,
        display_order: display_order !== undefined ? Number(display_order) : 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Admin: Update Item
export async function updateItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { category_id, name, description, price, image_path, is_available, popular, display_order } = req.body;

    const updates = {};
    if (category_id !== undefined) updates.category_id = category_id;
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (image_path !== undefined) updates.image_path = image_path;
    if (is_available !== undefined) updates.is_available = Boolean(is_available);
    if (popular !== undefined) updates.popular = Boolean(popular);
    if (display_order !== undefined) updates.display_order = Number(display_order);

    const { data, error } = await db
      .from('menu_items')
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

// Admin: Delete Item
export async function deleteItem(req, res) {
  try {
    const db = req.db || supabaseAdmin;
    const { id } = req.params;
    const { error } = await db
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
