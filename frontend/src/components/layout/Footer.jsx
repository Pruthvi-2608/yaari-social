import React from 'react';
import { Instagram, ArrowUp, Heart, MapPin } from 'lucide-react';
import { site } from '../../data/site';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181614] text-ivory-50 border-t border-charcoal-800 relative overflow-hidden">
      {/* Slow Marquee Banner Above Footer */}
      <div className="w-full bg-[#201D1A] py-3.5 border-b border-white/5 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className="text-[11px] uppercase tracking-[0.35em] font-medium text-coffee-400/80 mx-6 flex items-center gap-3"
            >
              <span>SEE YOU AT YAARI</span>
              <span className="text-white/20">•</span>
              <span>SILVASSA</span>
              <span className="text-white/20">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Col 1: Brand & Bio (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-ivory-100 p-0.5 flex items-center justify-center shadow-md">
                <img
                  src="/brand/yaari-social-logo.png"
                  alt="Yaari Social Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold tracking-tight text-ivory-50">
                  Yaari Social
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-coffee-400">
                  Cafe & Backyard • Silvassa
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ivory-200/70 font-light max-w-sm leading-relaxed">
              Your cozy corner for coffee, comfort food, acoustic music, and unhurried conversations that stretch into memorable evenings.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-taupe-400">
              <MapPin size={13} className="text-coffee-400" />
              <span>Near Lions College, Silvassa - 396230</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-coffee-400">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-ivory-200/80 font-light">
              {site.navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-coffee-400 transition-colors py-1 flex items-center gap-1 group"
                >
                  <span className="text-[10px] text-taupe-500 group-hover:text-coffee-400 transition-colors">↳</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Social & Back to Top (3 cols) */}
          <div className="md:col-span-3 space-y-4 flex flex-col md:items-end">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-coffee-400">
              Stay Connected
            </h4>

            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-coffee-600 border border-white/10 text-xs text-ivory-50 uppercase tracking-wider transition-colors"
            >
              <Instagram size={14} />
              <span>{site.social.handle}</span>
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs text-taupe-400 hover:text-white transition-colors pt-2 group"
            >
              <span>Back to top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-taupe-500 font-light gap-4">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Yaari Social.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-taupe-500 flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart size={11} className="text-rose-400 fill-rose-400" />
            <span>for good coffee & yaari</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
