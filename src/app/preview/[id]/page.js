"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicPreviewPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const funnelId = params.id;

  const [activeStep, setActiveStep] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false);

  // Funnel Content States
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [thanksMessage, setThanksMessage] = useState("");
  const [nextStepInstruction, setNextStepInstruction] = useState("");

  // Customer Form States (CRM & Lead Capture)
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
      // Step 1: Database ke 'leads' table mein CRM data safe karo
      const { error } = await supabase
        .from("leads")
        .insert([{ 
          name: customerName,
          email: customerEmail, 
          phone: customerPhone,
          funnel_id: funnelId,
          status: 'New' // pipeline starting stage
        }]);

      if (error) throw error;

      // Step 2: 🚀 AUTOMATION: Resend Email API Route ko background mein hit karo
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: customerEmail,
            customerName: customerName,
            productName: productName,
            thanksMessage: thanksMessage || "Thank you for joining us!"
          }),
        });
      } catch (emailErr) {
        // Agar email api fail bhi ho, toh checkout na ruke
        console.error("Email Automation Error:", emailErr);
      }

      // Step 3: Agle screen par bhej do (Checkout Step)
      setActiveStep("checkout");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLeadLoading(false);
    }
  };

  // 💳 Redirect to Razorpay / Stripe Link
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
        🌐 Connecting Automation Core...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      
      {/* 📄 STEP 1: LANDING PAGE & LEAD CAPTURE FORM */}
      {activeStep === "landing" && (
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">EXCLUSIVE OFFER</span>
          <h1 className="text-3xl font-black md:text-5xl leading-tight text-white">{headline}</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">{subheadline}</p>
          
          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto space-y-3 text-left pt-4">
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Full Name</label>
              <input type="text" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Email Address</label>
              <input type="email" placeholder="john@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Phone / WhatsApp Number</label>
              <input type="tel" placeholder="+91 98765 43210" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" required />
            </div>
            <button type="submit" disabled={leadLoading} className={`w-full text-white font-black py-4 rounded-xl text-sm mt-4 transition shadow-xl ${buttonColor}`}>
              {leadLoading ? "Syncing Automation..." : buttonText}
            </button>
          </form>
        </div>
      )}

      {/* 💳 STEP 2: SECURE CHECKOUT PAGE */}
      {activeStep === "checkout" && (
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4">🔒 Secure Checkout</h2>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">{productName}</p>
              <p className="text-xs text-slate-500">Instant Automated Access</p>
            </div>
            <p className="text-xl font-black text-indigo-400">₹{price}</p>
          </div>
          <button onClick={handlePaymentRedirect} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-xl text-sm transition shadow-lg">
            Pay Securely via Credit Card / UPI (₹{price}) ➔
          </button>
        </div>
      )}

    </div>
  );
}