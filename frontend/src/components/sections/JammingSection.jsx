import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, Calendar, Mic2 } from 'lucide-react';
import { jammingMedia as initialJamming } from '../../data/instagramMedia';
import { fetchJammingMedia } from '../../services/videoService';
import { fetchSiteContent } from '../../services/siteContentService';

export default function JammingSection() {
  const [isPlayingMain, setIsPlayingMain] = useState(true);
  const [isMutedMain, setIsMutedMain] = useState(true);
  const [jamming, setJamming] = useState(initialJamming);
  const [jammingCopy, setJammingCopy] = useState({
    title: 'Jamming at Yaari',
    subtitle: 'Some evenings are better with music, coffee and your people. When the whole crowd sings along, the energy in our backyard is something you have to feel for yourself.',
    eventHeading: 'Soulful Nights with Guest Artists',
    eventSubtext: 'Sunday sessions with live singers, acoustic guitars, and candlelit backyard seating.',
    entryNote: 'Seating on first-come basis • Free entry'
  });
  const mainVideoRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchJammingMedia().then(data => {
      if (isMounted && data) {
        setJamming(data);
      }
    });

    fetchSiteContent().then(res => {
      if (isMounted && res.content?.jamming) {
        setJammingCopy(prev => ({
          ...prev,
          ...res.content.jamming
        }));
      }
    });

    return () => { isMounted = false; };
  }, []);

  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlayingMain) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlayingMain(!isPlayingMain);
    }
  };

  const toggleMute = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !mainVideoRef.current.muted;
      setIsMutedMain(mainVideoRef.current.muted);
    }
  };

  return (
    <section
      id="jamming"
      className="relative py-24 sm:py-32 bg-[#181614] text-ivory-50 overflow-hidden border-b border-charcoal-800"
    >
      {/* Ambient Large Background Word */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 pointer-events-none select-none text-[16vw] font-serif font-bold text-white/[0.03] tracking-widest">
        JAMMING
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-coffee-400 font-medium mb-4">
            <Mic2 size={13} />
            <span>Acoustic Evenings & Live Sets</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-ivory-50">
            {jammingCopy.title || "Jamming at Yaari"}
          </h2>

          <p className="text-base sm:text-lg text-ivory-200/80 font-light mt-4 max-w-xl">
            {jammingCopy.subtitle || "Some evenings are better with music, coffee and your people. When the whole crowd sings along, the energy in our backyard is something you have to feel for yourself."}
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Main Big Feature Video (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative group rounded-3xl overflow-hidden bg-charcoal-800 border border-white/10 shadow-2xl min-h-[380px] sm:min-h-[460px] flex flex-col justify-end"
          >
            {jamming.mainVideo?.videoSrc ? (
              <video
                ref={mainVideoRef}
                src={jamming.mainVideo.videoSrc}
                poster={jamming.mainVideo.thumbnail}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <img
                src={jamming.mainVideo?.thumbnail || "/brand/yaari-social-logo.png"}
                alt="Jamming at Yaari Social"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />

            {/* Video Controls Top Right */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-coffee-600 transition-colors text-xs"
                title={isPlayingMain ? "Pause" : "Play"}
                aria-label="Toggle Play"
              >
                {isPlayingMain ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-coffee-600 transition-colors text-xs"
                title={isMutedMain ? "Unmute" : "Mute"}
                aria-label="Toggle Sound"
              >
                {isMutedMain ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Caption Info Bottom Left */}
            <div className="relative z-10 p-6 sm:p-8">
              <span className="inline-block px-2.5 py-0.5 rounded bg-coffee-600/80 text-[10px] uppercase tracking-widest text-white font-medium mb-2">
                Live Crowd Energy
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-normal">
                "When the crowd sings along, the whole place comes alive."
              </h3>
              <p className="text-xs text-ivory-200/70 font-light mt-2 max-w-md line-clamp-2">
                {jamming.mainVideo?.caption || "Acoustic performances and live soulful sessions at Yaari Social Silvassa."}
              </p>
            </div>
          </motion.div>

          {/* Right Column (5 cols): Poster + Event Card */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
            {/* Live Musical Event Poster Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group rounded-3xl overflow-hidden bg-charcoal-800 border border-white/10 p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xl"
            >
              {(jammingCopy.eventPosterUrl || jamming.eventPoster?.thumbnail) && (
                <div className="w-full sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 bg-charcoal-900 border border-white/10">
                  <img
                    src={jammingCopy.eventPosterUrl || jamming.eventPoster.thumbnail}
                    alt="Live Musical Night Event at Yaari Social"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex flex-col justify-center space-y-2.5 text-left w-full">
                <div className="flex items-center gap-1.5 text-xs text-coffee-400 font-medium uppercase tracking-wider">
                  <Calendar size={13} />
                  <span>Live Musical Sessions</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-ivory-50 font-normal">
                  {jammingCopy.eventHeading || "Soulful Nights with Guest Artists"}
                </h4>
                <p className="text-xs text-ivory-200/70 font-light leading-relaxed">
                  {jammingCopy.eventSubtext || "Sunday sessions with live singers, acoustic guitars, and candlelit backyard seating."}
                </p>
                <div className="pt-1">
                  <span className="text-[11px] text-taupe-400 font-mono">
                    {jammingCopy.entryNote || "Seating on first-come basis • Free entry"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Secondary Video / Crowd Reel Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-800 to-charcoal-900 border border-white/10 p-6 flex-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase tracking-widest text-ivory-200 font-medium">
                    Host Your Session
                  </span>
                </div>
                <Music size={18} className="text-coffee-400" />
              </div>

              <div className="space-y-2 my-2">
                <h4 className="font-serif text-2xl text-ivory-50 font-normal">
                  Are you an indie artist or guitarist?
                </h4>
                <p className="text-xs text-ivory-200/70 font-light leading-relaxed">
                  Yaari Social is an open floor for local musicians, poets, and acoustic artists. Drop by and jam with us!
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-white/10 mt-2">
                <span className="text-xs text-coffee-400 font-medium">DM @yaari_social</span>
                <a
                  href="https://www.instagram.com/yaari_social/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wider text-ivory-100 hover:text-white underline underline-offset-4"
                >
                  Join Next Jam →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
