import { motion } from "motion/react";
import { Award, Eye, Heart, Leaf, ShieldAlert } from "lucide-react";

interface AboutProps {
  lang: 'en' | 'fr';
}

export default function AboutSection({ lang }: AboutProps) {
  const stats = [
    { number: "12", label: lang === 'en' ? "Years of Craft" : "Années d'Artisanat" },
    { number: "18k+", label: lang === 'en' ? "Guests Satisfied" : "Hôtes Satisfaits" },
    { number: "3", label: lang === 'en' ? "Culinary Stars" : "Étoiles Culinaires" },
    { number: "100%", label: lang === 'en' ? "Organic Sourcing" : "Sourcing Biologique" },
  ];

  const values = [
    {
      icon: <Award className="text-[#C8A96A]" size={20} />,
      title: lang === 'en' ? "Absolute Perfection" : "Perfection Absolue",
      description: lang === 'en' 
        ? "From hand-kneading organic semolina to selecting the precise early-harvest olive oil, we settle for nothing less than culinary masterpieces."
        : "Du pétrissage de la semoule biologique au choix de l'huile d'olive de récolte précoce, nous visons l'excellence."
    },
    {
      icon: <Eye className="text-[#C8A96A]" size={20} />,
      title: lang === 'en' ? "Aesthetic Senses" : "Harmonie Sensorielle",
      description: lang === 'en'
        ? "We believe true fine dining is experienced by all senses—the warm hum of the dining salon, visual elegance of gold foil, and aromatic smoke."
        : "La haute cuisine sollicite tous les sens : le bruissement feutré du salon, l'éclat des feuilles d'or et les fumées aromatiques."
    },
    {
      icon: <Leaf className="text-[#C8A96A]" size={20} />,
      title: lang === 'en' ? "Organic & Local" : "Local et Biologique",
      description: lang === 'en'
        ? "We partner directly with sustainable, local farmers and direct Sicilian estates to ensure 100% trace-integrity of every herb and steak."
        : "Partenariats directs avec des fermes éco-responsables et des domaines siciliens pour assurer la traçabilité complète de nos produits."
    }
  ];

  return (
    <section id="story" className="py-24 bg-white relative overflow-hidden">
      
      {/* Absolute Decorative Flourishes */}
      <div className="absolute top-[30%] -right-16 w-64 h-64 rounded-full bg-[#F8F4EC] blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Section Headings */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
            {lang === 'en' ? 'Our Heritage' : 'Notre Héritage'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-3 leading-tight">
            {lang === 'en' 
              ? "Bridging Sicilian Tradition and Modern Gastronomy"
              : "Le Point de Rencontre de la Tradition et de la Haute Cuisine"}
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto mt-6" />
        </div>

        {/* Story Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left Grid: Images Bento */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Primary Large Image */}
            <div className="col-span-8 rounded-2xl overflow-hidden relative shadow-lg h-80 group">
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-500 z-10" />
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
                alt="Olive & Beige Dining Room"
                className="w-full h-full object-cover scale-102 group-hover:scale-108 transition-transform duration-[1.5s]"
              />
              <div className="absolute bottom-4 left-4 frosted-glass border border-white/60 px-3.5 py-1.5 rounded-lg shadow-md z-20">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#556B2F] font-bold">
                  {lang === 'en' ? 'The Salon Lounge' : 'Le Salon principal'}
                </span>
              </div>
            </div>

            {/* Accent Small Image offset */}
            <div className="col-span-4 rounded-2xl overflow-hidden shadow-md h-44 mt-auto group relative">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80"
                alt="Gourmet Prep"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000"
              />
            </div>

            {/* Secondary lower width image */}
            <div className="col-span-4 rounded-2xl overflow-hidden shadow-md h-48 group">
              <img
                src="https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=600&auto=format&fit=crop&q=80"
                alt="Lamb Chop Plating"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000"
              />
            </div>

            {/* Text Highlight card */}
            <div className="col-span-8 rounded-2xl frosted-glass-gold p-6 border border-white/40 shadow-md flex flex-col justify-center h-48">
              <span className="font-serif italic text-stone-800 text-lg leading-relaxed mb-3">
                "We don't merely serve dinners; we compose private symphonies of taste and visual rhythm."
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8A96A] font-bold">
                — Executive Chef Mawiya
              </span>
            </div>

          </div>

          {/* Right Grid: Story copy and values */}
          <div className="flex flex-col">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6 leading-tight">
              {lang === 'en' ? "Our Story & Vision" : "Notre Histoire et Notre Vision"}
            </h3>
            <p className="text-stone-600 text-base leading-relaxed mb-8 font-light">
              {lang === 'en' 
                ? "Founded on the principles of organic integrity and elegant visual minimalism, Olive & Beige is a landmark culinary sanctuary. We represent the golden intersection between classical Italian techniques and modern gastronomy. Every plate designed in our kitchen is a tribute to pure ingredients—sourced with absolute transparency and cooked to unleash their richest sensory notes."
                : "Fondé sur les principes d'intégrité biologique et de minimalisme visuel élégant, Olive & Beige est un sanctuaire culinaire d'exception. Nous représentons l'intersection parfaite entre les techniques italiennes classiques et la gastronomie moderne. Chaque assiette conçue dans notre cuisine est un hommage à la pureté des ingrédients."}
            </p>

            {/* Core Values list */}
            <div className="flex flex-col gap-6 mb-10">
              {values.map((v, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/60 flex items-center justify-center shrink-0 shadow-sm">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">{v.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed mt-1 font-light">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Numeric stats section */}
        <div className="frosted-glass rounded-2xl p-10 border border-white/50 grid grid-cols-2 md:grid-cols-4 gap-8 glass-shadow-lg">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center relative">
              {idx > 0 && (
                <div className="hidden md:block absolute left-0 top-1/4 w-[1px] h-10 bg-stone-300" />
              )}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="block font-serif text-3xl sm:text-4xl font-extrabold text-[#556B2F]"
              >
                {s.number}
              </motion.span>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold mt-2">
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
