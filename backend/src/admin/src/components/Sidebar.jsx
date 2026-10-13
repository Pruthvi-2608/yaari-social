import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Image as ImageIcon,
  Video,
  Music,
  Sparkles,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Coffee
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'gallery', label: 'Moments Gallery', icon: ImageIcon },
    { id: 'videos', label: 'Videos & Reels', icon: Video },
    { id: 'jamming', label: 'Jamming Section', icon: Music },
    { id: 'hero', label: 'Hero & Homepage', icon: Sparkles },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'settings', label: 'Contact & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#201D1A] text-ivory-50 flex flex-col justify-between border-r border-charcoal-800 flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-charcoal-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ivory-50 p-1 flex items-center justify-center shadow">
            <img
              src="/brand/yaari-social-logo.png"
              alt="Yaari Social"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-tight text-ivory-50 leading-tight">
              Yaari Social
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-coffee-400 font-medium">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-coffee-600 text-white shadow-sm font-semibold'
                    : 'text-ivory-200/70 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-coffee-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with User Profile, Public Link, and Logout */}
      <div className="p-4 border-t border-charcoal-800 space-y-3">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory-200 text-xs transition-colors"
        >
          <ExternalLink size={13} />
          <span>View Public Website</span>
        </a>

        {user && (
          <div className="px-3 py-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-[10px] text-taupe-400 uppercase tracking-wider">Signed in as</p>
              <p className="text-xs text-ivory-100 font-medium truncate">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-taupe-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
