import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, ExternalLink, Volume2 } from 'lucide-react';

export default function MediaModal({ media, isOpen, onClose }) {
  if (!isOpen || !media) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-charcoal-900 text-ivory-50 rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col md:flex-row"
        >
          {/* Media Viewport (Left) */}
          <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
            {media.type === 'video' && media.src ? (
              <video
                src={media.src}
                poster={media.thumbnail}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[75vh] object-contain"
              />
            ) : (
              <img
                src={media.thumbnail || media.src}
                alt={media.caption || "Yaari Social Moment"}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            )}
          </div>

          {/* Details & Caption Viewport (Right) */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-charcoal-900 border-t md:border-t-0 md:border-l border-white/10">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-ivory-100 p-0.5">
                    <img
                      src="/brand/yaari-social-logo.png"
                      alt="Yaari Social"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ivory-50">yaari_social</h4>
                    <span className="text-[10px] text-taupe-400">Silvassa, DNH</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-ivory-200 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Caption Text */}
              <div className="text-xs sm:text-sm text-ivory-200/90 leading-relaxed font-light whitespace-pre-line max-h-60 overflow-y-auto pr-2">
                {media.caption || "Authentic moment captured at Yaari Social Cafe & Backyard."}
              </div>
            </div>

            {/* Footer Metrics & Actions */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-taupe-400">
                <div className="flex items-center gap-4">
                  {media.likes > 0 && (
                    <span className="flex items-center gap-1.5 text-ivory-200">
                      <Heart size={14} className="text-rose-400 fill-rose-400" />
                      {media.likes.toLocaleString()} likes
                    </span>
                  )}
                  {media.comments > 0 && (
                    <span className="flex items-center gap-1.5 text-ivory-200">
                      <MessageCircle size={14} />
                      {media.comments}
                    </span>
                  )}
                </div>
                {media.timestamp && (
                  <span className="text-[10px] text-taupe-500">
                    {new Date(media.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              <a
                href={media.instagramUrl || "https://www.instagram.com/yaari_social/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-coffee-600 text-ivory-50 text-xs font-medium uppercase tracking-wider transition-colors"
              >
                <span>View on Instagram</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
