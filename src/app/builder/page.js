"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BuilderPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [savedFunnelId, setSavedFunnelId] = useState(null);

  // All States
  const [headline, setHeadline] = useState("Apna Mahaan Offer Yahan Likhein!");
  const [subheadline, setSubheadline] = useState("Ek aisi line jo customer ko majboor kar de product khareedne par.");
  const [buttonText, setButtonText] = useState("Join Now ➔");
  const [buttonColor, setButtonColor] = useState("bg-indigo-600");
  const [productName, setProductName] = useState("Premium SaaS Masterclass");
  const [price, setPrice] = useState("999");
  const [thanksMessage, setThanksMessage] = useState("Aapka Bohot Bohot Shukriya!");
  const [nextStepInstruction, setNextStepInstruction] = useState("Humne access link aapke email par bhej diya hai.");
  
  // Local preview ke liye email state
  const [previewEmail, setPreviewEmail] = useState("");

  // Check login & Fetch Data
  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      try {
        const { data, error } = await supabase
          .from("funnels")
          .select("*")
          .eq("user_id", user.id)
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
          setSavedFunnelId(data.id);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    checkUserAndFetch();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Save Data
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
            user_id: userId,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setSavedFunnelId(data[0].id);
        alert("🎉 Aapka Personal Data Cloud Par Save Ho Gaya!");
      }
    } catch (error) {
      console.error(error);
      alert("Error: Data save nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  // Builder preview ke andar temporary email handle karne ke liye (leads me save nahi karega, sirf navigation check karne ke liye)
  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    setActiveStep("checkout"); // Seedhe agle step par bhej do!
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-mono">
        🔄 Security Check & Loading Your Funnel...
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
            <button onClick={handleLogout} className="text-xs text-rose-400 hover:text-rose-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Logout
            </button>
          </div>

          {/* NAVIGATION */}
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

        {/* LINK BOX & SAVE BUTTON AREA */}
        <div className="space-y-3 mt-6">
          {savedFunnelId && (
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">🔗 Your Live Funnel Link</p>
              <a 
                href={`/preview/${savedFunnelId}`} 
                target="_blank" 
                className="text-[11px] text-emerald-400 hover:underline block break-all font-mono"
              >
                /preview/{savedFunnelId}
              </a>
            </div>
          )}

          <button onClick={saveFunnelToDatabase} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 py-3 rounded-xl font-bold text-sm shadow-lg transition">
            {loading ? "Saving..." : "💾 Save Full Funnel"}
          </button>
        </div>

      </div>

      {/* RIGHT SIDE: LIVE PREVIEW */}
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
            
            {/* 🎯 Ab form aur button dono active hain testing ke liye */}
            <form onSubmit={handlePreviewSubmit} className="max-w-xs mx-auto space-y-3 mb-6">
              <input 
                type="email" 
                placeholder="Apna Email Address" 
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none text-center" 
                required
              />
              <button type="submit" className={`w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-lg ${buttonColor}`}>
                {buttonText}
              </button>
            </form>
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
            {/* 🎯 Checkout button par click karne se thank you step khulega */}
            <button onClick={() => setActiveStep("thanks")} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-xs shadow-lg">
              Complete Payment (₹{price})
            </button>
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