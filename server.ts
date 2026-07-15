import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database file path resolution
const dbPath = path.join(process.cwd(), "src", "db.json");

// Helper to load database
function loadDb() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }
  } catch (error) {
    console.error("Error reading DB file:", error);
  }
  // Fallback in case of issue
  return { menu: [], reservations: [], orders: [], blogs: [], messages: [], reviews: [] };
}

// Helper to save database
function saveDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing DB file:", error);
  }
}

// Initial DB check
let db = loadDb();

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI integration successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Chatbot will run in simulation/fallback mode.");
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. MENU ENDPOINTS
app.get("/api/menu", (req, res) => {
  db = loadDb();
  res.json(db.menu);
});

app.post("/api/admin/menu", (req, res) => {
  db = loadDb();
  const newItem = req.body;
  if (!newItem.id) {
    newItem.id = "m" + (db.menu.length + 1);
  }
  
  const index = db.menu.findIndex((item: any) => item.id === newItem.id);
  if (index !== -1) {
    db.menu[index] = newItem; // Edit
  } else {
    db.menu.push(newItem); // Add new
  }
  
  saveDb(db);
  res.json({ success: true, item: newItem });
});

app.delete("/api/admin/menu/:id", (req, res) => {
  db = loadDb();
  const { id } = req.params;
  db.menu = db.menu.filter((item: any) => item.id !== id);
  saveDb(db);
  res.json({ success: true, message: "Item deleted successfully." });
});

// 2. RESERVATIONS ENDPOINTS
app.get("/api/reservations", (req, res) => {
  db = loadDb();
  res.json(db.reservations);
});

app.post("/api/reservations", (req, res) => {
  db = loadDb();
  const { name, email, phone, date, time, guests, specialRequests } = req.body;
  
  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  // Create new reservation
  const newRes = {
    id: "res-" + Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    phone,
    date,
    time,
    guests: Number(guests),
    specialRequests: specialRequests || "",
    status: "Confirmed", // Auto-confirm for instant magical user experience!
    tableNumber: Math.floor(1 + Math.random() * 12), // Assign random romantic table number
    createdAt: new Date().toISOString()
  };

  db.reservations.unshift(newRes);
  saveDb(db);

  res.json({
    success: true,
    message: "Table reserved successfully!",
    reservation: newRes
  });
});

app.post("/api/admin/reservations/:id/status", (req, res) => {
  db = loadDb();
  const { id } = req.params;
  const { status } = req.body;

  const rIndex = db.reservations.findIndex((r: any) => r.id === id);
  if (rIndex !== -1) {
    db.reservations[rIndex].status = status;
    saveDb(db);
    return res.json({ success: true, reservation: db.reservations[rIndex] });
  }
  res.status(404).json({ error: "Reservation not found." });
});

// 3. ORDERS ENDPOINTS
app.get("/api/orders", (req, res) => {
  db = loadDb();
  res.json(db.orders);
});

app.post("/api/orders", (req, res) => {
  db = loadDb();
  const { items, subtotal, discount, deliveryFee, total, type, customerName, customerEmail, customerPhone, deliveryAddress, couponUsed } = req.body;

  if (!items || items.length === 0 || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: "Invalid order checkout payload." });
  }

  const newOrder = {
    id: "ord-" + Math.floor(100000 + Math.random() * 900000),
    items,
    subtotal: Number(subtotal),
    discount: Number(discount),
    deliveryFee: Number(deliveryFee),
    total: Number(total),
    status: "Preparing", // Starting status
    type,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress: deliveryAddress || "",
    couponUsed: couponUsed || "",
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDb(db);

  res.json({
    success: true,
    message: "Order placed successfully!",
    order: newOrder
  });
});

app.post("/api/admin/orders/:id/status", (req, res) => {
  db = loadDb();
  const { id } = req.params;
  const { status } = req.body;

  const oIndex = db.orders.findIndex((o: any) => o.id === id);
  if (oIndex !== -1) {
    db.orders[oIndex].status = status;
    saveDb(db);
    return res.json({ success: true, order: db.orders[oIndex] });
  }
  res.status(404).json({ error: "Order not found." });
});

// 4. BLOGS ENDPOINTS
app.get("/api/blogs", (req, res) => {
  db = loadDb();
  res.json(db.blogs);
});

// 5. REVIEWS ENDPOINTS
app.get("/api/reviews", (req, res) => {
  db = loadDb();
  res.json(db.reviews);
});

// 6. CONTACT MESSAGES
app.get("/api/messages", (req, res) => {
  db = loadDb();
  res.json(db.messages);
});

