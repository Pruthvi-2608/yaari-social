import React from 'react';

export default function BrandMarquee({ text = "COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI • SILVASSA BACKYARD • GOOD VIBES •", reverse = false }) {
  const items = [text, text, text, text];

  return (
    <div className="w-full bg-ivory-100 py-4 sm:py-5 border-y border-charcoal-900/10 overflow-hidden select-none">
      <div className={`flex whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {items.map((str, idx) => (
          <span
            key={idx}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-charcoal-800/80 mx-4 flex items-center"
          >
            {str}
          </span>
        ))}
      </div>
    </div>
  );
}
