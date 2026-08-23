import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Music, Users, Sparkles } from 'lucide-react';
import { instagramMedia } from '../../data/instagramMedia';

export default function TheYaariFeeling() {
  // Select a candid cafe/interior image
  const candidPhoto =
    instagramMedia.find((m) => m.shortCode === 'DZVA2cwN9uM')?.thumbnail ||
    instagramMedia.find((m) => m.shortCode === 'DZVAABJty-Z')?.thumbnail ||
    instagramMedia.find((m) => m.thumbnail)?.thumbnail ||
    '/brand/yaari-social-logo.png';

  return (
    <section id="vibe" className="relative py-24 sm:py-32 bg-ivory-50 text-charcoal-900 overflow-hidden border-b border-charcoal-900/10">
      {/* Background Decorative Faint Watermark */}
      <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 pointer-events-none select-none text-[18vw] font-serif font-bold text-taupe-300/10 leading-none">
        YAARI
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-coffee-500 animate-pulse-subtle" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-coffee-600">
            The Yaari Feeling
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 leading-[1.08] tracking-tight font-normal">
              Not just a table. <br />
              <span className="italic font-light text-coffee-600">
                A place to stay a little longer.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-charcoal-700 font-light leading-relaxed max-w-2xl">
              Yaari Social is built around the simple things we keep coming back for —
              good coffee, comforting food, soul-stirring music, and the people we love sharing time with.
              Whether it's a quiet morning read or an evening jamming session under the lights, you're always home here.
            </p>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { icon: Coffee, label: "Fresh Brews", sub: "Hot & Cold" },
                { icon: Users, label: "Cozy Corners", sub: "Backyard Vibe" },
                { icon: Music, label: "Acoustic Nights", sub: "Live Jamming" },
                { icon: Sparkles, label: "Late Hours", sub: "Good Memories" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-ivory-100/80 border border-charcoal-900/5 hover:border-coffee-500/30 transition-all duration-300 group"
                >
                  <item.icon size={18} className="text-coffee-500 mb-1.5 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-charcoal-900">{item.label}</div>
                  <div className="text-[10px] text-taupe-500">{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Editorial Photo with Polaroid Angle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group max-w-sm w-full">
              {/* Polaroid Frame Card */}
              <div className="transform rotate-2 group-hover:rotate-0 transition-transform duration-500 p-4 bg-white rounded-2xl shadow-xl card-shadow border border-charcoal-900/10">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ivory-200">
                  <img
                    src={candidPhoto}
                    alt="Cozy table moments at Yaari Social"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-serif italic">
                    Backyard conversations • Yaari Social
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] text-taupe-500 tracking-wider uppercase font-mono">
                  <span>Silvassa, DNH</span>
                  <span>Est. 2024</span>
                </div>
              </div>

              {/* Decorative Subtle Backing Tag */}
              <div className="absolute -bottom-4 -left-4 bg-charcoal-900 text-ivory-100 text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-lg shadow-md border border-white/10 hidden sm:block">
                #YaariMoments
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
