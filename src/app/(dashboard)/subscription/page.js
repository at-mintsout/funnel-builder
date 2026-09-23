"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserSubscriptionTierModule() {
  const [currentTier, setCurrentTier] = useState("Growth Plan Tier");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const CURRENT_USER_ID = "demo-user-123"; // Aapke user ki ID ya auth session id

  // 1. Load active plan from Supabase on mount
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("active_plan")
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (data && data.active_plan) {
          setCurrentTier(data.active_plan);
        }
      } catch (err) {
        console.error("Error fetching plan:", err.message);
      }
    };
    fetchUserPlan();

    // Load Razorpay Script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const applicationPlansMatrix = [
    { 
      id: "starter", 
      name: "Starter Core Box", 
      price: "₹0", 
      rawPrice: 0,
      desc: "For entry level sandbox automation testing arrays.", 
      active: currentTier === "Starter Core Box" 
    },
    { 
      id: "growth", 
      name: "Growth Plan Tier", 
      price: "₹2,999/mo", 
      rawPrice: 2999,
      desc: "Unlimited active funnel runtimes with Razorpay pipelines.", 
      active: currentTier === "Growth Plan Tier" 
    },
    { 
      id: "enterprise", 
      name: "Enterprise Protocol Cluster", 
      price: "Custom Call", 
      rawPrice: 9999,
      desc: "For massive cross-organization scaling clusters.", 
      active: currentTier === "Enterprise Protocol Cluster" 
    },
  ];

  // Function to update plan in Supabase Database automatically
  const updatePlanInDatabase = async (planName) => {
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: CURRENT_USER_ID, 
          active_plan: planName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setCurrentTier(planName);
    } catch (err) {
      console.error("Database upgrade error:", err.message);
      alert("⚠️ Payment successful, but failed to sync plan with database: " + err.message);
    }
  };

  // Direct Frontend Razorpay Checkout Handler with Auto-DB Upgrade
  const handleUpgrade = async (plan) => {
    if (plan.rawPrice === 0) {
      await updatePlanInDatabase(plan.name);
      alert(`✅ Switched to ${plan.name} successfully!`);
      return;
    }

    setLoadingPlan(plan.name);

    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Check your internet connection.");
      }

      const options = {
        key: "rzp_test_TSvymNXmAY7Wpq", // Aap apni test/live key yahan use kar sakte hain
        amount: plan.rawPrice * 100, // Amount in paise
        currency: "INR",
        name: "FunnelForge Subscriptions",
        description: `Upgrade protocol to ${plan.name}`,
        handler: async function (response) {
          // 🚀 AUTOMATIC DATABASE UPGRADE ON SUCCESSFUL PAYMENT
          await updatePlanInDatabase(plan.name);
          alert(`🎉 Payment Verified! Deployment automatically upgraded to ${plan.name}. Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Sandeep Kumar",
          email: "kumar.sandeepchoudhary01@gmail.com",
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment Gateway Error: " + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-950 to-indigo-950 border border-indigo-900/40 rounded-3xl p-6 shadow-xl">
        <span className="text-[9px] bg-indigo-500 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-widest">ACTIVE PACKAGE LICENSE</span>
        <h3 className="font-black text-2xl tracking-tight text-white mt-3 mb-1">{currentTier}</h3>
        <p className="text-xs text-indigo-300/70 font-semibold max-w-md">Your subscription pipeline will automatically re-verify and bill processing tokens safely on the next epoch node interval schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {applicationPlansMatrix.map((plan, index) => (
          <div key={index} className={`border rounded-3xl p-6 flex flex-col justify-between transition-all ${plan.active ? "bg-slate-950 border-indigo-500 shadow-xl shadow-indigo-600/5 scale-[101%]" : "bg-slate-950/60 border-slate-800"}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-300 tracking-wider">{plan.name}</span>
                {plan.active && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase tracking-widest">ACTIVE</span>}
              </div>
              <div className="text-3xl font-mono font-black text-white">{plan.price}</div>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{plan.desc}</p>
            </div>
            
            <button 
              disabled={plan.active || loadingPlan === plan.name}
              onClick={() => handleUpgrade(plan)}
              className={`w-full font-black text-[10px] tracking-widest uppercase py-3.5 rounded-xl border mt-6 transition-all ${
                plan.active 
                ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white shadow-md active:scale-95"
              }`}
            >
              {loadingPlan === plan.name ? "Opening Gateway..." : plan.active ? "Current Deployment Active" : "Trigger Tier Upgrade Protocol ➔"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}