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

  // Core Funnel States
  const [headline, setHeadline] = useState("Apna Mahaan Offer Yahan Likhein!");
  const [subheadline, setSubheadline] = useState("Ek aisi line jo customer ko majboor kar de product khareedne par.");
  const [buttonText, setButtonText] = useState("Join Now ➔");
  const [buttonColor, setButtonColor] = useState("bg-indigo-600");
  const [productName, setProductName] = useState("Premium SaaS Masterclass");
  const [price, setPrice] = useState("999");
  const [paymentUrl, setPaymentUrl] = useState("https://rzp.io/l/example");
  const [thanksMessage, setThanksMessage] = useState("Aapka Bohot Bohot Shukriya!");
  const [nextStepInstruction, setNextStepInstruction] = useState("Humne access link aapke email par bhej diya hai.");
  
  // Elementor Expansion Layout States
  const [heroImageUrl, setHeroImageUrl] = useState("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80");
  const [features, setFeatures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

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
        setPaymentUrl(funnelData.payment_url || "");
        setThanksMessage(funnelData.thanks_message);
        setNextStepInstruction(funnelData.next_step_instruction);
        setSavedFunnelId(funnelData.id);
        
        // Custom Matrix Load
        setHeroImageUrl(funnelData.hero_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80");
        setFeatures(Array.isArray(funnelData.features) ? funnelData.features : []);
        setTestimonials(Array.isArray(funnelData.testimonials) ? funnelData.testimonials : []);

        // Fetch Leads
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

  // CRM State Control Dropdown
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

  // Add & Remove Elementor Dynamic Features Row Array Helper
  const addFeatureRow = () => setFeatures([...features, { title: "", desc: "" }]);
  const updateFeatureRow = (index, key, val) => {
    const updated = [...features];
    updated[index][key] = val;
    setFeatures(updated);
  };
  const removeFeatureRow = (index) => setFeatures(features.filter((_, i) => i !== index));

  // Add & Remove Testimonials Row Helper
  const addTestimonialRow = () => setTestimonials([...testimonials, { name: "", role: "", review: "" }]);
  const updateTestimonialRow = (index, key, val) => {
    const updated = [...testimonials];
    updated[index][key] = val;
    setTestimonials(updated);
  };
  const removeTestimonialRow = (index) => setTestimonials(testimonials.filter((_, i) => i !== index));

  // Upsert Master Funnel Payload Function
  const saveFunnelToDatabase = async () => {
    setLoading(true);
    try {
      const funnelData = {
        name: "My Expanded Layout Funnel",
        headline,
        subheadline,
        button_text: buttonText,
        button_color: buttonColor,
        product_name: productName,
        price,
        payment_url: paymentUrl,
        thanks_message: thanksMessage,
        next_step_instruction: nextStepInstruction,
        hero_image_url: heroImageUrl,
        features,
        testimonials,
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
        alert("🎉 Funnel Premium Elementor Engine Blueprint Saved!");
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

  if (fetchLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-mono">🔄 Compiling Visual Grid Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col md:flex-row">
      
      {/* LEFT PANEL CONTROLS */}
      <div className="w-full md:w-96 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between overflow-y-auto h-screen sticky top-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-black tracking-wider text-indigo-400">FUNNEL CRAFT V2</h2>
            <button onClick={handleLogout} className="text-[10px] text-rose-400 hover:text-rose-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">Logout</button>
          </div>

          {/* SIDEBAR TABS VIEW SELECTOR */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex flex-col gap-1">
            <button onClick={() => setActiveStep("landing")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "landing" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>📄 1. Landing Layout Builder</button>
            <button onClick={() => setActiveStep("checkout")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "checkout" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>💳 2. Checkout Controls</button>
            <button onClick={() => setActiveStep("thanks")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "thanks" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>🎉 3. Thank You Engine</button>
            <button onClick={() => setActiveStep("crm")} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${activeStep === "crm" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-amber-400"}`}>💼 CRM Pipeline Board ({leadsList.length})</button>
          </div>

          <hr className="border-slate-800" />

          {/* DYNAMIC LEFT CONTROLS EXPANSION MATRIX */}
          {activeStep === "landing" && (
            <div className="space-y-5 pb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hero Main Headline</label>
                <textarea value={headline} onChange={(e) => setHeadline(e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sub-Headline Context</label>
                <textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lead Submit CTA Text</label>
                <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">🖼️ Hero Banner Image URL</label>
                <input type="url" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>

              {/* DYNAMIC D&D ELEMENTOR COMPONENT: FEATURES ACCORDION FIELD */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">🌟 Features Matrix Block</label>
                  <button onClick={addFeatureRow} className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded hover:bg-indigo-600 hover:text-white transition">+ Add Section</button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {features.map((feat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2 relative">
                      <button onClick={() => removeFeatureRow(idx)} className="absolute top-2 right-2 text-rose-400 text-[10px] hover:underline">Delete</button>
                      <input type="text" placeholder="Feature Title" value={feat.title || ""} onChange={(e) => updateFeatureRow(idx, "title", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                      <input type="text" placeholder="Short description..." value={feat.desc || ""} onChange={(e) => updateFeatureRow(idx, "desc", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* DYNAMIC COMPONENT: TESTIMONIALS SECTION BLOCK */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">💬 Social Proof Testimonials</label>
                  <button onClick={addTestimonialRow} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-600 hover:text-white transition">+ Add Review</button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {testimonials.map((test, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2 relative">
                      <button onClick={() => removeTestimonialRow(idx)} className="absolute top-2 right-2 text-rose-400 text-[10px] hover:underline">Delete</button>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input type="text" placeholder="User Name" value={test.name || ""} onChange={(e) => updateTestimonialRow(idx, "name", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                        <input type="text" placeholder="Role (SaaS...)" value={test.role || ""} onChange={(e) => updateTestimonialRow(idx, "role", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-400" />
                      </div>
                      <input type="text" placeholder="Review comment..." value={test.review || ""} onChange={(e) => updateTestimonialRow(idx, "review", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === "checkout" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Price (INR)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">🔌 Payment Gateway Link</label>
                <input type="url" placeholder="Razorpay, Stripe..." value={paymentUrl} onChange={(e) => setPaymentUrl(e.target.value)} className="w-full bg-slate-900 border border-amber-500/30 text-amber-300 rounded-lg p-2 text-xs" />
              </div>
            </div>
          )}

          {activeStep === "thanks" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Thank You Title</label>
                <input type="text" value={thanksMessage} onChange={(e) => setThanksMessage(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Next Step Instruction</label>
                <textarea value={nextStepInstruction} onChange={(e) => setNextStepInstruction(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs" />
              </div>
            </div>
          )}
        </div>

        {/* WORKSPACE SAVE FOOTER SECTION */}
        <div className="space-y-3 bg-slate-950 pt-4 border-t border-slate-900">
          {savedFunnelId && (
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center">
              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">🔗 Live Public Link</p>
              <a href={`/preview/${savedFunnelId}`} target="_blank" className="text-[10px] text-emerald-400 hover:underline block break-all font-mono">/preview/{savedFunnelId}</a>
            </div>
          )}
          <button onClick={saveFunnelToDatabase} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold text-xs text-slate-950 shadow-lg transition">
            {loading ? "Saving Schema..." : "💾 Save Full Funnel Blueprint"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL LIVE MATRIX CANVAS SCREEN */}
      <div className="flex-1 bg-slate-900 p-8 flex items-center justify-center relative overflow-y-auto h-screen">
        
        {activeStep === "crm" ? (
          /* 💼 PIPELINE CRM RENDERING COMPONENT BLOCK */
          <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 text-left my-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
              <div>
                <h2 className="text-xl font-black text-amber-400">💼 Pipeline CRM Engine</h2>
                <p className="text-xs text-slate-500 mt-1">Manage, segment, and close your incoming customers.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
                {["All", "New", "Interested", "Closed", "Lost"].map((seg) => (
                  <button key={seg} onClick={() => setSelectedSegment(seg)} className={`px-3 py-1.5 rounded-lg font-bold transition ${selectedSegment === seg ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}>{seg}</button>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No active leads found in this segment pipeline slot.</div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800"><th className="p-4">Customer Info</th><th className="p-4">WhatsApp / Phone</th><th className="p-4">Pipeline Status</th><th className="p-4 text-right">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{lead.name || "No Name"}</p>
                          <p className="text-xs text-slate-400">{lead.email}</p>
                        </td>
                        <td className="p-4 font-mono">{lead.phone || "No Phone"}</td>
                        <td className="p-4">
                          <select value={lead.status || "New"} onChange={(e) => handleStatusChange(lead.id, e.target.value)} className="bg-slate-950 border border-slate-800 text-xs px-2 py-1.5 rounded-lg font-bold text-amber-400 focus:outline-none">
                            <option value="New">🟢 New Lead</option><option value="Interested">⚡ Interested</option><option value="Closed">🏆 Closed (Won)</option><option value="Lost">❌ Lost</option>
                          </select>
                        </td>
                        <td className="p-4 text-right font-mono text-slate-500">{lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : "Now"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* 🖥️ DYNAMIC LAYOUT WORKSPACE PREVIEW MODULE CONTAINER */
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-8 my-auto overflow-y-auto max-h-[85vh] no-scrollbar">
            {activeStep === "checkout" ? (
              <div className="text-left space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-800 pb-3 text-white">💳 Secure Checkout Preview</h2>
                <div className="bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-800">
                  <div><p className="text-xs font-bold text-white">{productName}</p><p className="text-[10px] text-slate-500">Gateway Route Enabled</p></div>
                  <p className="text-md font-black text-indigo-400">₹{price}</p>
                </div>
                <button className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs">Pay Securely ➔</button>
              </div>
            ) : activeStep === "thanks" ? (
              <div className="space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-md">✓</div>
                <h1 className="text-xl font-black text-white">{thanksMessage}</h1>
                <p className="text-slate-400 text-xs">{nextStepInstruction}</p>
              </div>
            ) : (
              /* LANDING EXPANDED PREVIEW MATRIX CORE BLOCK */
              <div className="space-y-6 text-left">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">HERO SCREEN INTERFACE</span>
                <h1 className="text-2xl font-black text-white tracking-tight leading-snug">{headline}</h1>
                <p className="text-slate-400 text-xs leading-relaxed">{subheadline}</p>
                <button className={`w-full py-3 rounded-xl text-xs font-bold text-white tracking-wide ${buttonColor}`}>{buttonText}</button>
                
                {heroImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 mt-4 aspect-video bg-slate-900 max-h-48">
                    <img src={heroImageUrl} alt="Visual Workspace Banner" className="w-full h-full object-cover" />
                  </div>
                )}
                
                {features.length > 0 && (
                  <div className="pt-4 border-t border-slate-900 space-y-2">
                    <p className="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Features Section Grid ({features.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {features.map((f, i) => (
                        <div key={i} className="bg-slate-900 p-2 rounded-lg border border-slate-800"><p className="text-xs font-bold text-white truncate">{f.title || "Feature..."}</p></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}