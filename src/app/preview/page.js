"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicPreviewPage() {
  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false); // Email save hote waqt loader chalane ke liye

  // States for Data
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [thanksMessage, setThanksMessage] = useState("");
  const [nextStepInstruction, setNextStepInstruction] = useState("");

  // Customer ka input email state
  const [customerEmail, setCustomerEmail] = useState("");

  // Database se funnel data load karna
  const fetchFunnelData = async () => {
    try {
      const { data, error } = await supabase
        .from("funnels")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setHeadline(data.headline);
        setSubheadline(data.subheadline);
        setButtonText(data.button_text);
        setButtonColor(data.button_color);
        setProductName(data.product_name);
        setPrice(data.price);
        setThanksMessage(data.thanks_message);
        setNextStepInstruction(data.next_step_instruction);
      }
    } catch (error) {
      console.error("Preview data load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunnelData();
  }, []);

  // 📄 CUSTOMER KA EMAIL SAVE KARNE WALA FUNCTION
  const handleLeadSubmit = async (e) => {
    e.preventDefault(); // Page ko reload hone se rokega
    
    if (!customerEmail) {
      alert("Kripya apna email dalein!");
      return;
    }

    setLeadLoading(true);

    try {
      // Supabase ke 'leads' table mein data insert kar rahe hain
      const { error } = await supabase
        .from("leads")
        .insert([{ email: customerEmail }]);

      if (error) throw error;

      // Email save hone ke baad user ko Checkout page par bhej do
      setActiveStep("checkout");
    } catch (error) {
      console.error("Lead save nahi ho payi:", error);
      alert("Kuch galat hua, dobara koshish karein!");
    } finally {
      setLeadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs">
        🌐 Funnel Is Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      
      {/* 1. LANDING PAGE STAGE */}
      {activeStep === "landing" && (
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl text-center space-y-6">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
            Special Limited Offer
          </span>
          <h1 className="text-4xl font-black text-white leading-tight md:text-5xl">
            {headline}
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            {subheadline}
          </p>
          
          {/* Form banaya taaki Enter marne par bhi submit ho jaye */}
          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto pt-4">
            <input 
              type="email" 
              placeholder="Enter your best email address..." 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 transition mb-3 text-center text-white"
              required
            />
            <button 
              type="submit"
              disabled={leadLoading}
              className={`w-full text-white font-black py-4 px-6 rounded-xl text-sm shadow-xl hover:scale-[1.01] transition active:scale-[0.99] disabled:opacity-50 ${buttonColor}`}
            >
              {leadLoading ? "Processing..." : buttonText}
            </button>
          </form>
        </div>
      )}

      {/* 2. CHECKOUT PAGE STAGE */}
      {activeStep === "checkout" && (
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
            🔒 Secure Checkout
          </h2>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">{productName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Lifetime Digital Access</p>
            </div>
            <p className="text-xl font-black text-indigo-400">₹{price}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Card Holder Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Card Details</label>
              <input type="text" placeholder="4111 2222 3333 4444" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="MM / YY" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300" />
              <input type="text" placeholder="CVV" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300" />
            </div>
          </div>

          <button 
            onClick={() => setActiveStep("thanks")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl text-sm shadow-lg transition mt-2"
          >
            Pay Now & Get Instant Access (₹{price})
          </button>
        </div>
      )}

      {/* 3. THANK YOU PAGE STAGE */}
      {activeStep === "thanks" && (
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
            ✓
          </div>
          <h1 className="text-3xl font-black text-white">
            {thanksMessage}
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            {nextStepInstruction}
          </p>
          <div className="pt-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 inline-block text-xs text-slate-500 font-mono">
              Transaction ID: <span className="text-white font-bold">#FC-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}