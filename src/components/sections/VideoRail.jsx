import React, { useRef, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { reelVideos } from '../../data/instagramMedia';
import MediaModal from '../ui/MediaModal';

function ReelCard({ reel, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-[240px] sm:w-[280px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-charcoal-900 relative group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-charcoal-900/10 transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* High performance media switcher: Poster by default + Active video preview on hover */}
      <img
        src={reel.thumbnail}
        alt={reel.caption || "Yaari Social Reel"}
        className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-opacity duration-300 ${
          isHovered && reel.videoSrc ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {reel.videoSrc && (
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          loop
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-black/20 group-hover:from-charcoal-950/95 transition-all duration-300 pointer-events-none" />

      {/* Floating Play Indicator Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 shadow-lg ${
            isHovered ? 'scale-110 bg-coffee-600' : 'scale-100'
          }`}
        >
          <Play size={20} className="ml-0.5 fill-white" />
        </div>
      </div>

      {/* Bottom Caption Excerpt */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white transform group-hover:-translate-y-1 transition-transform duration-300 pointer-events-none">
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
    </div>
  );
}

export default function VideoRail() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('normal');

  // Duplicate the array for seamless infinite loop
  const displayReels = [...reelVideos, ...reelVideos];

  return (
    <section
      id="reels"
      className="py-24 sm:py-32 bg-ivory-100/70 border-b border-charcoal-900/10 text-charcoal-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-coffee-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-coffee-600">
              Live Feed • Reels & Moments
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
            Press play on the vibe.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 font-light mt-3 max-w-lg">
            Monsoon rain in the backyard, cold coffee pours, live music singalongs, and everyday laughter.
          </p>
        </div>

        {/* Action Controls (Pause / Resume & Direction) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-charcoal-900/10 text-charcoal-800 hover:bg-charcoal-900 hover:text-white transition-all duration-300 shadow-sm text-xs font-medium uppercase tracking-wider"
          >
            {isPaused ? <Play size={13} className="fill-current" /> : <Pause size={13} className="fill-current" />}
            <span>{isPaused ? 'Resume Motion' : 'Pause'}</span>
          </button>

          <button
            onClick={() => setDirection(prev => (prev === 'normal' ? 'reverse' : 'normal'))}
            className="p-2.5 rounded-full bg-white border border-charcoal-900/10 text-charcoal-800 hover:bg-charcoal-900 hover:text-white transition-all duration-300 shadow-sm"
            title={direction === 'normal' ? "Reverse direction" : "Normal direction"}
            aria-label="Reverse motion direction"
          >
            {direction === 'normal' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Continuous Marquee Rail Container */}
      <div className="relative w-full overflow-hidden select-none group/rail">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-ivory-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-ivory-100 to-transparent z-10 pointer-events-none" />

        <div
          className={`flex gap-5 sm:gap-6 py-4 w-max ${
            direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'
          }`}
          style={{
            animationDuration: '60s',
            animationPlayState: isPaused ? 'paused' : undefined,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayReels.map((reel, idx) => (
            <ReelCard
              key={`${reel.id || idx}-${idx}`}
              reel={reel}
              onClick={() => setSelectedVideo(reel)}
            />
          ))}
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="text-center pt-6 text-[11px] text-taupe-500 font-mono">
        Hover over any video to preview & click to watch with sound in full view
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
