import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, X, Video, Upload, Play, Folder } from 'lucide-react';
import { api } from '../services/api';
import MediaLibraryModal from './MediaLibraryModal';

export default function VideosTab() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlacement, setFilterPlacement] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState('video'); // 'video' | 'thumbnail'
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    video_path: '',
    thumbnail_path: '',
    placement: 'reels',
    display_order: 0,
    is_published: true
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      const data = await api.getVideos();
      setVideos(data || []);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredVideos = videos.filter(v => {
    if (filterPlacement === 'all') return true;
    return v.placement === filterPlacement;
  });

  function handleOpenCreate() {
    setEditingVideo(null);
    setFormData({
      title: '',
      caption: '',
      video_path: '',
      thumbnail_path: '',
      placement: 'reels',
      display_order: videos.length + 1,
      is_published: true
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(video) {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      caption: video.caption || '',
      video_path: video.video_path,
      thumbnail_path: video.thumbnail_path || '',
      placement: video.placement,
      display_order: video.display_order,
      is_published: video.is_published !== false
    });
    setIsModalOpen(true);
  }

  async function handleTogglePublished(video) {
    try {
      const newStatus = !video.is_published;
      await api.updateVideo(video.id, { is_published: newStatus });
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_published: newStatus } : v));
    } catch (err) {
      alert('Failed to update video status: ' + err.message);
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await api.uploadMedia(file, 'videos');
      if (res?.url) {
        setFormData(prev => ({ ...prev, video_path: res.url }));
      }
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await api.uploadMedia(file, 'thumbnails');
      if (res?.url) {
        setFormData(prev => ({ ...prev, thumbnail_path: res.url }));
      }
    } catch (err) {
      alert('Thumbnail upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingVideo) {
        const updated = await api.updateVideo(editingVideo.id, formData);
        setVideos(prev => prev.map(v => v.id === editingVideo.id ? updated : v));
      } else {
        const created = await api.createVideo(formData);
        setVideos(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving video: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert('Failed to delete video: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Videos & Reels
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Manage full-width hero videos, vertical reels for the continuous rail, and jamming sets.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Upload New Video</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-charcoal-900/10 w-fit">
        {['all', 'hero', 'jamming', 'reels'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterPlacement(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
              filterPlacement === tab
                ? 'bg-coffee-600 text-white font-semibold'
                : 'text-charcoal-700 hover:bg-ivory-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="p-12 text-center text-taupe-400 bg-white rounded-2xl border border-charcoal-900/10">
          Loading videos from Supabase...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 text-center text-taupe-400 bg-white rounded-2xl border border-charcoal-900/10">
          No videos found for this placement.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-2xl bg-white border border-charcoal-900/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[9/16] max-h-60 bg-charcoal-950 relative group overflow-hidden flex items-center justify-center">
                  {video.thumbnail_path ? (
                    <img
                      src={video.thumbnail_path}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video size={36} className="text-white/30" />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={video.video_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-coffee-600"
                    >
                      <Play size={18} className="ml-0.5 fill-white" />
                    </a>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/60 backdrop-blur-md text-coffee-400 border border-white/10">
                      {video.placement}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleTogglePublished(video)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md shadow ${
                        video.is_published
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-black/70 text-white/70'
                      }`}
                    >
                      {video.is_published ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="font-serif text-base font-medium text-charcoal-900 truncate">
                    {video.title}
                  </div>
                  {video.caption && (
                    <p className="text-xs text-charcoal-600 font-light line-clamp-2">
                      {video.caption}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 border-t border-charcoal-900/5 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[10px] text-taupe-500 font-mono">Order #{video.display_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(video)}
                    className="p-1.5 text-taupe-400 hover:text-coffee-600 rounded-lg hover:bg-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
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
                {editingVideo ? 'Edit Video' : 'Add New Video'}
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
                <label className="block text-charcoal-700 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Crowd Singing Vibe"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Placement *</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 font-medium"
                  >
                    <option value="hero">Hero Background</option>
                    <option value="jamming">Jamming Live Set</option>
                    <option value="reels">Vertical Reels Rail</option>
                  </select>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-charcoal-700 font-semibold">Video File / Path *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLibraryTarget('video');
                      setIsLibraryOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-coffee-500/30 bg-coffee-500/10 text-coffee-700 hover:bg-coffee-500/20 font-medium text-[11px] transition-colors"
                  >
                    <Folder size={12} />
                    <span>Choose Saved Video</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={formData.video_path}
                    onChange={(e) => setFormData({ ...formData, video_path: e.target.value })}
                    placeholder="/media/instagram/videos/...mp4 or public URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="text-[11px] text-taupe-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:bg-coffee-500/10 file:text-coffee-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-charcoal-700 font-semibold">Poster Thumbnail</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLibraryTarget('thumbnail');
                      setIsLibraryOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-coffee-500/30 bg-coffee-500/10 text-coffee-700 hover:bg-coffee-500/20 font-medium text-[11px] transition-colors"
                  >
                    <Folder size={12} />
                    <span>Choose Saved Photo</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.thumbnail_path}
                    onChange={(e) => setFormData({ ...formData, thumbnail_path: e.target.value })}
                    placeholder="/media/instagram/images/...jpg or public URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="text-[11px] text-taupe-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:bg-coffee-500/10 file:text-coffee-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Caption</label>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Video description or lyrics excerpt..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-charcoal-800">Published (Visible on site)</span>
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
                  disabled={saving || !formData.video_path}
                  className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingVideo ? 'Save Changes' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={(item) => {
          if (libraryTarget === 'video') {
            setFormData({
              ...formData,
              video_path: item.url,
              thumbnail_path: item.thumbnail || formData.thumbnail_path
            });
          } else {
            setFormData({
              ...formData,
              thumbnail_path: item.thumbnail || item.url
            });
          }
        }}
        filterType={libraryTarget === 'video' ? 'video' : 'image'}
        title={libraryTarget === 'video' ? 'Select Saved Video' : 'Select Poster Thumbnail Photo'}
      />
    </div>
  );
}
