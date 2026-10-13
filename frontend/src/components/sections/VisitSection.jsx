import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Instagram, Navigation, Phone, Sparkles, Send } from 'lucide-react';
import { site as fallbackSite } from '../../data/site';
import { fetchSiteContent } from '../../services/siteContentService';

export default function VisitSection() {
  const [siteData, setSiteData] = useState(fallbackSite);

  useEffect(() => {
    let isMounted = true;
    fetchSiteContent().then(res => {
      if (isMounted && res.site) {
        setSiteData(res.site);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="visit" className="py-24 sm:py-32 bg-ivory-50 text-charcoal-900 border-b border-charcoal-900/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory-100 border border-charcoal-900/10 text-[11px] uppercase tracking-[0.2em] font-semibold text-coffee-600 mb-3 shadow-sm">
            <MapPin size={12} />
            <span>Find Yaari Social</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
            Drop by for a cup.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 font-light mt-3">
            We’re located in the heart of Silvassa. Come on in, grab your favourite table, and take your time.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Card 1: Address & Landmark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-white border border-charcoal-900/10 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-coffee-500/10 text-coffee-600 flex items-center justify-center mb-6">
                <MapPin size={22} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal-900 mb-2 font-normal">Location</h3>
              <p className="text-xs sm:text-sm text-charcoal-700 font-light leading-relaxed">
                {siteData.location.address}
              </p>
              <p className="text-xs text-taupe-500 font-medium mt-1">
                {siteData.location.city}, {siteData.location.state} — {siteData.location.pincode}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-charcoal-900/5">
              <a
                href={siteData.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-coffee-600 hover:text-charcoal-900 transition-colors"
              >
                <Navigation size={13} />
                <span>Get Directions →</span>
              </a>
            </div>
          </motion.div>

          {/* Card 2: Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-3xl bg-white border border-charcoal-900/10 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-coffee-500/10 text-coffee-600 flex items-center justify-center mb-6">
                <Clock size={22} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal-900 mb-2 font-normal">Cafe Timings</h3>
              <div className="space-y-2 mt-3">
                {siteData.hours.map((h, idx) => (
                  <div key={idx} className="text-xs sm:text-sm">
                    <div className="font-medium text-charcoal-900">{h.days}</div>
                    <div className="text-taupe-500 font-mono text-xs">{h.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-charcoal-900/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-charcoal-700 font-medium">Open Everyday for Yaari</span>
            </div>
          </motion.div>

          {/* Card 3: Instagram & Social Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-3xl bg-charcoal-900 text-ivory-50 border border-charcoal-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-coffee-400 flex items-center justify-center mb-6">
                <Instagram size={22} />
              </div>
              <h3 className="font-serif text-2xl text-ivory-50 mb-2 font-normal">Connect With Us</h3>
              <p className="text-xs sm:text-sm text-ivory-200/80 font-light leading-relaxed">
                Stay updated with our weekly live music schedule, monsoon specials, and new menu additions.
              </p>
              <div className="mt-3 inline-block font-mono text-xs text-coffee-400 font-semibold">
                {siteData.social.handle}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <a
                href={siteData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-sm"
              >
                <Instagram size={14} />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
