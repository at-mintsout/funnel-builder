"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("crm"); // Testing ke liye CRM open rakha hai
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [razorpayKey, setRazorpayKey] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [fbPixel, setFbPixel] = useState("");
  const [gaTracking, setGaTracking] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  
  // NEW: CRM States
  const [webhookUrl, setWebhookUrl] = useState("");
  const [mailchimpKey, setMailchimpKey] = useState("");

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
      // 1. Agar Custom Domain save ho raha hai, toh pehle Vercel API ko bhejein
      if (activeTab === "domains" && customDomain) {
        const vercelRes = await fetch("/api/domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: customDomain }),
        });
        const vercelData = await vercelRes.json();
        if (vercelData.error && !vercelData.error.message?.includes("already exists")) {
           throw new Error("Vercel Domain Error: " + vercelData.error.message);
        }
      }

      // 2. Database me sab kuch save karein
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
      alert("✅ Settings & Integrations saved successfully!");
    } catch (err) {
      alert("❌ Error: " + err.message);
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
          
          {/* TAB 4: CRM & WEBHOOKS (NEW) */}
          {activeTab === "crm" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">CRM & Automation</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm text-purple-800 mb-6">
                  <strong>Automation:</strong> Send leads automatically to Zapier, Pabbly Connect, or your email autoresponder.
                </div>

                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🔗</span>
                    <label className="text-sm font-bold text-slate-700">Global Webhook URL (Zapier/Pabbly)</label>
                  </div>
                  <input type="url" placeholder="https://hooks.zapier.com/hooks/catch/..." value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono" />
                </div>

                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📧</span>
                    <label className="text-sm font-bold text-slate-700">Mailchimp API Key (Optional)</label>
                  </div>
                  <input type="password" placeholder="xxxxxxxxxxxxxxxxxxxxxxxx-us21" value={mailchimpKey} onChange={(e) => setMailchimpKey(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-mono" />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-all">{isSaving ? "Saving..." : "Save CRM Settings"}</button>
                </div>
              </form>
            </div>
          )}

          {/* BAQI TABS (Payments, Tracking, Domains) YAHAN RAHENGE */}
          {activeTab === "domains" && (
             <div className="animate-fadeIn">
               <h2 className="text-xl font-bold text-[#0f172a] border-b pb-4 mb-6">Custom Domain</h2>
               <div className="bg-slate-900 text-white p-6 rounded-xl mb-6 shadow-lg">
                 <h3 className="text-sm font-black uppercase text-indigo-400 mb-2">DNS Configuration Setup</h3>
                 <p className="text-xs text-slate-400 mb-4">Add this CNAME record inside your domain provider's DNS settings.</p>
                 <table className="w-full text-left text-xs font-mono">
                   <thead className="bg-slate-950 text-slate-500">
                     <tr><th className="px-4 py-2">Type</th><th className="px-4 py-2">Name / Host</th><th className="px-4 py-2">Value / Target</th></tr>
                   </thead>
                   <tbody>
                     <tr><td className="px-4 py-3 font-bold text-emerald-400">CNAME</td><td className="px-4 py-3">offer</td><td className="px-4 py-3 font-bold text-white">cname.vercel-dns.com</td></tr>
                   </tbody>
                 </table>
               </div>
               <form onSubmit={handleSaveSettings} className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-2">Your Connected Domain</label>
                   <input type="text" placeholder="offer.yourdomain.com" value={customDomain} onChange={(e) => setCustomDomain(e.target.value.toLowerCase().replace("https://", "").replace("http://", "").trim())} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none font-mono text-indigo-700 font-bold" />
                 </div>
                 <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-all">{isSaving ? "Connecting to Vercel..." : "Connect Domain"}</button>
               </form>
             </div>
          )}
          
          {/* (Note: Payments aur Tracking wale blocks pichle message jaise same rahenge, jagah bachane ke liye hide kiye hain. Aap apne pichle code wale blocks yahan rakh lena ya isi ko copy paste kar lena testing ke liye) */}
        </div>
      </div>
    </div>
  );
}