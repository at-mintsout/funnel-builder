"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicPreviewPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const funnelId = params.id;

  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false);

  // States
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  
  // 🎯 Payment URL state
  const [paymentUrl, setPaymentUrl] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const { data, error } = await supabase
          .from("funnels")
          .select("*")
          .eq("id", funnelId)
          .single();

        if (data) {
          setHeadline(data.headline);
          setSubheadline(data.subheadline);
          setButtonText(data.button_text);
          setButtonColor(data.button_color);
          setProductName(data.product_name);
          setPrice(data.price);
          setPaymentUrl(data.payment_url || ""); // Load URL
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (funnelId) fetchFunnelData();
  }, [funnelId]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const { error } = await supabase
        .from("leads")
        .insert([{ 
          name: customerName,
          email: customerEmail, 
          phone: customerPhone,
          funnel_id: funnelId,
          status: 'New'
        }]);

      if (error) throw error;
      setActiveStep("checkout");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLeadLoading(false);
    }
  };

  // 💸 REDIRECT TO RAZORPAY / STRIPE GATEWAY
  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // 🚀 Customer seedhe payment link par chala gaya!
    } else {
      alert("Merchant has not set a payment link yet.");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs">🌐 Connecting Gateways...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      {activeStep === "landing" && (
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <h1 className="text-3xl font-black md:text-5xl">{headline}</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">{subheadline}</p>
          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto space-y-3 text-left pt-4">
            <input type="text" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
            <input type="email" placeholder="Email Address" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
            <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
            <button type="submit" disabled={leadLoading} className={`w-full text-white font-black py-4 rounded-xl text-sm ${buttonColor}`}>
              {leadLoading ? "Processing..." : buttonText}
            </button>
          </form>
        </div>
      )}

      {/* CHECKOUT PAGE GATEWAY ROUTE */}
      {activeStep === "checkout" && (
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4">🔒 Secure Checkout</h2>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">{productName}</p>
              <p className="text-xs text-slate-500">Secure Merchant Transaction</p>
            </div>
            <p className="text-xl font-black text-indigo-400">₹{price}</p>
          </div>
          
          {/* 🎯 CLICK KARTE HI REAL LINK PAR REDIRECT */}
          <button onClick={handlePaymentRedirect} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-xl text-sm transition">
            Pay via Credit Card / UPI / Wallet (₹{price}) ➔
          </button>
        </div>
      )}
    </div>
  );
}