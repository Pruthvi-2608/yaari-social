import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Play, Upload, Video, Image as ImageIcon, Trash2, Edit2, Folder } from 'lucide-react';
import { api } from '../services/api';
import MediaLibraryModal from './MediaLibraryModal';

export default function HeroTab() {
  const [content, setContent] = useState({
    heading: 'A little coffee. A lot of yaari.',
    subtitle: 'Your cozy corner for coffee, comfort food, conversations and late-evening yaari in Silvassa.',
    tagline: 'Backyard Cafe & Acoustic Hangout',
    ctaText: 'Explore Menu',
    ctaLink: '#menu',
    secondaryCtaText: 'Experience The Vibe',
    secondaryCtaLink: '#vibe',
    badgeText: "Silvassa's Cozy Corner & Backyard"
  });

  const [heroVideo, setHeroVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaSavedSuccess, setMediaSavedSuccess] = useState(false);

  // Media Library Picker state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState('all'); // 'video' or 'image'
  const [libraryTarget, setLibraryTarget] = useState(null); // 'video' or 'poster'

  // Form for hero media (video & poster)
  const [mediaForm, setMediaForm] = useState({
    title: 'Hero Atmosphere Video',
    video_path: '/media/instagram/videos/Db_CweANDwQ.mp4',
    thumbnail_path: '/media/instagram/images/Db_CweANDwQ.jpg',
    placement: 'hero',
    is_published: true
  });

  useEffect(() => {
    loadHero();
  }, []);

  async function loadHero() {
    try {
      setLoading(true);
      const [siteRes, vids] = await Promise.all([
        api.getSiteContent(),
        api.getVideos('hero')
      ]);

      if (siteRes?.hero) {
        setContent(prev => ({ ...prev, ...siteRes.hero }));
      }

      if (vids && vids.length > 0) {
        setHeroVideo(vids[0]);
        setMediaForm({
          title: vids[0].title || 'Hero Background Video',
          video_path: vids[0].video_path || '',
          thumbnail_path: vids[0].thumbnail_path || '',
          placement: 'hero',
          is_published: vids[0].is_published !== false
        });
      }
    } catch (err) {
      console.error('Failed to load hero content:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCopy(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSiteContent('hero', content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save hero copy: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveMedia(e) {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      if (heroVideo?.id) {
        const updated = await api.updateVideo(heroVideo.id, mediaForm);
        setHeroVideo(updated);
      } else {
        const created = await api.createVideo(mediaForm);
        setHeroVideo(created);
      }
      setMediaSavedSuccess(true);
      setTimeout(() => setMediaSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save hero media: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingMedia(true);
      const res = await api.uploadMedia(file, 'hero');
      if (res?.url) {
        const updatedForm = { ...mediaForm, video_path: res.url };
        setMediaForm(updatedForm);

        // Auto-save to database
        if (heroVideo?.id) {
          const updated = await api.updateVideo(heroVideo.id, updatedForm);
          setHeroVideo(updated);
        } else {
          const created = await api.createVideo(updatedForm);
          setHeroVideo(created);
        }
        setMediaSavedSuccess(true);
        setTimeout(() => setMediaSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handlePosterUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingMedia(true);
      const res = await api.uploadMedia(file, 'hero');
      if (res?.url) {
        const updatedForm = { ...mediaForm, thumbnail_path: res.url };
        setMediaForm(updatedForm);

        // Auto-save to database
        if (heroVideo?.id) {
          const updated = await api.updateVideo(heroVideo.id, updatedForm);
          setHeroVideo(updated);
        } else {
          const created = await api.createVideo(updatedForm);
          setHeroVideo(created);
        }
        setMediaSavedSuccess(true);
        setTimeout(() => setMediaSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
          Hero & Homepage Editor
        </h2>
        <p className="text-xs text-charcoal-600 font-light mt-0.5">
          Change the background video or photo, edit headlines, and configure call-to-action buttons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Background Media Uploader (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
                <Video size={18} className="text-coffee-600" />
                <span>Background Video & Photo</span>
              </h3>
              {mediaSavedSuccess && (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs animate-fade-in">
                  <Check size={14} /> Saved Live!
                </span>
              )}
            </div>

            <p className="text-charcoal-600 font-light leading-relaxed">
              Upload a background MP4 video or high-resolution cover photo for the full-screen landing view.
            </p>

            {/* Current Media Visual Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-charcoal-950 border border-charcoal-900/15 shadow-inner flex items-center justify-center group">
              {mediaForm.video_path ? (
                <video
                  src={mediaForm.video_path}
                  poster={mediaForm.thumbnail_path}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              ) : mediaForm.thumbnail_path ? (
                <img
                  src={mediaForm.thumbnail_path}
                  alt="Hero Preview"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="text-center p-4 text-ivory-400">
                  <Video size={32} className="mx-auto mb-2 opacity-60" />
                  <p className="text-xs">No media loaded</p>
                </div>
              )}

              {/* Hover Overlay Badge */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                <label className="cursor-pointer px-4 py-2 rounded-full bg-white text-charcoal-900 font-semibold text-xs shadow-md hover:bg-ivory-100 transition-colors flex items-center gap-1.5">
                  <Upload size={13} /> Upload Video
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingMedia}
                    className="hidden"
                  />
                </label>
                <label className="cursor-pointer px-4 py-2 rounded-full bg-white/90 text-charcoal-900 font-semibold text-xs shadow-md hover:bg-white transition-colors flex items-center gap-1.5">
                  <ImageIcon size={13} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    disabled={uploadingMedia}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Media Action Buttons & URL Inputs */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-ivory-50 border border-charcoal-900/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-charcoal-800 font-semibold flex items-center gap-1.5">
                    <Video size={14} className="text-coffee-600" />
                    <span>Hero Video (MP4)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryFilter('video');
                        setLibraryTarget('video');
                        setIsLibraryOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-700 hover:text-coffee-600 bg-white px-2.5 py-1 rounded-lg border border-charcoal-900/10 shadow-2xs"
                    >
                      <Folder size={12} />
                      <span>Choose Saved Video</span>
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-coffee-600 hover:text-coffee-700">
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
                  value={mediaForm.video_path}
                  onChange={(e) => setMediaForm({ ...mediaForm, video_path: e.target.value })}
                  placeholder="URL or /media/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-charcoal-900/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-charcoal-800 font-semibold flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-coffee-600" />
                    <span>Hero Poster / Fallback Photo</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryFilter('image');
                        setLibraryTarget('poster');
                        setIsLibraryOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-700 hover:text-coffee-600 bg-white px-2.5 py-1 rounded-lg border border-charcoal-900/10 shadow-2xs"
                    >
                      <Folder size={12} />
                      <span>Choose Saved Photo</span>
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-coffee-600 hover:text-coffee-700">
                      <Upload size={12} />
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload New'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterUpload}
                        disabled={uploadingMedia}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={mediaForm.thumbnail_path}
                  onChange={(e) => setMediaForm({ ...mediaForm, thumbnail_path: e.target.value })}
                  placeholder="URL or /media/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveMedia}
                  disabled={saving || uploadingMedia}
                  className="px-5 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Media Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Headline & Buttons Copy (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSaveCopy} className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
              <Sparkles size={18} className="text-coffee-600" />
              <span>Landing Page Copy & CTAs</span>
            </h3>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Pill Badge Text</label>
              <input
                type="text"
                value={content.badgeText}
                onChange={(e) => setContent({ ...content, badgeText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={content.heading}
                onChange={(e) => setContent({ ...content, heading: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 font-serif text-sm"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Hero Subtitle</label>
              <textarea
                rows="3"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 resize-none font-light"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={content.ctaLink}
                  onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Secondary Button Label</label>
                <input
                  type="text"
                  value={content.secondaryCtaText}
                  onChange={(e) => setContent({ ...content, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={content.secondaryCtaLink}
                  onChange={(e) => setContent({ ...content, secondaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-charcoal-900/10">
              {savedSuccess ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <Check size={14} /> Hero copy updated live!
                </span>
              ) : <div />}

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Hero Copy'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        filterType={libraryFilter}
        title={libraryTarget === 'video' ? 'Select Saved Hero Video' : 'Select Saved Hero Photo'}
        onSelect={(url) => {
          if (libraryTarget === 'video') {
            const updated = { ...mediaForm, video_path: url };
            setMediaForm(updated);
            if (heroVideo?.id) api.updateVideo(heroVideo.id, updated).catch(console.error);
          } else {
            const updated = { ...mediaForm, thumbnail_path: url };
            setMediaForm(updated);
            if (heroVideo?.id) api.updateVideo(heroVideo.id, updated).catch(console.error);
          }
          setMediaSavedSuccess(true);
          setTimeout(() => setMediaSavedSuccess(false), 3000);
        }}
      />
    </div>
  );
}
