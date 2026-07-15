import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, User, ArrowRight, Heart, HeartOff, BookOpen, X } from "lucide-react";
import { Blog } from "../types";

interface BlogSectionProps {
  blogs: Blog[];
  lang: 'en' | 'fr';
}

export default function BlogSection({ blogs, lang }: BlogSectionProps) {
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<string[]>([]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal
    if (likedList.includes(id)) {
      setLikes({ ...likes, [id]: (likes[id] || 0) - 1 });
      setLikedList(likedList.filter(item => item !== id));
    } else {
      setLikes({ ...likes, [id]: (likes[id] || 0) + 1 });
      setLikedList([...likedList, id]);
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#F8F4EC]/40 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
            {lang === 'en' ? 'The Culinary Journal' : 'Le Journal Culinaire'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
            {lang === 'en' ? "Chefs' Secrets & Cooking Philosophy" : "Secrets de Chef & Philosophie Gastronomique"}
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto mt-6" />
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogs.map((b) => {
            const currentLikes = b.likes + (likes[b.id] || 0);
            const isLiked = likedList.includes(b.id);
            return (
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                key={b.id}
                onClick={() => setActiveBlog(b)}
                className="frosted-glass rounded-2xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:bg-white/65 cursor-pointer flex flex-col justify-between glass-shadow"
              >
                <div>
                  {/* Blog Image */}
                  <div className="h-64 overflow-hidden relative group">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
                    />
                    <div className="absolute top-4 left-4 bg-[#556B2F] text-white font-mono text-[9px] tracking-wider font-bold uppercase px-3 py-1 rounded">
                      {b.category}
                    </div>
                  </div>

                  {/* Blog body copy */}
                  <div className="p-8">
                    {/* Date and author meta */}
                    <div className="flex items-center gap-4 text-xs text-stone-500 font-mono mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {b.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User size={13} />
                        {b.author}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-3 hover:text-[#556B2F] transition-colors leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed font-light mb-6">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer interactions */}
                <div className="px-8 pb-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Read duration */}
                    <span className="font-mono text-[10px] uppercase text-[#C8A96A] font-bold">
                      {b.readTime}
                    </span>

                    {/* Like heart */}
                    <button
                      onClick={(e) => handleLike(b.id, e)}
                      className={`flex items-center gap-1.5 text-xs font-mono font-medium ${
                        isLiked ? "text-red-500" : "text-stone-500 hover:text-red-500"
                      }`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                      <span>{currentLikes} likes</span>
                    </button>
                  </div>

                  <span className="text-[#556B2F] text-xs font-mono font-bold flex items-center gap-1 uppercase group-hover:translate-x-1 transition-transform">
                    {lang === 'en' ? 'Read Secrets' : 'Découvrir'}
                    <ArrowRight size={13} />
                  </span>
                </div>

              </motion.article>
            );
          })}
        </div>

      </div>

      {/* Blog Detail Article Lightbox overlay */}
      <AnimatePresence>
        {activeBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden max-w-2xl w-full border border-white/60 shadow-2xl relative my-8"
            >
              {/* Header Image */}
              <div className="h-64 sm:h-80 relative overflow-hidden">
                <img
                  src={activeBlog.image}
                  alt={activeBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <button
                  onClick={() => setActiveBlog(null)}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-white/90 shadow-md text-stone-800 hover:text-[#556B2F] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Read Text copy scrollable */}
              <div className="p-8 max-h-[50vh] overflow-y-auto">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C8A96A] font-bold bg-[#F8F4EC] px-2.5 py-1 rounded">
                  {activeBlog.category} Masterclass
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-4 leading-tight">
                  {activeBlog.title}
                </h3>

                {/* Author Info */}
                <div className="flex items-center gap-4 text-xs text-stone-500 font-mono mt-3 pb-6 border-b border-stone-100">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {activeBlog.date}
                  </span>
                  <span>•</span>
                  <span>By {activeBlog.author}</span>
                  <span>•</span>
                  <span className="text-[#556B2F] font-bold">{activeBlog.readTime}</span>
                </div>

                {/* Body Content */}
                <div className="text-stone-700 text-sm sm:text-base leading-relaxed mt-6 font-light space-y-4 whitespace-pre-line">
                  {activeBlog.content}
                </div>

                <div className="h-[1px] bg-stone-100 my-8 w-full" />

                <div className="flex justify-between items-center bg-[#F8F4EC]/60 p-4 rounded-xl border border-[#C8A96A]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                      <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop&q=80" alt="Chef" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-serif text-xs font-bold text-stone-950 block">Written by {activeBlog.author}</span>
                      <span className="font-mono text-[9px] text-[#C8A96A] uppercase block">Executive Chef, Olive & Beige</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveBlog(null)}
                    className="px-4 py-2 bg-[#556B2F] text-white hover:bg-[#4F5D3A] rounded-lg text-xs font-mono uppercase"
                  >
                    Finish reading
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
