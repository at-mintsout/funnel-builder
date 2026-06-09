"use client";
import { useState, useEffect } from "react"; // 1. useEffect ko import kiya
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BuilderPage() {
  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // Data fetch karne ke liye loader

  // All States
  const [headline, setHeadline] = useState("Apna Mahaan Offer Yahan Likhein!");
  const [subheadline, setSubheadline] = useState("Ek aisi line jo customer ko majboor kar de product khareedne par.");
  const [buttonText, setButtonText] = useState("Join Now ➔");
  const [buttonColor, setButtonColor] = useState("bg-indigo-600");
  const [productName, setProductName] = useState("Premium SaaS Masterclass");
  const [price, setPrice] = useState("999");
  const [thanksMessage, setThanksMessage] = useState("Aapka Bohot Bohot Shukriya!");
  const [nextStepInstruction, setNextStepInstruction] = useState("Humne access link aapke email par bhej diya hai.");

  // 2. DATABASE SE DATA WAPAS LANE WALA FUNCTION
  const fetchSavedFunnel = async () => {
    try {
      // Hum database ke 'funnels' table se sabse latest save kiya hua funnel utha rahe hain
      const { data, error } = await supabase
        .from("funnels")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 ka matlab hai table khali hai (no rows found), use error nahi manenge
        throw error;
      }

      if (data) {
        // Agar database mein data mila, toh saari states ko update kar do
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
      console.error("Data fetch karne mein dikkat hui:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  // 3. Page khulte hi automatic fetch function ko chalao
  useEffect(() => {
    fetchSavedFunnel();
  }, []);

  // 4. DATA SAVE KARNE WALA FUNCTION
  const saveFunnelToDatabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("funnels")
        .insert([
          {
            name: "My Cloud Funnel",
            headline,
            subheadline,
            button_text: buttonText,
            button_color: buttonColor,
            product_name: productName,
            price,
            thanks_message: thanksMessage,
            next_step_instruction: nextStepInstruction,
          },
        ]);

      if (error) throw error;
      alert("🎉 Data Cloud Par Save Ho Gaya! Ab page refresh karke check karo bhai!");
    } catch (error) {
      console.error(error);
      alert("Error: Data save nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  // Agar page abhi database se data load kar raha hai toh loading screen dikhao
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-mono">
        🔄 Cloud Se Aapka Funnel Load Ho Raha Hai...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col md:flex-row">
      
      {/* LEFT SIDE: CONTROLS PANEL */}
      <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black tracking-wider text-indigo-400">FUNNEL CRAFT</h2>
            <Link href="/" className="text-xs text-slate-400 hover:text-white bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Dashboard
            </Link>
          </div>

          {/* FUNNEL STEPS NAVIGATION */}
          <div className="mb-8 bg-slate-900 p-1 rounded-xl border border-slate-800 flex flex-col gap-1">
            <button onClick={() => setActiveStep("landing")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "landing" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>📄 1. Landing Page</button>
            <button onClick={() => setActiveStep("checkout")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "checkout" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>💳 2. Checkout Page</button>
            <button onClick={() => setActiveStep("thanks")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "thanks" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>🎉 3. Thank You Page</button>
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* INPUTS */}
          <div className="space-y-5">
            {activeStep === "landing" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Headline</label>
                  <textarea value={headline} onChange={(e) => setHeadline(e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-Headline</label>
                  <textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Button Text</label>
                  <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Button Color</label>
                  <div className="flex gap-2">
                    <button onClick={() => setButtonColor("bg-indigo-600")} className="w-6 h-6 rounded-full bg-indigo-600"></button>
                    <button onClick={() => setButtonColor("bg-emerald-600")} className="w-6 h-6 rounded-full bg-emerald-600"></button>
                    <button onClick={() => setButtonColor("bg-rose-600")} className="w-6 h-6 rounded-full bg-rose-600"></button>
                  </div>
                </div>
              </>
            )}

            {activeStep === "checkout" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Price (INR)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </>
            )}

            {activeStep === "thanks" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Success Message</label>
                  <textarea value={thanksMessage} onChange={(e) => setThanksMessage(e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</label>
                  <textarea value={nextStepInstruction} onChange={(e) => setNextStepInstruction(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={saveFunnelToDatabase} 
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 py-3 rounded-xl font-bold text-sm shadow-lg mt-6 transition"
        >
          {loading ? "Saving to Cloud..." : "💾 Save Full Funnel"}
        </button>
      </div>

      {/* RIGHT SIDE: LIVE PREVIEW SCREEN */}
      <div className="flex-1 bg-slate-900 p-8 flex items-center justify-center relative overflow-y-auto pt-20">
        <div className="absolute top-4 left-8 right-8 bg-slate-950/40 border border-slate-800 p-2 rounded-t-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] text-slate-500 ml-2 font-mono">https://funnelcraft.com/preview/{activeStep}</span>
        </div>

        {activeStep === "landing" && (
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 p-10 rounded-2xl shadow-2xl text-center">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">EXCLUSIVE OFFER</span>
            <h1 className="text-3xl font-black mt-6 mb-4 text-white leading-tight">{headline}</h1>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">{subheadline}</p>
            <div className="max-w-xs mx-auto space-y-2 mb-6">
              <input type="email" placeholder="Apna Email Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none" disabled />
            </div>
            <button className={`max-w-xs w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-lg ${buttonColor}`}>{buttonText}</button>
          </div>
        )}

        {activeStep === "checkout" && (
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 p-10 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-3">💳 Secure Checkout</h2>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold text-white">{productName}</p>
                <p className="text-[10px] text-slate-500">Instant Digital Access</p>
              </div>
              <p className="text-lg font-black text-indigo-400">₹{price}</p>
            </div>
            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-xs shadow-lg">Complete Payment (₹{price})</button>
          </div>
        )}

        {activeStep === "thanks" && (
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 p-10 rounded-2xl shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h1 className="text-2xl font-black text-white mb-2">{thanksMessage}</h1>
            <p className="text-slate-400 text-xs mb-6">{nextStepInstruction}</p>
          </div>
        )}
      </div>

    </div>
  );
}