"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FunnelPublicPreviewRuntimeEngine() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-400 font-mono text-xs">Loading Preview...</div>}>
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
    // Razorpay Checkout Script Dynamically Load karenge
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

  // Razorpay Payment Handler (Updated to /payment-api)
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
        theme: {
          color: "#0d216b",
        },
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
      
      setLeadName("");
      setLeadEmail("");
      
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">Loading Funnel Canvas...</div>;
  if (!activeId || !funnelData) return <div className="min-h-screen flex items-center justify-center">Funnel Not Found</div>;

  const canvasRows = funnelData.canvas_state?.[activeStep] || [];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl space-y-6">
        
        {canvasRows.length > 0 ? (
          canvasRows.map((row) => (
            <div key={row.id} className="flex gap-4 w-full flex-wrap md:flex-nowrap">
              {row.columns.map((col) => (
                <div key={col.id} style={{ width: `${col.widthPercent}%` }} className="flex flex-col gap-4 w-full min-w-[250px]">
                  {col.widgets.map((widget) => {
                    
                    if (widget.type === "heading") return <h1 key={widget.id} className="font-black text-3xl" style={widget.styles}>{widget.content}</h1>;
                    if (widget.type === "paragraph") return <p key={widget.id} className="text-slate-600" style={widget.styles}>{widget.content}</p>;
                    
                    if (widget.type === "form" || widget.type === "button" || widget.type.includes("form")) {
                      return (
                        <div key={widget.id} className="flex flex-col gap-3 p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
                          {activeStep === "checkout" ? (
                            <>
                              <h3 className="font-bold text-lg text-[#0d216b]">Complete Your Order</h3>
                              <p className="text-sm text-slate-600">Amount to pay: ₹500</p>
                              <button 
                                onClick={handlePayment} 
                                disabled={isSubmitting}
                                className="mt-4 px-6 py-3 bg-green-600 text-white font-black uppercase tracking-wide rounded-md shadow hover:bg-green-700 disabled:opacity-50"
                              >
                                {isSubmitting ? "Processing..." : "Pay Now (₹500)"}
                              </button>
                            </>
                          ) : (
                            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                              <label className="text-xs font-bold text-slate-600 uppercase">Full Name</label>
                              <input type="text" placeholder="Enter your name" className="px-4 py-2 border rounded-md outline-none text-sm" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                              <label className="text-xs font-bold text-slate-600 uppercase mt-2">Primary Email</label>
                              <input type="email" placeholder="Enter your email" className="px-4 py-2 border rounded-md outline-none text-sm" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                              <button type="submit" disabled={isSubmitting} className="mt-4 px-6 py-3 bg-[#0d216b] text-white font-black uppercase tracking-wide rounded-md shadow hover:bg-blue-900 disabled:opacity-50">
                                {isSubmitting ? "Processing..." : (widget.content || "Submit & Next Step")}
                              </button>
                            </form>
                          )}
                        </div>
                      );
                    }

                    return <div key={widget.id}>{widget.content}</div>;
                  })}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center bg-slate-100 p-10 rounded-lg">
             <h2 className="text-xl font-bold text-slate-500 uppercase">{activeStep} PAGE NOT DESIGNED YET</h2>
             <p className="text-sm mt-2">Please add some widgets to the {activeStep} page in the builder and hit publish.</p>
          </div>
        )}

      </div>
    </div>
  );
}