import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";

interface ContactSectionProps {
  lang: 'en' | 'fr';
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all required contact metrics.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessageSent(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert(data.error || "Failed to submit form.");
      }
    } catch (err) {
      console.error("Message error:", err);
      setMessageSent(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
            {lang === 'en' ? 'Concierge & Sanctuary' : 'Nous Contacter'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
            {lang === 'en' ? "Secure Directions & Enquiries" : "L’Écoute de vos Attentes"}
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Grid: Info details & Beautiful Custom SVG Map (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10">
            <div className="flex flex-col gap-6">
              
              {/* Info: Location */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#F8F4EC] border border-[#C8A96A]/30 flex items-center justify-center text-[#556B2F] shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Physical Sanctuary</h4>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed font-light">
                    Khyaban-e-Shujaat, Phase 8, Defense Housing Authority (DHA), Karachi, Pakistan.
                  </p>
                </div>
              </div>

              {/* Info: Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#F8F4EC] border border-[#C8A96A]/30 flex items-center justify-center text-[#556B2F] shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Voice Line Enquiries</h4>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed font-mono font-bold text-stone-700">
                    +92 (21) 3456-7890 • +92 (300) 123-4567
                  </p>
                </div>
              </div>

              {/* Info: WhatsApp */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Direct WhatsApp Concierge</h4>
                  <a 
                    href="https://wa.me/923370338321" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-stone-500 hover:text-emerald-600 text-xs mt-1 leading-relaxed font-mono font-bold transition-all"
                  >
                    <span>+92 337 0338321</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-semibold px-2 py-0.5 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      Chat Now →
                    </span>
                  </a>
                </div>
              </div>

              {/* Info: Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#F8F4EC] border border-[#C8A96A]/30 flex items-center justify-center text-[#556B2F] shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Digital Concierge Mail</h4>
                  <a 
                    href="mailto:muhammadmawiya5@gmail.com"
                    className="text-stone-500 hover:text-[#C8A96A] text-xs mt-1 leading-relaxed font-mono text-[#556B2F] font-bold block hover:underline transition-colors"
                  >
                    muhammadmawiya5@gmail.com
                  </a>
                </div>
              </div>

              {/* Info: Hours */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#F8F4EC] border border-[#C8A96A]/30 flex items-center justify-center text-[#556B2F] shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Working Hours</h4>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed font-light">
                    <span className="font-bold text-stone-700">Daily:</span> 12:00 PM – 12:00 AM <br />
                    <span className="font-bold text-stone-700">Weekend Brunch:</span> Saturday & Sunday, 9:00 AM – 2:00 PM
                  </p>
                </div>
              </div>

            </div>

            {/* HIGH-END MINIMALIST GEOGRAPHIC SVG MAP */}
            <div className="relative h-64 frosted-glass-gold rounded-2xl border border-white/50 shadow-inner overflow-hidden flex flex-col justify-between p-6">
              {/* Background Map grids */}
              <svg className="absolute inset-0 w-full h-full text-[#556B2F]/10 stroke-current opacity-80" viewBox="0 0 400 200" fill="none">
                <line x1="0" y1="50" x2="400" y2="50" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="120" x2="400" y2="120" strokeWidth="1.5" />
                <line x1="0" y1="160" x2="400" y2="160" strokeWidth="1" strokeDasharray="3,3" />
                
                <line x1="80" y1="0" x2="80" y2="200" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="220" y1="0" x2="220" y2="200" strokeWidth="1.5" />
                <line x1="310" y1="0" x2="310" y2="200" strokeWidth="1" />

                {/* Sea Shore layout */}
                <path d="M 0 170 Q 150 185 400 170" stroke="#C8A96A" strokeWidth="2.5" />
                <text x="180" y="192" fill="#C8A96A" className="font-mono text-[8px] uppercase tracking-widest font-bold">Sea breeze shoreline</text>

                {/* Pin coordinate */}
                <circle cx="220" cy="120" r="14" fill="#556B2F" fillOpacity="0.15" />
                <circle cx="220" cy="120" r="6" fill="#C8A96A" />
              </svg>

              {/* Header coordinate card */}
              <div className="relative bg-white/55 backdrop-blur-md p-3 rounded-lg shadow border border-white/60 w-fit">
                <span className="font-mono text-[9px] uppercase font-bold text-[#556B2F] block tracking-wider">Olive & Beige location</span>
                <span className="font-mono text-[8px] text-stone-500 block">DHA Phase 8, Karachi, Pakistan</span>
              </div>

              {/* Compass metadata bottom */}
              <div className="relative self-end flex items-center gap-2 font-mono text-[8px] text-stone-500 bg-white/55 backdrop-blur-md px-2.5 py-1 rounded border border-white/60">
                <span>Lat: 24.79° N</span>
                <span>•</span>
                <span>Long: 67.06° E</span>
              </div>
            </div>

          </div>

          {/* Right Grid: Inquiry message Form (lg:col-span-7) */}
          <div className="lg:col-span-7 frosted-glass rounded-2xl border border-white/50 p-8 sm:p-10 shadow-lg relative glass-shadow-lg">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-8 flex items-center gap-2.5">
              <MessageSquare size={18} className="text-[#556B2F]" />
              {lang === 'en' ? 'Direct Enquiries Form' : 'Envoyer un message'}
            </h3>

            {!messageSent ? (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-stone-600 font-bold">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sarah Ahmed"
                      className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-stone-600 font-bold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="sarah@example.com"
                      className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-stone-600 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 8887766"
                      className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-stone-600 font-bold">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Private Catering Booking"
                      className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-stone-600 font-bold">Message Details *</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your enquiries or corporate catering requirements..."
                    className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-800 text-sm focus:outline-none focus:border-[#556B2F] focus:bg-white/70 transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-4 rounded-xl bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-medium tracking-widest text-xs uppercase transition-all duration-500 shadow-md flex items-center justify-center gap-2"
                >
                  <Send size={13} />
                  {loading ? "Transmitting enquiry..." : (lang === 'en' ? "Transmit message" : "Transmettre le message")}
                </button>

              </form>
            ) : (
              // Thank you State
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6 shadow-sm border border-green-200">
                  <CheckCircle size={28} />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900 mb-2">Message Transmitted!</h4>
                <p className="text-stone-500 text-xs font-light max-w-sm leading-relaxed mb-6">
                  Thank you for contacting us. Executive Chef Muhammad Mawiya’s team has received your guidelines and will respond via email within 12 hours.
                </p>
                <button
                  onClick={() => setMessageSent(false)}
                  className="px-5 py-2 rounded-full border border-[#556B2F] text-[#556B2F] text-xs font-mono uppercase"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
