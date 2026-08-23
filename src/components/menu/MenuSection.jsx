import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image, Sparkles, UtensilsCrossed } from 'lucide-react';
import { menu } from '../../data/menu';
import MenuLightbox from './MenuLightbox';

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const categories = ["All", ...menu.map(c => c.category)];

  // Filtered menu items based on selected category and search
  const filteredMenu = useMemo(() => {
    return menu.map(cat => {
      // Category filter check
      if (selectedCategory !== "All" && cat.category !== selectedCategory) {
        return null;
      }
      // Search filter check
      const matchingItems = cat.items.filter(item => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || cat.category.toLowerCase().includes(q);
      });

      if (matchingItems.length === 0) return null;

      return {
        ...cat,
        items: matchingItems
      };
    }).filter(Boolean);
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="menu"
      className="py-24 sm:py-32 bg-[#F5F0E6] text-charcoal-900 border-b border-charcoal-900/10 relative overflow-hidden"
    >
      {/* Background Decorative Faint Rings */}
      <div className="absolute top-12 left-8 w-72 h-72 rounded-full border border-charcoal-900/5 pointer-events-none" />
      <div className="absolute bottom-16 right-12 w-96 h-96 rounded-full border border-charcoal-900/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-coffee-500" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-coffee-600">
                Fresh & Handcrafted
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-normal leading-[1.08] tracking-tight">
              The Yaari Menu
            </h2>
            <p className="text-sm sm:text-base text-charcoal-700 font-light mt-3 max-w-xl">
              Freshly brewed coffees, comforting chai, triple-cheese grilled breads, authentic pastas and monsoon snacks.
            </p>
          </div>

          {/* View Original Menu Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white border border-charcoal-900/15 text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-all duration-300 shadow-sm text-xs uppercase tracking-[0.16em] font-medium group"
          >
            <Image size={15} className="text-coffee-500 group-hover:text-white transition-colors" />
            <span>View Original Menu Photos</span>
          </button>
        </div>

        {/* Search & Category Filter Rail */}
        <div className="space-y-5 mb-12">
          {/* Search Field */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find something tasty (e.g. coffee, maggi, pasta, bun)..."
              className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-charcoal-900/10 rounded-full text-xs sm:text-sm text-charcoal-900 placeholder:text-taupe-400 focus:outline-none focus:border-coffee-500 focus:bg-white transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-taupe-400 hover:text-charcoal-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontally Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium tracking-wider uppercase ${
                  selectedCategory === cat
                    ? 'bg-charcoal-900 text-ivory-50 shadow-md'
                    : 'bg-white/60 text-charcoal-700 hover:bg-white hover:text-charcoal-900 border border-charcoal-900/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {filteredMenu.map((catSection, sectionIdx) => (
              <motion.div
                key={catSection.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (sectionIdx % 2) * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-charcoal-900/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Category Title & Description */}
                  <div className="flex items-baseline justify-between border-b border-charcoal-900/10 pb-4 mb-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-normal">
                        {catSection.category}
                      </h3>
                      {catSection.description && (
                        <p className="text-xs text-taupe-500 font-light mt-1">
                          {catSection.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-coffee-600 font-mono">
                      {catSection.items.length} items
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {catSection.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-baseline justify-between py-1 transition-transform duration-300 hover:translate-x-1"
                      >
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <span className="text-sm sm:text-base font-medium text-charcoal-800 group-hover:text-coffee-600 transition-colors">
                            {item.name}
                          </span>
                          {item.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-coffee-500/10 text-coffee-600 text-[10px] font-semibold tracking-wider uppercase">
                              <Sparkles size={10} />
                              <span>Must Try</span>
                            </span>
                          )}
                        </div>

                        {/* Leader Dot Line */}
                        <div className="flex-1 mx-3 border-b border-dotted border-charcoal-900/20 group-hover:border-coffee-500/40 transition-colors" />

                        {/* Price */}
                        <span className="font-mono text-sm sm:text-base font-semibold text-charcoal-900 group-hover:text-coffee-600 transition-colors">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Micro Note */}
                <div className="pt-6 mt-4 border-t border-charcoal-900/5 text-[11px] text-taupe-400 font-light italic flex items-center justify-between">
                  <span>Prepared fresh on order</span>
                  <span>Taxes included</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-charcoal-900/10">
            <UtensilsCrossed size={32} className="mx-auto text-taupe-400 mb-3" />
            <h4 className="font-serif text-2xl text-charcoal-800">No menu items found</h4>
            <p className="text-xs text-taupe-500 mt-1">Try searching for coffee, burger, chai or sandwiches</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 text-xs font-semibold text-coffee-600 underline uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox for Original Menu Photos */}
      <MenuLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </section>
  );
}
