import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, ArrowRight } from 'lucide-react';
import { signaturePicks } from '../../data/menu';

export default function SignaturePicks() {
  return (
    <section className="py-20 sm:py-28 bg-ivory-50 text-charcoal-900 border-b border-charcoal-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-coffee-600 mb-2">
            <Award size={14} />
            <span>Yaari Highlights</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 font-normal">
            Signature House Favourites
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light mt-2">
            What our regulars keep ordering again and again.
          </p>
        </div>

        {/* 5-Item Signature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {signaturePicks.map((pick, idx) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-charcoal-900/10 shadow-sm hover:shadow-md hover:border-coffee-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-coffee-600 bg-coffee-500/10 px-2.5 py-0.5 rounded-full mb-3">
                  {pick.tag}
                </span>
                <h3 className="font-serif text-xl text-charcoal-900 font-medium group-hover:text-coffee-600 transition-colors">
                  {pick.name}
                </h3>
                <p className="text-xs text-charcoal-600 font-light leading-relaxed mt-2">
                  {pick.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-charcoal-900/5 flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-charcoal-900">
                  ₹{pick.price}
                </span>
                <a
                  href="#menu"
                  className="text-[11px] uppercase tracking-wider text-taupe-500 group-hover:text-coffee-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Menu</span>
                  <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
