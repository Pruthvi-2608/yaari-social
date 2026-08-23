import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { heroMedia } from '../../data/instagramMedia';

export default function Hero() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted until interaction
      });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden bg-charcoal-900 text-ivory-50"
    >
      {/* Background Media Container (GPU-accelerated, zero lag) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        {heroMedia.video ? (
          <video
            ref={videoRef}
            src={heroMedia.video}
            poster={heroMedia.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onCanPlay={() => setIsVideoLoaded(true)}
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transform-gpu transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-90'
            }`}
            style={{ willChange: 'transform' }}
          />
        ) : (
          <img
            src={heroMedia.poster || "/brand/yaari-social-logo.png"}
            alt="Yaari Social Cafe Atmosphere"
            className="w-full h-full object-cover transform-gpu"
          />
        )}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-charcoal-900/60" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center pt-16 sm:pt-20">
        {/* Subtle Brand Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory-50/10 backdrop-blur-md border border-white/15 text-ivory-100 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium mb-6 shadow-sm"
        >
          <Sparkles size={12} className="text-coffee-400" />
          <span>Silvassa's Cozy Corner & Backyard</span>
        </motion.div>

        {/* Main Serif Heading with Masked Upward Motion */}
        <div className="overflow-hidden mb-5">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-normal leading-[1.02] tracking-tight text-ivory-50 drop-shadow-sm"
          >
            A little coffee. <br className="hidden sm:inline" />
            <span className="italic font-serif text-ivory-100 font-light">A lot of yaari.</span>
          </motion.h1>
        </div>

        {/* Subtitle Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="max-w-xl text-base sm:text-lg md:text-xl text-ivory-200/90 font-light leading-relaxed mb-8 sm:mb-10"
        >
          Coffee, comfort food, conversations and evenings worth staying for.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ivory-100 text-charcoal-900 font-medium text-xs sm:text-sm tracking-[0.14em] uppercase hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-center"
          >
            Explore the Menu
          </a>
          <a
            href="#vibe"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-charcoal-900/50 backdrop-blur-md text-ivory-50 border border-white/25 font-medium text-xs sm:text-sm tracking-[0.14em] uppercase hover:bg-white/15 transition-all duration-300 text-center"
          >
            See Our Vibe
          </a>
        </motion.div>
      </div>

      {/* Sound Toggle (if video has audio) */}
      {heroMedia.video && (
        <button
          onClick={toggleSound}
          className="absolute bottom-8 right-6 z-20 p-2.5 rounded-full bg-charcoal-900/60 backdrop-blur-md border border-white/15 text-ivory-200 hover:text-white hover:bg-charcoal-900 transition-all duration-300 text-xs flex items-center gap-1.5"
          title={isMuted ? "Unmute video" : "Mute video"}
          aria-label="Toggle Hero Video Sound"
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline text-[10px] uppercase tracking-wider pr-1">
            {isMuted ? 'Muted' : 'Audio On'}
          </span>
        </button>
      )}

      {/* Scroll Down Indicator */}
      <motion.a
        href="#vibe"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-ivory-200/70 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-light">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: infiniteRepeatHelper(), ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="group-hover:text-coffee-400 transition-colors" />
        </motion.div>
      </motion.a>
    </section>
  );
}

function infiniteRepeatHelper() {
  return Infinity;
}
