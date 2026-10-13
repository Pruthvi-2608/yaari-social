import React, { useEffect, useState } from 'react';
import { FileText, Check, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function ContentTab() {
  const [content, setContent] = useState({
    the_yaari_feeling: {
      heading: 'Where Silvassa slow-brews friendships',
      quote: 'Some cafes are built for quick takeaways; Yaari Social was built for hours that slip away unnoticed.',
      subheading: 'Rain on the backyard canopy, acoustic strings tuning in the corner, steaming cups of Adrak Chai and conversations that start with coffee and end under fairy lights.'
    },
    about: {
      heading: 'About Yaari Social',
      story: "Born out of a simple desire: to give Silvassa a warm, soulful space that feels less like a commercial eatery and more like a dear friend's cozy backyard.",
      amenities: [
        'Cozy Monsoon Backyard Setup',
        'Live Acoustic & Jamming Nights',
        'Outdoor & Indoor Seating',
        'Curated Music & Vibe',
        'Fresh Artisan Coffee & Bites',
        'Birthday & Gathering Celebrations'
      ]
    },
    marquee: {
      text: 'COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI • SILVASSA •'
    }
  });
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      const res = await api.getSiteContent();
      if (res) {
        setContent(prev => ({
          ...prev,
          the_yaari_feeling: res.the_yaari_feeling || prev.the_yaari_feeling,
          about: res.about || prev.about,
          marquee: res.marquee || prev.marquee
        }));
      }
    } catch (err) {
      console.error('Failed to load site content:', err);
    }
  }

  async function handleSaveSection(sectionKey) {
    try {
      setSaving(true);
      await api.updateSiteContent(sectionKey, content[sectionKey]);
      setSavedSection(sectionKey);
      setTimeout(() => setSavedSection(null), 3000);
    } catch (err) {
      alert(`Failed to save ${sectionKey}: ` + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddAmenity() {
    const newAmenity = prompt('Enter new feature / amenity:');
    if (!newAmenity?.trim()) return;
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        amenities: [...prev.about.amenities, newAmenity.trim()]
      }
    }));
  }

  function handleRemoveAmenity(index) {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        amenities: prev.about.amenities.filter((_, i) => i !== index)
      }
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
          Website Narrative & Copy
        </h2>
        <p className="text-xs text-charcoal-600 font-light mt-0.5">
          Edit brand stories, the "Yaari Feeling" section, the About Yaari page, and ambient ticker text.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: The Yaari Feeling */}
        <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              01 — The Yaari Feeling (Intro Section)
            </h3>
            {savedSection === 'the_yaari_feeling' && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check size={14} /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Heading</label>
            <input
              type="text"
              value={content.the_yaari_feeling.heading}
              onChange={(e) => setContent({
                ...content,
                the_yaari_feeling: { ...content.the_yaari_feeling, heading: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Pull Quote</label>
            <textarea
              rows="2"
              value={content.the_yaari_feeling.quote}
              onChange={(e) => setContent({
                ...content,
                the_yaari_feeling: { ...content.the_yaari_feeling, quote: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 resize-none font-serif text-sm"
            />
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Atmosphere Description</label>
            <textarea
              rows="3"
              value={content.the_yaari_feeling.subheading}
              onChange={(e) => setContent({
                ...content,
                the_yaari_feeling: { ...content.the_yaari_feeling, subheading: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 resize-none font-light"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSaveSection('the_yaari_feeling')}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors"
            >
              Save Yaari Feeling Copy
            </button>
          </div>
        </div>

        {/* Section 2: About Yaari & Amenities */}
        <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              02 — About Section & Highlights
            </h3>
            {savedSection === 'about' && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check size={14} /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Heading</label>
            <input
              type="text"
              value={content.about.heading}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, heading: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Origin Story</label>
            <textarea
              rows="3"
              value={content.about.story}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, story: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 resize-none font-light"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-charcoal-700 font-semibold">Amenities & Features</label>
              <button
                type="button"
                onClick={handleAddAmenity}
                className="text-[11px] text-coffee-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Plus size={12} /> Add Feature
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {content.about.amenities.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-ivory-50 border border-charcoal-900/10 flex items-center justify-between">
                  <span className="truncate">{item}</span>
                  <button
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-taupe-400 hover:text-red-600 ml-2"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSaveSection('about')}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors"
            >
              Save About Details
            </button>
          </div>
        </div>

        {/* Section 3: Slow Brand Marquee */}
        <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-900/10">
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              03 — Brand Marquee Ticker
            </h3>
            {savedSection === 'marquee' && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check size={14} /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Ticker Text</label>
            <input
              type="text"
              value={content.marquee.text}
              onChange={(e) => setContent({
                ...content,
                marquee: { ...content.marquee, text: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 uppercase font-mono text-[11px]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSaveSection('marquee')}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold transition-colors"
            >
              Save Marquee Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
