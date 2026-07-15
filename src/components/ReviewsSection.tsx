import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "../types";

interface ReviewsSectionProps {
  reviews: Review[];
  lang: 'en' | 'fr';
}

export default function ReviewsSection({ reviews, lang }: ReviewsSectionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 8000); // Auto-scroll every 8 seconds
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="py-24 bg-white relative overflow-hidden">
      
      {/* Dynamic Gold accents */}
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#C8A96A]/5 blur-3xl z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Quote symbol mark */}
        <div className="flex justify-center mb-6 text-[#C8A96A]/20">
          <Quote size={64} fill="currentColor" />
        </div>

        {/* Carousel slide transition wrapper */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              
              {/* Rating stars */}
              <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-6">
                {Array.from({ length: reviews[index]?.rating || 5 }).map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>

              {/* Review blockquote */}
              <p className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-900 leading-relaxed font-medium mb-10 italic">
                "{reviews[index]?.text}"
              </p>

              {/* Guest Profile metadata */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A96A] shadow-sm">
                  <img
                    src={reviews[index]?.avatar}
                    alt={reviews[index]?.author}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    {reviews[index]?.author}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold">
                      {reviews[index]?.source} Review
                    </span>
                    <span className="text-stone-300 text-xs">•</span>
                    <span className="text-xs text-stone-400 font-light">{reviews[index]?.date}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Sidebar Arrow Controllers */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-stone-500 hover:text-stone-800 hover:bg-[#F8F4EC]/30 transition-all shrink-0 hidden md:block shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-stone-500 hover:text-stone-800 hover:bg-[#F8F4EC]/30 transition-all shrink-0 hidden md:block shadow-sm"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        {/* Sliders manual selection dots indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-12">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                index === idx ? "w-6 bg-[#556B2F]" : "w-1.5 bg-stone-200 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
