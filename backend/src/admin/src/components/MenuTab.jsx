import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Sparkles,
  ArrowUpDown,
  X,
  Folder
} from 'lucide-react';
import { api } from '../services/api';
import MediaLibraryModal from './MediaLibraryModal';

export default function MenuTab() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    image_path: '',
    popular: false,
    is_available: true
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [catsData, itemsData] = await Promise.all([
        api.getCategories(),
        api.getItems()
      ]);
      setCategories(catsData || []);
      setItems(itemsData || []);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category_id === selectedCategory;
      const matchSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, search]);

  function handleOpenCreate() {
    setEditingItem(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      price: '',
      description: '',
      image_path: '',
      popular: false,
      is_available: true
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category_id: item.category_id || '',
      price: item.price,
      description: item.description || '',
      image_path: item.image_path || '',
      popular: item.popular || false,
      is_available: item.is_available !== false
    });
    setIsModalOpen(true);
  }

  async function handleToggleAvailability(item) {
    try {
      const newStatus = !item.is_available;
      await api.updateItem(item.id, { is_available: newStatus });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: newStatus } : i));
    } catch (err) {
      alert('Failed to update availability: ' + err.message);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        const updated = await api.updateItem(editingItem.id, {
          name: formData.name,
          category_id: formData.category_id,
          price: Number(formData.price),
          description: formData.description,
          image_path: formData.image_path,
          popular: formData.popular,
          is_available: formData.is_available
        });
        setItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const created = await api.createItem({
          name: formData.name,
          category_id: formData.category_id,
          price: Number(formData.price),
          description: formData.description,
          image_path: formData.image_path,
          popular: formData.popular,
          is_available: formData.is_available
        });
        setItems(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving menu item: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setSaving(true);
      const res = await api.uploadMedia(file, 'menu');
      if (res?.url) {
        setFormData(prev => ({ ...prev, image_path: res.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Menu Items Management
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Manage all 80+ items, update prices live, toggle availability, and assign photos.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-charcoal-900/10 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe-400" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-xs text-charcoal-900 placeholder:text-taupe-400 focus:outline-none focus:border-coffee-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-taupe-500 font-medium whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-xs text-charcoal-900 focus:outline-none focus:border-coffee-500"
          >
            <option value="All">All Categories ({items.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-taupe-500 font-mono">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-charcoal-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-100/60 border-b border-charcoal-900/10 text-[11px] font-semibold uppercase tracking-wider text-charcoal-700">
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Highlight</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/5 text-xs text-charcoal-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-taupe-400">
                    Loading items from Supabase...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-taupe-400">
                    No items matching your search or category filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cat = categories.find((c) => c.id === item.category_id);
                  return (
                    <tr key={item.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-charcoal-900">
                        <div className="flex items-center gap-3">
                          {item.image_path ? (
                            <img
                              src={item.image_path}
                              alt={item.name}
                              className="w-8 h-8 rounded-lg object-cover border border-charcoal-900/10"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-ivory-100 border border-charcoal-900/10 flex items-center justify-center text-taupe-400">
                              <ImageIcon size={14} />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-charcoal-900">{item.name}</div>
                            {item.description && (
                              <div className="text-[10px] text-taupe-500 font-light truncate max-w-xs">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-ivory-100 text-[10px] font-medium text-charcoal-700">
                          {cat?.name || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-serif text-sm font-semibold text-charcoal-900">
                        ₹{item.price}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.popular ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-coffee-600 bg-coffee-500/10 px-2 py-0.5 rounded-full font-semibold">
                            <Sparkles size={10} />
                            <span>Popular</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-taupe-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            item.is_available
                              ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                          }`}
                        >
                          {item.is_available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 text-taupe-400 hover:text-coffee-600 hover:bg-ivory-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            title="Delete"
                            className="p-1.5 text-taupe-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-charcoal-900/10">
            <h3 className="font-serif text-xl font-medium text-charcoal-900">
              Confirm Delete
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              Are you sure you want to permanently delete this menu item from Supabase? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full border border-charcoal-900/15 text-xs text-charcoal-700 hover:bg-ivory-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-charcoal-900/10">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
              <h3 className="font-serif text-xl font-medium text-charcoal-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-taupe-400 hover:text-charcoal-900 hover:bg-ivory-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. DavidOff Hot Coffee"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Category *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="60"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh artisan brew details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Item Photo</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-[11px] text-taupe-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-coffee-500/10 file:text-coffee-600 file:font-medium hover:file:bg-coffee-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsLibraryOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-coffee-500/30 bg-coffee-500/10 text-coffee-700 hover:bg-coffee-500/20 font-medium text-xs transition-colors"
                  >
                    <Folder size={14} />
                    <span>Choose Saved Photo</span>
                  </button>
                  {formData.image_path && (
                    <div className="flex items-center gap-2 ml-auto">
                      <img
                        src={formData.image_path}
                        alt="Preview"
                        className="w-8 h-8 rounded-lg object-cover border border-charcoal-900/10"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_path: '' })}
                        className="text-taupe-400 hover:text-red-500 p-1"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-coffee-600 focus:ring-coffee-500"
                  />
                  <span className="font-medium text-charcoal-800">Popular Signature Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-charcoal-800">In Stock / Available</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-900/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-charcoal-900/15 text-charcoal-700 hover:bg-ivory-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={(selected) => {
          const url = typeof selected === 'string' ? selected : (selected?.url || '');
          setFormData(prev => ({ ...prev, image_path: url }));
        }}
        filterType="image"
        title="Select Menu Item Photo"
      />
    </div>
  );
}
