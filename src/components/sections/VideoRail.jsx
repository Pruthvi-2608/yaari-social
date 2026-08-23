import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Film, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { reelVideos } from '../../data/instagramMedia';
import MediaModal from '../ui/MediaModal';

export default function VideoRail() {
  const scrollContainerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="reels"
      className="py-24 sm:py-32 bg-ivory-100/70 border-b border-charcoal-900/10 text-charcoal-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-coffee-500" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-coffee-600">
              Reels & Moments
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
            Press play on the vibe.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 font-light mt-3 max-w-lg">
            Monsoon rain in the backyard, cold coffee pours, live music singalongs, and everyday laughter.
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white border border-charcoal-900/10 text-charcoal-800 hover:bg-charcoal-900 hover:text-white transition-all duration-300 shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white border border-charcoal-900/10 text-charcoal-800 hover:bg-charcoal-900 hover:text-white transition-all duration-300 shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Rail Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-4 pt-2 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
      >
        {reelVideos.map((reel, idx) => (
          <motion.div
            key={reel.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            onClick={() => setSelectedVideo(reel)}
            className="flex-shrink-0 w-[240px] sm:w-[280px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-charcoal-900 relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 snap-start border border-charcoal-900/10"
          >
            {/* Video or Poster */}
            {reel.videoSrc ? (
              <video
                src={reel.videoSrc}
                poster={reel.thumbnail}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <img
                src={reel.thumbnail}
                alt={reel.caption || "Yaari Social Reel"}
                className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700"
              />
            )}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-black/20 group-hover:from-charcoal-950/95 transition-all duration-300" />

            {/* Floating Play Indicator Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-coffee-600 transition-all duration-300 shadow-lg">
                <Play size={20} className="ml-0.5 fill-white" />
              </div>
            </div>

            {/* Bottom Caption Excerpt */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
              <span className="text-[10px] uppercase tracking-widest text-coffee-400 font-semibold mb-1 block">
                @yaari_social
              </span>
              <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-ivory-100 drop-shadow-sm">
                {reel.caption || "Cozy backyard vibes & delicious coffee in Silvassa."}
              </p>
              {reel.likes > 0 && (
                <div className="text-[10px] text-ivory-200/70 font-mono mt-2 flex items-center gap-2">
                  <span>❤️ {reel.likes.toLocaleString()}</span>
                  <span>💬 {reel.comments}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Media Detail Modal */}
      <MediaModal
        isOpen={Boolean(selectedVideo)}
        media={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}
