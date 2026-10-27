import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import MenuTab from './components/MenuTab';
import CategoriesTab from './components/CategoriesTab';
import GalleryTab from './components/GalleryTab';
import VideosTab from './components/VideosTab';
import JammingTab from './components/JammingTab';
import HeroTab from './components/HeroTab';
import ContentTab from './components/ContentTab';
import SettingsTab from './components/SettingsTab';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';
import { api, supabase } from './services/api';
import { LogOut, Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      setCheckingAuth(true);
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.log('No active session:', err.message);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  }

  // 1. Loading screen while checking existing auth session
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#181614] flex flex-col items-center justify-center p-4 text-ivory-50">
        <div className="w-16 h-16 rounded-full bg-ivory-50 p-2 flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <img
            src="/brand/yaari-social-logo.png"
            alt="Yaari Social"
            className="w-full h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div className="w-6 h-6 border-2 border-coffee-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-ivory-200/70 font-mono tracking-wider uppercase text-[11px]">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  // 2. Gatekeeper: If unauthenticated, show the Login Page first
  if (!user) {
    return (
      <LoginModal
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
        }}
      />
    );
  }

  // 3. Authenticated: Render the full admin dashboard
  return (
    <div className="flex h-screen bg-[#FBF8F2] text-[#282522] overflow-hidden font-sans">
      {/* Sidebar Navigation (Off-canvas drawer on mobile, static on desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        user={user}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 px-3.5 sm:px-6 lg:px-8 border-b border-charcoal-900/10 bg-white/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-charcoal-700 hover:text-charcoal-950 hover:bg-black/5 lg:hidden transition-colors flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Brand Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ivory-100 p-0.5 flex items-center justify-center lg:hidden flex-shrink-0 border border-charcoal-900/10 shadow-sm">
              <img
                src="/brand/yaari-social-logo.png"
                alt="Yaari"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-coffee-600 font-semibold font-mono truncate">
              YAARI SOCIAL
            </span>
            <span className="text-taupe-300 hidden sm:inline">•</span>
            <span className="text-xs text-charcoal-600 capitalize font-medium truncate hidden sm:inline">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] sm:text-xs font-medium">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Admin Authenticated</span>
              <span className="sm:hidden">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 text-xs font-medium transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Scrollable Tab Views */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            <ErrorBoundary key={activeTab}>
              {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
              {activeTab === 'menu' && <MenuTab />}
              {activeTab === 'categories' && <CategoriesTab />}
              {activeTab === 'gallery' && <GalleryTab />}
              {activeTab === 'videos' && <VideosTab />}
              {activeTab === 'jamming' && <JammingTab />}
              {activeTab === 'hero' && <HeroTab />}
              {activeTab === 'content' && <ContentTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
