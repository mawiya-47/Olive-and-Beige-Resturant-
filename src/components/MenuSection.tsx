import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mic, Star, ShoppingBag, Heart, Leaf, HelpCircle, Eye, Flame, Check } from "lucide-react";
import { MenuItem } from "../types";

interface MenuSectionProps {
  menu: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  lang: 'en' | 'fr';
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

type CategoryType = 'All' | 'Appetizers' | 'Breakfast' | 'Mains' | 'Steaks' | 'Seafood' | 'Desserts' | 'Mocktails' | 'Beverages';

export default function MenuSection({
  menu,
  onAddToCart,
  lang,
  favorites,
  onToggleFavorite
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);

  const categories: CategoryType[] = [
    'All',
    'Appetizers',
    'Breakfast',
    'Mains',
    'Steaks',
    'Seafood',
    'Desserts',
    'Mocktails',
    'Beverages'
  ];

  // Voice Speech Recognition setup safely
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported on your current browser. Try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const voiceText = event.results[0][0].transcript;
      setSearchQuery(voiceText);
    };

    recognition.start();
  };

  // Add to cart animated state
  const handleAddClick = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 1200);
  };

  // Filter logic
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-24 bg-[#F8F4EC]/45 relative overflow-hidden">
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A96A]/25 to-transparent" />
      <div className="absolute -left-32 bottom-20 w-80 h-80 rounded-full bg-[#556B2F]/3 blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
              {lang === 'en' ? 'The Culinary Catalogue' : 'La Carte de Saison'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
              {lang === 'en' ? "Explore Signature Creations" : "Nos Créations Gastronomiques"}
            </h2>
          </div>
          
          {/* Integrated search and speech panel */}
          <div className="flex items-center gap-3 w-full md:w-80 relative">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                type="text"
                placeholder={lang === 'en' ? "Search dishes or ingredients..." : "Rechercher un plat..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/70 text-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A96A] shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-mono font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Voice Listener Toggle */}
            <button
              onClick={handleVoiceSearch}
              className={`p-3 rounded-full border transition-all duration-300 relative shrink-0 ${
                isListening
                  ? "bg-red-500/80 backdrop-blur-md border-red-500 text-white animate-pulse"
                  : "bg-white/40 backdrop-blur-md border-white/60 text-stone-600 hover:border-[#C8A96A]"
              }`}
              title="Voice Search"
            >
              <Mic size={16} />
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Categories Tab bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide mb-12 -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#556B2F] text-white shadow-md"
                  : "bg-white/45 backdrop-blur-md text-stone-600 hover:border-[#C8A96A]/40 hover:text-[#556B2F] border border-white/70 shadow-sm"
              }`}
            >
              {cat === 'All' ? (lang === 'en' ? 'All Masterpieces' : 'Tout') : cat}
            </button>
          ))}
        </div>

        {/* Dishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, idx) => {
              const isFav = favorites.includes(item.id);
              const isAdded = addedItemIds.includes(item.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  key={item.id}
                  className="frosted-glass rounded-2xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-500 relative group flex flex-col justify-between glass-shadow"
                >
                  
                  {/* Card upper image and action overlays */}
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-[1.5s]"
                    />
                    {/* Glossy filter */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Best Seller or Chef Special tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {item.isBestSeller && (
                        <span className="px-3 py-1 rounded-md bg-[#C8A96A] text-white text-[9px] font-mono font-bold tracking-widest uppercase shadow-sm">
                          {lang === 'en' ? 'Best Seller' : 'Meilleure Vente'}
                        </span>
                      )}
                      {item.isChefSpecial && (
                        <span className="px-3 py-1 rounded-md bg-[#556B2F] text-white text-[9px] font-mono font-bold tracking-widest uppercase shadow-sm flex items-center gap-1">
                          <Flame size={10} className="animate-pulse" />
                          {lang === 'en' ? 'Chef Special' : 'Spécial Chef'}
                        </span>
                      )}
                    </div>

                    {/* Quick interaction buttons overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                      {/* Wishlist Heart */}
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-stone-700 hover:text-red-500 hover:scale-110 transition-all ${
                          isFav ? "text-red-500" : ""
                        }`}
                      >
                        <Heart size={15} fill={isFav ? "currentColor" : "none"} />
                      </button>

                      {/* Info Lightbox popup */}
                      <button
                        onClick={() => setActiveItemDetails(item)}
                        className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-stone-700 hover:text-[#556B2F] hover:scale-110 transition-all"
                        title="Nutrition & Details"
                      >
                        <Eye size={15} />
                      </button>
                    </div>

                    {/* Categories tag bottom overlay */}
                    <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-wider text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm z-10 uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Card core description and info */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#556B2F] transition-colors duration-300 leading-snug">
                          {item.name}
                        </h3>
                        <span className="font-serif text-lg font-bold text-[#556B2F] shrink-0">
                          ${item.price}
                        </span>
                      </div>

                      {/* Calorie/Rating line */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center text-amber-500 gap-0.5">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-mono font-bold text-stone-700 mt-0.5">
                            {item.rating}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 font-light">({item.reviewsCount} reviews)</span>
                        <span className="text-stone-300 text-xs">|</span>
                        <span className="text-xs text-stone-500 font-mono mt-0.5">{item.calories} kcal</span>
                      </div>

                      <p className="text-stone-500 text-xs leading-relaxed font-light mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Allergens badges list */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.isVegan && (
                          <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[9px] font-mono font-medium flex items-center gap-1">
                            <Leaf size={10} />
                            VEGAN
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-mono font-medium flex items-center gap-1">
                            GL Gluten-Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Button action */}
                    <button
                      onClick={() => handleAddClick(item)}
                      disabled={isAdded}
                      className={`w-full py-3 rounded-xl font-medium tracking-wider text-xs uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                        isAdded
                          ? "bg-stone-100 text-stone-500 border border-stone-200"
                          : "bg-[#556B2F] text-white hover:bg-[#4F5D3A] shadow-sm hover:shadow-md"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          Added to Basket
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          {lang === 'en' ? 'Add To Order' : 'Ajouter à la Commande'}
                        </>
                      )}
                    </button>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Fallback view */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm mt-8 max-w-lg mx-auto">
            <HelpCircle size={40} className="text-stone-300 mx-auto mb-4 animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-stone-800">
              {lang === 'en' ? "No Culinary Creations Found" : "Aucun plat trouvé"}
            </h3>
            <p className="text-stone-500 text-xs mt-2 px-6">
              {lang === 'en' 
                ? "Try adjusting your filters, searching for ingredients like 'truffle', or try our voice assistant below."
                : "Ajustez vos filtres ou recherchez d’autres mots-clés."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2 rounded-full bg-[#556B2F] text-white text-xs font-mono uppercase"
            >
              Reset Search
            </button>
          </div>
        )}

      </div>

      {/* Details Lightbox Pop-up Modal */}
      <AnimatePresence>
        {activeItemDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl overflow-hidden max-w-xl w-full border border-[#C8A96A]/20 shadow-2xl relative"
            >
              {/* Image banner */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={activeItemDetails.image}
                  alt={activeItemDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <button
                  onClick={() => setActiveItemDetails(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md text-stone-800 hover:text-[#556B2F] transition-all"
                >
                  <Search size={16} className="rotate-45" />
                </button>
              </div>

              {/* Main Information */}
              <div className="p-8">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C8A96A] font-bold">
                  {activeItemDetails.category} Masterpiece
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-2">
                  {activeItemDetails.name}
                </h3>
                <div className="flex items-center gap-4 mt-3 pb-4 border-b border-stone-100">
                  <span className="text-xl font-serif font-bold text-[#556B2F]">
                    ${activeItemDetails.price}
                  </span>
                  <span className="text-stone-300">|</span>
                  <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                    <Star size={13} fill="currentColor" />
                    <span>{activeItemDetails.rating}</span>
                  </div>
                  <span className="text-stone-300">|</span>
                  <span className="text-xs text-stone-500 font-mono">
                    {activeItemDetails.calories} kcal
                  </span>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mt-4 font-light">
                  {activeItemDetails.description}
                </p>

                {/* Ingredients tag cloud */}
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-6 mb-3">
                  Sourced Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeItemDetails.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1.5 rounded-lg bg-[#F8F4EC] border border-[#C8A96A]/20 text-stone-700 text-xs font-light"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Add CTA */}
                <button
                  onClick={() => {
                    handleAddClick(activeItemDetails);
                    setActiveItemDetails(null);
                  }}
                  className="w-full mt-8 py-3.5 rounded-xl bg-[#556B2F] text-white text-xs uppercase font-medium tracking-widest hover:bg-[#4F5D3A] transition-all"
                >
                  Add to order • ${activeItemDetails.price}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
