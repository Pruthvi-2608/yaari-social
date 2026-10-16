import React, { useEffect, useState } from 'react';
import {
  UtensilsCrossed,
  Layers,
  Image as ImageIcon,
  Video,
  Music,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function OverviewTab({ setActiveTab }) {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    availableMenuItems: 0,
    totalCategories: 0,
    publishedGallery: 0,
    publishedVideos: 0,
    publishedJammingMedia: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      if (data) setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const metricCards = [
    {
      title: 'Total Menu Items',
      value: stats.totalMenuItems,
      subtext: `${stats.availableMenuItems} actively available`,
      icon: UtensilsCrossed,
      color: 'bg-coffee-500/10 text-coffee-600',
      tab: 'menu'
    },
    {
      title: 'Menu Categories',
      value: stats.totalCategories,
      subtext: 'Organized & filtered',
      icon: Layers,
      color: 'bg-emerald-500/10 text-emerald-600',
      tab: 'categories'
    },
    {
      title: 'Moments Gallery',
      value: stats.publishedGallery,
      subtext: 'High-res lifestyle photos',
      icon: ImageIcon,
      color: 'bg-blue-500/10 text-blue-600',
      tab: 'gallery'
    },
    {
      title: 'Videos & Reels',
      value: stats.publishedVideos,
      subtext: 'Horizontal rail & background',
      icon: Video,
      color: 'bg-amber-500/10 text-amber-600',
      tab: 'videos'
    },
    {
      title: 'Jamming Media',
      value: stats.publishedJammingMedia,
      subtext: 'Acoustic sets & crowd video',
      icon: Music,
      color: 'bg-purple-500/10 text-purple-600',
      tab: 'jamming'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#282522] to-[#181614] text-ivory-50 border border-charcoal-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/20 text-coffee-400 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
            <Sparkles size={13} />
            <span>Yaari Social Cafe Management</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
            Welcome to the Yaari Admin Panel
          </h2>
          <p className="text-xs sm:text-sm text-ivory-200/70 font-light mt-1 max-w-xl leading-relaxed">
            Manage your digital menu, authentic Instagram media, acoustic jamming nights, and website copy in real time without editing code.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal-900 mb-3 sm:mb-4">
          Cafe Content Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {metricCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(card.tab)}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-900/10 shadow-sm hover:shadow-md hover:border-coffee-500/30 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-charcoal-600">{card.title}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-semibold text-charcoal-900 group-hover:text-coffee-600 transition-colors">
                    {loading ? '...' : card.value}
                  </div>
                  <p className="text-[11px] text-taupe-500 font-light mt-1">{card.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ivory-100/60 border border-charcoal-900/10">
        <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal-900 mb-3 sm:mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('menu')}
            className="p-4 rounded-2xl bg-white border border-charcoal-900/10 text-left hover:border-coffee-500/40 hover:shadow-sm transition-all"
          >
            <PlusCircle size={20} className="text-coffee-600 mb-2" />
            <div className="text-sm font-semibold text-charcoal-900">Add Menu Item</div>
            <p className="text-xs text-charcoal-600 font-light mt-1">Add a beverage or snack to the live menu</p>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className="p-4 rounded-2xl bg-white border border-charcoal-900/10 text-left hover:border-coffee-500/40 hover:shadow-sm transition-all"
          >
            <ImageIcon size={20} className="text-coffee-600 mb-2" />
            <div className="text-sm font-semibold text-charcoal-900">Upload Gallery Photo</div>
            <p className="text-xs text-charcoal-600 font-light mt-1">Add moments to the website photo grid</p>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className="p-4 rounded-2xl bg-white border border-charcoal-900/10 text-left hover:border-coffee-500/40 hover:shadow-sm transition-all"
          >
            <Video size={20} className="text-coffee-600 mb-2" />
            <div className="text-sm font-semibold text-charcoal-900">Add Reel / Video</div>
            <p className="text-xs text-charcoal-600 font-light mt-1">Upload acoustic jamming or lifestyle reels</p>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-4 rounded-2xl bg-white border border-charcoal-900/10 text-left hover:border-coffee-500/40 hover:shadow-sm transition-all"
          >
            <Sparkles size={20} className="text-coffee-600 mb-2" />
            <div className="text-sm font-semibold text-charcoal-900">Edit Cafe Hours & Info</div>
            <p className="text-xs text-charcoal-600 font-light mt-1">Update timings, phone number or address</p>
          </button>
        </div>
      </div>
    </div>
  );
}
