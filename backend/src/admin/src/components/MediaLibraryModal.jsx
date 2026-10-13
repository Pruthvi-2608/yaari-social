import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon, Video, Check, Upload, Folder, Calendar, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all', // 'all' | 'image' | 'video'
  title = 'Select from Saved Media Library'
}) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFolder, setActiveFolder] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  async function loadMedia() {
    try {
      setLoading(true);
      const items = await api.getMediaLibrary();
      setMedia(items || []);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const isVideo = file.type.startsWith('video/');
      const folder = isVideo ? 'videos' : 'general';
      const uploaded = await api.uploadMedia(file, folder);
      if (uploaded?.url) {
        await loadMedia();
        setSelectedItem({
          url: uploaded.url,
          name: uploaded.originalName,
          type: isVideo ? 'video' : 'image'
        });
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteItem(item, e) {
    e.stopPropagation();
    const isLocal = item.source === 'website';
    const confirmMsg = isLocal
      ? `Delete "${item.name}" from website assets?\nWarning: If this image/video is currently referenced anywhere, it will be removed permanently.`
      : `Delete "${item.name}" from your saved cloud library?\nThis cannot be undone.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setDeletingPath(item.path);
      await api.deleteMedia(item.path, item.source || 'supabase');
      setMedia(prev => prev.filter(m => m.path !== item.path));
      if (selectedItem?.path === item.path) {
        setSelectedItem(null);
      }
    } catch (err) {
      alert('Failed to delete media: ' + (err.message || err));
    } finally {
      setDeletingPath(null);
    }
  }

  if (!isOpen) return null;

  const filteredMedia = media.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (activeFolder !== 'all' && item.folder !== activeFolder) return false;
    return true;
  });

  const folders = ['all', ...Array.from(new Set(media.map(m => m.folder)))];

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-charcoal-900/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-charcoal-900/10 flex items-center justify-between flex-shrink-0 bg-ivory-50">
          <div>
            <h3 className="font-serif text-xl font-medium text-charcoal-900 flex items-center gap-2">
              <Folder size={18} className="text-coffee-600" />
              <span>{title}</span>
            </h3>
            <p className="text-xs text-charcoal-600 font-light mt-0.5">
              All your previously uploaded photos and videos are saved permanently in Supabase. Select any item to reuse it.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ivory-200 text-charcoal-500 hover:text-charcoal-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Folder tabs + Quick upload button */}
        <div className="px-6 py-3 border-b border-charcoal-900/10 flex flex-wrap items-center justify-between gap-3 bg-white flex-shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-3 py-1.5 rounded-full capitalize font-medium transition-all ${
                  activeFolder === f
                    ? 'bg-coffee-600 text-white shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 font-semibold border border-charcoal-900/10 transition-colors">
            <Upload size={13} />
            <span>{uploading ? 'Uploading...' : 'Upload New File'}</span>
            <input
              type="file"
              accept={filterType === 'video' ? 'video/*' : filterType === 'image' ? 'image/*' : 'image/*,video/*'}
              onChange={handleQuickUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-ivory-50/50">
          {loading ? (
            <div className="h-full flex items-center justify-center text-charcoal-400 text-xs">
              Loading saved media library from Supabase...
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-charcoal-400">
              <ImageIcon size={36} className="opacity-40" />
              <p className="text-sm font-medium text-charcoal-700">No media found in this filter</p>
              <p className="text-xs max-w-sm">
                Every photo or video you upload is permanently stored in your Supabase bucket. Upload a new one using the button above to begin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredMedia.map(item => {
                const isSelected = selectedItem?.url === item.url;
                return (
                  <div
                    key={item.path}
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => {
                      onSelect(item, item.url);
                      onClose();
                    }}
                    className={`group relative rounded-2xl overflow-hidden aspect-square border-2 cursor-pointer transition-all bg-charcoal-900 ${
                      isSelected
                        ? 'border-coffee-600 ring-2 ring-coffee-600/30 shadow-md scale-[1.02]'
                        : 'border-charcoal-900/10 hover:border-coffee-500/40 hover:shadow-sm'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-charcoal-950">
                        <video src={item.url} className="w-full h-full object-cover opacity-70" preload="metadata" />
                        <span className={`absolute ${isSelected ? 'top-2 left-9' : 'top-2 left-2'} px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white uppercase font-mono flex items-center gap-1 z-10 transition-all`}>
                          <Video size={10} /> MP4
                        </span>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-coffee-600 text-white flex items-center justify-center shadow-md animate-scale-up z-10">
                        <Check size={14} />
                      </div>
                    )}

                    {/* Delete Button (Hover) */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item, e)}
                      disabled={deletingPath === item.path}
                      title="Delete saved media"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-md hover:scale-110"
                    >
                      <Trash2 size={12} />
                    </button>

                    {/* Deleting Overlay */}
                    {deletingPath === item.path && (
                      <div className="absolute inset-0 bg-charcoal-950/80 flex items-center justify-center z-30">
                        <span className="text-[10px] text-white font-mono animate-pulse">Deleting...</span>
                      </div>
                    )}

                    {/* Hover detail overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] pointer-events-none">
                      <p className="truncate font-mono">{item.name}</p>
                      <div className="flex items-center justify-between text-[9px] text-ivory-300 mt-0.5">
                        <span className="capitalize">{item.folder}</span>
                        <span className="px-1 py-0.2 rounded bg-white/20 text-white font-mono uppercase text-[8px]">
                          {item.source === 'website' ? 'Site' : 'Cloud'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-charcoal-900/10 flex items-center justify-between flex-shrink-0 bg-white text-xs">
          <div className="flex-1 truncate pr-4 text-charcoal-600 font-mono text-[11px]">
            {selectedItem ? (
              <span className="truncate">Selected: <strong className="text-charcoal-900 font-semibold">{selectedItem.name}</strong></span>
            ) : (
              <span>Click any photo or video above to select it.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-charcoal-900/20 text-charcoal-700 hover:bg-ivory-50 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={!selectedItem}
              onClick={() => {
                if (selectedItem) {
                  // Support both callback signatures: onSelect(item) and onSelect(url)
                  onSelect(selectedItem, selectedItem.url);
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              Use Selected Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
