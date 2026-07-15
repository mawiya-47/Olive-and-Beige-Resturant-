import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, Users, Calendar, ShoppingBag, MessageSquare, Plus, Trash2, CheckCircle2, XCircle, ChevronRight, BarChart3, Edit, DollarSign } from "lucide-react";
import { MenuItem, Reservation, Order, Message } from "../types";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'fr';
  onUpdateMenu: () => void;
  onUpdateReservations: () => void;
  onUpdateOrders: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  lang,
  onUpdateMenu,
  onUpdateReservations,
  onUpdateOrders
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Reservations' | 'Orders' | 'MenuManager' | 'Messages'>('Overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Menu form state
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 15,
    category: "Mains",
    image: "",
    calories: 350,
    ingredients: [],
    rating: 4.8,
    reviewsCount: 1,
    isBestSeller: false,
    isVegan: false,
    isGlutenFree: false
  });
  const [ingredientInput, setIngredientInput] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resAnal, resMenu, resRes, resOrd, resMsg] = await Promise.all([
        fetch("/api/analytics").then(r => r.json()),
        fetch("/api/menu").then(r => r.json()),
        fetch("/api/reservations").then(r => r.json()),
        fetch("/api/orders").then(r => r.json()),
        fetch("/api/messages").then(r => r.json())
      ]);

      setAnalytics(resAnal);
      setMenu(resMenu);
      setReservations(resRes);
      setOrders(resOrd);
      setMessages(resMsg);
    } catch (err) {
      console.error("Error loading admin datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  // Handle Reservation status updates
  const handleUpdateReservationStatus = async (id: string, status: 'Confirmed' | 'Cancelled') => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
        onUpdateReservations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Order status updates
  const handleUpdateOrderStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
        onUpdateOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Message read status
  const handleMarkMessageRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: "POST"
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Menu creation
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setMenuForm({
        ...menuForm,
        ingredients: [...(menuForm.ingredients || []), ingredientInput.trim()]
      });
      setIngredientInput('');
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.image || !menuForm.description) {
      alert("Please fill in item names, image URLs, and descriptions.");
      return;
    }

    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm)
      });
      if (res.ok) {
        alert("Menu updated successfully!");
        fetchAdminData();
        onUpdateMenu();
        // Reset Form
        setMenuForm({
          name: "",
          description: "",
          price: 15,
          category: "Mains",
          image: "",
          calories: 350,
          ingredients: [],
          rating: 4.8,
          reviewsCount: 1,
          isBestSeller: false,
          isVegan: false,
          isGlutenFree: false
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        const res = await fetch(`/api/admin/menu/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          fetchAdminData();
          onUpdateMenu();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#F8F4EC]/95 backdrop-blur-md z-50 flex flex-col overflow-hidden">
      
      {/* Top Admin Navigation Header */}
      <div className="px-6 py-4 bg-white border-b border-[#C8A96A]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#556B2F] text-white flex items-center justify-center shadow-md">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wide uppercase leading-none">
              Olive & Beige Admin
            </h2>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#C8A96A] font-bold block mt-1">
              Gourmet Controller Board
            </span>
          </div>
        </div>

        {/* Action Toggles tab triggers */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#F8F4EC] rounded-xl border border-stone-200">
          {(['Overview', 'Reservations', 'Orders', 'MenuManager', 'Messages'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab
                  ? "bg-[#556B2F] text-white shadow-sm"
                  : "text-stone-600 hover:text-[#556B2F]"
              }`}
            >
              {tab === 'MenuManager' ? 'Menu Manager' : tab}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 hover:border-red-500 hover:text-red-500 font-mono text-[10px] uppercase font-bold transition-all"
        >
          Close Panel
        </button>
      </div>

      {/* Core admin content layout */}
      <div className="flex-grow overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-stone-300 border-t-[#556B2F] animate-spin" />
            <p className="font-mono text-[11px] text-stone-500 uppercase tracking-widest mt-4">Assembling controller panel datasets...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === 'Overview' && analytics && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                {/* KPI 1: REVENUE */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#556B2F]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold">Total Revenue</span>
                    <DollarSign size={18} />
                  </div>
                  <div className="mt-4">
                    <span className="font-serif text-3xl font-extrabold text-stone-950">${analytics.totalRevenue}</span>
                    <p className="text-[10px] text-green-600 font-medium mt-1">▲ 14% growth since yesterday</p>
                  </div>
                </div>

                {/* KPI 2: ORDERS */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#C8A96A]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold">Orders placed</span>
                    <ShoppingBag size={18} />
                  </div>
                  <div className="mt-4">
                    <span className="font-serif text-3xl font-extrabold text-stone-950">{analytics.totalOrders}</span>
                    <p className="text-[10px] text-stone-500 mt-1">Pending: {analytics.orderStats.Pending} | Preparing: {analytics.orderStats.Preparing}</p>
                  </div>
                </div>

                {/* KPI 3: BOOKINGS */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-indigo-500">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold">Table Reservations</span>
                    <Calendar size={18} />
                  </div>
                  <div className="mt-4">
                    <span className="font-serif text-3xl font-extrabold text-stone-950">{analytics.totalReservations}</span>
                    <p className="text-[10px] text-stone-500 mt-1">Confirmed: {analytics.reservationStats.Confirmed} | Pending: {analytics.reservationStats.Pending}</p>
                  </div>
                </div>

                {/* KPI 4: INQUIRIES */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-teal-500">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold">Messages received</span>
                    <MessageSquare size={18} />
                  </div>
                  <div className="mt-4">
                    <span className="font-serif text-3xl font-extrabold text-stone-950">{analytics.totalMessages}</span>
                    <p className="text-[10px] text-stone-500 mt-1">Awaiting responses</p>
                  </div>
                </div>

                {/* Recent bookings logs bento card */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-950 mb-4">Recent Bookings</h3>
                    <div className="flex flex-col gap-3">
                      {analytics.recentReservations.map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8F4EC]/60 border border-stone-200/50 text-xs">
                          <div>
                            <span className="font-serif font-bold text-stone-900">{r.name}</span>
                            <span className="text-stone-500 block text-[10px] font-mono mt-0.5">{r.date} @ {r.time} PM • {r.guests} Chairs</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded font-mono text-[9px] font-bold uppercase ${
                            r.status === 'Confirmed' ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('Reservations')} className="text-xs text-[#556B2F] font-mono font-bold mt-4 self-end flex items-center gap-1">
                    Manage bookings <ChevronRight size={14} />
                  </button>
                </div>

                {/* Recent orders log bento card */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-950 mb-4">Recent Orders Log</h3>
                    <div className="flex flex-col gap-3">
                      {analytics.recentOrders.map((o: any) => (
                        <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8F4EC]/60 border border-stone-200/50 text-xs">
                          <div>
                            <span className="font-serif font-bold text-stone-900">{o.customerName}</span>
                            <span className="text-[#556B2F] font-mono block text-[10px] font-bold mt-0.5">Total: ${o.total.toFixed(1)} • {o.type.toUpperCase()}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-stone-900 text-[#C8A96A] font-mono text-[9px] font-bold uppercase">{o.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('Orders')} className="text-xs text-[#556B2F] font-mono font-bold mt-4 self-end flex items-center gap-1">
                    Manage orders log <ChevronRight size={14} />
                  </button>
                </div>

              </motion.div>
            )}

            {/* TAB 2: RESERVATIONS LIST */}
            {activeTab === 'Reservations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6"
              >
                <h3 className="font-serif text-lg font-bold text-stone-950 mb-6">Active Table Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 font-mono text-[9px] uppercase tracking-wider text-stone-500 pb-2">
                        <th className="py-3 font-bold">Booking ID</th>
                        <th className="py-3 font-bold">Guest Coordinate</th>
                        <th className="py-3 font-bold">Date & Hour</th>
                        <th className="py-3 font-bold">Table No.</th>
                        <th className="py-3 font-bold">Special Notes</th>
                        <th className="py-3 font-bold">Status</th>
                        <th className="py-3 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((r) => (
                        <tr key={r.id} className="border-b border-stone-50 text-stone-700">
                          <td className="py-4 font-mono font-bold text-stone-800">{r.id}</td>
                          <td className="py-4">
                            <span className="font-bold text-stone-950 block">{r.name}</span>
                            <span className="text-stone-400 block text-[10px] font-mono">{r.email} • {r.phone}</span>
                          </td>
                          <td className="py-4">
                            <span className="font-medium text-stone-900 block">{r.date}</span>
                            <span className="text-stone-500 font-mono text-[10px]">{r.time} PM • {r.guests} Chairs</span>
                          </td>
                          <td className="py-4 font-serif font-extrabold text-[#556B2F]">T-{r.tableNumber || "None"}</td>
                          <td className="py-4 max-w-xs truncate text-stone-500 font-light" title={r.specialRequests}>
                            {r.specialRequests || "No notes"}
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              r.status === 'Confirmed' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}>{r.status}</span>
                          </td>
                          <td className="py-4 text-right">
                            {r.status === 'Pending' ? (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id, 'Confirmed')}
                                  className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id, 'Cancelled')}
                                  className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                                >
                                  <XCircle size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-stone-400">Archived</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 3: ORDERS LIST */}
            {activeTab === 'Orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6"
              >
                <h3 className="font-serif text-lg font-bold text-stone-950 mb-6">Active Culinary Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 font-mono text-[9px] uppercase tracking-wider text-stone-500 pb-2">
                        <th className="py-3 font-bold">Order ID</th>
                        <th className="py-3 font-bold">Recipient</th>
                        <th className="py-3 font-bold">Fulfillment / Destination</th>
                        <th className="py-3 font-bold">Dishes Details</th>
                        <th className="py-3 font-bold">Payment Total</th>
                        <th className="py-3 font-bold">Tracking Status</th>
                        <th className="py-3 text-right font-bold">Process Journey</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-stone-50 text-stone-700">
                          <td className="py-4 font-mono font-bold text-stone-800">{o.id}</td>
                          <td className="py-4">
                            <span className="font-bold text-stone-950 block">{o.customerName}</span>
                            <span className="text-stone-400 block text-[10px] font-mono">{o.customerEmail} • {o.customerPhone}</span>
                          </td>
                          <td className="py-4 max-w-xs truncate">
                            <span className="font-mono font-bold text-[#556B2F] text-[10px] block uppercase">{o.type}</span>
                            <span className="text-stone-500 block text-[10px] mt-0.5">{o.deliveryAddress || "Self-Pickup Lounge"}</span>
                          </td>
                          <td className="py-4">
                            {o.items.map((it: any, idx: number) => (
                              <div key={idx} className="text-[11px] text-stone-600">
                                {it.quantity}x <span className="font-serif font-medium">{it.menuItem.name}</span>
                              </div>
                            ))}
                          </td>
                          <td className="py-4 font-bold text-stone-900">${o.total.toFixed(1)}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded bg-stone-900 text-[#C8A96A] font-mono text-[9px] font-bold uppercase">{o.status}</span>
                          </td>
                          <td className="py-4 text-right">
                            {o.status === 'Preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, o.type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup')}
                                className="px-3 py-1.5 rounded-lg bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-mono text-[9px] uppercase tracking-wider font-bold"
                              >
                                Ready to Dispatch
                              </button>
                            )}
                            {(o.status === 'Out for Delivery' || o.status === 'Ready for Pickup') && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'Completed')}
                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-mono text-[9px] uppercase tracking-wider font-bold"
                              >
                                Mark Delivered
                              </button>
                            )}
                            {o.status === 'Completed' && (
                              <span className="text-[10px] font-mono text-stone-400">Fulfilled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 4: MENU MANAGER */}
            {activeTab === 'MenuManager' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left Form adding menu (lg:col-span-4) */}
                <form onSubmit={handleCreateMenuItem} className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="font-serif text-base font-bold text-stone-950 mb-2">Create / Update Dish</h3>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Dish Title *</label>
                    <input
                      type="text"
                      required
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                      placeholder="Truffle Eggs Benedict"
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Price ($) *</label>
                    <input
                      type="number"
                      required
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Category *</label>
                    <select
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as any })}
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    >
                      {["Appetizers", "Breakfast", "Mains", "Steaks", "Seafood", "Desserts", "Mocktails", "Beverages"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Image URL *</label>
                    <input
                      type="text"
                      required
                      value={menuForm.image}
                      onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Calorie Metrics (Kcal)</label>
                    <input
                      type="number"
                      value={menuForm.calories}
                      onChange={(e) => setMenuForm({ ...menuForm, calories: Number(e.target.value) })}
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Sourced Ingredients</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="e.g. Umbrian Truffles"
                        className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="p-2 bg-stone-900 text-white rounded-lg text-xs hover:bg-[#556B2F]"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    {/* Ingredients tags previews */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {menuForm.ingredients?.map((ing) => (
                        <span key={ing} className="px-2 py-0.5 bg-[#F8F4EC] text-stone-700 text-[9px] font-mono font-bold border border-stone-200 rounded flex items-center gap-1">
                          {ing}
                          <button type="button" onClick={() => setMenuForm({ ...menuForm, ingredients: menuForm.ingredients?.filter(i => i !== ing) })} className="text-red-500 font-bold hover:text-red-700">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Allergen Metrics</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={menuForm.isVegan}
                          onChange={(e) => setMenuForm({ ...menuForm, isVegan: e.target.checked })}
                          className="rounded text-[#556B2F]"
                        />
                        Is Vegan
                      </label>
                      <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={menuForm.isGlutenFree}
                          onChange={(e) => setMenuForm({ ...menuForm, isGlutenFree: e.target.checked })}
                          className="rounded text-[#556B2F]"
                        />
                        Gluten-Free
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-stone-500 font-bold">Description *</label>
                    <textarea
                      required
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      rows={3}
                      placeholder="Marinated tomatoes under olive oils, finished with basalt trims..."
                      className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 bg-[#556B2F] text-white rounded-xl text-xs font-mono uppercase font-bold hover:bg-[#4F5D3A] transition-colors"
                  >
                    Transmit Menu Item
                  </button>
                </form>

                {/* Right grid list of existing dishes (lg:col-span-8) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <h3 className="font-serif text-base font-bold text-stone-950 mb-4">Existing Culinary Items ({menu.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
                    {menu.map((m) => (
                      <div key={m.id} className="flex gap-3 p-3 bg-[#F8F4EC]/60 border border-stone-200 rounded-xl relative group justify-between items-center">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-serif text-xs font-bold text-stone-900 block truncate max-w-[150px]">{m.name}</span>
                            <span className="font-mono text-[10px] text-[#556B2F] font-bold block mt-0.5">${m.price} • {m.category}</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => setMenuForm(m)}
                            className="p-1.5 rounded bg-white text-stone-600 hover:text-[#556B2F] border border-stone-200 shadow-sm"
                            title="Edit Item"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(m.id)}
                            className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-stone-200 shadow-sm"
                            title="Delete Item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 5: CONTACT MESSAGES EXPLORER */}
            {activeTab === 'Messages' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6"
              >
                <h3 className="font-serif text-lg font-bold text-stone-950 mb-6">Concierge Enquiry Mail</h3>
                <div className="flex flex-col gap-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                        m.isRead
                          ? "bg-[#F8F4EC]/30 border-stone-200"
                          : "bg-white border-l-4 border-l-[#556B2F] border-stone-200 shadow-sm"
                      }`}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-stone-900 text-sm">{m.name}</span>
                          <span className="text-stone-300">•</span>
                          <span className="font-mono text-[10px] text-stone-500">{m.email} {m.phone && `• ${m.phone}`}</span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-stone-950 mt-2">Subject: {m.subject}</h4>
                        <p className="text-stone-600 text-xs mt-1.5 font-light leading-relaxed whitespace-pre-line">{m.message}</p>
                        <span className="font-mono text-[9px] text-stone-400 mt-3 block">{m.createdAt}</span>
                      </div>

                      {!m.isRead && (
                        <button
                          onClick={() => handleMarkMessageRead(m.id)}
                          className="px-4 py-2 bg-[#556B2F] text-white hover:bg-[#4F5D3A] rounded-xl text-[9px] font-mono uppercase tracking-wider font-bold shrink-0 self-start"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="text-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                      <MessageSquare size={32} className="text-stone-300 mx-auto mb-3" />
                      <p className="font-serif text-sm font-bold text-stone-800">Inbox is empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </div>

    </div>
  );
}
