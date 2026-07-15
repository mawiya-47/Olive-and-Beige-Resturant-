import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Navigation, Calendar } from "lucide-react";

interface HeroProps {
  lang: 'en' | 'fr';
}

export default function Hero({ lang }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse positions from -1 to 1 for elegant parallax
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 bg-[#F8F4EC] overflow-hidden">
      
      {/* Background Layer: Subtle Gradients & Floating Sparks */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Radial Gradients */}
        <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-[#556B2F]/5 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-[#C8A96A]/10 blur-[90px]" />
        
        {/* Dynamic Canvas-like grid mesh */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#556B2F 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Floating 3D-Like Parallax Olive Leaves & Culinary Accents */}
      <motion.div
        animate={{
          x: mousePos.x * 25,
          y: mousePos.y * 25,
          rotate: mousePos.x * 5,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {/* Olive Leaf 1 */}
        <div className="absolute top-[22%] left-[8%] w-16 h-16 opacity-30">
          <svg viewBox="0 0 100 100" fill="none" className="text-[#556B2F] w-full h-full transform -rotate-45">
            <path d="M50 0 C70 30 80 50 50 100 C20 50 30 30 50 0" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <path d="M50 0 L50 100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Olive Leaf 2 */}
        <div className="absolute bottom-[20%] left-[15%] w-12 h-12 opacity-25">
          <svg viewBox="0 0 100 100" fill="none" className="text-[#4F5D3A] w-full h-full transform rotate-12">
            <path d="M50 0 C70 30 80 50 50 100 C20 50 30 30 50 0" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Golden Herb Spark 3 */}
        <div className="absolute top-[18%] right-[12%] w-10 h-10 opacity-40">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="1" className="w-full h-full animate-pulse">
            <path d="M12 2v20M2 12h20M12 2l5 5-5 5-5-5z" />
          </svg>
        </div>

        {/* Floating Spoon/Fork outline 4 */}
        <div className="absolute bottom-[15%] right-[10%] w-16 h-16 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="#556B2F" strokeWidth="1" className="w-full h-full">
            <path d="M6 3v13a4 4 0 0 0 4 4h0a4 4 0 0 0 4-4V3" />
            <path d="M9 3v7M11 3v7" />
          </svg>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Grid: Elegant Copywriting */}
        <div className="lg:col-span-7 flex flex-col items-start">
          
          {/* Accent micro-badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full frosted-glass-gold shadow-sm mb-6"
          >
            <Sparkles size={12} className="text-[#C8A96A] animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#556B2F] font-semibold">
              {lang === 'en' ? 'Gourmet Masterpieces in defense' : 'Chefs-d’œuvre Gourmands'}
            </span>
          </motion.div>

          {/* Huge typography brand header */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold text-stone-900 leading-[1.08] tracking-tight mb-8"
          >
            {lang === 'en' ? (
              <>
                Where Gastronomy <br />
                <span className="text-[#556B2F] italic font-normal font-serif">Meets Fine</span> Art.
              </>
            ) : (
              <>
                La Gastronomie <br />
                <span className="text-[#556B2F] italic font-normal font-serif">Devient un</span> Art.
              </>
            )}
          </motion.h1>

          {/* Supportive copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-stone-600 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-light"
          >
            {lang === 'en' 
              ? "Under the creative direction of Executive Chef Muhammad Mawiya, Olive & Beige weaves together hand-rolled Italian pastas, seared pasture-raised lamb, and gold-dusted chocolate hazelnut rochers in a sensory interior."
              : "Sous la direction créative du chef exécutif Muhammad Mawiya, Olive & Beige marie pâtes italiennes fraîches, pièces de bœuf d’exception et dôme chocolat poudré d’or 24 carats."}
          </motion.p>

          {/* Elegant CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <a
              href="#menu"
              className="group px-7 py-4 rounded-full bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-medium tracking-wider text-xs uppercase flex items-center gap-2.5 shadow-md transition-all duration-500"
            >
              <span>{lang === 'en' ? 'Explore Our Menu' : 'Découvrir la Carte'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            <a
              href="#reservations"
              className="px-7 py-4 rounded-full bg-white/40 backdrop-blur-md text-stone-800 hover:bg-[#556B2F] hover:text-white border border-white/60 font-medium tracking-wider text-xs uppercase transition-all duration-500 shadow-sm flex items-center gap-2"
            >
              <Calendar size={14} />
              <span>{lang === 'en' ? 'Secure Table' : 'Réserver Table'}</span>
            </a>
          </motion.div>

          {/* Quick Stats list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="grid grid-cols-3 gap-6 sm:gap-12 mt-16 pt-8 border-t border-stone-200/60 w-full max-w-lg"
          >
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#556B2F]">A5</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] mt-1">Wagyu Rating</p>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#556B2F]">24K</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] mt-1">Edible Gold</p>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#556B2F]">100%</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] mt-1">Sourdough</p>
            </div>
          </motion.div>

        </div>

        {/* Right Grid: Elegant 3D-Like Hover Plate Component */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: "spring", bounce: 0.2 }}
            className="relative w-72 h-72 sm:w-96 sm:h-96"
          >
            {/* Soft Glowing plate aura backdrop */}
            <div className="absolute inset-4 rounded-full bg-stone-300/40 blur-[45px] -z-10" />

            {/* Simulated 3D lighting shadow rim */}
            <motion.div
              animate={{
                x: mousePos.x * -18,
                y: mousePos.y * -18,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C8A96A]/20 to-transparent border border-[#C8A96A]/10 pointer-events-none"
            />

            {/* Rotating Outer Ring */}
            <svg 
              className="absolute inset-0 w-full h-full animate-[spin_50s_linear_infinite] opacity-40" 
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="#C8A96A" strokeWidth="0.5" />
              <path d="M 50 2 L 50 6" stroke="#C8A96A" strokeWidth="1" />
              <path d="M 50 94 L 50 98" stroke="#C8A96A" strokeWidth="1" />
              <path d="M 2 50 L 6 50" stroke="#C8A96A" strokeWidth="1" />
              <path d="M 94 50 L 98 50" stroke="#C8A96A" strokeWidth="1" />
            </svg>

            {/* The Plate Surface Container */}
            <motion.div
              style={{
                perspective: 1000,
              }}
              animate={{
                rotateX: mousePos.y * -20,
                rotateY: mousePos.x * 20,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="w-full h-full rounded-full bg-white p-8 shadow-2xl flex items-center justify-center border border-[#C8A96A]/15 cursor-pointer relative group overflow-hidden"
            >
              {/* Gold rim detail line inside plate */}
              <div className="absolute inset-6 rounded-full border border-[#C8A96A]/25" />
              <div className="absolute inset-[26px] rounded-full border border-[#C8A96A]/10" />

              {/* Masterpiece Dish Image (Wagyu or Deconstructed Rocher) */}
              <div className="w-[85%] h-[85%] rounded-full overflow-hidden relative shadow-inner">
                {/* Glossy glint reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 z-10 pointer-events-none transition-transform duration-500 group-hover:translate-x-12" />
                
                <img
                  src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=600&auto=format&fit=crop&q=80"
                  alt="A5 Wagyu Signature Plating"
                  className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-[2s]"
                />
              </div>

              {/* Gold brand tag label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 frosted-glass-gold border border-white/40 rounded-full shadow-md z-20">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#556B2F] font-bold">
                  Chef special: A5 Wagyu
                </span>
              </div>
            </motion.div>

            {/* Small hovering ingredients detail labels */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-2 px-3 py-2 frosted-glass-heavy border border-white/60 shadow-md rounded-xl flex items-center gap-1.5 z-20"
            >
              <span className="w-2 h-2 rounded-full bg-[#556B2F]" />
              <span className="font-mono text-[9px] uppercase text-stone-600 font-semibold tracking-wider">
                Fresh Truffles
              </span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-8 -left-8 px-3 py-2 frosted-glass-gold border border-white/50 shadow-md rounded-xl flex items-center gap-1.5 z-20"
            >
              <span className="w-2 h-2 rounded-full bg-[#C8A96A]" />
              <span className="font-mono text-[9px] uppercase text-stone-600 font-semibold tracking-wider">
                Gold Dust
              </span>
            </motion.div>

          </motion.div>
        </div>

      </div>

      {/* Dynamic Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#556B2F] font-medium opacity-70">
          {lang === 'en' ? 'Slide to Explore' : 'Faire défiler'}
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#556B2F] to-transparent relative overflow-hidden">
          <motion.div
            animate={{
              y: [0, 40, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-full h-3 bg-[#C8A96A]"
          />
        </div>
      </div>

    </section>
  );
}
