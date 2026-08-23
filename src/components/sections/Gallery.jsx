import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Eye, Heart, Instagram } from 'lucide-react';
import { galleryMoments } from '../../data/instagramMedia';
import MediaModal from '../ui/MediaModal';

export default function Gallery() {
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <section
      id="moments"
      className="py-24 sm:py-32 bg-ivory-50 text-charcoal-900 border-b border-charcoal-900/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-coffee-500" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-coffee-600">
              Moments & Stories
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
            Little moments at Yaari.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 font-light mt-3 max-w-lg">
            Candid captures from our backyard, cozy seating, and real conversations.
          </p>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryMoments.map((item, idx) => {
            // Give some items taller aspect ratio for an editorial masonry feel
            const isSpanTall = idx % 3 === 0;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                onClick={() => setActiveMedia(item)}
                className={`relative rounded-2xl overflow-hidden bg-ivory-200 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-charcoal-900/10 ${
                  isSpanTall ? 'aspect-[3/4] row-span-1' : 'aspect-square'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.caption || "Yaari Social Moment"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5 text-white">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Eye size={14} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-serif line-clamp-2 italic text-ivory-100 mb-1">
                      {item.caption || "Yaari Social Cafe"}
                    </p>
                    {item.likes > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-ivory-200/70 font-mono">
                        <Heart size={11} className="text-rose-400 fill-rose-400" />
                        <span>{item.likes} likes</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View on Instagram Footer Link */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/yaari_social/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-charcoal-800 hover:text-coffee-600 border-b border-charcoal-800/30 hover:border-coffee-600 pb-1 transition-colors"
          >
            <Instagram size={14} />
            <span>Follow along on Instagram @yaari_social</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      <MediaModal
        isOpen={Boolean(activeMedia)}
        media={activeMedia}
        onClose={() => setActiveMedia(null)}
      />
    </section>
  );
}
