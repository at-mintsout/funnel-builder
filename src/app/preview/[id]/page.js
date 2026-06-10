"use client";
import { useState, useEffect, use } from "react"; // 'use' ko import kiya URL params ke liye
import { supabase } from "@/lib/supabase";

export default function PublicPreviewPage({ params: paramsPromise }) {
  // Next.js ke latest niyam ke mutabik params ko unwrap (use) karna padta hai
  const params = use(paramsPromise);
  const funnelId = params.id; // URL se unique ID mil gayi!

  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false);

  // States for Data
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [thanksMessage, setThanksMessage] = useState("");
  const [nextStepInstruction, setNextStepInstruction] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // DATABASE SE SPECIFIC ID KA DATA LOAD KARNA
  const fetchFunnelData = async () => {
    try {
      const { data, error } = await supabase
        .from("funnels")
        .select("*")
        .eq("id", funnelId) // 🎯 Sabse main filter: Sirf isi ID ka data lao!
        .single();

      if (error) throw error;

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
    if (funnelId) {
      fetchFunnelData();
    }
  }, [funnelId]);

  // Lead Submit Logic
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail) return alert("Kripya email dalein!");
    setLeadLoading(true);

    try {
      const { error } = await supabase
        .from("leads")
        .insert([{ email: customerEmail }]);

      if (error) throw error;
      setActiveStep("checkout");
    } catch (error) {
      console.error(error);
      alert("Kuch galat hua!");
    } finally {
      setLeadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs">
        🌐 Fetching Your Specific Funnel Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      
      {/* LANDING PAGE */}
      {activeStep === "landing" && (
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl text-center space-y-6">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">Special Limited Offer</span>
          <h1 className="text-4xl font-black text-white leading-tight md:text-5xl">{headline}</h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">{subheadline}</p>
          
          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto pt-4">
            <input 
              type="email" 
              placeholder="Enter your best email address..." 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 transition mb-3 text-center text-white"
              required
            />
            <button type="submit" disabled={leadLoading} className={`w-full text-white font-black py-4 px-6 rounded-xl text-sm shadow-xl hover:scale-[1.01] transition active:scale-[0.99] disabled:opacity-50 ${buttonColor}`}>
              {leadLoading ? "Processing..." : buttonText}
            </button>
          </form>
        </div>
      )}

      {/* CHECKOUT PAGE */}
      {activeStep === "checkout" && (
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">🔒 Secure Checkout</h2>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">{productName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Lifetime Digital Access</p>
            </div>
            <p className="text-xl font-black text-indigo-400">₹{price}</p>
          </div>
          <button onClick={() => setActiveStep("thanks")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl text-sm shadow-lg transition mt-2">
            Pay Now & Get Instant Access (₹{price})
          </button>
        </div>
      )}

      {/* THANK YOU PAGE */}
      {activeStep === "thanks" && (
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-3xl font-black">✓</div>
          <h1 className="text-3xl font-black text-white">{thanksMessage}</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">{nextStepInstruction}</p>
        </div>
      )}

    </div>
  );
}