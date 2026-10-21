"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FunnelPublicPreviewRuntimeEngine() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-mono text-xs text-indigo-500 animate-pulse">Initializing Live Engine...</div>}>
      <PreviewCoreExecutionEngine />
    </Suspense>
  );
}

function PreviewCoreExecutionEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeId = searchParams.get("id");
  const activeStep = searchParams.get("step") || "landing";

  const [funnelData, setFunnelData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form (Lead) Data States
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Dynamically Load Razorpay Checkout Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (!activeId) {
      setLoading(false);
      return;
    }

    const fetchFunnel = async () => {
      try {
        const { data, error } = await supabase
          .from("funnels")
          .select("*")
          .eq("id", activeId)
          .maybeSingle();

        if (error) throw error;
        setFunnelData(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFunnel();
  }, [activeId]);

  // ==========================================
  // 💳 RAZORPAY SECURE PAYMENT HANDLER
  // ==========================================
  const handlePayment = async (dynamicAmount) => {
    setIsSubmitting(true);
    try {
      const paymentAmount = dynamicAmount ? parseInt(dynamicAmount) : 500;

      const response = await fetch("/payment-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount }), 
      });

      const order = await response.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TSvymNXmAY7Wpq",
        amount: order.amount,
        currency: order.currency,
        name: funnelData?.name || "Premium Checkout",
        description: "Secure Digital Product Purchase",
        order_id: order.id,
        handler: async function (response) {
          // Success hone par Thank You page par redirect karein
          router.push(`/preview?id=${activeId}&step=thankyou`);
        },
        prefill: {
          name: leadName || "Valued Customer",
          email: leadEmail || "customer@example.com",
        },
        theme: { color: "#0B1536" },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();

    } catch (err) {
      alert("Payment Failed or Cancelled: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 📝 LEAD SUBMIT & CRM SYNC HANDLER
  // ==========================================
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      alert("Please enter your Name and Email to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct insertion into Supabase 'leads' table
      const { error } = await supabase
        .from("leads")
        .insert([{ 
          funnel_id: activeId, 
          name: leadName, 
          email: leadEmail,
          status: "Lead",
          amount: 0
        }]);

      if (error) throw error;
      
      // Auto-routing based on current step
      if (activeStep === "landing") {
         router.push(`/preview?id=${activeId}&step=checkout`);
      } else if (activeStep === "checkout") {
         router.push(`/preview?id=${activeId}&step=thankyou`);
      } else {
         alert("Data submitted successfully!");
      }
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 🖥️ UI RENDERER
  // ==========================================
  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-sm font-bold text-slate-400 bg-[#f8fafc]">Loading Live Website Engine...</div>;
  if (!activeId || !funnelData) return <div className="min-h-screen flex items-center justify-center font-black text-2xl text-slate-300 bg-[#f8fafc]">404 - Funnel Not Found</div>;

  const canvasRows = funnelData.canvas_state?.[activeStep] || [];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center pb-20 overflow-x-hidden selection:bg-indigo-200">
      <div className="w-full max-w-5xl space-y-0">
        
        {canvasRows.length > 0 ? (
          canvasRows.map((row) => (
            <div key={row.id} className="flex gap-6 w-full flex-wrap md:flex-nowrap py-4 px-4 md:px-8">
              {row.columns.map((col) => (
                <div key={col.id} style={{ flexBasis: `${col.widthPercent}%`, flexGrow: 1 }} className="flex flex-col w-full min-w-[280px]">
                  {col.widgets.map((widget) => {
                    const globalStyles = {
                      color: widget.styles?.color || "inherit",
                      fontSize: widget.styles?.fontSize || "inherit",
                      textAlign: widget.styles?.textAlign || "left",
                      fontWeight: widget.styles?.fontWeight || "normal",
                      backgroundColor: widget.styles?.backgroundColor || "transparent",
                      paddingTop: widget.styles?.paddingTop || "0px",
                      paddingBottom: widget.styles?.paddingBottom || "0px",
                      paddingLeft: widget.styles?.paddingLeft || "0px",
                      paddingRight: widget.styles?.paddingRight || "0px",
                    };

                    const wType = widget.type;

                    return (
                      <div key={widget.id} style={globalStyles} className="w-full my-3">
                        
                        {/* 🌟 PRO WIDGET RENDERER */}
                        {(() => {
                          // 1. Text & Typography
                          if (["h1","h2","h3","h4","h5","h6"].includes(wType)) return <h2 className="m-0 leading-tight tracking-tight">{widget.content}</h2>;
                          if (wType === "paragraph") return <p className="m-0 leading-relaxed text-slate-600">{widget.content}</p>;
                          if (wType === "blockquote") return <blockquote className="border-l-4 border-indigo-500 pl-5 italic m-0 text-slate-700 bg-slate-50 py-3 rounded-r-lg">{widget.content}</blockquote>;
                          if (wType === "bullet_list") return <ul className="list-disc pl-5 m-0 text-left text-slate-600">{widget.content.split('\n').map((item, i) => <li key={i} className="mb-1">{item}</li>)}</ul>;
                          if (wType === "check_list") return <ul className="pl-2 m-0 text-left text-slate-700 space-y-2">{widget.content.split('\n').map((item, i) => <li key={i} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {item}</li>)}</ul>;
                          if (wType === "gradient_text") return <h2 style={{...globalStyles, background: 'linear-gradient(to right, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{widget.content}</h2>;
                          
                          // 2. Media & Visuals
                          if (wType === "image") return <div className="flex justify-center"><img src={widget.content} className="max-w-full h-auto rounded-xl shadow-md" alt="Visual" /></div>;
                          if (["video", "video_embed", "video_sales_letter"].includes(wType)) return <div className="aspect-video bg-black rounded-xl shadow-2xl overflow-hidden w-full border border-slate-200"><iframe className="w-full h-full" src={widget.content} allowFullScreen></iframe></div>;
                          
                          // 3. Marketing Elements
                          if (wType === "urgency_text") return <div className="font-bold border border-red-200 text-red-700 bg-red-50 py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 animate-pulse">🚨 {widget.content}</div>;
                          if (wType === "countdown_timer") return <div className="text-center font-mono font-black text-3xl text-red-600 bg-red-50 py-4 rounded-xl border border-red-100 shadow-sm">{widget.content} <span className="text-xs text-red-400 block uppercase tracking-widest mt-1">Time Remaining</span></div>;
                          if (wType === "confetti_trigger") return <div className="text-7xl text-center py-10 animate-bounce">🎉🎊🏆</div>;
                          if (wType === "trust_badges") return <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-b border-slate-100 py-3 my-4">🛡️ {widget.content}</div>;
                          if (wType === "testimonial_card") return <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm italic text-slate-600 text-center">"{widget.content}" <div className="mt-3 text-indigo-500 text-sm font-black not-italic">★★★★★</div></div>;
                          
                          // 4. Structural
                          if (wType === "spacer") return <div style={{ height: widget.styles?.verticalSpace || "40px" }}></div>;
                          if (wType === "divider") return <div style={{ borderTop: `${widget.styles?.thickness || "2px"} solid ${widget.styles?.color || "#e2e8f0"}`, margin: `${widget.styles?.verticalMargin || "24px"} 0` }}></div>;
                          
                          // 5. BUTTONS, FORMS & PAYMENT LOGIC
                          if (wType.includes("form") || wType.includes("checkout") || wType.includes("button") || wType === "razorpay_btn") {
                            
                            // If it's the specific Razorpay Checkout Button
                            if (wType === "razorpay_btn") {
                               const btnPrice = widget.pricing?.finalPrice || "499";
                               return (
                                <div className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md mx-auto w-full">
                                  <h3 className="font-black text-xl text-[#0B1536] text-center border-b border-slate-100 pb-4 mb-2">Secure Checkout</h3>
                                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-6 px-2">
                                    <span>Total Amount:</span>
                                    <span className="text-emerald-600 text-lg">₹{btnPrice}</span>
                                  </div>
                                  <button 
                                    onClick={() => handlePayment(btnPrice)} 
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:bg-emerald-500 hover:shadow-emerald-500/30 hover:-translate-y-1 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                                  >
                                    {isSubmitting ? "Processing..." : `🔒 Pay ₹${btnPrice} Securely`}
                                  </button>
                                  <div className="flex flex-col items-center gap-1 mt-3 opacity-60">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Secured by Razorpay</span>
                                    <span className="text-[10px] text-slate-400 font-medium">UPI • Credit Card • NetBanking</span>
                                  </div>
                                </div>
                               );
                            }

                            // Otherwise, it's a Standard Lead Form or CTA Button
                            return (
                              <div className="w-full max-w-md mx-auto">
                                <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 p-8 bg-white border border-slate-200 rounded-2xl shadow-2xl">
                                  <h3 className="font-black text-2xl text-[#0B1536] text-center mb-4">{widget.name || "Claim Your Offer"}</h3>
                                  
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" required className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none text-sm font-medium bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                                  </div>
                                  
                                  <div className="space-y-1 mt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" required className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none text-sm font-medium bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                                  </div>
                                  
                                  <button type="submit" disabled={isSubmitting} className="mt-4 w-full px-6 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-1 disabled:opacity-50 transition-all">
                                    {isSubmitting ? "Processing..." : (widget.content || "Continue to Next Step ➔")}
                                  </button>
                                  <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">Your information is 100% secure.</p>
                                </form>
                              </div>
                            );
                          }

                          // Fallback for unknown widgets
                          return <div className="p-3 border border-dashed border-slate-300 rounded bg-slate-50 text-slate-500 text-xs text-center">{widget.content}</div>;
                        })()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-slate-200 p-20 mt-10 rounded-3xl shadow-xl max-w-2xl mx-auto">
             <div className="text-6xl mb-6">🚧</div>
             <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-3">{activeStep} Page Empty</h2>
             <p className="text-slate-500 text-lg">You haven't designed this page yet. Go back to the builder, add some widgets to the <b>{activeStep}</b> step, and hit update.</p>
          </div>
        )}
      </div>
    </div>
  );
}
