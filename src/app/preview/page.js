"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// 🌀 1. Main Component with Suspense Guard Rails
export default function FunnelPublicPreviewRuntimeEngine() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-indigo-400 font-mono text-xs space-y-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="tracking-widest uppercase text-[10px] text-slate-500">
            Initializing Safe Route Sandbox Context...
          </span>
        </div>
      }
    >
      <PreviewCoreExecutionEngine />
    </Suspense>
  );
}

// 🛡️ 2. Core Operational Engine Logic
function PreviewCoreExecutionEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL se ?id=xxxx ya ?client_id=xxxx ko catch kar raha hai
  const activeId = searchParams.get("id") || searchParams.get("client_id");

  const [funnelData, setFunnelData] = useState(null);
  const [activePageState, setActivePageState] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [debugError, setDebugError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    console.log("🔍 Catching Query Param ID:", activeId);
    if (!activeId) {
      setLoading(false);
      return;
    }

    const fetchTargetFunnelSchemaArrays = async () => {
      try {
        // First try fetching by 'id', if empty fallback to 'client_id'
        let { data, error } = await supabase
          .from("funnels")
          .select("*")
          .eq("id", activeId)
          .maybeSingle();

        if (!data) {
          const res = await supabase
            .from("funnels")
            .select("*")
            .eq("client_id", activeId)
            .maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (error) {
          setDebugError(error.message);
          throw error;
        }

        setFunnelData(data);
      } catch (err) {
        console.error("Critical Engine Router Failure:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTargetFunnelSchemaArrays();
  }, [activeId]);

  const normalizePayloadArray = (dataField) => {
    if (!dataField) return [];
    if (Array.isArray(dataField)) return dataField;
    try {
      return JSON.parse(dataField);
    } catch (e) {
      return [];
    }
  };

  const handleLinkActionExecution = (elementNode) => {
    if (!elementNode) return;
    const actionType = elementNode.linkActionType || "next_page";
    switch (actionType) {
      case "next_page":
        if (activePageState === "landing") setActivePageState("checkout");
        else if (activePageState === "checkout") setActivePageState("thanks");
        break;
      case "checkout_trigger":
        setActivePageState("checkout");
        break;
      case "thankyou_redirect":
        setActivePageState("thanks");
        break;
      case "external_url":
        if (elementNode.customTargetUrl && elementNode.customTargetUrl.startsWith("http")) {
          window.location.href = elementNode.customTargetUrl;
        } else {
          alert("Invalid redirection address.");
        }
        break;
      default:
        setActivePageState("checkout");
        break;
    }
  };

  // 🚀 LEAD & CHECKOUT SUBMISSION ENGINE
  const handleCustomerCheckoutProcess = async (e) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill in all required parameters (Name, Email, Phone).");
      return;
    }

    setProcessingOrder(true);

    try {
      // 1. Save Lead Data directly into Supabase 'leads' table
      const { error: leadError } = await supabase.from("leads").insert([
        {
          client_id: activeId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
      ]);

      if (leadError) {
        console.warn("Lead storage warning:", leadError.message);
      }

      // 2. Custom External Payment URL Redirect (If configured)
      if (funnelData?.payment_url && funnelData.payment_url.startsWith("http")) {
        window.location.href = funnelData.payment_url;
        return;
      }

      // 3. Razorpay Gateway Trigger (If active)
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (window.Razorpay && razorpayKey && razorpayKey !== "rzp_test_YOUR_KEY_HERE") {
        const options = {
          key: razorpayKey,
          amount: Number(funnelData?.price || "999") * 100,
          currency: "INR",
          name: funnelData?.name || "Secure Gateway",
          description: funnelData?.product_name || "Order Package SKU",
          handler: function (response) {
            alert("Payment Successful!");
            setActivePageState("thanks");
            setProcessingOrder(false);
          },
          prefill: { name: customerName, email: customerEmail, contact: customerPhone },
          theme: { color: "#6366f1" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // 4. Default Direct Submission Success Page Redirection
      alert("🎉 Details submitted successfully!");
      setActivePageState("thanks");
    } catch (err) {
      console.error("Lead Storage Error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  const compileCSSStylesMatrix = (elem) => {
    if (!elem || !elem.styles) return {};
    const s = elem.styles;
    let finalTextColor =
      s.textColor === "textDark" ? "#1e293b" : s.textColor === "primary" ? "#6366f1" : s.textColor;
    let resolvedBgColor =
      s.backgroundColorSolid === "primary"
        ? "#6366f1"
        : s.backgroundColorSolid === "accent"
        ? "#10b981"
        : s.backgroundColorSolid;
    let shadowValue =
      s.boxShadowPreset === "sm"
        ? "0 2px 8px rgba(0,0,0,0.04)"
        : s.boxShadowPreset === "md"
        ? "0 10px 30px -10px rgba(99, 102, 241, 0.15)"
        : s.boxShadowPreset === "lg"
        ? "0 20px 50px -12px rgba(15, 23, 42, 0.12)"
        : "none";

    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSizeDesktop,
      fontWeight: s.fontWeight,
      color: finalTextColor,
      textAlign: s.textAlign,
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
      paddingLeft: s.paddingLeft,
      paddingRight: s.paddingRight,
      marginTop: s.marginTop,
      marginBottom: s.marginBottom,
      borderRadius: s.borderRadius,
      borderStyle: s.borderStyle,
      borderWidth: s.borderWidth,
      borderColor: s.borderColor,
      boxShadow: shadowValue,
      backgroundColor: s.backgroundType === "solid" ? resolvedBgColor : undefined,
      backgroundImage:
        s.backgroundType === "gradient"
          ? s.backgroundGradientStr
          : s.backgroundType === "image" && elem.mediaUrl
          ? `url(${elem.mediaUrl})`
          : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-mono text-xs text-slate-400 space-y-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Assembling Campaign Components Array Modules...</span>
      </div>
    );
  }

  if (!activeId || !funnelData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-xl mb-4 text-red-500">
          🚫
        </div>
        <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          Preview Configuration Error
        </h1>
        <p className="text-xs text-slate-400 font-bold mt-1 max-w-xs leading-relaxed">
          {!activeId
            ? "URL contains no ?id= parameter tokens."
            : `Funnel data could not be retrieved from Supabase.`}
        </p>
        {debugError && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 font-mono text-[10px] rounded border border-red-200">
            {debugError}
          </div>
        )}
        <button
          onClick={() => router.push("/builder")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-md"
        >
          ⬅️ Return to Studio
        </button>
      </div>
    );
  }

  let activePageSchemaArray =
    activePageState === "landing"
      ? normalizePayloadArray(funnelData.page_json)
      : activePageState === "checkout"
      ? normalizePayloadArray(funnelData.checkout_json)
      : normalizePayloadArray(funnelData.thanks_json);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased flex flex-col items-center justify-start py-10 px-4 md:px-8">
      <div className="w-full max-w-4xl space-y-6">
        {activePageSchemaArray.map((element) => (
          <div key={element.id} style={compileCSSStylesMatrix(element)} className="w-full text-left">
            {(() => {
              switch (element.type) {
                case "h1":
                  return <h1 className="font-black tracking-tight leading-tight text-3xl">{element.content}</h1>;
                case "h2":
                  return <h2 className="font-extrabold tracking-tight leading-snug text-2xl">{element.content}</h2>;
                case "paragraph":
                  return <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{element.content}</p>;
                case "image":
                  return element.mediaUrl ? (
                    <img
                      src={element.mediaUrl}
                      alt="Campaign Asset"
                      className="w-full h-auto object-cover rounded-2xl shadow-sm"
                    />
                  ) : null;
                case "primary_button":
                  return (
                    <button
                      onClick={() => handleLinkActionExecution(element)}
                      className="w-full font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md text-white"
                      style={{ backgroundColor: "#6366f1" }}
                    >
                      {element.content}
                    </button>
                  );
                case "pricing_table":
                  return (
                    <div className="w-full max-w-md mx-auto bg-white border-2 border-indigo-600 p-8 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
                      <div className="text-[8px] font-black text-white bg-indigo-600 px-3 py-1 absolute top-4 right-4 rounded-full uppercase tracking-widest">
                        OFFER VALID
                      </div>
                      <h4 className="font-black text-sm tracking-widest text-slate-900 uppercase pt-2">
                        {element.content}
                      </h4>
                      <div className="text-5xl font-mono font-black text-indigo-600">
                        ₹{funnelData.price || "999"}
                      </div>
                      {activePageState === "checkout" ? (
                        <form onSubmit={handleCustomerCheckoutProcess} className="space-y-3 text-left pt-2">
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
                            placeholder="Full Name"
                          />
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
                            placeholder="Email Address"
                          />
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
                            placeholder="Phone Number"
                          />
                          <button
                            type="submit"
                            disabled={processingOrder}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-4 rounded-xl uppercase tracking-widest mt-2 transition-all disabled:opacity-50"
                          >
                            {processingOrder
                              ? "Processing..."
                              : `💸 Submit & Proceed (₹${funnelData.price || "999"})`}
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => handleLinkActionExecution(element)}
                          className="w-full text-white font-black text-xs py-4 rounded-xl uppercase tracking-widest shadow-md"
                          style={{ backgroundColor: "#6366f1" }}
                        >
                          Secure Checkout Now
                        </button>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}