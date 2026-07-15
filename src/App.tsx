import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import MenuSection from "./components/MenuSection";
import ReservationSection from "./components/ReservationSection";
import ReviewsSection from "./components/ReviewsSection";
import GallerySection from "./components/GallerySection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import OrderDrawer from "./components/OrderDrawer";
import AdminDashboard from "./components/AdminDashboard";
import ChatAssistant from "./components/ChatAssistant";
import { MenuItem, OrderItem, Reservation, Order, Blog, Review } from "./types";

export default function App() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Global data states loaded from API
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Local additions log tracking
  const [localReservations, setLocalReservations] = useState<Reservation[]>([]);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  const loadData = async () => {
    try {
      const [menuRes, blogRes, reviewRes] = await Promise.all([
        fetch("/api/menu").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/reviews").then((r) => r.json())
      ]);
      setMenu(menuRes);
      setBlogs(blogRes);
      setReviews(reviewRes);
    } catch (err) {
      console.error("Error loading server dataset, utilizing defaults:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Section Observer tracking scroll highlights
  useEffect(() => {
    const sections = ["home", "story", "menu", "reservations", "blog", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add item to cart
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  // Modify cart quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuItem.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle wishlist favorites
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Log successful submissions
  const handleAddReservation = (res: Reservation) => {
    setLocalReservations((prev) => [...prev, res]);
  };

  const handleAddOrder = (ord: Order) => {
    setLocalOrders((prev) => [...prev, ord]);
  };

  return (
    <div className="font-sans antialiased text-stone-800 bg-[#F8F4EC]/20 selection:bg-[#556B2F] selection:text-white min-h-screen">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        lang={lang}
        setLang={setLang}
        activeSection={activeSection}
      />

      {/* 2. Panoramic Hero Scene */}
      <Hero lang={lang} />

      {/* 3. Heritage Story Bento */}
      <AboutSection lang={lang} />

      {/* 4. Luxury Culinary Catalogue */}
      <MenuSection
        menu={menu}
        onAddToCart={handleAddToCart}
        lang={lang}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 5. Intimate Private Table booking */}
      <ReservationSection lang={lang} onAddReservation={handleAddReservation} />

      {/* 6. Google & Verified Guest Testimonials */}
      <ReviewsSection reviews={reviews} lang={lang} />

      {/* 7. Scenic Lightbox Atmosphere Gallery */}
      <GallerySection lang={lang} />

      {/* 8. Cooking Secrets Journal */}
      <BlogSection blogs={blogs} lang={lang} />

      {/* 9. Karachi Concierge & SVG Map coordinates */}
      <ContactSection lang={lang} />

      {/* 10. Copyright and Directed Credits */}
      <Footer lang={lang} />

      {/* 11. Sliding Right Gourmet Basket Drawer */}
      <OrderDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        lang={lang}
        onOrderPlaced={handleAddOrder}
      />

      {/* 12. Full-scale Administrative Control Board */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        lang={lang}
        onUpdateMenu={loadData}
        onUpdateReservations={loadData}
        onUpdateOrders={loadData}
      />

      {/* 13. Interactive Concierge AI Assistant bubble */}
      <ChatAssistant />

    </div>
  );
}
