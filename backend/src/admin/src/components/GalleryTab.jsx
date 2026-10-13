import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, X, Image as ImageIcon, Upload } from 'lucide-react';
import { api } from '../services/api';

export default function GalleryTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    media_path: '',
    thumbnail_path: '',
    alt_text: '',
    display_order: 0,
    is_published: true
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setLoading(true);
      const data = await api.getGallery();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingItem(null);
    setFormData({
      title: '',
      caption: '',
      media_path: '',
      thumbnail_path: '',
      alt_text: '',
      display_order: items.length + 1,
      is_published: true
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      media_path: item.media_path,
      thumbnail_path: item.thumbnail_path || item.media_path,
      alt_text: item.alt_text || '',
      display_order: item.display_order,
      is_published: item.is_published !== false
    });
    setIsModalOpen(true);
  }

  async function handleTogglePublished(item) {
    try {
      const newStatus = !item.is_published;
      await api.updateGalleryItem(item.id, { is_published: newStatus });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_published: newStatus } : i));
    } catch (err) {
      alert('Failed to update published status: ' + err.message);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await api.uploadMedia(file, 'gallery');
      if (res?.url) {
        setFormData(prev => ({
          ...prev,
          media_path: res.url,
          thumbnail_path: res.url
        }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        const updated = await api.updateGalleryItem(editingItem.id, {
          ...formData,
          media_type: 'image'
        });
        setItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const created = await api.createGalleryItem({
          ...formData,
          media_type: 'image'
        });
        setItems(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving gallery item: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    try {
      await api.deleteGalleryItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Moments Gallery Management
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Upload lifestyle photos, manage captions, reorder items, and publish or unpublish.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Upload New Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-12 text-center text-taupe-400 bg-white rounded-2xl border border-charcoal-900/10">
          Loading gallery items...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-taupe-400 bg-white rounded-2xl border border-charcoal-900/10">
          No gallery items yet. Click "Upload New Photo" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-charcoal-900/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-charcoal-900 relative group overflow-hidden">
                  <img
                    src={item.media_path}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleTogglePublished(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md shadow ${
                        item.is_published
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-black/70 text-white/70'
                      }`}
                    >
                      {item.is_published ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="font-serif text-base font-medium text-charcoal-900">
                    {item.title || 'Untitled Moment'}
                  </div>
                  {item.caption && (
                    <p className="text-xs text-charcoal-600 font-light line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 border-t border-charcoal-900/5 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[10px] text-taupe-500 font-mono">Order #{item.display_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-taupe-400 hover:text-coffee-600 rounded-lg hover:bg-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-taupe-400 hover:text-red-600 rounded-lg hover:bg-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-charcoal-900/10">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
              <h3 className="font-serif text-xl font-medium text-charcoal-900">
                {editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
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
                <label className="block text-charcoal-700 font-semibold mb-1">Photo Upload (Supabase Storage) *</label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-charcoal-900/15 bg-ivory-50 text-center space-y-2">
                  {formData.media_path ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.media_path}
                        alt="Uploaded preview"
                        className="w-32 h-24 rounded-xl object-cover border border-charcoal-900/10 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="py-2 text-taupe-400">
                      <Upload size={24} className="mx-auto mb-1 text-coffee-500" />
                      <span>{uploading ? 'Uploading to Supabase...' : 'Click to select image file'}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-taupe-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Monsoon Backyard Canopy"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Caption</label>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Cozy rainy evenings, hot coffee and fairy lights..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="Accessibility description"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-charcoal-800">Published (Visible on website)</span>
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
                  disabled={saving || !formData.media_path}
                  className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
