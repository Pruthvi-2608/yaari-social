import React, { useEffect, useState } from 'react';
import { Settings, Check, Clock, Eye, MapPin, Instagram, Phone, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsTab() {
  const [cafeInfo, setCafeInfo] = useState({
    name: 'Yaari Social',
    tagline: 'A little coffee. A lot of yaari.',
    description: 'Your cozy corner for coffee, comfort food, conversations and late-evening yaari in Silvassa.',
    phone: '+91 97373 35305',
    alternatePhone: '+91 76987 97087',
    instagram: 'https://www.instagram.com/yaari_social/',
    instagramHandle: '@yaari_social',
    address: 'Near Lions College (Opp. Sai Nidhi Dosa), SSR Road',
    city: 'Silvassa',
    pincode: '396230',
    state: 'Dadra and Nagar Haveli',
    landmark: 'Opposite Sai Nidhi Dosa',
    googleMapsUrl: 'https://maps.google.com/?q=Yaari+Social+Silvassa'
  });

  const [hours, setHours] = useState([
    { days: 'Monday – Friday', time: '11:00 AM – 11:00 PM' },
    { days: 'Saturday – Sunday', time: '10:30 AM – 11:30 PM' }
  ]);

  const [visibility, setVisibility] = useState({
    hero: true,
    vibe: true,
    jamming: true,
    reels: true,
    menu: true,
    moments: true,
    about: true,
    visit: true
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await api.getSiteSettings();
      if (res) {
        if (res.cafe_info) setCafeInfo(prev => ({ ...prev, ...res.cafe_info }));
        if (res.hours) setHours(res.hours);
        if (res.section_visibility) setVisibility(prev => ({ ...prev, ...res.section_visibility }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  async function handleSaveAll(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await Promise.all([
        api.updateSiteSetting('cafe_info', cafeInfo),
        api.updateSiteSetting('hours', hours),
        api.updateSiteSetting('section_visibility', visibility)
      ]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddHourSlot() {
    setHours([...hours, { days: 'New Days', time: '11:00 AM – 11:00 PM' }]);
  }

  function handleRemoveHourSlot(index) {
    setHours(hours.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Contact & Site Settings
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-0.5">
            Manage verified business details, opening timings, and section visibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
              <Check size={14} /> Settings Saved!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Business Details & Contact (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
              <MapPin size={18} className="text-coffee-600" />
              <span>Location & Business Information</span>
            </h3>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Cafe Brand Name</label>
              <input
                type="text"
                value={cafeInfo.name}
                onChange={(e) => setCafeInfo({ ...cafeInfo, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Street Address</label>
              <input
                type="text"
                value={cafeInfo.address}
                onChange={(e) => setCafeInfo({ ...cafeInfo, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={cafeInfo.city}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">State / UT</label>
                <input
                  type="text"
                  value={cafeInfo.state}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={cafeInfo.pincode}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Google Maps Direction URL</label>
              <input
                type="text"
                value={cafeInfo.googleMapsUrl}
                onChange={(e) => setCafeInfo({ ...cafeInfo, googleMapsUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={cafeInfo.phone}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Secondary Phone</label>
                <input
                  type="text"
                  value={cafeInfo.alternatePhone}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, alternatePhone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={cafeInfo.instagramHandle}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, instagramHandle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={cafeInfo.instagram}
                  onChange={(e) => setCafeInfo({ ...cafeInfo, instagram: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hours & Section Visibility (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operating Hours */}
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
                <Clock size={18} className="text-coffee-600" />
                <span>Cafe Timings</span>
              </h3>
              <button
                type="button"
                onClick={handleAddHourSlot}
                className="text-coffee-600 hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                <Plus size={12} /> Add Schedule
              </button>
            </div>

            <div className="space-y-3">
              {hours.map((slot, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-ivory-50 border border-charcoal-900/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal-800">Slot #{idx + 1}</span>
                    {hours.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveHourSlot(idx)}
                        className="text-taupe-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={slot.days}
                      onChange={(e) => {
                        const copy = [...hours];
                        copy[idx].days = e.target.value;
                        setHours(copy);
                      }}
                      placeholder="Days"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-charcoal-900/10"
                    />
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => {
                        const copy = [...hours];
                        copy[idx].time = e.target.value;
                        setHours(copy);
                      }}
                      placeholder="Hours"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-charcoal-900/10 font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Visibility */}
          <div className="p-6 bg-white rounded-3xl border border-charcoal-900/10 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
              <Eye size={18} className="text-coffee-600" />
              <span>Public Website Section Visibility</span>
            </h3>

            <p className="text-charcoal-600 font-light text-[11px]">
              Toggle entire website sections on or off without redeploying code.
            </p>

            <div className="divide-y divide-charcoal-900/5">
              {[
                { key: 'hero', label: 'Hero Landing Section' },
                { key: 'vibe', label: 'The Yaari Feeling (Vibe Intro)' },
                { key: 'jamming', label: 'Jamming & Live Music' },
                { key: 'reels', label: 'Continuous Video Rail' },
                { key: 'menu', label: 'Digital Menu & Lightbox' },
                { key: 'moments', label: 'Moments Photo Gallery' },
                { key: 'about', label: 'About Yaari Story' },
                { key: 'visit', label: 'Visit / Contact Section' },
              ].map((sec) => (
                <div key={sec.key} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-charcoal-800">{sec.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibility[sec.key] !== false}
                      onChange={(e) => setVisibility({ ...visibility, [sec.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-taupe-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-coffee-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
