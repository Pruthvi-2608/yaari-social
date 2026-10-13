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
import { api, supabase } from './services/api';
import { Lock, LogIn, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    await api.logout();
    setUser(null);
  }

  return (
    <div className="flex h-screen bg-[#FBF8F2] text-[#282522] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-8 border-b border-charcoal-900/10 bg-white/70 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-coffee-600 font-semibold font-mono">
              YAARI SOCIAL CAFE
            </span>
            <span className="text-taupe-300">•</span>
            <span className="text-xs text-charcoal-600 capitalize font-medium">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admin Authenticated</span>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
              >
                <LogIn size={14} />
                <span>Sign In as Admin</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Tab Views */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
            {activeTab === 'menu' && <MenuTab />}
            {activeTab === 'categories' && <CategoriesTab />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'videos' && <VideosTab />}
            {activeTab === 'jamming' && <JammingTab />}
            {activeTab === 'hero' && <HeroTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onLoginSuccess={(loggedUser) => {
            setUser(loggedUser);
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
}
