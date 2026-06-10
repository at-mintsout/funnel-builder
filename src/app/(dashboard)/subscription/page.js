"use client";
import { useState } from "react";

export default function UserSubscriptionTierModule() {
  const [currentTier, setCurrentTier] = useState("Growth Plan Tier");

  const applicationPlansMatrix = [
    { name: "Starter Core Box", price: "₹0", desc: "For entry level sandbox automation testing arrays.", active: false },
    { name: "Growth Plan Tier", price: "₹2,999/mo", desc: "Unlimited active funnel runtimes with Razorpay pipelines.", active: true },
    { name: "Enterprise Protocol Cluster", price: "Custom Call", desc: "For massive cross-organization scaling clusters.", active: false },
  ];

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
            <button disabled={plan.active} className={`w-full font-black text-[10px] tracking-widest uppercase py-3.5 rounded-xl border mt-6 transition-all ${plan.active ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white shadow-md"}`}>
              {plan.active ? "Current Deployment Active" : "Trigger Tier Upgrade Protocol ➔"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}