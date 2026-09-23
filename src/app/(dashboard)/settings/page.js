"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");

  // Simulated User ID (Jab actual Auth lagayenge tab isko Supabase Auth se replace karenge)
  const CURRENT_USER_ID = "demo-user-123"; 

  // Page load hote hi database se saved keys fetch karna
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("razorpay_key_id, razorpay_secret")
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setRazorpayKey(data.razorpay_key_id || "");
          setRazorpaySecret(data.razorpay_secret || "");
        }
      } catch (err) {
        console.error("Error fetching settings:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Keys ko database mein save ya update karna
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Upsert: Agar data pehle se hai toh update karega, nahi hai toh naya banayega
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: CURRENT_USER_ID, 
          razorpay_key_id: razorpayKey, 
          razorpay_secret: razorpaySecret,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); // user_id ke basis par check karega

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
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
              </h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 mb-6">
                  <strong>Note:</strong> Jab aapke funnel par koi purchase karega, toh payment seedha in API keys se jude Razorpay account mein jayegi.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Key ID</label>
                  <input 
                    type="text" 
                    placeholder="rzp_live_xxxxxxxxxxxxxx" 
                    value={razorpayKey}
                    onChange={(e) => setRazorpayKey(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Secret Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••••••••••" 
                    value={razorpaySecret}
                    onChange={(e) => setRazorpaySecret(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isSaving ? "Saving securely..." : "Save Payment Settings"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DUMMY STATES FOR OTHER TABS */}
          {activeTab !== "payments" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <span className="text-4xl mb-4">🚧</span>
              <h3 className="text-lg font-bold text-slate-700">Module Under Construction</h3>
              <p className="text-slate-500 text-sm mt-2">Hum isko step-by-step integrate karenge. Abhi Payments par focus hai.</p>
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