app.post("/api/messages", (req, res) => {
  db = loadDb();
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  const newMessage = {
    id: "msg-" + Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    phone: phone || "",
    subject,
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.messages.unshift(newMessage);
  saveDb(db);

  res.json({
    success: true,
    message: "Your message has been sent. Chef Mawiya's team will contact you shortly."
  });
});

app.post("/api/admin/messages/:id/read", (req, res) => {
  db = loadDb();
  const { id } = req.params;
  const mIndex = db.messages.findIndex((m: any) => m.id === id);
  if (mIndex !== -1) {
    db.messages[mIndex].isRead = true;
    saveDb(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Message not found." });
});

// 7. ANALYTICS ENDPOINT
app.get("/api/analytics", (req, res) => {
  db = loadDb();
  
  const totalRevenue = db.orders
    .filter((o: any) => o.status === "Completed" || o.status === "Preparing" || o.status === "Out for Delivery" || o.status === "Ready for Pickup")
    .reduce((sum: number, o: any) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const totalReservations = db.reservations.length;
  const totalMessages = db.messages.length;

  // Compute status breakdowns
  const reservationStats = {
    Confirmed: db.reservations.filter((r: any) => r.status === "Confirmed").length,
    Pending: db.reservations.filter((r: any) => r.status === "Pending").length,
    Cancelled: db.reservations.filter((r: any) => r.status === "Cancelled").length,
  };

  const orderStats = {
    Pending: db.orders.filter((o: any) => o.status === "Pending").length,
    Preparing: db.orders.filter((o: any) => o.status === "Preparing").length,
    OutForDelivery: db.orders.filter((o: any) => o.status === "Out for Delivery" || o.status === "Ready for Pickup").length,
    Completed: db.orders.filter((o: any) => o.status === "Completed").length,
  };

  res.json({
    totalRevenue,
    totalOrders,
    totalReservations,
    totalMessages,
    reservationStats,
    orderStats,
    recentOrders: db.orders.slice(0, 5),
    recentReservations: db.reservations.slice(0, 5)
  });
});

// 8. GEMINI AI CHATBOT ENDPOINT
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // System instructions explaining Olive & Beige restaurant details
  const systemInstruction = `You are "Aurelia", the elegant, highly refined digital concierge for the ultra-luxury restaurant "OLIVE & BEIGE".
Our restaurant is designed under the creative direction of Executive Chef Muhammad Mawiya, located in the prestigious Defense neighborhood of Karachi, Pakistan.
We combine Italian fine dining with modern gastronomy, featuring olive grove themes, warm beige visual spaces, and delicate gold accents.

YOUR VOICE AND TONE:
- Speak with incredible poise, warmth, sophisticated elegance, and luxury service etiquette.
- Always use hospitable expressions. Keep answers relatively concise and beautifully structured (using markdown lists or bold markers).
- Speak of Chef Mawiya with great respect, calling him "Executive Chef Mawiya" or "our Creative Director Chef Mawiya".

OUR SIGNATURE DISHES IN MENU:
1. Artisanal Burrata & Heirloom Tomatoes ($24) - Appetizer with 25-yr Modena aged balsamic and cold-pressed Sicilian olive oil.
2. Rosemary Truffle Angus Beef Sliders ($28) - Appetizer with black truffle aioli, melted Gruyère on house-baked brioche.
3. Smoked Salmon & Caviar Eggs Benedict ($34) - Breakfast with organic poached eggs, Norwegian salmon, and Royal Ossetra Caviar.
4. Wild Mushroom & Black Truffle Pappardelle ($38) - Mains. Hand-rolled pappardelle with chanterelles and Umbrian black truffle.
5. Olive & Herb Encrusted Lamb Rack ($48) - Mains. Australian lamb rack with Kalamata olives and parsnip purée.
6. A5 Wagyu Ribeye ($95) - Steaks. Seared Kagoshima Wagyu with smoked green olive butter and charred broccolini.
7. Pan-Seared Chilean Sea Bass ($54) - Seafood. Saffron-olive bouillon, baby fennel, and fingerling potato confit.
8. Deconstructed Golden Hazelnut Rocher ($18) - Dessert. Dark chocolate mousse sphere with 24k gold leaf and Piedmont hazelnuts.
9. Smoked Rosemary & Hibiscus Spritz ($14) - Mocktail. Hibiscus flower tea, cold-pressed grapefruit, served under rosemary smoke.
10. Kyoto Cold Brew ($12) - Beverage. 12-hour slow drip Geisha single origin coffee over hand-carved ice sphere.

OUR POLICIES & CAPABILITIES:
- Location: Karachi, Pakistan (Defense phase 8 overlooking the serene Arabian sea breeze).
- Hours: 12:00 PM to 12:00 AM daily. Special Breakfast on weekends from 9:00 AM to 2:00 PM.
- Reservations: Highly recommended. Guests can reserve tables of 1 to 12 guests directly via our website reservation portal.
- Delivery & Pickup: Available. Our delivery area covers all upscale neighborhoods with white-glove packaging.
- Promotion: Guests can use code "GOLDEN20" during checkout to receive an exclusive 20% savings.
- Developer: Muhammad Mawiya, a talented designer and developer (GitHub: https://github.com/mawiya-47).

DIRECTIONS:
- If asked, guide guests on what wine/drink pairings suit their selected dish (e.g., recommend our Smoked Rosemary Spritz with the A5 Wagyu, or the Kyoto Cold Brew with the Golden Rocher).
- If the Gemini API key is missing, you are running in simulated mode. Provide beautiful elegant concierge answers utilizing pre-configured responses based on keywords.`;

  if (ai) {
    try {
      // Structure chat contents for GoogleGenAI
      // Translate simple history format to Gemini parts/role format
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const h of history) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const reply = response.text || "I apologize, my gourmet connection faltered slightly. How may I serve you today?";
      return res.json({ reply });
    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      // Fallback in case of server-side Gemini errors
      return res.json({ 
        reply: generateLocalFallbackResponse(message),
        isSimulated: true
      });
    }
  } else {
    // Simulated concierge if no key is supplied
    return res.json({ 
      reply: generateLocalFallbackResponse(message),
      isSimulated: true
    });
  }
});

// A magnificent, local fallback search database for the chatbot when GEMINI_API_KEY is not configured
function generateLocalFallbackResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase();
  
  if (msg.includes("menu") || msg.includes("eat") || msg.includes("food") || msg.includes("dish")) {
    return `Ah, our menu at **Olive & Beige** is a culinary tapestry! Our most coveted masterpiece is the **A5 Wagyu Ribeye** ($95), pan-seared and finished with smoked green olive butter. For pasta aficionados, our **Wild Mushroom & Black Truffle Pappardelle** ($38) is absolute heaven. May I guide you to add one of these to your basket?`;
  }
  if (msg.includes("reserve") || msg.includes("book") || msg.includes("table") || msg.includes("seat")) {
    return `Reservations at **Olive & Beige** are a seamless affair. You can use our real-time table selector right on the website! Simply scroll down to the **Reservations** section, specify your desired date, hour, and party size. We will instantly secure a table for you, and perhaps assign one of our romantic window seats overlooking the sea breeze.`;
  }
  if (msg.includes("where") || msg.includes("location") || msg.includes("address") || msg.includes("karachi")) {
    return `Our physical sanctuary is located in the beautiful seaside vicinity of **Defense Phase 8, Karachi, Pakistan**. We offer secure, private valet parking, and our dining salon provides a panoramic glass view of the sea. We look forward to welcoming you soon!`;
  }
  if (msg.includes("hours") || msg.includes("time") || msg.includes("open") || msg.includes("close")) {
    return `We greet our guests daily from **12:00 PM to 12:00 AM**. For weekend gourmands, we host our elite **Breakfast & Caviar brunch** on Saturdays and Sundays from **9:00 AM to 2:00 PM**.`;
  }
  if (msg.includes("chef") || msg.includes("mawiya") || msg.includes("developer") || msg.includes("who made")) {
    return `**Olive & Beige** is under the creative leadership of our celebrated Creative Director and Executive Chef, **Muhammad Mawiya**. Chef Mawiya has poured his passion for luxury aesthetics into both our culinary masterpieces and our digital architecture. You can review his incredible work on his GitHub (https://github.com/mawiya-47) or portfolio website!`;
  }
  if (msg.includes("coupon") || msg.includes("discount") || msg.includes("offer") || msg.includes("promo")) {
    return `How delightful of you to ask! To honor your visit, we invite you to utilize our exclusive promotional code **GOLDEN20** during checkout to receive an elegant **20% savings** on your culinary order today.`;
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greetings")) {
    return `Welcome to **Olive & Beige**, I am Aurelia, your digital concierge. It is a absolute pleasure to assist you today. Would you like me to recommend a signature dish from Chef Mawiya’s kitchen, help you book an intimate table, or perhaps discuss our single-origin Kyoto Cold Brew?`;
  }

  return `I hear you perfectly. At **Olive & Beige**, we strive for absolute perfection in every detail. As Aurelia, I can guide you through our hand-selected menu items, find the perfect seating, apply our **GOLDEN20** savings code, or introduce you to Executive Chef Mawiya's culinary philosophies. How may I enhance your day today?`;
}

// ==========================================
// VITE DEV SERVER VS PRODUCTION MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server assets configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Olive & Beige custom full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
