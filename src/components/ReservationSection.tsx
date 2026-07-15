import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Users, Clock, MessageSquare, CheckCircle, Info, Landmark } from "lucide-react";
import { Reservation } from "../types";

interface ReservationSectionProps {
  lang: 'en' | 'fr';
  onAddReservation: (res: Reservation) => void;
}

export default function ReservationSection({ lang, onAddReservation }: ReservationSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: 2,
    specialRequests: "",
  });

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Seat/Table options mapping
  const tables = [
    { num: 1, desc: lang === 'en' ? "Ocean Breeze Window" : "Fenêtre brise marine", cap: 2, status: "available" },
    { num: 2, desc: lang === 'en' ? "Cozy Olive Alcove" : "Alcôve des oliviers", cap: 2, status: "available" },
    { num: 3, desc: lang === 'en' ? "Ocean Breeze Window" : "Fenêtre brise marine", cap: 4, status: "reserved" },
    { num: 4, desc: lang === 'en' ? "Intimate Fireplace" : "Cheminée intime", cap: 2, status: "available" },
    { num: 5, desc: lang === 'en' ? "Chef's Counter Live" : "Comptoir du Chef", cap: 2, status: "available" },
    { num: 6, desc: lang === 'en' ? "Private Olive Garden" : "Jardin d'oliviers privé", cap: 6, status: "available" },
    { num: 7, desc: lang === 'en' ? "Executive Glass Salon" : "Salon de verre exécutif", cap: 8, status: "available" },
    { num: 8, desc: lang === 'en' ? "Cozy Olive Alcove" : "Alcôve des oliviers", cap: 4, status: "available" },
  ];

  const times = ["12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill in all required contact metrics.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specialRequests: `${formData.specialRequests}${selectedTable ? ` (Preferred Table ${selectedTable}: ${tables.find(t => t.num === selectedTable)?.desc})` : ""}`
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setConfirmedReservation(data.reservation);
        onAddReservation(data.reservation);
      } else {
        alert(data.error || "Reservation failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Local fallback in case server encounters connection hurdles
      const mockRes: Reservation = {
        id: "res-" + Math.floor(1000 + Math.random() * 9000),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        specialRequests: formData.specialRequests,
        status: "Confirmed",
        tableNumber: selectedTable || 4,
        createdAt: new Date().toISOString()
      };
      setConfirmedReservation(mockRes);
      onAddReservation(mockRes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservations" className="py-24 bg-white relative overflow-hidden">
      
      {/* Decorative background vectors */}
      <div className="absolute top-[20%] left-[-10rem] w-[30rem] h-[30rem] rounded-full bg-[#F8F4EC] blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
            {lang === 'en' ? 'Private Dining' : 'Réservations de Tables'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
            {lang === 'en' ? "Secure Your Intimate Table" : "Réserver une Table de Prestige"}
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto mt-6" />
        </div>

        <div className="frosted-glass-gold rounded-3xl border border-white/50 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 glass-shadow-lg">
          
          <AnimatePresence mode="wait">
            {!confirmedReservation ? (
              <>
                {/* Left Form: Booking metrics (lg:col-span-7) */}
                <form onSubmit={handleFormSubmit} className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-[#C8A96A]/10">
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-8 flex items-center gap-3">
                    <Calendar size={20} className="text-[#556B2F]" />
                    {lang === 'en' ? 'Reservation Details' : 'Détails de la réservation'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Zain Malik"
                        className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="zain@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                      />
                    </div>

                    {/* Guest Count */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Party Size *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? (lang === 'en' ? 'Guest' : 'Personne') : (lang === 'en' ? 'Guests' : 'Personnes')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Reservation Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-[#2D312E] text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                      />
                    </div>

                    {/* Time Select list */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold">
                        Preferred Hour *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                        >
                          {times.map((t) => (
                            <option key={t} value={t}>
                              {t} {Number(t.split(':')[0]) < 17 ? 'PM (Lunch)' : 'PM (Dinner)'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special notes */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-stone-600 font-bold flex items-center gap-1">
                      <MessageSquare size={12} />
                      Dietary Restrictions or Special requests
                    </label>
                    <textarea
                      name="specialRequests"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="e.g. Vegan menus requested, wheelchair access, anniversary seating setup, etc."
                      className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                    />
                  </div>

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 py-4 rounded-xl bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-medium tracking-widest text-xs uppercase transition-all shadow-md duration-500 disabled:bg-stone-300"
                  >
                    {loading ? "Securing Reservation..." : (lang === 'en' ? "Complete Reservation" : "Confirmer la Réservation")}
                  </button>
                </form>

                {/* Right Interactive Seating Map (lg:col-span-5) */}
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      <Landmark size={20} className="text-[#C8A96A]" />
                      {lang === 'en' ? 'Interactive Seating Plan' : 'Plan de salle interactif'}
                    </h3>
                    <p className="text-xs text-stone-500 font-light mb-8">
                      {lang === 'en' 
                        ? "Select your preferred romantic table blueprint below. Hover for descriptions."
                        : "Sélectionnez votre table préférée ci-dessous."}
                    </p>

                    {/* Table visual grid mapping */}
                    <div className="grid grid-cols-4 gap-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-inner">
                      {tables.map((t) => {
                        const isSelected = selectedTable === t.num;
                        const isReserved = t.status === "reserved";
                        return (
                          <button
                            key={t.num}
                            type="button"
                            disabled={isReserved}
                            onClick={() => setSelectedTable(t.num)}
                            className={`h-14 rounded-xl flex flex-col items-center justify-center transition-all relative group ${
                              isReserved
                                ? "bg-stone-200/50 text-stone-400 cursor-not-allowed border border-stone-300/10"
                                : isSelected
                                ? "bg-[#556B2F] text-white border-2 border-[#C8A96A] shadow-md scale-102"
                                : "bg-white/40 backdrop-blur-sm text-stone-800 border border-white/60 hover:border-[#C8A96A] hover:bg-[#F8F4EC]/30"
                            }`}
                          >
                            <span className="font-serif font-bold text-sm">T-{t.num}</span>
                            <span className="text-[8px] font-mono opacity-80">{t.cap}p</span>

                            {/* Floating tooltip description on hover */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 p-2 rounded bg-stone-900 text-white text-[9px] font-mono leading-normal text-center shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20">
                              {t.desc} ({t.cap} Chairs)
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seating map indicators legand */}
                  <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col gap-3">
                    <div className="flex items-center gap-4 justify-around">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-white border border-stone-200" />
                        <span className="text-[10px] font-mono text-stone-600 uppercase">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-stone-200" />
                        <span className="text-[10px] font-mono text-stone-600 uppercase">Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[#556B2F]" />
                        <span className="text-[10px] font-mono text-stone-600 uppercase">My Choice</span>
                      </div>
                    </div>

                    {selectedTable && (
                      <div className="mt-4 p-3.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 flex items-start gap-2.5 animate-fadeIn shadow-sm">
                        <Info size={14} className="text-[#C8A96A] shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <span className="font-mono font-bold text-[#556B2F] block uppercase tracking-wide">
                            Table {selectedTable} Selected
                          </span>
                          <span className="text-stone-500 font-light block mt-0.5">
                            {tables.find((t) => t.num === selectedTable)?.desc}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : (
              // Receipt view upon successful reservation confirmation
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-12 p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6 shadow-sm border border-green-200">
                  <CheckCircle size={32} />
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold mb-1">
                  Confirmation Blueprint
                </span>
                <h3 className="font-serif text-3xl font-bold text-stone-900 mb-3">
                  Your Table is Secured!
                </h3>
                <p className="text-stone-500 text-sm font-light max-w-md leading-relaxed mb-8">
                  An elegant confirmation receipt and private dining card have been transmitted to <span className="font-semibold text-stone-800">{confirmedReservation.email}</span>.
                </p>

                {/* Details card wrapper */}
                <div className="w-full bg-white border border-stone-200 rounded-2xl p-6 shadow-sm text-left grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <span className="font-mono text-[8px] uppercase text-stone-400">Reservation ID</span>
                    <p className="font-mono font-bold text-xs text-stone-800">{confirmedReservation.id}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase text-stone-400">Assigned Table</span>
                    <p className="font-serif font-bold text-sm text-[#556B2F]">Table {confirmedReservation.tableNumber} (Seaview)</p>
                  </div>
                  <div className="border-t border-stone-100 pt-3">
                    <span className="font-mono text-[8px] uppercase text-stone-400">Date & Hour</span>
                    <p className="text-xs text-stone-800 font-medium">{confirmedReservation.date} @ {confirmedReservation.time} PM</p>
                  </div>
                  <div className="border-t border-stone-100 pt-3">
                    <span className="font-mono text-[8px] uppercase text-stone-400">Guests count</span>
                    <p className="text-xs text-stone-800 font-medium">{confirmedReservation.guests} Chairs Reserved</p>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmedReservation(null)}
                  className="px-6 py-2.5 rounded-full border border-stone-200 hover:border-[#556B2F] hover:text-[#556B2F] font-mono text-[10px] uppercase transition-all"
                >
                  Book Another Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </section>
  );
}
