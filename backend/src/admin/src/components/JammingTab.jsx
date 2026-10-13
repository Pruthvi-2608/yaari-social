import React, { useEffect, useState } from 'react';
import { Music, Calendar, Check, Edit2, Upload, Trash2, X, Plus, Image as ImageIcon, Folder } from 'lucide-react';
import { api } from '../services/api';
import MediaLibraryModal from './MediaLibraryModal';

export default function JammingTab() {
  const [jammingVideos, setJammingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    title: 'Jamming at Yaari',
    subtitle: 'Some evenings are better with music, coffee and your people. When the whole crowd sings along, the energy in our backyard is something you have to feel for yourself.',
    eventHeading: 'Soulful Nights with Guest Artists',
    eventSubtext: 'Sunday sessions with live singers, acoustic guitars, and candlelit backyard seating.',
    entryNote: 'Seating on first-come basis • Free entry',
    eventPosterUrl: '/media/instagram/images/DcLMoGnNRJ6.jpg'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Media Library state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState('image');
  const [libraryTarget, setLibraryTarget] = useState(null); // 'poster' | 'video_thumbnail' | 'video_file'

  // Edit Video Modal state
  const [editingVideo, setEditingVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    caption: '',
    video_path: '',
    thumbnail_path: '',
    placement: 'jamming',
    display_order: 1,
    is_published: true
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [vids, siteRes] = await Promise.all([
        api.getVideos('jamming'),
        api.getSiteContent()
      ]);
      setJammingVideos(vids || []);
      if (siteRes?.jamming) {
        const jam = siteRes.jamming;
        const rawPoster = jam.eventPosterUrl;
        const normalizedPoster = typeof rawPoster === 'object' && rawPoster !== null
          ? (rawPoster.url || '')
          : (typeof rawPoster === 'string' ? rawPoster : '');

        setContent(prev => ({
          ...prev,
          title: jam.title ?? prev.title,
          subtitle: jam.subtitle ?? prev.subtitle,
          eventHeading: jam.eventHeading ?? prev.eventHeading,
          eventSubtext: jam.eventSubtext ?? prev.eventSubtext,
          entryNote: jam.entryNote ?? prev.entryNote,
          eventPosterUrl: normalizedPoster || prev.eventPosterUrl
        }));
      }
    } catch (err) {
      console.error('Failed to load jamming data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContent(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSiteContent('jamming', content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save jamming details: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePosterUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingPoster(true);
      const res = await api.uploadMedia(file, 'jamming');
      if (res?.url) {
        const updatedContent = {
          ...content,
          eventPosterUrl: res.url
        };
        setContent(updatedContent);
        // Automatically save to Supabase site_content
        await api.updateSiteContent('jamming', updatedContent);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert('Poster upload failed: ' + err.message);
    } finally {
      setUploadingPoster(false);
    }
  }

  function handleOpenEditVideo(video) {
    setEditingVideo(video);
    setVideoFormData({
      title: video.title || '',
      caption: video.caption || '',
      video_path: video.video_path || '',
      thumbnail_path: video.thumbnail_path || '',
      placement: 'jamming',
      display_order: video.display_order || 1,
      is_published: video.is_published !== false
    });
    setIsModalOpen(true);
  }

  function handleOpenAddVideo() {
    setEditingVideo(null);
    setVideoFormData({
      title: '',
      caption: '',
      video_path: '',
      thumbnail_path: '',
      placement: 'jamming',
      display_order: jammingVideos.length + 1,
      is_published: true
    });
    setIsModalOpen(true);
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingMedia(true);
      const res = await api.uploadMedia(file, 'thumbnails');
      if (res?.url) {
        setVideoFormData(prev => ({ ...prev, thumbnail_path: res.url }));
      }
    } catch (err) {
      alert('Thumbnail upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingMedia(true);
      const res = await api.uploadMedia(file, 'videos');
      if (res?.url) {
        setVideoFormData(prev => ({ ...prev, video_path: res.url }));
      }
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleSaveVideo(e) {
    e.preventDefault();
    if (!videoFormData.title.trim()) {
      alert('Please provide a title');
      return;
    }
    try {
      setSavingVideo(true);
      if (editingVideo) {
        const updated = await api.updateVideo(editingVideo.id, videoFormData);
        setJammingVideos(prev => prev.map(v => v.id === editingVideo.id ? updated : v));
      } else {
        const created = await api.createVideo(videoFormData);
        setJammingVideos(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save jamming video: ' + err.message);
    } finally {
      setSavingVideo(false);
    }
  }

  async function handleDeleteVideo(id) {
    if (!window.confirm('Delete this jamming video?')) return;
    try {
      await api.deleteVideo(id);
      setJammingVideos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert('Failed to delete video: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Jamming Section Management
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Curate acoustic video sets, cover photos, event posters, and live music schedule.
          </p>
        </div>
        <button
          onClick={handleOpenAddVideo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-semibold shadow-sm transition-colors self-start"
        >
          <Plus size={14} /> Add Jamming Video
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Jamming Videos (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
                <Music size={18} className="text-coffee-600" />
                <span>Featured Acoustic Video Sets</span>
              </h3>
              <span className="text-xs text-taupe-500 font-mono">
                {jammingVideos.length} Active Sets
              </span>
            </div>

            {jammingVideos.length === 0 ? (
              <p className="text-xs text-taupe-400 py-4">No jamming videos found. Click 'Add Jamming Video' above to upload a video.</p>
            ) : (
              <div className="space-y-3">
                {jammingVideos.map((v, idx) => (
                  <div key={v.id} className="p-3.5 rounded-2xl bg-ivory-50 border border-charcoal-900/10 flex items-center gap-4 hover:border-coffee-500/40 transition-all">
                    <div className="w-16 h-16 rounded-xl bg-charcoal-900 overflow-hidden flex-shrink-0 relative group">
                      {v.thumbnail_path ? (
                        <img src={v.thumbnail_path} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ivory-400">
                          <Music size={20} />
                        </div>
                      )}
                      <button
                        onClick={() => handleOpenEditVideo(v)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Change Thumbnail Image"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-coffee-500/15 text-coffee-600">
                          {idx === 0 ? 'Primary Feature' : `Secondary #${idx}`}
                        </span>
                        <h4 className="text-xs font-semibold text-charcoal-900 truncate">{v.title}</h4>
                      </div>
                      <p className="text-[11px] text-charcoal-600 font-light line-clamp-1 mt-0.5">{v.caption || 'No caption provided'}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditVideo(v)}
                        className="p-2 rounded-xl text-charcoal-600 hover:text-coffee-600 hover:bg-white transition-colors"
                        title="Edit Video & Image"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(v.id)}
                        className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Event Poster Photo Card */}
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-coffee-600" />
                <span>Live Musical Event Poster Photo</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLibraryFilter('image');
                    setLibraryTarget('poster');
                    setIsLibraryOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 text-xs font-semibold border border-charcoal-900/10 transition-colors"
                >
                  <Folder size={12} />
                  <span>Choose Saved Photo</span>
                </button>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 text-xs font-semibold border border-charcoal-900/10 transition-colors">
                  <Upload size={12} />
                  <span>{uploadingPoster ? 'Uploading...' : 'Upload New'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    disabled={uploadingPoster}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-ivory-50 border border-charcoal-900/10">
              <div className="w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-900/15 flex-shrink-0 shadow-sm relative group">
                {content.eventPosterUrl ? (
                  <img
                    src={typeof content.eventPosterUrl === 'string' ? content.eventPosterUrl : (content.eventPosterUrl?.url || '')}
                    alt="Event Poster"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ivory-400 text-xs text-center p-2">
                    No Poster
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-2">
                  <Upload size={18} className="mb-1" />
                  <span className="text-[10px] font-semibold">Upload New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    disabled={uploadingPoster}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <h4 className="text-sm font-semibold text-charcoal-900">Current Jamming Event Poster</h4>
                <p className="text-xs text-charcoal-600 font-light leading-relaxed">
                  This photo is shown next to the live music schedule on the website's Jamming section. Click "Change Poster Image" to select any image from your computer to replace it immediately.
                </p>
                {content.eventPosterUrl && (
                  <p className="text-[10px] text-taupe-500 font-mono truncate max-w-sm mt-1">
                    {typeof content.eventPosterUrl === 'string' ? content.eventPosterUrl : (content.eventPosterUrl?.url || '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Jamming Editorial Texts (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSaveContent} className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
              <Calendar size={18} className="text-coffee-600" />
              <span>Event Card & Copy</span>
            </h3>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Section Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Intro Narrative</label>
              <textarea
                rows="3"
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Live Night Heading</label>
              <input
                type="text"
                value={content.eventHeading || ''}
                onChange={(e) => setContent({ ...content, eventHeading: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Event Description</label>
              <textarea
                rows="2"
                value={content.eventSubtext || ''}
                onChange={(e) => setContent({ ...content, eventSubtext: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Entry Terms Note</label>
              <input
                type="text"
                value={content.entryNote || ''}
                onChange={(e) => setContent({ ...content, entryNote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <Check size={14} /> Saved live to Supabase!
                </span>
              ) : <div />}

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Jamming Details'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit / Add Video & Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-charcoal-900">
                {editingVideo ? 'Edit Jamming Video & Cover Image' : 'Add Jamming Video & Cover'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-400 hover:text-charcoal-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="e.g. Acoustic Live Session"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Caption / Description</label>
                <textarea
                  rows="2"
                  value={videoFormData.caption}
                  onChange={(e) => setVideoFormData({ ...videoFormData, caption: e.target.value })}
                  placeholder="Lights, music & pure vibes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              {/* Cover Photo / Thumbnail Upload */}
              <div className="p-4 rounded-2xl bg-ivory-50 border border-charcoal-900/10 space-y-3">
                <label className="block text-charcoal-800 font-semibold">Cover Photo / Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-charcoal-900 overflow-hidden flex-shrink-0 relative border border-charcoal-900/10">
                    {videoFormData.thumbnail_path ? (
                      <img src={videoFormData.thumbnail_path} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ivory-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLibraryFilter('image');
                          setLibraryTarget('video_thumbnail');
                          setIsLibraryOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold border border-charcoal-900/10 shadow-sm"
                      >
                        <Folder size={12} />
                        <span>Choose Saved Photo</span>
                      </button>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-ivory-100 text-charcoal-900 font-semibold border border-charcoal-900/10 transition-colors shadow-sm">
                        <Upload size={12} />
                        <span>{uploadingMedia ? 'Uploading...' : 'Upload New'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          disabled={uploadingMedia}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-charcoal-500">Pick any saved image or upload a fresh one.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={videoFormData.thumbnail_path || ''}
                  onChange={(e) => setVideoFormData({ ...videoFormData, thumbnail_path: e.target.value })}
                  placeholder="Or paste image URL"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-charcoal-900/10 text-charcoal-800 text-[11px] font-mono"
                />
              </div>

              {/* Video File / URL */}
              <div className="p-4 rounded-2xl bg-ivory-50 border border-charcoal-900/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-charcoal-800 font-semibold">Video File / URL</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryFilter('video');
                        setLibraryTarget('video_file');
                        setIsLibraryOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-700 hover:text-coffee-600 bg-white px-2.5 py-1 rounded-lg border border-charcoal-900/10 shadow-sm"
                    >
                      <Folder size={12} />
                      <span>Choose Saved Video</span>
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-ivory-100 text-charcoal-900 font-semibold border border-charcoal-900/10 transition-colors shadow-sm">
                      <Upload size={12} />
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload New'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        onChange={handleVideoUpload}
                        disabled={uploadingMedia}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={videoFormData.video_path || ''}
                  onChange={(e) => setVideoFormData({ ...videoFormData, video_path: e.target.value })}
                  placeholder="Or enter video path (/media/instagram/videos/... or https://...)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-charcoal-900/10 text-charcoal-800 text-[11px] font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-charcoal-900/20 text-charcoal-700 font-medium hover:bg-ivory-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVideo || uploadingMedia}
                  className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {savingVideo ? 'Saving...' : 'Save Video & Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        filterType={libraryFilter}
        title="Select from Saved Media Library"
        onSelect={async (selected, fallbackUrl) => {
          const url = (typeof selected === 'string' ? selected : (selected?.url || fallbackUrl)) || '';
          if (libraryTarget === 'poster') {
            const updatedContent = {
              ...content,
              eventPosterUrl: url
            };
            setContent(updatedContent);
            await api.updateSiteContent('jamming', updatedContent).catch(console.error);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
          } else if (libraryTarget === 'video_thumbnail') {
            setVideoFormData(prev => ({ ...prev, thumbnail_path: url }));
          } else if (libraryTarget === 'video_file') {
            setVideoFormData(prev => ({ ...prev, video_path: url }));
          }
        }}
      />
    </div>
  );
}
