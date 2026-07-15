import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image, Eye, X, ZoomIn } from "lucide-react";

interface GallerySectionProps {
  lang: 'en' | 'fr';
}

export default function GallerySection({ lang }: GallerySectionProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Interior' | 'Kitchen' | 'Food' | 'Events'>('All');
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  const tabs: ('All' | 'Interior' | 'Kitchen' | 'Food' | 'Events')[] = ['All', 'Interior', 'Kitchen', 'Food', 'Events'];

  const images = [
    {
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Our Grand Salon dining" : "Le Grand Salon de Réception",
      category: "Interior"
    },
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Culinary Precision Line" : "Ligne de Cuisine de Haute Précision",
      category: "Kitchen"
    },
    {
      url: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Executive Wagyu Ribeye" : "Ribeye de Bœuf de Kobe",
      category: "Food"
    },
    {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Deconstructed Rocher glaze" : "Dôme au Chocolat Praliné",
      category: "Food"
    },
    {
      url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Seared Sea Bass Plating" : "Rôti de Bar Poêlé",
      category: "Food"
    },
    {
      url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Smoked Rosemary Spritz smoke" : "Infusion de Romarin Fumé",
      category: "Food"
    },
    {
      url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Private Culinary Event" : "Événement de Dégustation Privé",
      category: "Events"
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
      title: lang === 'en' ? "Al-Fresco Seaside Terrace" : "Terrasse sur Mer au Crépuscule",
      category: "Interior"
    }
  ];

  const filteredImages = images.filter((img) => activeTab === 'All' || img.category === activeTab);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
            {lang === 'en' ? 'Sensory Chronicles' : 'Galerie Visuelle'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
            {lang === 'en' ? "The Olive & Beige Visual Diary" : "L’Atmosphère Olive & Beige"}
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto mt-6" />
        </div>

        {/* Gallery filters tab bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-mono font-medium tracking-wide uppercase transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#556B2F] text-white shadow-sm"
                  : "bg-white/45 backdrop-blur-md text-stone-600 hover:border-[#C8A96A] border border-white/70"
              }`}
            >
              {tab === 'All' ? (lang === 'en' ? 'All spaces' : 'Tout') : tab}
            </button>
          ))}
        </div>

        {/* Masonry-Style Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => {
              // Find real global index of this image to link lightbox correctly
              const globalIndex = images.findIndex(i => i.url === img.url);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  key={img.url}
                  onClick={() => setActiveImageIdx(globalIndex)}
                  className="group relative h-72 rounded-2xl overflow-hidden border border-stone-200/50 shadow-sm hover:shadow-md cursor-pointer bg-stone-100"
                >
                  {/* Real Image */}
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-[1.5s]"
                  />

                  {/* Dark hover gloss cover */}
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-10" />

                  {/* Details Overlay on Hover */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex justify-end">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white">
                        <ZoomIn size={14} />
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#C8A96A] font-bold">
                        {img.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white leading-snug mt-1.5">
                        {img.title}
                      </h4>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Elegant Lightbox View Overlay */}
      <AnimatePresence>
        {activeImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6"
          >
            {/* Close trigger */}
            <button
              onClick={() => setActiveImageIdx(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all z-50"
            >
              <X size={20} />
            </button>

            {/* Carousel navigation arrow - Prev */}
            <button
              onClick={() => setActiveImageIdx((activeImageIdx - 1 + images.length) % images.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white font-serif text-4xl hidden sm:block"
            >
              ‹
            </button>

            {/* Active image view */}
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center"
            >
              <img
                src={images[activeImageIdx].url}
                alt={images[activeImageIdx].title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Description card details below image */}
            <div className="text-center mt-6 max-w-xl">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold">
                {images[activeImageIdx].category} Salon
              </span>
              <h3 className="font-serif text-lg font-bold text-white mt-1">
                {images[activeImageIdx].title}
              </h3>
              <p className="font-mono text-[9px] text-stone-500 mt-2">
                Image {activeImageIdx + 1} of {images.length} • Powered by Olive & Beige Fine Dining
              </p>
            </div>

            {/* Carousel navigation arrow - Next */}
            <button
              onClick={() => setActiveImageIdx((activeImageIdx + 1) % images.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white font-serif text-4xl hidden sm:block"
            >
              ›
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
