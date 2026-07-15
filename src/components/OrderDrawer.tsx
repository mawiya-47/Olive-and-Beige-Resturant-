import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Truck, Store, MapPin, CreditCard, CheckCircle, Package } from "lucide-react";
import { MenuItem, OrderItem, Order } from "../types";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  lang: 'en' | 'fr';
  onOrderPlaced: (order: Order) => void;
}

export default function OrderDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
  onOrderPlaced
}: OrderDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.20
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Shipping metrics
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Active tracking order
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? 15 : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    if (couponCode.toUpperCase() === 'GOLDEN20') {
      setAppliedDiscount(0.20);
      setCouponSuccess('GOLDEN20 coupon applied successfully! Enjoy 20% luxury savings.');
    } else {
      setCouponError('Invalid promotion code. Try "GOLDEN20".');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone) {
      alert("Please fill in contact details.");
      return;
    }
    if (orderType === 'delivery' && !shippingInfo.address) {
      alert("Please specify a delivery address.");
      return;
    }

    setLoading(true);

    const orderPayload = {
      items: cart,
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total,
      type: orderType,
      customerName: shippingInfo.name,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      deliveryAddress: orderType === 'delivery' ? shippingInfo.address : "",
      couponUsed: appliedDiscount > 0 ? "GOLDEN20" : ""
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setActiveOrder(data.order);
        onOrderPlaced(data.order);
        onClearCart();
        setStep('tracking');
      } else {
        alert(data.error || "Failed to place order.");
      }
    } catch (err) {
      console.error("Order error:", err);
      // Fallback
      const mockOrder: Order = {
        id: "ord-" + Math.floor(100000 + Math.random() * 900000),
        items: cart,
        subtotal,
        discount: discountAmount,
        deliveryFee,
        total,
        status: 'Preparing',
        type: orderType,
        customerName: shippingInfo.name,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        deliveryAddress: shippingInfo.address,
        couponUsed: appliedDiscount > 0 ? "GOLDEN20" : "",
        createdAt: new Date().toISOString()
      };
      setActiveOrder(mockOrder);
      onOrderPlaced(mockOrder);
      onClearCart();
      setStep('tracking');
    } finally {
      setLoading(false);
    }
  };

  const trackingStages = [
    { title: "Order Placed", desc: "Awaiting confirmation", key: "Pending" },
    { title: "Cooking Masterpiece", desc: "Chef Mawiya is preparing", key: "Preparing" },
    { title: "Out for Journey", desc: "White-glove delivery transit", key: "Out for Delivery" },
    { title: "Savor Journey", desc: "Completed successfully", key: "Completed" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Right Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-[#F8F4EC]/85 backdrop-blur-xl shadow-2xl z-50 flex flex-col justify-between overflow-hidden border-l border-[#C8A96A]/20"
          >
            {/* Header */}
            <div className="p-6 bg-white/45 backdrop-blur-md border-b border-white/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#556B2F]" size={20} />
                <h3 className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider">
                  {step === 'cart' && (lang === 'en' ? 'Gourmet Basket' : 'Votre Panier')}
                  {step === 'checkout' && (lang === 'en' ? 'Checkout' : 'Paiement')}
                  {step === 'tracking' && (lang === 'en' ? 'Order Journey' : 'Suivi Commande')}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-[#F8F4EC]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Core Drawer scrollable content */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* STAGE 1: BASKET ITEMS */}
              {step === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <ShoppingBag size={48} className="text-stone-300 mb-4 animate-bounce" />
                      <p className="font-serif text-base font-bold text-stone-800">Your Basket is Empty</p>
                      <p className="text-xs text-stone-500 font-light mt-1.5 px-12 leading-relaxed">
                        Explore our seasonal master menu and select exquisite creations from Executive Chef Mawiya's kitchen.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-6 px-6 py-2.5 rounded-full bg-[#556B2F] text-white text-xs font-mono uppercase"
                      >
                        Start Ordering
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200/60 shadow-sm relative group">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-grow">
                            <h4 className="font-serif text-sm font-bold text-stone-900">{item.menuItem.name}</h4>
                            <span className="font-mono text-xs text-stone-500 block mt-0.5">${item.menuItem.price} each</span>
                            
                            {/* Quantity controls */}
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                                className="p-1 rounded bg-[#F8F4EC] text-stone-700 hover:bg-[#C8A96A] hover:text-white"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-mono text-xs font-bold text-stone-800 mt-0.5">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                                className="p-1 rounded bg-[#F8F4EC] text-stone-700 hover:bg-[#C8A96A] hover:text-white"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>

                          {/* Delete Item button */}
                          <button
                            onClick={() => onRemoveItem(item.menuItem.id)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-red-500 p-1 rounded"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}

                      {/* Promo Coupon Module */}
                      <div className="mt-6 p-4 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
                          Promotion Discount Coupon
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter GOLDEN20"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#F8F4EC] border border-stone-200 text-xs focus:outline-none focus:border-[#556B2F]"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="px-4 py-2 bg-stone-900 text-white hover:bg-[#556B2F] rounded-lg text-xs font-mono font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponSuccess && (
                          <span className="text-[10px] text-green-600 font-medium block">{couponSuccess}</span>
                        )}
                        {couponError && (
                          <span className="text-[10px] text-red-500 font-medium block">{couponError}</span>
                        )}
                      </div>

                    </div>
                  )}
                </>
              )}

              {/* STAGE 2: PAYMENTS CHECKOUT FORM */}
              {step === 'checkout' && (
                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-6">
                  
                  {/* Fulfillment selector */}
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-white rounded-xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`py-2.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                        orderType === 'delivery'
                          ? "bg-[#556B2F] text-white shadow-sm"
                          : "text-stone-600 hover:bg-[#F8F4EC]"
                      }`}
                    >
                      <Truck size={14} />
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-2.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                        orderType === 'pickup'
                          ? "bg-[#556B2F] text-white shadow-sm"
                          : "text-stone-600 hover:bg-[#F8F4EC]"
                      }`}
                    >
                      <Store size={14} />
                      Pickup
                    </button>
                  </div>

                  {/* Customer Contact metrics */}
                  <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
                    <h4 className="font-serif text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                      <CreditCard size={15} className="text-[#C8A96A]" />
                      Contact Coordinates
                    </h4>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">Contact Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        placeholder="Zain Malik"
                        className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#556B2F]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="zain@example.com"
                        className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#556B2F]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">Phone Coordinate *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+92 333 9876543"
                        className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#556B2F]"
                      />
                    </div>

                    {orderType === 'delivery' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1">
                          <MapPin size={11} />
                          Delivery address (Karachi Only) *
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          placeholder="e.g. Apartment 4B, Khyaban-e-Shujaat, Phase 8, DHA, Karachi"
                          className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#556B2F]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Simulated Payment Module */}
                  <div className="bg-stone-900 text-white p-5 rounded-2xl flex flex-col gap-4 shadow-md">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#C8A96A] font-bold">
                      Simulated Payment details
                    </h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] uppercase tracking-wider text-stone-400">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4000 1234 5678 9010"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-[#C8A96A]"
                        />
                        <CreditCard className="absolute right-4 top-3 text-stone-500" size={14} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[8px] uppercase tracking-wider text-stone-400">Exp. Month/Year</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          className="px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-[#C8A96A] text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[8px] uppercase tracking-wider text-stone-400">CVC Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          className="px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-[#C8A96A] text-center"
                        />
                      </div>
                    </div>
                  </div>

                </form>
              )}

              {/* STAGE 3: LIVE ORDER TRACKING PIPELINE */}
              {step === 'tracking' && activeOrder && (
                <div className="flex flex-col gap-8 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto shadow-sm border border-green-200">
                    <CheckCircle size={32} />
                  </div>

                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#C8A96A] font-bold">
                      Order ID: {activeOrder.id}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                      Savor Journey Initiated!
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-1.5 leading-relaxed px-6">
                      Chef Mawiya’s kitchen is currently styling and emulsifying your chosen gourmet items.
                    </p>
                  </div>

                  {/* Real-time vertical tracking pipeline UI */}
                  <div className="flex flex-col gap-6 text-left max-w-sm mx-auto w-full bg-white border border-stone-200/60 p-6 rounded-2xl shadow-sm mt-4">
                    {trackingStages.map((stage, idx) => {
                      const isCompleted = activeOrder.status === 'Completed';
                      const isJourney = activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Ready for Pickup';
                      const isPreparing = activeOrder.status === 'Preparing';
                      
                      let isPassed = false;
                      let isCurrent = false;

                      if (idx === 0) isPassed = true; // Placed is always passed
                      if (idx === 1 && (isPreparing || isJourney || isCompleted)) isPassed = true;
                      if (idx === 2 && (isJourney || isCompleted)) isPassed = true;
                      if (idx === 3 && isCompleted) isPassed = true;

                      // Find active stage
                      if (idx === 0 && activeOrder.status === 'Pending') isCurrent = true;
                      if (idx === 1 && activeOrder.status === 'Preparing') isCurrent = true;
                      if (idx === 2 && (activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Ready for Pickup')) isCurrent = true;
                      if (idx === 3 && activeOrder.status === 'Completed') isCurrent = true;

                      return (
                        <div key={idx} className="flex gap-4 relative">
                          {/* Pipe connector */}
                          {idx < 3 && (
                            <div className={`absolute left-3.5 top-7 w-[1px] h-10 ${isPassed ? 'bg-[#556B2F]' : 'bg-stone-200'}`} />
                          )}
                          
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500 ${
                            isCurrent
                              ? "bg-[#556B2F] text-white border-[#556B2F] scale-110"
                              : isPassed
                              ? "bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]"
                              : "bg-white text-stone-300 border-stone-200"
                          }`}>
                            {isPassed ? <CheckCircle size={14} /> : <Package size={14} />}
                          </div>

                          <div>
                            <h4 className={`font-serif text-xs font-bold ${isCurrent ? 'text-[#556B2F]' : 'text-stone-800'}`}>
                              {stage.title}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-light mt-0.5">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-[#F8F4EC] border border-[#C8A96A]/20 p-4 rounded-xl text-left text-stone-700 text-xs font-light max-w-sm mx-auto leading-relaxed mt-4">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      White-Glove Courier Note
                    </span>
                    Our deliverer will arrive under thermal culinary casing within 40 minutes. Enjoy the gold savings applied.
                  </div>

                  <button
                    onClick={() => {
                      setStep('cart');
                      onClose();
                    }}
                    className="w-full max-w-xs mx-auto py-3 rounded-xl bg-stone-900 text-white hover:bg-[#556B2F] font-mono text-xs uppercase"
                  >
                    Track order details
                  </button>
                </div>
              )}

            </div>

            {/* Footer Summary (if NOT in tracking stage) */}
            {step !== 'tracking' && (
              <div className="p-6 bg-white border-t border-[#C8A96A]/10 flex flex-col gap-4">
                <div className="flex flex-col gap-2 font-mono text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-800">${subtotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Exclusive Savings (20%)</span>
                      <span className="font-bold">-${discountAmount.toFixed(1)}</span>
                    </div>
                  )}
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>White-Glove Courier Fee</span>
                      <span className="font-bold text-stone-800">${deliveryFee}</span>
                    </div>
                  )}
                  <div className="h-[1.5px] bg-stone-100 my-1" />
                  <div className="flex justify-between text-sm text-[#556B2F] font-bold">
                    <span>Total Savor value</span>
                    <span className="text-base font-serif">${total.toFixed(1)}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <button
                    disabled={cart.length === 0}
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-xl bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-medium tracking-widest text-xs uppercase transition-all duration-500 disabled:bg-stone-200 disabled:text-stone-500"
                  >
                    Proceed To Checkout
                  </button>
                ) : (
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#556B2F] text-white hover:bg-[#4F5D3A] font-medium tracking-widest text-xs uppercase transition-all duration-500 disabled:bg-stone-300"
                  >
                    {loading ? "Authenticating payment..." : "Finalize Order & Pay"}
                  </button>
                )}

                {step === 'checkout' && (
                  <button
                    onClick={() => setStep('cart')}
                    className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-500 text-xs font-mono uppercase text-center hover:border-stone-400"
                  >
                    Back to Basket
                  </button>
                )}
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
