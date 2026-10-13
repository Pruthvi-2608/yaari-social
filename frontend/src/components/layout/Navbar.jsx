import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { site } from '../../data/site';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FBF8F2]/90 backdrop-blur-md py-3 border-b border-charcoal-900/10 shadow-sm'
            : 'bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/30 to-transparent py-5 text-ivory-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <a
            href="#hero"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:rotate-6 transition-transform duration-500 bg-ivory-100 flex items-center justify-center p-0.5 shadow-sm">
              <img
                src="/brand/yaari-social-logo.png"
                alt="Yaari Social Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif text-2xl tracking-tight leading-none font-semibold ${
                  isScrolled ? 'text-charcoal-900' : 'text-ivory-50'
                }`}
              >
                Yaari Social
              </span>
              <span
                className={`text-[9px] uppercase tracking-[0.2em] font-sans transition-colors ${
                  isScrolled ? 'text-taupe-500' : 'text-ivory-200/80'
                }`}
              >
                Cafe & Backyard • Silvassa
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {site.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors relative py-1 group ${
                  isScrolled
                    ? 'text-charcoal-800 hover:text-coffee-600'
                    : 'text-ivory-100 hover:text-white'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-coffee-500' : 'bg-ivory-100'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Actions: Instagram & Visit Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? 'border-charcoal-900/15 text-charcoal-800 hover:bg-charcoal-900/5'
                  : 'border-white/20 text-ivory-100 hover:bg-white/10'
              }`}
              title="Follow @yaari_social on Instagram"
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>

            <a
              href="#visit"
              className={`text-xs tracking-[0.14em] uppercase px-4 py-2.5 rounded-full border transition-all duration-300 font-medium ${
                isScrolled
                  ? 'bg-charcoal-900 text-ivory-50 border-charcoal-900 hover:bg-coffee-600 hover:border-coffee-600'
                  : 'bg-ivory-50/15 backdrop-blur-sm text-ivory-50 border-white/30 hover:bg-ivory-50 hover:text-charcoal-900'
              }`}
            >
              Visit Yaari
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border ${
                isScrolled
                  ? 'border-charcoal-900/20 text-charcoal-800'
                  : 'border-white/20 text-ivory-100'
              }`}
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full border ${
                isScrolled
                  ? 'border-charcoal-900/20 text-charcoal-800 bg-white/50'
                  : 'border-white/20 text-ivory-100 bg-black/20'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#FBF8F2] border-b border-charcoal-900/10 shadow-xl px-6 py-8 md:hidden"
          >
            <div className="flex flex-col space-y-5">
              {site.navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-serif tracking-wider text-charcoal-900 hover:text-coffee-600 py-1 border-b border-charcoal-900/5 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-xs text-taupe-400 font-sans">→</span>
                </a>
              ))}

              <div className="pt-4 flex flex-col space-y-3">
                <a
                  href="#visit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-charcoal-900 text-ivory-50 rounded-full font-medium text-xs tracking-widest uppercase hover:bg-coffee-600 transition-colors"
                >
                  Visit Yaari Social
                </a>
                <div className="flex items-center justify-center gap-2 text-xs text-taupe-500 pt-1">
                  <MapPin size={13} className="text-coffee-500" />
                  <span>Near Lions College, Silvassa</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
