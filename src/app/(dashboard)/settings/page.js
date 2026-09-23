"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("domains"); // Default tab abhi Domains rakha hai testing ke liye
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [fbPixel, setFbPixel] = useState("");
  const [gaTracking, setGaTracking] = useState("");
  const [customDomain, setCustomDomain] = useState(""); // NEW: Domain State

  // Simulated User ID 
  const CURRENT_USER_ID = "demo-user-123"; 

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("razorpay_key_id, razorpay_secret, fb_pixel_id, ga_tracking_id, custom_domain")
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setRazorpayKey(data.razorpay_key_id || "");
          setRazorpaySecret(data.razorpay_secret || "");
          setFbPixel(data.fb_pixel_id || "");
          setGaTracking(data.ga_tracking_id || "");
          setCustomDomain(data.custom_domain || "");
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
          custom_domain: customDomain,
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
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Razorpay Setup</h2>
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
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-all">Save Payments</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: TRACKING */}
          {activeTab === "tracking" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Tracking & Analytics</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Facebook Pixel ID</label>
                  <input type="text" placeholder="123456789012345" value={fbPixel} onChange={(e) => setFbPixel(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Google Analytics (GA4) ID</label>
                  <input type="text" placeholder="G-XXXXXXXXXX" value={gaTracking} onChange={(e) => setGaTracking(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono" />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-all">Save Tracking</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CUSTOM DOMAINS (NEW) */}
          {activeTab === "domains" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6 flex justify-between items-center">
                <span>Custom Domain</span>
                {customDomain && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest font-bold">Configured</span>}
              </h2>
              
              <div className="bg-slate-900 text-white p-6 rounded-xl mb-6 shadow-lg">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">DNS Configuration Setup</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">To connect your custom domain (like <code className="text-emerald-400 bg-slate-800 px-1 py-0.5 rounded">offer.yourbrand.com</code>), add the following CNAME record inside your domain provider's DNS settings (GoDaddy, Hostinger, Namecheap, etc).</p>
                
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-500">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Type</th>
                        <th className="px-4 py-2 font-semibold">Name / Host</th>
                        <th className="px-4 py-2 font-semibold">Value / Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      <tr>
                        <td className="px-4 py-3 font-bold text-emerald-400">CNAME</td>
                        <td className="px-4 py-3">offer <span className="text-slate-500 text-[10px]">(or your subdomain)</span></td>
                        <td className="px-4 py-3 font-bold text-white">cname.vercel-dns.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Your Connected Domain</label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
                    <span className="bg-slate-100 text-slate-500 px-4 py-3 font-mono text-sm border-r border-slate-200 flex items-center">https://</span>
                    <input 
                      type="text" 
                      placeholder="offer.yourdomain.com" 
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value.toLowerCase().replace("https://", "").replace("http://", "").trim())}
                      className="w-full px-4 py-3 bg-white text-sm outline-none font-mono text-indigo-700 font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Do not include https:// in the input field above.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70">
                    {isSaving ? "Saving Domain..." : "Connect Domain"}
                  </button>
                  <button type="button" onClick={() => window.open(`http://${customDomain}`, '_blank')} disabled={!customDomain} className="bg-white border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center gap-2">
                    Test Link ➔
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: CRM */}
          {activeTab === "crm" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <span className="text-4xl mb-4">🚧</span>
              <h3 className="text-lg font-bold text-slate-700">CRM Module Under Construction</h3>
              <p className="text-slate-500 text-sm mt-2">Final module loading soon...</p>
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