import { Landmark, ArrowUp, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  lang: 'en' | 'fr';
}

export default function Footer({ lang }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone-950 text-white pt-20 pb-10 relative overflow-hidden border-t border-[#C8A96A]/20">
      
      {/* Delicate overlay patterns */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-transparent" />
      <div className="absolute -right-36 -bottom-36 w-96 h-96 rounded-full bg-[#556B2F]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
        
        {/* Col 1: Brand & Design (md:col-span-4) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border border-[#C8A96A] flex items-center justify-center text-[#C8A96A] bg-stone-900">
              <span className="font-serif font-extrabold text-sm">O&B</span>
            </div>
            <div>
              <span className="font-serif text-sm font-bold tracking-wider uppercase block">
                Olive & Beige
              </span>
              <span className="font-mono text-[7px] tracking-[0.3em] text-[#C8A96A] font-bold block uppercase">
                Bespoke Seaside Dining
              </span>
            </div>
          </div>

          <p className="text-stone-400 text-xs font-light leading-relaxed max-w-sm">
            An award-winning sanctuary overlooking the Arabian sea, crafted under the culinary command of Executive Chef Muhammad Mawiya. We define gastronomic elegance through organic sourcing and visual minimalism.
          </p>

          <div className="flex gap-3 text-stone-500">
            <a href="#" className="p-2 bg-stone-900 rounded-full border border-stone-800 text-stone-400 hover:text-[#C8A96A] hover:border-[#C8A96A] transition-all">
              <Instagram size={14} />
            </a>
            <a href="#" className="p-2 bg-stone-900 rounded-full border border-stone-800 text-stone-400 hover:text-[#C8A96A] hover:border-[#C8A96A] transition-all">
              <Facebook size={14} />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Shortcuts (md:col-span-2) */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <h4 className="font-serif text-xs font-bold tracking-wider uppercase text-[#C8A96A]">
            Navigation
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-stone-400 font-light">
            <li><a href="#about" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#menu" className="hover:text-white transition-colors">The Menu</a></li>
            <li><a href="#reservations" className="hover:text-white transition-colors">Book Private Dining</a></li>
            <li><a href="#gallery" className="hover:text-white transition-colors">Atmosphere</a></li>
            <li><a href="#blog" className="hover:text-white transition-colors">Chef's Journal</a></li>
          </ul>
        </div>

        {/* Col 3: Coordinates list (md:col-span-3) */}
        <div className="md:col-span-3 flex flex-col gap-5">
          <h4 className="font-serif text-xs font-bold tracking-wider uppercase text-[#C8A96A]">
            The Coordinates
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-stone-400 font-light">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-[#C8A96A] shrink-0 mt-0.5" />
              <span>Phase 8, DHA, Karachi, Pakistan.</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-[#C8A96A] shrink-0" />
              <a 
                href="https://wa.me/923370338321" 
                target="_blank" 
                rel="noreferrer"
                className="font-mono font-bold hover:text-[#C8A96A] transition-colors"
              >
                +92 337 0338321 (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-[#C8A96A] shrink-0" />
              <a 
                href="mailto:muhammadmawiya5@gmail.com"
                className="font-mono text-[#C8A96A] font-bold hover:underline transition-all"
              >
                muhammadmawiya5@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Savor Hours (md:col-span-3) */}
        <div className="md:col-span-3 flex flex-col gap-5">
          <h4 className="font-serif text-xs font-bold tracking-wider uppercase text-[#C8A96A]">
            Savor Hours
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-stone-400 font-light">
            <li>
              <span className="text-white font-medium block">Daily Dining Lounge</span>
              <span className="font-mono text-[10px] text-stone-500">12:00 PM – 12:00 AM</span>
            </li>
            <li>
              <span className="text-white font-medium block">Weekend Champagne Brunch</span>
              <span className="font-mono text-[10px] text-stone-500">Saturday & Sunday, 9:00 AM – 2:00 PM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Under copyright bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
        <div className="text-center sm:text-left">
          <p>© {new Date().getFullYear()} Olive & Beige Fine Dining. All Rights Reserved.</p>
          <p className="mt-1 text-[10px] font-mono text-stone-600">
            Conceived & Directed by Executive Chef <span className="text-[#C8A96A] font-bold">Muhammad Mawiya</span>, Karachi, Pakistan.
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-stone-400 hover:text-white border border-stone-800 hover:border-white px-3.5 py-2 rounded-full transition-all"
        >
          <span>Ascend to top</span>
          <ArrowUp size={11} />
        </button>
      </div>

    </footer>
  );
}
