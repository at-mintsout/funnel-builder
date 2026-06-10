"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicPreviewPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const funnelId = params.id;

  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false);

  // Core Funnel States
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [thanksMessage, setThanksMessage] = useState("");
  const [nextStepInstruction, setNextStepInstruction] = useState("");
  
  // Elementor-style Expanded States (JSON Storage)
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [features, setFeatures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Customer Form States (CRM)
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // 🔄 Fetch Funnel Data from Database
  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const { data, error } = await supabase
          .from("funnels")
          .select("*")
          .eq("id", funnelId)
          .single();

        if (data) {
          setHeadline(data.headline);
          setSubheadline(data.subheadline);
          setButtonText(data.button_text);
          setButtonColor(data.button_color);
          setProductName(data.product_name);
          setPrice(data.price);
          setPaymentUrl(data.payment_url || "");
          setThanksMessage(data.thanks_message);
          setNextStepInstruction(data.next_step_instruction);
          
          // Custom Layout Elements Mapping (With Fallback)
          setHeroImageUrl(data.hero_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80");
          setFeatures(Array.isArray(data.features) ? data.features : []);
          setTestimonials(Array.isArray(data.testimonials) ? data.testimonials : []);
        }
      } catch (error) {
        console.error("Error fetching funnel:", error);
      } finally {
        setLoading(false);
      }
    };
    if (funnelId) fetchFunnelData();
  }, [funnelId]);

  // 📈 CRM LEAD CAPTURE + AUTOMATIC EMAIL TRIGGER
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);

    try {
      // 1. CRM Lead Save
      const { error } = await supabase
        .from("leads")
        .insert([{ 
          name: customerName,
          email: customerEmail, 
          phone: customerPhone,
          funnel_id: funnelId,
          status: 'New'
        }]);

      if (error) throw error;

      // 2. Email Automation Trigger
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail,
            customerName,
            productName,
            thanksMessage: thanksMessage || "Thank you for joining us!"
          }),
        });
      } catch (emailErr) {
        console.error("Email Automation Error:", emailErr);
      }

      // 3. Go to Checkout
      setActiveStep("checkout");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLeadLoading(false);
    }
  };

  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      alert("Merchant has not set a payment link yet.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs">
        🌐 Rendering Premium Layout Matrix...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* 📄 STEP 1: DYNAMIC LANDING FUNNEL DESIGN */}
      {activeStep === "landing" && (
        <div className="w-full space-y-24 pb-20">
          
          {/* SECTION 1: HERO CONTAINER (Split Layout Elementor Design) */}
          <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                🔥 EXCLUSIVE LIMITED OFFER
              </span>
              <h1 className="text-4xl font-black md:text-6xl leading-tight text-white tracking-tight">
                {headline}
              </h1>
              <p className="text-slate-400 text-base md:text-lg max-w-lg leading-relaxed">
                {subheadline}
              </p>
            </div>

            {/* Lead Capture Box */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white text-center">Secure Your Spot Instantly</h3>
              <form onSubmit={handleLeadSubmit} className="space-y-3 text-left">
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Full Name</label>
                  <input type="text" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none text-white" required />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Email Address</label>
                  <input type="email" placeholder="john@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none text-white" required />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">WhatsApp / Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none text-white" required />
                </div>
                <button type="submit" disabled={leadLoading} className={`w-full text-white font-black py-4 rounded-xl text-sm mt-4 transition shadow-xl active:scale-[0.99] ${buttonColor}`}>
                  {leadLoading ? "Syncing Automation..." : buttonText}
                </button>
              </form>
            </div>
          </section>

          {/* SECTION 2: GRAPHIC/HERO BANNER COMPONENT */}
          {heroImageUrl && (
            <section className="max-w-5xl mx-auto px-6">
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video max-h-[450px]">
                <img src={heroImageUrl} alt="Preview Hero Graphic" className="w-full h-full object-cover" />
              </div>
            </section>
          )}

          {/* SECTION 3: FEATURES GRID COMPONENT */}
          {features.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 bg-slate-900/40 py-16 border-y border-slate-900">
              <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-2xl font-black md:text-4xl text-white">Why Smart Creators Choose Us</h2>
                <p className="text-slate-500 text-xs mt-2">Everything you need to scale up your production and workflows.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feat, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-indigo-500/30 transition group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-white mb-2">{feat.title || "Feature Title"}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{feat.desc || "Feature description text details."}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: SOCIAL PROOF / TESTIMONIALS COMPONENT */}
          {testimonials.length > 0 && (
            <section className="max-w-5xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-2xl font-black md:text-4xl text-white">Loved by Hundreds worldwide</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((test, index) => (
                  <div key={index} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <p className="text-slate-300 text-xs italic leading-relaxed">"{test.review || "This platform changed how I build single-page funnels!"}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 border border-slate-700 uppercase">
                        {test.name ? test.name[0] : "U"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{test.name || "Happy User"}</p>
                        <p className="text-[10px] text-indigo-400 font-medium">{test.role || "SaaS Founder"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* 💳 STEP 2: SECURE CHECKOUT PREVIEW CARD */}
      {activeStep === "checkout" && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 text-white">🔒 Secure Checkout</h2>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">{productName}</p>
                <p className="text-xs text-slate-500">Instant Automated Access</p>
              </div>
              <p className="text-xl font-black text-indigo-400">₹{price}</p>
            </div>
            <button onClick={handlePaymentRedirect} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-xl text-sm transition shadow-lg active:scale-[0.98]">
              Pay Securely via Credit Card / UPI (₹{price}) ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
}