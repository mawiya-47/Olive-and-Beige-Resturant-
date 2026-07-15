import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Globe, Menu, X, Landmark, TableProperties } from "lucide-react";
import { OrderItem } from "../types";

interface NavbarProps {
  cart: OrderItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  lang: 'en' | 'fr';
  setLang: (lang: 'en' | 'fr') => void;
  activeSection: string;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenAdmin,
  lang,
  setLang,
  activeSection
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: lang === 'en' ? 'Home' : 'Accueil', href: '#home' },
    { name: lang === 'en' ? 'Our Story' : 'Notre Histoire', href: '#story' },
    { name: lang === 'en' ? 'Menu' : 'Carte', href: '#menu' },
    { name: lang === 'en' ? 'Reservations' : 'Réservations', href: '#reservations' },
    { name: lang === 'en' ? 'Journal' : 'Journal', href: '#blog' },
    { name: lang === 'en' ? 'Contact' : 'Contact', href: '#contact' },
  ];

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fr' : 'en');
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/45 backdrop-blur-xl border-b border-[#C8A96A]/20 py-3 glass-shadow"
            : "bg-white/10 backdrop-blur-md border-b border-white/20 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 flex items-center justify-center">
              {/* Golden circular boundary */}
              <svg className="w-full h-full absolute animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#C8A96A" strokeWidth="1" strokeDasharray="4,4" />
              </svg>
              {/* Golden Leaf Emblem */}
              <svg className="w-6 h-6 text-[#556B2F] group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 1.5 5.5.5 11.2A7 7 0 0 1 11 20z" fill="currentColor" fillOpacity="0.1" />
                <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.25em] font-bold text-[#556B2F] leading-none">
                OLIVE & BEIGE
              </span>
              <span className="font-mono text-[9px] tracking-[0.4em] text-[#C8A96A] uppercase font-medium mt-0.5">
                Haute Gastronomie
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link Hierarchy */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm text-[#2D312E] hover:text-[#556B2F] tracking-wide font-medium transition-colors duration-300 py-1"
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C8A96A]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Admin Toggle */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-[#F8F4EC]/60 transition-all duration-300"
              title="Admin Panel"
            >
              <Landmark size={18} />
            </button>

            {/* Language Selector */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#C8A96A]/40 hover:text-[#556B2F] transition-all duration-300 text-xs font-mono"
            >
              <Globe size={13} />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#556B2F] hover:text-white border border-stone-200 shadow-sm transition-all duration-500"
            >
              <ShoppingBag size={18} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C8A96A] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* CTA Table Reserve */}
            <a
              href="#reservations"
              className="px-5 py-2.5 rounded-full bg-[#556B2F] text-white hover:bg-[#4F5D3A] transition-all duration-500 text-xs tracking-wider uppercase font-medium flex items-center gap-2"
            >
              <TableProperties size={14} />
              {lang === 'en' ? 'Book Table' : 'Réserver'}
            </a>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-3">
            {/* Quick Cart for Mobile */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full border border-stone-200"
            >
              <ShoppingBag size={18} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8A96A] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-stone-200 text-[#2D312E]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[70px] left-0 w-full bg-white/70 backdrop-blur-xl z-40 border-b border-[#C8A96A]/20 shadow-lg px-6 py-8 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-lg font-serif font-medium text-[#2D312E] hover:text-[#556B2F] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-[1px] bg-stone-100 w-full" />

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  toggleLang();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-[#2D312E] font-mono"
              >
                <Globe size={16} />
                <span>Language: <span className="uppercase font-bold">{lang}</span></span>
              </button>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-[#2D312E] font-mono"
              >
                <Landmark size={16} />
                <span>Admin Panel</span>
              </button>
            </div>

            <a
              href="#reservations"
              onClick={handleLinkClick}
              className="w-full py-3 rounded-full bg-[#556B2F] text-white text-center tracking-widest uppercase font-medium text-sm"
            >
              {lang === 'en' ? 'Book Private Table' : 'Réserver une table'}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
