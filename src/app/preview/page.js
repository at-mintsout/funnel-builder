"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FunnelPublicPreviewRuntimeEngine() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-indigo-500">Loading Preview Engine...</div>}>
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
    // Razorpay Checkout Script Dynamically Load
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

  // Razorpay Payment Handler (Aapka original logic)
  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/payment-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }), 
      });

      const order = await response.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: "rzp_test_TSvymNXmAY7Wpq",
        amount: order.amount,
        currency: order.currency,
        name: "FunnelCraft Checkout",
        description: "Test Product Payment",
        order_id: order.id,
        handler: async function (response) {
          alert("🎉 Payment Successful! Payment ID: " + response.razorpay_payment_id);
          router.push(`/preview?id=${activeId}&step=thankyou`);
        },
        prefill: {
          name: leadName || "Customer",
          email: leadEmail || "customer@example.com",
        },
        theme: { color: "#0d216b" },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();

    } catch (err) {
      alert("Payment Failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lead Submit karne ka Function (Landing Page ke liye)
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      alert("Please enter both Name and Email!");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("leads")
        .insert([{ funnel_id: activeId, name: leadName, email: leadEmail }]);

      if (error) throw error;
      
      if (activeStep === "landing") {
         router.push(`/preview?id=${activeId}&step=checkout`);
      } else {
         alert("🎉 Success!");
      }
      
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">Loading Funnel Canvas...</div>;
  if (!activeId || !funnelData) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Funnel Not Found</div>;

  const canvasRows = funnelData.canvas_state?.[activeStep] || [];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center py-10 px-4 overflow-x-hidden">
      <div className="w-full max-w-5xl space-y-6">
        
        {canvasRows.length > 0 ? (
          canvasRows.map((row) => (
            <div key={row.id} className="flex gap-4 w-full flex-wrap md:flex-nowrap">
              {row.columns.map((col) => (
                <div key={col.id} style={{ width: `${col.widthPercent}%` }} className="flex flex-col w-full min-w-[250px] p-2">
                  {col.widgets.map((widget) => {
                    // Extract styles exactly as they are in the builder
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
                      <div key={widget.id} style={globalStyles} className="w-full my-2">
                        {/* 🌟 MERGED SMART RENDERER */}
                        {(() => {
                          // 1. Text Nodes
                          if (["h1","h2","h3","h4","h5","h6","heading","sub_heading"].includes(wType)) return <h2 className="m-0 leading-tight">{widget.content}</h2>;
                          if (wType === "paragraph") return <p className="m-0 leading-relaxed">{widget.content}</p>;
                          if (wType === "blockquote") return <blockquote className="border-l-4 border-indigo-500 pl-4 italic m-0">{widget.content}</blockquote>;
                          if (wType === "code_block") return <pre className="p-3 bg-slate-900 text-emerald-400 rounded text-[11px] overflow-x-auto">{widget.content}</pre>;
                          if (wType === "urgency_text") return <p className="font-bold border-l-4 border-red-500 pl-3 bg-red-50 py-2">{widget.content}</p>;
                          if (wType === "confetti_trigger") return <div className="text-6xl text-center py-6">🎉🎊🎉</div>;
                          if (wType === "trust_badges") return <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-b py-2">{widget.content}</div>;
                          
                          // 2. Media Nodes (Yeh raw link ko video/image mein convert karega)
                          if (wType === "image") return <div className="flex justify-center"><img src={widget.content} className="max-w-full h-auto rounded shadow-sm" alt="Visual" /></div>;
                          if (["video", "video_embed", "youtube_embed"].includes(wType)) return <div className="aspect-video bg-black rounded shadow overflow-hidden w-full"><iframe className="w-full h-full" src={widget.content} allowFullScreen></iframe></div>;
                          
                          // 3. Utilities
                          if (wType === "spacer") return <div style={{ height: widget.styles?.verticalSpace || "40px" }}></div>;
                          if (wType === "divider") return <div style={{ borderTop: `${widget.styles?.thickness || "2px"} solid ${widget.styles?.color || "#e2e8f0"}`, margin: `${widget.styles?.verticalMargin || "20px"} 0` }}></div>;
                          
                          // 4. INTERACTIVE FORMS & CHECKOUT (Aapke logic par based UI)
                          if (wType.includes("form") || wType.includes("checkout") || wType.includes("button") || wType === "add_to_cart") {
                            return (
                              <div className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-xl shadow-lg max-w-md mx-auto w-full">
                                {activeStep === "checkout" ? (
                                  <>
                                    <h3 className="font-black text-xl text-[#0d216b] text-center border-b pb-3 mb-2">Secure Checkout</h3>
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-4">
                                      <span>Total Amount:</span>
                                      <span className="text-green-600">₹500.00</span>
                                    </div>
                                    <button 
                                      onClick={handlePayment} 
                                      disabled={isSubmitting}
                                      className="w-full px-6 py-4 bg-green-600 text-white font-black uppercase tracking-wide rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                                    >
                                      {isSubmitting ? "Processing Securely..." : "🔒 Pay ₹500 Now"}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 mt-2">Powered by Razorpay Secure 128-bit Encryption</p>
                                  </>
                                ) : (
                                  <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
                                    <h3 className="font-bold text-lg text-[#0d216b] text-center mb-2">{widget.name || "Sign Up Now"}</h3>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                                      <input type="text" placeholder="Enter your full name" required className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 transition-colors" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                      <input type="email" placeholder="Enter your best email" required className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 transition-colors" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="mt-2 w-full px-6 py-4 bg-[#0d216b] text-white font-black uppercase tracking-wide rounded-lg shadow-md hover:bg-blue-900 disabled:opacity-50 transition-all">
                                      {isSubmitting ? "Saving..." : (widget.content || "Submit & Next Step ➔")}
                                    </button>
                                  </form>
                                )}
                              </div>
                            );
                          }

                          // 5. Fallback (Agar koi widget match na ho)
                          return <div className="p-2 border border-dashed border-slate-300 text-slate-400 text-xs text-center">{widget.content}</div>;
                        })()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center bg-slate-50 border border-slate-200 p-16 rounded-2xl shadow-inner">
             <div className="text-4xl mb-4">🚧</div>
             <h2 className="text-2xl font-black text-slate-700 uppercase tracking-wider">{activeStep} PAGE NOT DESIGNED YET</h2>
             <p className="text-slate-500 mt-2">Please add widgets to the {activeStep} step in your builder and hit publish to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}