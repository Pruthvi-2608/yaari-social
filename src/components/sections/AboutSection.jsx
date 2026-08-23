import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Sparkles } from 'lucide-react';
import { instagramMedia } from '../../data/instagramMedia';

export default function AboutSection() {
  const aboutImage =
    instagramMedia.find((m) => m.shortCode === 'DZVBgDxtAFH')?.thumbnail ||
    instagramMedia.find((m) => m.shortCode === 'DX_t3o7jRH7')?.thumbnail ||
    instagramMedia.find((m) => m.thumbnail)?.thumbnail ||
    '/brand/yaari-social-logo.png';

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F5F0E6] text-charcoal-900 border-b border-charcoal-900/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Circular Border Motif */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-charcoal-900/10 bg-white p-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-ivory-200">
                <img
                  src={aboutImage}
                  alt="Inside Yaari Social Cafe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Circular Graphic Motif behind the image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-dashed border-coffee-500/40 pointer-events-none -z-0" />
            <div className="absolute -top-6 -left-6 w-36 h-36 rounded-full border border-charcoal-900/10 pointer-events-none -z-0" />

            {/* Small Floating Stamp */}
            <div className="absolute -bottom-4 left-8 z-20 bg-charcoal-900 text-ivory-50 px-4 py-2 rounded-xl shadow-lg border border-white/10 flex items-center gap-2">
              <Sparkles size={13} className="text-coffee-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                Silvassa • Backyard
              </span>
            </div>
          </motion.div>

          {/* Right Column: Editorial Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-charcoal-900/10 text-[11px] uppercase tracking-[0.2em] text-coffee-600 font-semibold shadow-sm">
              <Coffee size={12} />
              <span>Eat • Sip • Socialise</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
              A space crafted for unhurried evenings.
            </h2>

            <p className="text-base sm:text-lg text-charcoal-700 font-light leading-relaxed">
              Yaari Social is a neighbourhood cafe in Silvassa made for unhurried conversations, comforting food, coffee breaks, acoustic music, and the kind of spontaneous plans that become core memories.
            </p>

            <p className="text-sm sm:text-base text-charcoal-600 font-light leading-relaxed">
              From our rainy monsoon backyard setups to acoustic jamming nights under warm string lights, every detail is designed to feel welcoming, intimate, and effortlessly comfortable.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-charcoal-800 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coffee-500" />
                <span>Pet-friendly outdoor backyard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coffee-500" />
                <span>Indie music & acoustic sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coffee-500" />
                <span>Fresh artisan brews & bites</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
