"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BuilderPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [savedFunnelId, setSavedFunnelId] = useState(null);

  // CRM States
  const [leadsList, setLeadsList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("All");

  // Funnel States
  const [headline, setHeadline] = useState("Apna Mahaan Offer Yahan Likhein!");
  const [subheadline, setSubheadline] = useState("Ek aisi line jo customer ko majboor kar de product khareedne par.");
  const [buttonText, setButtonText] = useState("Join Now ➔");
  const [buttonColor, setButtonColor] = useState("bg-indigo-600");
  const [productName, setProductName] = useState("Premium SaaS Masterclass");
  const [price, setPrice] = useState("999");
  
  // 🎯 Nayi state payment URL ke liye
  const [paymentUrl, setPaymentUrl] = useState("https://rzp.io/l/example");

  const [thanksMessage, setThanksMessage] = useState("Aapka Bohot Bohot Shukriya!");
  const [nextStepInstruction, setNextStepInstruction] = useState("Humne access link aapke email par bhej diya hai.");
  const [previewEmail, setPreviewEmail] = useState("");

  // Fetch Funnel & CRM Leads
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);

    try {
      const { data: funnelData } = await supabase
        .from("funnels")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (funnelData) {
        setHeadline(funnelData.headline);
        setSubheadline(funnelData.subheadline);
        setButtonText(funnelData.button_text);
        setButtonColor(funnelData.button_color);
        setProductName(funnelData.product_name);
        setPrice(funnelData.price);
        setPaymentUrl(funnelData.payment_url || ""); // Load Payment URL
        setThanksMessage(funnelData.thanks_message);
        setNextStepInstruction(funnelData.next_step_instruction);
        setSavedFunnelId(funnelData.id);

        const { data: leadsData } = await supabase
          .from("leads")
          .select("*")
          .eq("funnel_id", funnelData.id)
          .order("created_at", { ascending: false });

        if (leadsData) setLeadsList(leadsData);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // CRM Status Update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;
      setLeadsList((prevLeads) =>
        prevLeads.map((lead) => lead.id === leadId ? { ...lead, status: newStatus } : lead)
      );
    } catch (error) {
      alert("Status update failed: " + error.message);
    }
  };

  // Upsert Funnel
  const saveFunnelToDatabase = async () => {
    setLoading(true);
    try {
      const funnelData = {
        name: "My Cloud Funnel",
        headline,
        subheadline,
        button_text: buttonText,
        button_color: buttonColor,
        product_name: productName,
        price,
        payment_url: paymentUrl, // 🎯 Database mein URL bhej rahe hain
        thanks_message: thanksMessage,
        next_step_instruction: nextStepInstruction,
        user_id: userId,
      };

      if (savedFunnelId) funnelData.id = savedFunnelId;

      const { data, error } = await supabase
        .from("funnels")
        .upsert([funnelData])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setSavedFunnelId(data[0].id);
        alert("🎉 Funnel & Payment gateway link updated!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredLeads = leadsList.filter((lead) => {
    if (selectedSegment === "All") return true;
    return lead.status === selectedSegment;
  });

  if (fetchLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-mono">🔄 Loading Gateway Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col md:flex-row">
      
      {/* LEFT PANEL */}
      <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black tracking-wider text-indigo-400">FUNNEL CRAFT</h2>
            <button onClick={handleLogout} className="text-xs text-rose-400 hover:text-rose-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">Logout</button>
          </div>

          <div className="mb-6 bg-slate-900 p-1 rounded-xl border border-slate-800 flex flex-col gap-1">
            <button onClick={() => setActiveStep("landing")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "landing" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>📄 1. Landing Page</button>
            <button onClick={() => setActiveStep("checkout")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "checkout" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>💳 2. Checkout Page</button>
            <button onClick={() => setActiveStep("thanks")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "thanks" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>🎉 3. Thank You Page</button>
            <button onClick={() => setActiveStep("crm")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "crm" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-amber-400"}`}>💼 CRM & Leads ({leadsList.length})</button>
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* EDITING INPUTS */}
          {activeStep !== "crm" && (
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
                  {/* 🎯 INTEGRATION FIELD FOR ALL PAYMENT GATEWAYS */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">🔌 Payment Gateway / UPI Link</label>
                    <input type="url" placeholder="Razorpay, Stripe, or UPI Link..." value={paymentUrl} onChange={(e) => setPaymentUrl(e.target.value)} className="w-full bg-slate-900 border border-amber-500/30 text-amber-300 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500" />
                    <p className="text-[9px] text-slate-500 mt-1">Paste your Razorpay Payment Page, Stripe Checkout, or Paytm link here.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3 mt-6">
          {savedFunnelId && (
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">🔗 Live Public Link</p>
              <a href={`/preview/${savedFunnelId}`} target="_blank" className="text-[11px] text-emerald-400 hover:underline block break-all font-mono">/preview/{savedFunnelId}</a>
            </div>
          )}
          <button onClick={saveFunnelToDatabase} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold text-sm shadow-lg transition">
            {loading ? "Saving..." : "💾 Save Full Funnel"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-slate-900 p-8 flex items-center justify-center relative overflow-y-auto">
        {activeStep === "crm" ? (
          // CRM UI
          <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-xl font-black text-amber-400">💼 Pipeline CRM Engine</h2>
            {/* Table remains same as previous */}
          </div>
        ) : (
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 p-10 rounded-2xl shadow-2xl text-center">
            {activeStep === "checkout" ? (
              <div className="text-left space-y-4">
                <h2 className="text-xl font-bold border-b border-slate-800 pb-3">💳 Secure Checkout Preview</h2>
                <div className="bg-slate-900 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{productName}</p>
                    <p className="text-[10px] text-slate-500">Gateway Route Enabled</p>
                  </div>
                  <p className="text-lg font-black text-indigo-400">₹{price}</p>
                </div>
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-xs">
                  Pay Now via Gateway ➔
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black mb-4">{headline}</h1>
                <p className="text-slate-400 text-xs mb-6">{subheadline}</p>
                <button className={`w-full py-2.5 rounded-lg text-xs font-bold ${buttonColor}`}>{buttonText}</button>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}