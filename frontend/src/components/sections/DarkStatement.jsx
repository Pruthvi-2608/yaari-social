import React from 'react';
import { motion } from 'framer-motion';

export default function DarkStatement() {
  return (
    <section className="relative py-28 sm:py-36 md:py-44 bg-[#181614] text-ivory-50 overflow-hidden flex items-center justify-center border-b border-charcoal-800">
      {/* Giant Rotating Logo-Inspired Double Ring Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full border border-dashed border-white animate-spin-slow" />
        <div className="absolute w-[440px] sm:w-[620px] h-[440px] sm:h-[620px] rounded-full border border-white/40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-block text-[11px] uppercase tracking-[0.3em] text-coffee-400 font-medium mb-6"
        >
          Yaari Social • Silvassa
        </motion.div>

        {/* Statement Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-ivory-50"
        >
          Come for the coffee. <br />
          <span className="italic text-coffee-400 font-light">
            Stay for the yaari.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 sm:mt-8 max-w-md mx-auto text-xs sm:text-sm text-ivory-200/70 font-light leading-relaxed"
        >
          Whether it’s a solo afternoon espresso or a late-night music jam with your closest friends, our doors and backyard are open.
        </motion.p>
      </div>
    </section>
  );
}
