import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, X, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      display_order: categories.length + 1,
      is_active: true
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(cat) {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      display_order: cat.display_order,
      is_active: cat.is_active !== false
    });
    setIsModalOpen(true);
  }

  async function handleToggleActive(cat) {
    try {
      const newStatus = !cat.is_active;
      await api.updateCategory(cat.id, { is_active: newStatus });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: newStatus } : c));
    } catch (err) {
      alert('Failed to update category: ' + err.message);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        const updated = await api.updateCategory(editingCategory.id, formData);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c));
      } else {
        const created = await api.createCategory(formData);
        setCategories(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this category? Make sure no items rely on it.')) {
      return;
    }
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Menu Categories
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Organize the menu structure, set display sequence, and activate or hide categories.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-900/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory-100/60 border-b border-charcoal-900/10 text-[11px] font-semibold uppercase tracking-wider text-charcoal-700">
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-900/5 text-xs text-charcoal-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-taupe-400">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-taupe-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-taupe-500 font-medium">
                    #{cat.display_order}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal-900">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-taupe-500">
                    {cat.slug}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600 font-light truncate max-w-xs">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                        cat.is_active
                          ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                          : 'bg-taupe-300/30 text-taupe-500 hover:bg-taupe-300/50'
                      }`}
                    >
                      {cat.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      <span>{cat.is_active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-taupe-400 hover:text-coffee-600 hover:bg-ivory-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-taupe-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-charcoal-900/10">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
              <h3 className="font-serif text-xl font-medium text-charcoal-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-taupe-400 hover:text-charcoal-900"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                  }}
                  placeholder="e.g. Pastas"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
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
                  placeholder="Short tagline shown above category items..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-charcoal-800">Active (Visible on public menu)</span>
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
                  {saving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
