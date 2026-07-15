import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, User, HelpCircle } from "lucide-react";

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Welcome to the digital sanctuary of Olive & Beige. I am Aurelia, your personal culinary concierge. How may I assist your dining reservations or bespoke orders today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionTags = [
    "What are your gluten-free mains?",
    "Book Table 5 for anniversary dining",
    "Show me Chef Specials",
    "Where is the restaurant located?"
  ];

  // Auto scroll to bottom on message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: new Date() }]);
      } else {
        setMessages((prev) => [...prev, {
          sender: 'ai',
          text: "My apologies. Our digital neural systems are currently experiencing a brief surge. Rest assured, Chef Mawiya's team is ready at +92 (300) 123-4567 for immediate assistance.",
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [...prev, {
        sender: 'ai',
        text: "I was unable to secure a gateway to our server. Please check your internet connectivity or dial our concierge directly at muhammadmawiya5@gmail.com.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Sparkly Chat Bubble Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#556B2F] text-white flex items-center justify-center shadow-2xl relative group border-2 border-[#C8A96A]/40"
      >
        <span className="absolute inset-0 rounded-full bg-[#556B2F]/20 group-hover:animate-ping" />
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        
        {/* Sparkly little dot indicating live AI */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm animate-bounce">
          ✦
        </span>
      </motion.button>

      {/* Concierge Dialog Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden flex flex-col justify-between glass-shadow-lg"
          >
            {/* Aurelia Header */}
            <div className="p-5 bg-stone-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F8F4EC] flex items-center justify-center text-[#556B2F] border-2 border-[#C8A96A] relative">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-stone-950" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                    Aurelia Concierge
                    <Sparkles size={11} className="text-[#C8A96A] animate-pulse" />
                  </h3>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-[#C8A96A] font-bold block mt-1 uppercase">
                    Olive & Beige Artificial Intelligence
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {/* Suggestions Quick Tags */}
            <div className="px-4 py-2.5 bg-[#F8F4EC]/60 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {suggestionTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSendMessage(tag)}
                  className="px-3 py-1.5 rounded-full bg-white text-stone-700 text-[10px] whitespace-nowrap border border-stone-200 hover:border-[#556B2F] hover:text-[#556B2F] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Scrolling Conversation Hub */}
            <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto bg-[#F8F4EC]/30 flex flex-col gap-4">
              {messages.map((m, idx) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={idx} className={`flex gap-2.5 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    {/* Tiny avatar mark */}
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border text-[10px] ${
                      isUser
                        ? "bg-stone-100 text-stone-800 border-stone-200"
                        : "bg-[#556B2F] text-white border-[#C8A96A]/20"
                    }`}>
                      {isUser ? <User size={12} /> : <Bot size={12} />}
                    </div>

                    {/* Bubble body text */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-stone-900 text-white rounded-tr-none"
                        : "bg-white text-stone-800 border border-stone-200/50 shadow-sm rounded-tl-none font-light"
                    }`}>
                      {m.text}
                      <span className="block font-mono text-[7px] text-stone-400 text-right mt-1.5">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation */}
              {loading && (
                <div className="flex gap-2.5 self-start items-center">
                  <div className="w-7 h-7 rounded-full bg-[#556B2F] text-white border border-stone-200 flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="p-3 bg-white border border-stone-200/50 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat message typing inputs */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/40 backdrop-blur-md border-t border-white/60 flex gap-2">
              <input
                type="text"
                placeholder="Ask Aurelia anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-white/40 border border-white/60 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#556B2F] focus:bg-white/70 transition-all"
              />
              <button
                type="submit"
                className="p-3 bg-[#556B2F] text-white rounded-full hover:bg-[#4F5D3A] transition-colors shadow"
              >
                <Send size={14} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
