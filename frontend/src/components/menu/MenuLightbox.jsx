import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

export default function MenuLightbox({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const menuPages = [
    { title: "Beverages & Hot/Cold Drinks Menu", src: "/images/menu/menu-drinks.png", alt: "Yaari Social Drinks Menu" },
    { title: "Food, Snacks & Pastas Menu", src: "/images/menu/menu-food.png", alt: "Yaari Social Food Menu" }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentPage(0);
      if (e.key === 'ArrowRight') setCurrentPage(1);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleZoom = () => {
    setZoomLevel(prev => (prev === 1 ? 1.6 : 1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#181614]/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-5xl bg-charcoal-900 text-ivory-50 rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col max-h-[95vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-charcoal-900/90">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ivory-50">
                Original Physical Cafe Menu
              </h3>
              <p className="text-xs text-taupe-400">
                Page {currentPage + 1} of {menuPages.length} — {menuPages[currentPage].title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="p-2 rounded-full hover:bg-white/10 text-ivory-200 hover:text-white transition-colors"
                title={zoomLevel === 1 ? "Zoom In" : "Zoom Out"}
                aria-label="Zoom"
              >
                {zoomLevel === 1 ? <ZoomIn size={18} /> : <ZoomOut size={18} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-ivory-200 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Canvas Container */}
          <div className="relative flex-1 overflow-auto bg-charcoal-950 p-4 sm:p-8 flex items-center justify-center min-h-[400px]">
            <motion.img
              key={currentPage}
              src={menuPages[currentPage].src}
              alt={menuPages[currentPage].alt}
              animate={{ scale: zoomLevel }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/10 cursor-pointer transition-transform"
              onClick={toggleZoom}
            />

            {/* Previous Page Arrow */}
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm transition-all duration-300 ${
                currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-coffee-600'
              }`}
              aria-label="Previous Page"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Page Arrow */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm transition-all duration-300 ${
                currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-coffee-600'
              }`}
              aria-label="Next Page"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bottom Switcher */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-charcoal-900">
            <div className="flex items-center gap-3">
              {menuPages.map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                    currentPage === idx
                      ? 'bg-coffee-600 border-coffee-600 text-white font-medium'
                      : 'border-white/15 text-ivory-200/80 hover:bg-white/10'
                  }`}
                >
                  Page {idx + 1}: {idx === 0 ? 'Drinks & Chai' : 'Food & Pasta'}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-taupe-400 font-mono hidden sm:inline">
              Click photo to zoom • Use arrows to switch
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
