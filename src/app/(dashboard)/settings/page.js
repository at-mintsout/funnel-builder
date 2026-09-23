"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("tracking"); // Default tab abhi ke liye tracking rakha hai
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States - Payments
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  
  // Form States - Tracking (NEW)
  const [fbPixel, setFbPixel] = useState("");
  const [gaTracking, setGaTracking] = useState("");

  // Simulated User ID 
  const CURRENT_USER_ID = "demo-user-123"; 

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("razorpay_key_id, razorpay_secret, fb_pixel_id, ga_tracking_id")
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setRazorpayKey(data.razorpay_key_id || "");
          setRazorpaySecret(data.razorpay_secret || "");
          setFbPixel(data.fb_pixel_id || "");
          setGaTracking(data.ga_tracking_id || "");
        }
      } catch (err) {
        console.error("Error fetching settings:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: CURRENT_USER_ID, 
          razorpay_key_id: razorpayKey, 
          razorpay_secret: razorpaySecret,
          fb_pixel_id: fbPixel,
          ga_tracking_id: gaTracking,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); 

      if (error) throw error;
      alert("✅ Settings saved successfully!");
    } catch (err) {
      alert("❌ Error saving settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 font-bold text-slate-400">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Core Settings</h1>
        <p className="text-slate-500 mt-1">Manage your integrations, domains, and payment gateways.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR TABS */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {[
            { id: "payments", name: "💳 Payment Gateways" },
            { id: "tracking", name: "📈 Tracking & Pixels" },
            { id: "domains", name: "🌐 Custom Domains" },
            { id: "crm", name: "✉️ CRM Integrations" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-[#0f172a] text-white shadow-lg shadow-slate-900/20" 
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* TAB 1: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6 flex items-center justify-between">
                <span>Razorpay Setup</span>
                {razorpayKey && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-widest">Active</span>}
              </h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Key ID</label>
                  <input type="text" placeholder="rzp_live_xxxxxxxxxxxxxx" value={razorpayKey} onChange={(e) => setRazorpayKey(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Secret Key</label>
                  <input type="password" placeholder="••••••••••••••••••••••••" value={razorpaySecret} onChange={(e) => setRazorpaySecret(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all font-mono" />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70">{isSaving ? "Saving..." : "Save Payment Settings"}</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: TRACKING & ANALYTICS (NEW) */}
          {activeTab === "tracking" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Tracking & Analytics</h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-sm text-emerald-800 mb-6">
                  <strong>Tip:</strong> Enter your Pixel IDs below. We will automatically inject the optimized tracking code into your live funnels.
                </div>

                {/* Facebook Pixel */}
                <div className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold">f</div>
                    <label className="text-sm font-bold text-slate-700">Facebook Pixel ID</label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. 123456789012345" 
                    value={fbPixel}
                    onChange={(e) => setFbPixel(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Used for tracking pageviews and lead/purchase conversions.</p>
                </div>

                {/* Google Analytics 4 */}
                <div className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 bg-amber-500 text-white rounded flex items-center justify-center font-bold">G</div>
                    <label className="text-sm font-bold text-slate-700">Google Analytics (GA4) ID</label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. G-XXXXXXXXXX" 
                    value={gaTracking}
                    onChange={(e) => setGaTracking(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Measurement ID for universal tracking.</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70">
                    {isSaving ? "Saving scripts..." : "Save Tracking Codes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DUMMY STATES FOR OTHER TABS */}
          {activeTab !== "payments" && activeTab !== "tracking" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <span className="text-4xl mb-4">🚧</span>
              <h3 className="text-lg font-bold text-slate-700">Module Under Construction</h3>
              <p className="text-slate-500 text-sm mt-2">Next module loading soon...</p>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
