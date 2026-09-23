"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("domains");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [fbPixel, setFbPixel] = useState("");
  const [gaTracking, setGaTracking] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [mailchimpKey, setMailchimpKey] = useState("");

  // ✨ NEW: Modal State for CNAME Instructions Popup
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [savedDomainName, setSavedDomainName] = useState("");

  const CURRENT_USER_ID = "demo-user-123"; 

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setRazorpayKey(data.razorpay_key_id || "");
          setRazorpaySecret(data.razorpay_secret || "");
          setFbPixel(data.fb_pixel_id || "");
          setGaTracking(data.ga_tracking_id || "");
          setCustomDomain(data.custom_domain || "");
          setWebhookUrl(data.webhook_url || "");
          setMailchimpKey(data.mailchimp_key || "");
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
      // 1. Agar Custom Domain save ho raha hai, toh Vercel API ko bhejein
      if (activeTab === "domains" && customDomain) {
        const vercelRes = await fetch("/api/domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: customDomain }),
        });
        
        const contentType = vercelRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const vercelData = await vercelRes.json();
          if (vercelData.error && !vercelData.error.message?.includes("already exists")) {
             throw new Error("Vercel Domain Error: " + (vercelData.error.message || JSON.stringify(vercelData.error)));
          }
        } else {
          throw new Error("API Route error or not found.");
        }
      }

      // 2. Database Save
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: CURRENT_USER_ID, 
          razorpay_key_id: razorpayKey, 
          razorpay_secret: razorpaySecret,
          fb_pixel_id: fbPixel,
          ga_tracking_id: gaTracking,
          custom_domain: customDomain,
          webhook_url: webhookUrl,
          mailchimp_key: mailchimpKey,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); 

      if (error) throw error;

      // Agar Domain tab par the toh popup open karo
      if (activeTab === "domains" && customDomain) {
        setSavedDomainName(customDomain);
        setIsDomainModalOpen(true);
      } else {
        alert("✅ Settings saved successfully!");
      }

    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 font-bold text-slate-400">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
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
            { id: "crm", name: "✉️ CRM & Webhooks" },
          ].map((tab) => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${ activeTab === tab.id ? "bg-[#0f172a] text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-50 border" }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* TAB: DOMAINS */}
          {activeTab === "domains" && (
             <div className="animate-fadeIn">
               <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6 flex justify-between items-center">
                 <span>Custom Domain Setup</span>
                 {customDomain && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest font-bold">Configured</span>}
               </h2>

               <form onSubmit={handleSaveSettings} className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Enter Your Domain / Subdomain</label>
                   <input 
                     type="text" 
                     placeholder="offer.yourdomain.com" 
                     value={customDomain} 
                     onChange={(e) => setCustomDomain(e.target.value.toLowerCase().replace("https://", "").replace("http://", "").trim())} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none font-mono text-indigo-700 font-bold focus:bg-white focus:border-indigo-500" 
                     required
                   />
                   <p className="text-[10px] text-slate-400 mt-2">Example: offer.dloanoffers.com or sub.yourbrand.com</p>
                 </div>

                 <div className="pt-4 border-t border-slate-100 flex gap-4">
                   <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70">
                     {isSaving ? "Connecting to Vercel..." : "Connect Domain & Get DNS Records"}
                   </button>
                 </div>
               </form>
             </div>
          )}

          {/* TAB: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Razorpay Setup</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Key ID</label>
                  <input type="text" placeholder="rzp_live_xxxxxxxxxxxxxx" value={razorpayKey} onChange={(e) => setRazorpayKey(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Razorpay Secret Key</label>
                  <input type="password" placeholder="••••••••••••••••••••••••" value={razorpaySecret} onChange={(e) => setRazorpaySecret(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                </div>
                <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500">Save Payments</button>
              </form>
            </div>
          )}

          {/* TAB: TRACKING */}
          {activeTab === "tracking" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Tracking & Analytics</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Facebook Pixel ID</label>
                  <input type="text" placeholder="123456789012345" value={fbPixel} onChange={(e) => setFbPixel(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Google Analytics ID</label>
                  <input type="text" placeholder="G-XXXXXXXXXX" value={gaTracking} onChange={(e) => setGaTracking(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                </div>
                <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500">Save Tracking</button>
              </form>
            </div>
          )}

          {/* TAB: CRM */}
          {activeTab === "crm" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">CRM & Webhooks</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Global Webhook URL</label>
                  <input type="url" placeholder="https://hooks.zapier.com/..." value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                </div>
                <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500">Save CRM</button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          🌟 DNS CNAME INSTRUCTIONS POPUP MODAL
         ========================================================================= */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden flex flex-col">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider m-0">Domain Connected Successfully!</h3>
                  <p className="text-[10px] text-slate-400 font-mono m-0">{savedDomainName}</p>
                </div>
              </div>
              <button onClick={() => setIsDomainModalOpen(false)} className="text-slate-400 hover:text-white font-black text-lg">✕</button>
            </div>

            <div className="p-6 space-y-4 bg-slate-50 text-left font-sans">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-lg">
                ✨ Vercel handshake complete! Now add the following DNS record to your domain provider (GoDaddy/Hostinger/Cloudflare).
              </div>

              <div className="bg-white border rounded-xl overflow-hidden shadow-inner">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-500 border-b">
                    <tr>
                      <th className="px-4 py-2 font-bold">Type</th>
                      <th className="px-4 py-2 font-bold">Host / Name</th>
                      <th className="px-4 py-2 font-bold">Target / Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 font-bold text-indigo-600">CNAME</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{savedDomainName.includes('.') ? savedDomainName.split('.')[0] : 'offer'}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">cname.vercel-dns.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Note: DNS propagation can take anywhere from 5 minutes to 2 hours depending on your registrar. Once active, your funnels will load directly under this domain.
              </p>
            </div>

            <div className="bg-slate-100 border-t p-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("cname.vercel-dns.com");
                  alert("📋 Target CNAME copied to clipboard!");
                }} 
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
              >
                Copy CNAME Target
              </button>
              <button 
                onClick={() => setIsDomainModalOpen(false)} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-lg transition-all shadow"
              >
                Got It, Close Modal
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
}