"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CompleteEnterpriseBuilderStudio() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const fontUploadRef = useRef(null);
  
  // 🎛️ Architecture Cluster Active Tabs, Layout Models & Core Device States
  const [activeTab, setActiveTab] = useState("builder"); // "funnels" | "builder" | "crm" | "brand_settings"
  const [currentEditingPage, setCurrentEditingPage] = useState("landing"); // "landing" | "checkout" | "thanks"
  const [currentDeviceMode, setCurrentDeviceMode] = useState("desktop"); // "desktop" | "mobile"
  const [selectedElementId, setSelectedElementId] = useState(null);

  // ⚙️ Account Licenses State Machines & Transmissions Indicators
  const [funnelsList, setFunnelsList] = useState([]);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeFunnelId, setActiveFunnelId] = useState(null);

  // 📋 Inbound Target CRM Analytics Matrices Logs
  const [leadsList, setLeadsList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("All");

  // 🎨 High Premium Global Brand Aesthetics Identity Definition (Unified Canvas Nodes)
  const [globalBrandColors, setGlobalBrandColors] = useState({
    primary: "#6366f1", // Elegant Royal Indigo Accent
    secondary: "#0f172a", // Deep Midnight Dark Slate Background Matrix Base
    accent: "#10b981", // High Conversion Emerald Mint Mint Green
    surface: "#ffffff", // Pure Ceramic White Surface Element Cards
    background: "#f8fafc", // Cool Soft Light Slate Canvas Background
    textDark: "#1e293b", // Aggressive Dark Charcoal for High Contrast Readability
    textMuted: "#64748b" // Subtle Cool Grey for supporting descriptions layers
  });

  // 📋 Active Pipeline General Properties Settings
  const [funnelName, setFunnelName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("999");
  const [paymentUrl, setPaymentUrl] = useState("");

  // 👑 Multi-Page Schema Data Object Containers
  const [landingJson, setLandingJson] = useState([]);
  const [checkoutJson, setCheckoutJson] = useState([]);
  const [thanksJson, setThanksJson] = useState([]);

  // 🅰️ Custom Vector Fonts Registries Stack
  const [customFontsRegistry, setCustomFontsRegistry] = useState([]);

  // ⚙️ Element Structure Blueprint Factory Map Node Generator
  const getInitialSchemaData = (type) => {
    return {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: type === "primary_button" ? "🔥 Get Instant Access Now" : type === "h1" ? "Transform Your Business Potential With One Complete Automated Engine" : type === "h2" ? "Why High-Performance Organizations Rely On Our System Blueprint" : type === "image" ? "" : "Premium structural editable content text slice configuration asset data holder node template copy.",
      subcontent: "Supporting sub-text layer copy variable field.",
      mediaUrl: "",
      
      // Dynamic Redirections Routing Core Engine Assets (New Core Logic Added)
      linkActionType: "next_page", // "next_page" | "external_url" | "checkout_trigger" | "thankyou_redirect"
      customTargetUrl: "https://",
      
      // Responsive Device Visibilities Layers Nodes
      hideOnDesktop: false,
      hideOnMobile: false,

      // Animation Motion Engines Tokens
      entranceAnimation: "none", // "none" | "animate-fade-in" | "animate-slide-left" | "animate-zoom-in"
      
      styles: {
        // Advanced Custom Fine Typography Metrics Map Array
        fontFamily: "inherit",
        fontSizeDesktop: type === "h1" ? "48px" : type === "h2" ? "32px" : type === "primary_button" ? "15px" : "16px",
        fontSizeMobile: type === "h1" ? "28px" : type === "h2" ? "22px" : type === "primary_button" ? "14px" : "14px",
        fontWeight: type.startsWith("h") || type.includes("button") ? "800" : "400",
        letterSpacing: type.startsWith("h") ? "-1px" : "0px",
        lineHeight: "1.4",
        wordSpacing: "0px",
        textColor: type === "primary_button" ? "#ffffff" : "textDark", // Dynamic Map Keys
        textAlign: "left", // "left" | "center" | "right" | "justify"
        
        // Complex Text Shaders and Borders Processing
        textShadow: "none", 
        textStrokeWidth: "0px",
        textStrokeColor: "#000000",
        textBlendMode: "normal",

        // Flexible Layout Structural Matrix Properties
        displayType: "block", // "block" | "flex" | "grid"
        flexDirection: "column", 
        flexAlignItems: "stretch",
        flexJustifyContent: "flex-start",
        gridColumnsCount: "1",
        
        // Box Model Properties System Slices (Padding and Margins Dimensions)
        paddingTop: type === "primary_button" ? "14px" : "12px", 
        paddingBottom: type === "primary_button" ? "14px" : "12px", 
        paddingLeft: type === "primary_button" ? "28px" : "12px", 
        paddingRight: type === "primary_button" ? "28px" : "12px",
        marginTop: "0px", 
        marginBottom: "16px", 
        marginLeft: "0px", 
        marginRight: "0px",
        zIndex: "1",

        // Backdrop Core Surfaces, Vectors Filters & Graphic Masks
        backgroundType: type === "primary_button" ? "solid" : "transparent", 
        backgroundColorSolid: type === "primary_button" ? "primary" : "#ffffff", // Primary maps to global palette hex values
        backgroundGradientStr: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        backgroundOverlayColor: "rgba(0,0,0,0)",
        shapeDividerType: "none", 

        // Vector Geometries Outer Curves & Shadows Properties
        borderRadius: type === "primary_button" ? "12px" : "0px",
        borderStyle: "none", 
        borderWidth: "1px",
        borderColor: "#e2e8f0",
        boxShadowPreset: type === "primary_button" ? "md" : "none", 

        // Live States Hover Interactions Variables Matrix
        hoverTextColor: "#ffffff",
        hoverBgColor: "accent", 
        hoverScale: "100" 
      }
    };
  };

  const normalizePayloadArray = (dataField) => {
    if (!dataField) return [];
    if (Array.isArray(dataField)) return dataField;
    try { return JSON.parse(dataField); } catch(e) { return []; }
  };

  // 🔄 Bootstrapping Initialization Network Handlers
  useEffect(() => {
    const bootstrapStudioCore = async () => {
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      if (user.user_metadata?.is_premium === true) {
        setIsPremiumUser(true);
      }

      await refreshFunnelsFeed(user.id);
      setFetchLoading(false);
    };
    bootstrapStudioCore();
  }, [router]);

  const refreshFunnelsFeed = async (uid) => {
    try {
      const { data, error } = await supabase.from("funnels").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (error) throw error;
      setFunnelsList(data || []);
      
      const { data: leadsData } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (leadsData) setLeadsList(leadsData);
    } catch (err) { console.error("Database Framework Critical Fault Exception:", err.message); }
  };

  const mountFunnelToCanvasWorkspace = (funnelInstance) => {
    setActiveFunnelId(funnelInstance.id);
    setFunnelName(funnelInstance.name || "Untitled Funnel Platform Workspace");
    setProductName(funnelInstance.product_name || "Premium Automation Course Package");
    setPrice(funnelInstance.price || "999");
    setPaymentUrl(funnelInstance.payment_url || "");
    
    const extractedLanding = normalizePayloadArray(funnelInstance.page_json);
    const extractedCheckout = normalizePayloadArray(funnelInstance.checkout_json);
    const extractedThanks = normalizePayloadArray(funnelInstance.thanks_json);

    setLandingJson(extractedLanding.length ? extractedLanding : [getInitialSchemaData("h1"), getInitialSchemaData("paragraph"), getInitialSchemaData("primary_button")]);
    setCheckoutJson(extractedCheckout.length ? extractedCheckout : [getInitialSchemaData("h2"), getInitialSchemaData("pricing_table")]);
    setThanksJson(extractedThanks.length ? extractedThanks : [getInitialSchemaData("h2"), getInitialSchemaData("paragraph")]);
    
    setSelectedElementId(null);
    setActiveTab("builder");
  };

  const handleCreateNewFunnelRequest = async () => {
    if (funnelsList.length >= 2 && !isPremiumUser) {
      setShowPaywallModal(true);
      return;
    }

    setLoading(true);
    const defaultStructure = {
      name: `Premium Growth Pipeline #${funnelsList.length + 1}`,
      product_name: "High Ticket Digital Matrix Suite",
      price: "1499",
      payment_url: "",
      user_id: userId,
      page_json: [getInitialSchemaData("h1"), getInitialSchemaData("paragraph"), getInitialSchemaData("primary_button")],
      checkout_json: [getInitialSchemaData("h2"), getInitialSchemaData("pricing_table")],
      thanks_json: [getInitialSchemaData("h2"), getInitialSchemaData("paragraph")]
    };

    try {
      const { data, error } = await supabase.from("funnels").insert([defaultStructure]).select();
      if (error) throw error;
      await refreshFunnelsFeed(userId);
      if (data?.[0]) mountFunnelToCanvasWorkspace(data[0]);
    } catch (err) { alert("Pipeline allocation allocation error: " + err.message); }
    finally { setLoading(false); }
  };

  const getActiveTargetPageJsonArray = () => {
    if (currentEditingPage === "landing") return landingJson;
    if (currentEditingPage === "checkout") return checkoutJson;
    return thanksJson;
  };

  const syncActiveTargetPageJsonArray = (updatedArray) => {
    if (currentEditingPage === "landing") setLandingJson(updatedArray);
    else if (currentEditingPage === "checkout") setCheckoutJson(updatedArray);
    else setThanksJson(updatedArray);
  };

  const insertComponentToActiveCanvas = (type) => {
    const currentArray = getActiveTargetPageJsonArray();
    const generatedNode = getInitialSchemaData(type);
    syncActiveTargetPageJsonArray([...currentArray, generatedNode]);
    setSelectedElementId(generatedNode.id);
  };

  const updateElementAttribute = (id, property, targetValue) => {
    const currentArray = getActiveTargetPageJsonArray();
    const optimizedMapping = currentArray.map((el) => el.id === id ? { ...el, [property]: targetValue } : el);
    syncActiveTargetPageJsonArray(optimizedMapping);
  };

  const updateNestedElementStyle = (id, styleKey, styleValue) => {
    const currentArray = getActiveTargetPageJsonArray();
    const optimizedMapping = currentArray.map((el) => {
      if (el.id === id) {
        return { ...el, styles: { ...el.styles, [styleKey]: styleValue } };
      }
      return el;
    });
    syncActiveTargetPageJsonArray(optimizedMapping);
  };

  const moveElementOrder = (index, direction) => {
    const currentArray = [...getActiveTargetPageJsonArray()];
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === currentArray.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const placeholderValue = currentArray[index];
    currentArray[index] = currentArray[targetIndex];
    currentArray[targetIndex] = placeholderValue;
    syncActiveTargetPageJsonArray(currentArray);
  };

  const executeDeviceMediaIngestion = async (event) => {
    const targetFile = event.target.files?.[0];
    if (!targetFile || !selectedElementId) return;
    setUploadingFile(true);
    try {
      const fileExtension = targetFile.name.split(".").pop();
      const allocatedPathUri = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExtension}`;
      const { error } = await supabase.storage.from("funnel-media").upload(allocatedPathUri, targetFile, { cacheControl: "3600", upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("funnel-media").getPublicUrl(allocatedPathUri);
      updateElementAttribute(selectedElementId, "mediaUrl", publicUrl);
    } catch (err) { alert("Media Upload Execution Fault Sequence Exception: " + err.message); }
    finally { setUploadingFile(false); }
  };

  const executeCustomFontIngestion = async (event) => {
    const targetFontFile = event.target.files?.[0];
    if (!targetFontFile) return;
    try {
      const fontNameClean = targetFontFile.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "");
      const reader = new FileReader();
      reader.onload = function(e) {
        const fontDataUrl = e.target.result;
        const newUserFontEntry = new FontFace(fontNameClean, `url(${fontDataUrl})`);
        newUserFontEntry.load().then(function(loadedFace) {
          document.fonts.add(loadedFace);
          setCustomFontsRegistry([...customFontsRegistry, fontNameClean]);
          alert(`🎉 Custom Asset Font "${fontNameClean}" registered successfully!`);
        });
      };
      reader.readAsDataURL(targetFontFile);
    } catch(err) { alert("Font Ingestion Module Parsing Error: " + err.message); }
  };

  const handleSubscriptionUpgrade = () => {
    if (!window.Razorpay) { alert("Razorpay runtime modules gateway unavailable. Re-attempting connection execution."); return; }
    const options = {
      key: "rzp_test_YOUR_KEY_HERE",
      amount: 499900,
      currency: "INR",
      name: "FunnelCraft Studio Pro Plan",
      description: "Infinite Enterprise Architecture Development License Token",
      handler: async function (response) {
        try {
          setLoading(true);
          const { error } = await supabase.auth.updateUser({ data: { is_premium: true } });
          if (error) throw error;
          setIsPremiumUser(true);
          setShowPaywallModal(false);
          alert("👑 Subscription Node Confirmed! Account Escalated to Infinite Tier Pipeline Access.");
        } catch (err) { alert("Database Metadata Token Synchronization Exception: " + err.message); }
        finally { setLoading(false); }
      },
      theme: { color: globalBrandColors.primary }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const dispatchComprehensiveCanvasToCloud = async () => {
    setLoading(true);
    try {
      const comprehensiveUnifiedPayload = {
        name: funnelName,
        product_name: productName,
        price,
        payment_url: paymentUrl,
        user_id: userId,
        page_json: landingJson,
        checkout_json: checkoutJson,
        thanks_json: thanksJson
      };
      if (activeFunnelId) comprehensiveUnifiedPayload.id = activeFunnelId;
      const { error } = await supabase.from("funnels").upsert([comprehensiveUnifiedPayload]);
      if (error) throw error;
      alert("🚀 Master Multi-Page Object Blueprints Injected Safely into Supabase Clusters Core Database!");
      await refreshFunnelsFeed(userId);
    } catch (err) { alert("Transmission Hub Fault Error Exception: " + err.message); }
    finally { setLoading(false); }
  };

  const activeSelectedElement = getActiveTargetPageJsonArray().find(el => el.id === selectedElementId);

  // 🎨 Complex CSS Style Compile Handler Matrix
  const compileAppliedCSSStylesMatrix = (elem) => {
    if (!elem || !elem.styles) return {};
    const s = elem.styles;
    
    // Resolve dynamic text color token mappings
    let finalTextColor = s.textColor;
    if (globalBrandColors[s.textColor]) finalTextColor = globalBrandColors[s.textColor];

    const finalFontSize = currentDeviceMode === "desktop" ? s.fontSizeDesktop : s.fontSizeMobile;

    let shadowValue = "none";
    if (s.boxShadowPreset === "sm") shadowValue = "0 2px 8px rgba(0,0,0,0.04)";
    else if (s.boxShadowPreset === "md") shadowValue = "0 10px 30px -10px rgba(99, 102, 241, 0.15), 0 1px 3px rgba(0,0,0,0.05)";
    else if (s.boxShadowPreset === "lg") shadowValue = "0 20px 50px -12px rgba(15, 23, 42, 0.12)";
    else if (s.boxShadowPreset === "inset") shadowValue = "inset 0 4px 12px rgba(0,0,0,0.06)";

    let textShadowStr = "none";
    if (s.textShadow === "soft") textShadowStr = "2px 2px 10px rgba(15, 23, 42, 0.1)";
    else if (s.textShadow === "hard") textShadowStr = "3px 3px 0px rgba(99, 102, 241, 0.2)";

    let resolvedBgColor = s.backgroundColorSolid;
    if (globalBrandColors[s.backgroundColorSolid]) resolvedBgColor = globalBrandColors[s.backgroundColorSolid];

    const cssObject = {
      fontFamily: s.fontFamily,
      fontSize: finalFontSize,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      lineHeight: s.lineHeight,
      wordSpacing: s.wordSpacing,
      color: finalTextColor,
      textAlign: s.textAlign,
      textShadow: textShadowStr,
      WebkitTextStrokeWidth: s.textStrokeWidth,
      WebkitTextStrokeColor: s.textStrokeColor,
      mixBlendMode: s.textBlendMode,

      display: s.displayType,
      flexDirection: s.flexDirection,
      alignItems: s.flexAlignItems,
      justifyContent: s.flexJustifyContent,
      gridTemplateColumns: s.displayType === "grid" ? `repeat(${s.gridColumnsCount}, minmax(0, 1fr))` : "none",
      gap: "20px",

      paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, paddingLeft: s.paddingLeft, paddingRight: s.paddingRight,
      marginTop: s.marginTop, marginBottom: s.marginBottom, marginLeft: s.marginLeft, marginRight: s.marginRight,
      zIndex: s.zIndex,

      borderRadius: s.borderRadius,
      borderStyle: s.borderStyle,
      borderWidth: s.borderWidth,
      borderColor: s.borderColor,
      boxShadow: shadowValue,
      position: "relative",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    };

    if (s.backgroundType === "solid") cssObject.backgroundColor = resolvedBgColor;
    else if (s.backgroundType === "gradient") cssObject.backgroundImage = s.backgroundGradientStr;
    else if (s.backgroundType === "image" && elem.mediaUrl) {
      cssObject.backgroundImage = `url(${elem.mediaUrl})`;
      cssObject.backgroundSize = "cover";
      cssObject.backgroundPosition = "center";
    }

    return cssObject;
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-indigo-400 font-mono text-xs space-y-3">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="tracking-widest uppercase text-[10px] text-slate-500">Initializing Premium Studio V3 Engine Pipeline Contexts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans antialiased overflow-hidden h-screen select-none" style={{ backgroundColor: globalBrandColors.background }}>
      
      {/* 🌐 STRUCTURAL HEADER CONTROLLER MODULE (HIGH FIDELITY CUSTOM IMPLEMENTATION) */}
      <header className="h-16 border-b border-slate-200/80 px-8 flex items-center justify-between z-30 shrink-0 shadow-xs bg-white">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("funnels")}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md" style={{ backgroundColor: globalBrandColors.primary }}>F</div>
            <h1 className="text-xs font-black uppercase tracking-widest text-slate-900">
              FunnelCraft <span className="font-medium text-slate-400 text-[10px]">Studio Engine</span>
            </h1>
          </div>
          <span className="h-5 w-px bg-slate-200"></span>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/40 text-[11px] font-black tracking-wide">
            <button onClick={() => setActiveTab("funnels")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "funnels" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`}>📂 Pipeline Hub</button>
            {activeFunnelId && (
              <>
                <button onClick={() => setActiveTab("builder")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "builder" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`}>🎨 Visual Canvas Studio</button>
                <button onClick={() => setActiveTab("crm")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "crm" ? "bg-white text-emerald-600 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`}>💼 CRM Pipelines ({leadsList.length})</button>
                <button onClick={() => setActiveTab("brand_settings")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "brand_settings" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`}>🛠️ Brand Architecture</button>
              </>
            )}
          </nav>
        </div>

        {/* Dynamic Canvas Breakpoint Emulators Controls Interface Row */}
        {activeTab === "builder" && (
          <div className="bg-slate-100 border border-slate-200/80 p-1 rounded-xl hidden md:flex items-center space-x-1">
            <button onClick={() => setCurrentDeviceMode("desktop")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentDeviceMode === "desktop" ? "bg-white text-slate-900 shadow-2xs border border-slate-200" : "text-slate-400 hover:text-slate-700"}`}>🖥️ Desktop View</button>
            <button onClick={() => setCurrentDeviceMode("mobile")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentDeviceMode === "mobile" ? "bg-white text-indigo-600 shadow-2xs border border-slate-200" : "text-slate-400 hover:text-slate-700"}`}>📱 Mobile View</button>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {isPremiumUser ? (
            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-black tracking-widest px-3 py-1.5 rounded-xl uppercase shadow-3xs">👑 Unlimited Enterprise Tier</span>
          ) : (
            <button onClick={() => setShowPaywallModal(true)} className="text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-black tracking-widest px-3 py-1.5 rounded-xl uppercase cursor-pointer transition shadow-3xs">⭐ Unlock Pro Engine</button>
          )}
          {activeFunnelId && activeTab === "builder" && (
            <button onClick={dispatchComprehensiveCanvasToCloud} disabled={loading} className="text-white font-black text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-xl transition shadow-md hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: globalBrandColors.primary }}>
              {loading ? "Transmitting Node Packets..." : "💾 Sync Active Changes"}
            </button>
          )}
        </div>
      </header>

      {/* 📂 SCREEN 1: PROJECTS HUB PORTAL VIEW SEGMENT */}
      {activeTab === "funnels" && (
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 text-left animate-in fade-in duration-200">
          <div className="bg-white p-8 border border-slate-200/60 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Funnel Deployment Clusters</h2>
              <p className="text-xs font-medium text-slate-400">Initialize standalone high conversion landing systems, customize layout grids, and view operations lead matrices logs.</p>
            </div>
            <button onClick={handleCreateNewFunnelRequest} className="text-white font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-2xl transition shadow-md hover:opacity-95" style={{ backgroundColor: globalBrandColors.primary }}>
              ➕ Deploy New Campaign Cluster Node
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funnelsList.map((funnel) => (
              <div key={funnel.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-indigo-500 transition-all"></div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-black text-indigo-600">🚀</div>
                  <h3 className="font-black text-base text-slate-900 tracking-tight truncate">{funnel.name || "Untitled Production Pipeline Node"}</h3>
                  <p className="text-xs font-semibold text-slate-400">Target Inventory SKU: <span className="text-slate-800 font-bold">{funnel.product_name}</span></p>
                  <div className="text-[10px] font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-indigo-600 font-bold truncate">/preview?id={funnel.id}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => mountFunnelToCanvasWorkspace(funnel)} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl py-2.5 text-xs font-black transition">🛠️ Boot Blueprint</button>
                  <a href={`/preview?id=${funnel.id}`} target="_blank" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 text-center rounded-xl py-2.5 text-xs font-black transition flex items-center justify-center">🌐 View Sandbox</a>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 🛠️ SCREEN 2: GRAPHICAL CANVAS BUILDING STUDIO WORKSPACE INTERFACES */}
      {activeTab === "builder" && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full animate-in fade-in duration-200">
          
          {/* 🗂️ GRANULAR SIDEBAR SYSTEM DESIGN MANAGEMENT DRAWER (LEFT MODULE CONTROLLER) */}
          <aside className="w-full md:w-[420px] bg-white border-r border-slate-200/80 flex flex-col overflow-y-auto h-full shrink-0 z-20 pb-24">
            
            {/* Context Multi-Page Navigation Layer Switchers Row */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-1.5 text-[10px] font-black text-center tracking-widest uppercase">
              <button onClick={() => { setCurrentEditingPage("landing"); setSelectedElementId(null); }} className={`py-2.5 rounded-xl border transition-all ${currentEditingPage === "landing" ? "bg-white border-slate-200/80 text-indigo-600 shadow-2xs" : "border-transparent text-slate-400 hover:text-slate-700"}`}>📄 1. Landing</button>
              <button onClick={() => { setCurrentEditingPage("checkout"); setSelectedElementId(null); }} className={`py-2.5 rounded-xl border transition-all ${currentEditingPage === "checkout" ? "bg-white border-slate-200/80 text-emerald-600 shadow-2xs" : "border-transparent text-slate-400 hover:text-slate-700"}`}>💳 2. Checkout</button>
              <button onClick={() => { setCurrentEditingPage("thanks"); setSelectedElementId(null); }} className={`py-2.5 rounded-xl border transition-all ${currentEditingPage === "thanks" ? "bg-white border-slate-200/80 text-amber-600 shadow-2xs" : "border-transparent text-slate-400 hover:text-slate-700"}`}>🎉 3. Thanks</button>
            </div>

            <div className="p-5 space-y-6 text-left">

              {/* 🔗 INTEGRATED DYNAMIC LINK REDIRECTION ENGINE SETTINGS CONTROLLER (CRITICAL CORE FIX) */}
              {activeSelectedElement && (activeSelectedElement.type.includes("button") || activeSelectedElement.type === "pricing_table") && (
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 space-y-4 shadow-md border border-indigo-900/40">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <span>🔗 Interactive Action Target Router Links</span>
                  </p>
                  
                  <div>
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">On-Click Action Trigger Protocol</label>
                    <select value={activeSelectedElement.linkActionType || "next_page"} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "linkActionType", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-500">
                      <option value="next_page">Auto Route to Next Page In Sequence Flow</option>
                      <option value="checkout_trigger">Instant Launch Checkout Page State</option>
                      <option value="thankyou_redirect">Direct Conversion Thankyou Page Jump</option>
                      <option value="external_url">External Hyperlink Redirection Target Redirect</option>
                    </select>
                  </div>

                  {activeSelectedElement.linkActionType === "external_url" && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                      <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">Target External Destination URL String</label>
                      <input type="text" value={activeSelectedElement.customTargetUrl || "https://"} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "customTargetUrl", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-400" placeholder="https://yourdomain.com/checkout" />
                    </div>
                  )}
                  
                  <p className="text-[9px] text-slate-400 leading-relaxed font-medium">💡 When public viewers click this component block element frame button instance, the engine router automatically triggers the execution parameter bound above.</p>
                </div>
              )}

              {/* DYNAMIC COMPONENT ATTRIBUTES INSPECTOR WORKSPACE NODES */}
              {activeSelectedElement ? (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-5 text-left shadow-xl border border-slate-800/80 animate-in slide-in-from-left-4 duration-200">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <p className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">📝 Inspector Matrix Instance Node: [{activeSelectedElement.type.toUpperCase()}]</p>
                    <button onClick={() => setSelectedElementId(null)} className="text-[9px] text-slate-400 hover:text-white font-black bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md transition">✕ Close</button>
                  </div>

                  {activeSelectedElement.type !== "divider" && activeSelectedElement.type !== "spacer" && (
                    <div>
                      <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">Static Text Layer Content</label>
                      <textarea rows={3} value={activeSelectedElement.content || ""} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "content", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none font-semibold focus:border-indigo-500" />
                    </div>
                  )}

                  {/* 1. FINE TYPOGRAPHY CONTROLS BLOCK SECTION */}
                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <p className="text-[9px] font-black text-indigo-400 tracking-wider uppercase">1. Advanced Typography & Alignment Mapping</p>
                    
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Font Token Register Mapping</label>
                      <select value={activeSelectedElement.styles?.fontFamily || "inherit"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "fontFamily", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-xs font-bold">
                        <option value="inherit">Default Standard Inter System</option>
                        <option value="'Poppins', sans-serif">Poppins Neo-Geometric</option>
                        <option value="'Lato', sans-serif">Lato Modern Humanist</option>
                        <option value="Georgia, serif">Classic Editorial Georgia Serif</option>
                        <option value="monospace">Developer Terminal Monospace Code</option>
                        {customFontsRegistry.map(fn => <option key={fn} value={fn}>{fn} (Custom Font Node)</option>)}
                      </select>
                      <div className="mt-2">
                        <input type="file" accept=".ttf,.woff,.woff2" ref={fontUploadRef} onChange={executeCustomFontIngestion} className="hidden" />
                        <button onClick={() => fontUploadRef.current?.click()} className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-black px-2.5 py-1.5 rounded border border-slate-700 uppercase tracking-widest w-full text-center transition">⬆️ Load Custom Font Binary File Asset (.ttf)</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Desktop Font Size (px)</label>
                        <input type="text" value={activeSelectedElement.styles?.fontSizeDesktop || "16px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "fontSizeDesktop", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono font-bold" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Mobile Font Size (px)</label>
                        <input type="text" value={activeSelectedElement.styles?.fontSizeMobile || "14px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "fontSizeMobile", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Text Align Target</label>
                        <select value={activeSelectedElement.styles?.textAlign || "left"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "textAlign", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                          <option value="left">Align Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                          <option value="justify">Justify Block</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Font Weight Axis</label>
                        <select value={activeSelectedElement.styles?.fontWeight || "400"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "fontWeight", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                          <option value="300">Light (300)</option>
                          <option value="400">Regular (400)</option>
                          <option value="600">Semi Bold (600)</option>
                          <option value="800">Ultra Black (800)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[7px] font-bold text-slate-500 block mb-0.5 uppercase text-center">Letter Gap</label>
                        <input type="text" value={activeSelectedElement.styles?.letterSpacing || "0px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "letterSpacing", e.target.value)} className="w-full bg-slate-900 text-center text-white font-mono text-[10px] p-1 rounded" />
                      </div>
                      <div>
                        <label className="text-[7px] font-bold text-slate-500 block mb-0.5 uppercase text-center">Line Ht</label>
                        <input type="text" value={activeSelectedElement.styles?.lineHeight || "1.4"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "lineHeight", e.target.value)} className="w-full bg-slate-900 text-center text-white font-mono text-[10px] p-1 rounded" />
                      </div>
                      <div>
                        <label className="text-[7px] font-bold text-slate-500 block mb-0.5 uppercase text-center">Word Gap</label>
                        <input type="text" value={activeSelectedElement.styles?.wordSpacing || "0px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "wordSpacing", e.target.value)} className="w-full bg-slate-900 text-center text-white font-mono text-[10px] p-1 rounded" />
                      </div>
                    </div>

                    {/* TEXT EFFECTS SUB-PANEL CONTROLLERS */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[7px] font-black text-slate-400 uppercase block mb-1">Drop Shadows</label>
                        <select value={activeSelectedElement.styles?.textShadow || "none"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "textShadow", e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white rounded p-1 text-[10px] font-bold">
                          <option value="none">None</option>
                          <option value="soft">Soft Ambient Blur</option>
                          <option value="hard">Retro Solid Offset</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[7px] font-black text-slate-400 uppercase block mb-1">Blend Mode Mix</label>
                        <select value={activeSelectedElement.styles?.textBlendMode || "normal"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "textBlendMode", e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white rounded p-1 text-[10px] font-bold">
                          <option value="normal">Normal Style</option>
                          <option value="multiply">Multiply Darken</option>
                          <option value="screen">Screen Luminance</option>
                          <option value="difference">Inversion Diff</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. PAGE STRUCTURE, FLEXBOX & BOX LAYOUT PROPERTIES CONTROLLER */}
                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <p className="text-[9px] font-black text-emerald-400 tracking-wider uppercase">2. Page Structure Layout & Box Dimensions Matrix</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Display Engine Matrix</label>
                        <select value={activeSelectedElement.styles?.displayType || "block"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "displayType", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                          <option value="block">HTML Standard Block</option>
                          <option value="flex">CSS Flexbox Layout</option>
                          <option value="grid">CSS Grid Framework Array</option>
                        </select>
                      </div>
                      {activeSelectedElement.styles?.displayType === "flex" && (
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Flex Flow Slices Direction</label>
                          <select value={activeSelectedElement.styles?.flexDirection || "column"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "flexDirection", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                            <option value="column">Vertical Grid Stack (Col)</option>
                            <option value="row">Horizontal Flex Row Structure</option>
                          </select>
                        </div>
                      )}
                      {activeSelectedElement.styles?.displayType === "grid" && (
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Grid Partition Count</label>
                          <select value={activeSelectedElement.styles?.gridColumnsCount || "1"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "gridColumnsCount", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono font-bold">
                            {["1","2","3","4"].map(col => <option key={col} value={col}>{col} Equal Slices Columns</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Integrated Margins and Paddings Controls Cluster Map Box */}
                    <div className="bg-slate-950 p-2.5 rounded-xl grid grid-cols-4 gap-2 border border-slate-800">
                      <div className="col-span-4 text-[7px] font-black uppercase text-indigo-400 tracking-widest">Internal Layout Padding (Sizing)</div>
                      {["Top","Bottom","Left","Right"].map(dir => (
                        <div key={dir}>
                          <label className="text-[7px] text-slate-500 block text-center uppercase font-mono">{dir.substring(0,1)}</label>
                          <input type="text" value={activeSelectedElement.styles?.[`padding${dir}`] || "0px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, `padding${dir}`, e.target.value)} className="w-full bg-slate-900 text-center text-white font-mono text-[10px] p-1 rounded border border-slate-800" />
                        </div>
                      ))}
                      <div className="col-span-4 text-[7px] font-black uppercase text-indigo-400 tracking-widest mt-2">External Elements Margins (Spacing)</div>
                      {["Top","Bottom","Left","Right"].map(dir => (
                        <div key={dir}>
                          <label className="text-[7px] text-slate-500 block text-center uppercase font-mono">{dir.substring(0,1)}</label>
                          <input type="text" value={activeSelectedElement.styles?.[`margin${dir}`] || "0px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, `margin${dir}`, e.target.value)} className="w-full bg-slate-900 text-center text-white font-mono text-[10px] p-1 rounded border border-slate-800" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. STYLINGS, BACKDROP VECTOR GRADIENTS MAP BOX */}
                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <p className="text-[9px] font-black text-amber-400 tracking-wider uppercase">3. Surface Stylings, Overlays & Shape Dividers</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Background Surface Target</label>
                        <select value={activeSelectedElement.styles?.backgroundType || "transparent"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "backgroundType", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                          <option value="transparent">Transparent Space Empty</option>
                          <option value="solid">Solid Palette Fill</option>
                          <option value="gradient">Linear Graphic Gradient</option>
                          <option value="image">Media Backdrop Texture Image</option>
                        </select>
                      </div>
                      {activeSelectedElement.styles?.backgroundType === "solid" && (
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">Select Target Hex/Token</label>
                          <select value={activeSelectedElement.styles?.backgroundColorSolid || "#ffffff"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "backgroundColorSolid", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold">
                            <option value="primary">Brand Accent Primary Indigo</option>
                            <option value="accent">Brand Conversion Emerald</option>
                            <option value="#ffffff">Pure Static White</option>
                            <option value="#f1f5f9">Slate Neutral Light Gray</option>
                            <option value="#0f172a">Deep Dark Midnight Charcoal</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {activeSelectedElement.styles?.backgroundType === "gradient" && (
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1 uppercase">CSS Standard Linear Gradient Node String</label>
                        <input type="text" value={activeSelectedElement.styles?.backgroundGradientStr || ""} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "backgroundGradientStr", e.target.value)} className="w-full bg-slate-800 border border-slate-700 font-mono text-white p-2 text-xs rounded-lg" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Backdrop Overlay Tint Mask</label>
                        <input type="text" value={activeSelectedElement.styles?.backgroundOverlayColor || "rgba(0,0,0,0)"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "backgroundOverlayColor", e.target.value)} className="w-full bg-slate-800 border border-slate-700 font-mono text-white text-xs p-1.5 rounded-lg" placeholder="rgba(0,0,0,0.4)" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Shape Divider Spline Mask</label>
                        <select value={activeSelectedElement.styles?.shapeDividerType || "none"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "shapeDividerType", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-xs font-bold">
                          <option value="none">Straight Cut None</option>
                          <option value="wave">Curved Wave Cutout</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. GEOMETRIES OUTLINES AND 3D VECTOR SHADOWS PRESETS */}
                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <p className="text-[9px] font-black text-rose-400 tracking-wider uppercase">4. Box Geometries, Radii Curves & Elevations</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5">Corner Radius</label>
                        <input type="text" value={activeSelectedElement.styles?.borderRadius || "0px"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "borderRadius", e.target.value)} className="w-full bg-slate-800 border border-slate-700 font-mono text-white p-1 text-[11px] rounded" placeholder="12px" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5">Border Style</label>
                        <select value={activeSelectedElement.styles?.borderStyle || "none"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "borderStyle", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1 text-[11px]">
                          <option value="none">None</option>
                          <option value="solid">Solid Line</option>
                          <option value="dashed">Dashed Line</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5">Elevation Shadow</label>
                        <select value={activeSelectedElement.styles?.boxShadowPreset || "none"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "boxShadowPreset", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1 text-[11px]">
                          <option value="none">Flat None</option>
                          <option value="sm">Soft Ambient</option>
                          <option value="md">Indigo Pulse High</option>
                          <option value="lg">Max Floating depth</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 5. RESPONSIVE DEVICING TRACKING VISIBILITIES FILTER SEGMENTS */}
                  <div className="space-y-3 border-t border-slate-800 pt-3 bg-slate-950 p-3 rounded-2xl border border-dashed border-slate-800">
                    <p className="text-[9px] font-black text-purple-400 tracking-wider uppercase">5. Cross-Device Visibility Filtering Nodes</p>
                    <div className="grid grid-cols-1 gap-2 text-left">
                      <label className="flex items-center space-x-2.5 text-[10px] font-black text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={activeSelectedElement.hideOnDesktop || false} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "hideOnDesktop", e.target.checked)} className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0" />
                        <span>Purge Element from Desktop Layout View</span>
                      </label>
                      <label className="flex items-center space-x-2.5 text-[10px] font-black text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={activeSelectedElement.hideOnMobile || false} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "hideOnMobile", e.target.checked)} className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0" />
                        <span>Purge Element from Mobile Layout View</span>
                      </label>
                    </div>
                  </div>

                  {/* 6. MOTIONS, TIMINGS AND TRANSITIONS KEYFRAME CONTROLLER BOX */}
                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <p className="text-[9px] font-black text-cyan-400 tracking-wider uppercase">6. Motion Engineering, Timings & Micro Interactions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1">Entrance Animation</label>
                        <select value={activeSelectedElement.entranceAnimation || "none"} onChange={(e) => updateElementAttribute(activeSelectedElement.id, "entranceAnimation", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-xs font-bold">
                          <option value="none">No Motion (Static)</option>
                          <option value="animate-fade-in">Ambient Fade In Wave</option>
                          <option value="animate-slide-left">Slide In From Left Axis</option>
                          <option value="animate-zoom-in">Elastic Scaling Zoom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block mb-1">Hover Scale Micro Interaction</label>
                        <select value={activeSelectedElement.styles?.hoverScale || "100"} onChange={(e) => updateNestedElementStyle(activeSelectedElement.id, "hoverScale", e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-xs font-bold">
                          <option value="100">None Static (100%)</option>
                          <option value="102">Soft Pulse Scale (102%)</option>
                          <option value="105">High Scale Zoom Out (105%)</option>
                          <option value="97">Contracted Click Pulse (97%)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {activeSelectedElement.type === "image" && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Storage Node Media Stream File Ingest</p>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={executeDeviceMediaIngestion} className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white text-slate-950 font-black py-2.5 rounded-xl text-[9px] uppercase tracking-widest transition shadow-sm hover:bg-slate-100">📷 Stream Binary Image File From Local Device</button>
                    </div>
                  )}

                  <button onClick={() => { const curr = getActiveTargetPageJsonArray(); syncActiveTargetPageJsonArray(curr.filter(el=>el.id!==activeSelectedElement.id)); setSelectedElementId(null); }} className="w-full bg-red-950/60 hover:bg-red-950 text-red-400 font-bold text-[10px] py-3 rounded-xl border border-red-900/50 uppercase tracking-widest mt-3 transition">
                    🗑️ Purge Component Block Node Data Slices
                  </button>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center text-xs text-slate-400 font-medium leading-relaxed shadow-3xs">
                  💡 Select any component matrix structure inside the canvas node area workspace to prompt deep contextual typography configs, spatial padding grids or nested action target link paths mapping panels.
                </div>
              )}

              {/* FACTORY SCHEMA COMPONENTS DRAWER (INJECT COMPONENT INSTANCES STACK) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-widest">➕ Deploy Structural Component Matrix Stack</h3>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {["h1", "h2", "paragraph", "quote_block", "image", "video", "countdown_timer", "divider", "spacer", "primary_button", "hero_section", "pricing_table"].map((type) => (
                    <button key={type} onClick={() => insertComponentToActiveCanvas(type)} className="bg-white hover:bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-[10px] font-black text-slate-700 capitalize transition shadow-3xs truncate flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      <span>{type.replace("_", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* 🖥️ DYNAMIC LIVE PLAYGROUND EDITOR FRAME (RIGHT CANVAS MAIN HOUSING CONTAINER) */}
          <main className="flex-1 bg-slate-100/60 p-4 md:p-8 flex flex-col overflow-hidden h-full">
            
            {/* Structural Sandboxed Device Header Metadata Layer Mapping Row */}
            <div className="bg-slate-900 h-12 px-6 rounded-t-3xl flex items-center justify-between shrink-0 shadow-md text-white border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                </div>
                <span className="text-[9px] tracking-widest uppercase font-mono font-black text-slate-400">
                  Target Blueprint Sandbox Location Pipeline: Page Component Layer [{currentEditingPage.toUpperCase()}] Array Configuration Nodes
                </span>
              </div>
              <div className="text-[9px] bg-indigo-950/60 border border-indigo-900/50 px-3 py-1 rounded-xl font-mono font-black text-indigo-400 uppercase tracking-widest shadow-inner">
                EMULATION MATRIX ACTIVE
              </div>
            </div>

            {/* Central Sandboxed Scaling Window Device Box Framework Housing */}
            <div className="flex-1 bg-slate-200/40 border-x border-b border-slate-200 rounded-b-3xl overflow-y-auto p-6 flex items-start justify-center shadow-inner transition-all duration-300">
              
              <div className={`bg-white transition-all duration-300 min-h-[700px] shadow-2xl relative border border-slate-200 ${currentDeviceMode === "mobile" ? "w-[375px] rounded-3xl border-[12px] border-slate-900 px-4 py-8" : "w-full rounded-b-2xl p-10 md:p-16"}`}>
                
                {/* Visual Assembly Array Output Renderer Stack Pipeline */}
                <div className="w-full space-y-5 text-left">
                  {getActiveTargetPageJsonArray().length === 0 ? (
                    <div className="text-center py-48 font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">Target Active Page Storage Matrix Array Data Empty.</div>
                  ) : (
                    getActiveTargetPageJsonArray().map((element, index) => {
                      if (currentDeviceMode === "desktop" && element.hideOnDesktop) return null;
                      if (currentDeviceMode === "mobile" && element.hideOnMobile) return null;

                      let animationClassStr = "";
                      if (element.entranceAnimation && element.entranceAnimation !== "none") {
                        animationClassStr = `transition-all transform duration-700 ease-out ${element.entranceAnimation}`;
                      }

                      return (
                        <div 
                          key={element.id} 
                          onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id); }} 
                          className={`group relative rounded-2xl border border-dashed border-transparent hover:border-indigo-400 transition-all cursor-pointer p-1.5 ${selectedElementId === element.id ? "border-indigo-500 bg-indigo-50/5 ring-1 ring-indigo-500/10 shadow-sm" : ""} ${animationClassStr}`}
                          style={compileAppliedCSSStylesMatrix(element)}
                        >
                          
                          {/* Floating Anchored Quick Action Controller Trigger Modals Row */}
                          <div className="absolute -top-4 right-3 bg-slate-900 text-white border border-slate-800 px-2.5 py-1 rounded-xl text-[8px] font-mono font-black flex items-center space-x-2.5 z-50 opacity-0 group-hover:opacity-100 transition shadow-lg">
                            <span className="text-indigo-400 uppercase tracking-wider">[{element.type}]</span>
                            {element.linkActionType && <span className="text-emerald-400 uppercase text-[7px] tracking-tighter">🔗 {element.linkActionType}</span>}
                            <button onClick={(e) => { e.stopPropagation(); moveElementOrder(index, "up"); }} className="hover:text-indigo-300 text-[9px]">▲</button>
                            <button onClick={(e) => { e.stopPropagation(); moveElementOrder(index, "down"); }} className="hover:text-indigo-300 text-[9px]">▼</button>
                          </div>

                          {element.styles?.shapeDividerType === "wave" && (
                            <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden pointer-events-none z-10 opacity-30"><svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-slate-400"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.31,83.1,22.11,141.43,34.19,201.8,40.41,262.29,40.83A703.35,703.35,0,0,0,321.39,56.44Z"></path></svg></div>
                          )}

                          {/* INLINE WYSIWYG DIRECT INTERACTIVE TEXT EDITING BINDING HANDLERS */}
                          {(() => {
                            switch (element.type) {
                              case "h1":
                              case "h2":
                                return (
                                  <div 
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateElementAttribute(element.id, "content", e.target.innerText)}
                                    className="focus:outline-none focus:ring-2 focus:ring-indigo-500/50 p-1 block w-full bg-transparent min-h-[35px]"
                                  >
                                    {element.content}
                                  </div>
                                );
                              case "paragraph":
                                return (
                                  <p 
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateElementAttribute(element.id, "content", e.target.innerText)}
                                    className="focus:outline-none focus:ring-2 focus:ring-indigo-500/50 p-1 block w-full bg-transparent min-h-[25px] whitespace-pre-wrap text-slate-600 font-medium leading-relaxed"
                                  >
                                    {element.content}
                                  </p>
                                );
                              case "quote_block":
                                return (
                                  <div className="border-l-4 pl-5 py-2 italic font-black text-slate-800 text-sm block w-full bg-slate-50 border-indigo-500 rounded-r-xl">
                                    "{element.content}"
                                  </div>
                                );
                              case "image":
                                return (
                                  <div className="w-full flex items-center justify-center bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden min-h-[160px] shadow-inner">
                                    {element.mediaUrl ? (
                                      <img src={element.mediaUrl} alt="Visual Dynamic Section Node Image Asset" className="max-w-full h-auto object-cover max-h-80 shadow-md" />
                                    ) : (
                                      <span className="text-[10px] font-mono text-slate-400 font-bold p-8 text-center uppercase tracking-widest">📷 Image Canvas Stream Null. Select element node to upload file structure.</span>
                                    )}
                                  </div>
                                );
                              case "video":
                                return (
                                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black border border-slate-900 max-h-[360px]">
                                    <iframe src={element.mediaUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} className="w-full h-full" allowFullScreen></iframe>
                                  </div>
                                );
                              case "countdown_timer":
                                return (
                                  <div className="w-full max-w-md mx-auto bg-rose-50/60 border border-rose-100 text-rose-600 rounded-2xl p-5 text-center shadow-xs">
                                    <span className="font-black uppercase tracking-widest block mb-2 text-[10px] text-rose-500">{element.content || "Limited Availability License Vault Closing"}</span>
                                    <div className="text-2xl font-black font-mono tracking-widest text-slate-900 bg-white inline-block px-4 py-1.5 rounded-xl border border-rose-100">00h : 14m : 58s</div>
                                  </div>
                                );
                              case "divider": return <hr className="border-slate-200/80 w-full my-1" />;
                              case "spacer": return <div className="h-10 w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest">Spatial Grid Spacer Element (40px)</div>;
                              case "primary_button":
                                return <button className="w-full font-black text-xs uppercase tracking-widest shadow-md rounded-xl transition-all pointer-events-none py-3.5" style={{ backgroundColor: globalBrandColors.primary, color: "#ffffff" }}>{element.content}</button>;
                              case "hero_section":
                                return (
                                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 border border-slate-200/60 p-8 rounded-3xl text-left shadow-2xs">
                                    <div className="space-y-3">
                                      <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight">{element.content}</h3>
                                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">High fidelity processing framework schemas map conversion layout vector indices dynamically.</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-3 shadow-sm">
                                      <div className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-[10px] text-slate-400 font-black text-left uppercase tracking-wider">Dynamic Customer Identity Field</div>
                                      <button className="w-full text-white font-black text-[10px] py-3 rounded-xl uppercase tracking-widest transition-all shadow-sm" style={{ backgroundColor: globalBrandColors.primary }}>Submit Parameters ➔</button>
                                    </div>
                                  </div>
                                );
                              case "pricing_table":
                                return (
                                  <div className="w-full max-w-sm mx-auto bg-white border-2 p-6 rounded-3xl text-center space-y-5 shadow-xl relative overflow-hidden" style={{ borderColor: globalBrandColors.primary }}>
                                    <div className="text-[8px] font-black text-white px-3 py-1 absolute top-4 right-4 rounded-full uppercase tracking-widest" style={{ backgroundColor: globalBrandColors.primary }}>ENTERPRISE SECTOR</div>
                                    <h4 className="font-black text-sm tracking-widest text-slate-900 pt-3 uppercase">{element.content}</h4>
                                    <div className="text-4xl font-mono font-black" style={{ color: globalBrandColors.primary }}>₹{price}</div>
                                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Deploy secure transaction pipelines, hook lead listeners triggers and build un-capped funnel flows routes.</p>
                                    <button className="w-full text-white font-black text-xs py-3 rounded-xl uppercase tracking-widest shadow-md transition-all" style={{ backgroundColor: globalBrandColors.primary }}>Secure Vault Settlement Setup</button>
                                  </div>
                                );
                              default: return null;
                            }
                          })()}

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </div>
          </main>

        </div>
      )}

      {/* 💼 SCREEN 3: ENTERPRISE CRM LEADS MANAGEMENT VIEW */}
      {activeTab === "crm" && (
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-6 text-left animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 border border-slate-200/60 rounded-3xl gap-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Inbound Pipeline Conversion Ledger Terminal</h2>
              <p className="text-xs text-slate-400 font-medium">Trace data acquisition, settlement responses tokens, and consumer attributes records variables.</p>
            </div>
            <div className="flex bg-slate-100 border border-slate-200/80 p-1 rounded-xl text-[10px] font-black tracking-widest uppercase">
              {["All", "New", "Interested", "Closed"].map((seg) => (
                <button key={seg} onClick={() => setSelectedSegment(seg)} className={`px-4 py-2 rounded-lg transition-all ${selectedSegment === seg ? "bg-white text-slate-900 shadow-3xs border border-slate-200/60" : "text-slate-400 hover:text-slate-800"}`}>{seg}</button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-widest"><th className="p-5">Inbound Prospect Signature</th><th className="p-5">Pipeline Flag State Node</th><th className="p-5 text-right">Acquisition Timestamp Token</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {leadsList.filter(l => selectedSegment === "All" || l.status === selectedSegment).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-5"><p className="font-black text-slate-900 text-sm">{lead.name}</p><p className="text-xs text-slate-400 font-mono font-bold mt-0.5">{lead.email}</p></td>
                    <td className="p-5"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">{lead.status || "Closed Won Entry"}</span></td>
                    <td className="p-5 text-right font-mono font-bold text-slate-400">{new Date(lead.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* 🛠️ SCREEN 4: BRAND ARCHITECTURE SETTINGS MANAGER (NEW HIGH DESIGN SYSTEM PANEL) */}
      {activeTab === "brand_settings" && (
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full text-left space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm space-y-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest text-indigo-600">Unified Architecture General Campaign Parameters</h2>
            <p className="text-xs text-slate-400 font-semibold">Configure core routing fields, price variables, and external gateway integration endpoints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">💰 Monetization Inventory Node Fields</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Campaign Project Identity Name</label>
                  <input type="text" value={funnelName} onChange={(e) => setFunnelName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Product Offer Title SKU</label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Product Settlement Cost Base (INR)</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-black text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">🎨 Visual Engine Theme Swatches Control</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Accent Accent Key Color</label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <input type="color" value={globalBrandColors.primary} onChange={(e) => setGlobalBrandColors({ ...globalBrandColors, primary: e.target.value })} className="w-8 h-8 rounded-lg cursor-pointer border-none shadow-3xs" />
                    <span className="text-xs font-mono font-bold text-slate-700">{globalBrandColors.primary}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Conversion Emerald Mix</label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <input type="color" value={globalBrandColors.accent} onChange={(e) => setGlobalBrandColors({ ...globalBrandColors, accent: e.target.value })} className="w-8 h-8 rounded-lg cursor-pointer border-none shadow-3xs" />
                    <span className="text-xs font-mono font-bold text-slate-700">{globalBrandColors.accent}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Direct External Backup Redirect Gateway Link</label>
                  <input type="text" value={paymentUrl} onChange={(e) => setPaymentUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-indigo-600 font-bold focus:outline-none focus:border-indigo-500" placeholder="https://rzp.io/l/your_custom_payment_link" />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ⭐ ACCOUNT PAYWALL MODAL GATEWAY OVERLAY DIALOG */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-slate-200 text-center space-y-5 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center font-black text-xl mx-auto text-indigo-600">⭐</div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Free Layer Platform Quota Reached</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-semibold">Your default subscription limits container environment allocation bounds to a maximum constraint of <strong>2 Free Campaigns Clusters</strong>.</p>
            </div>
            <button onClick={handleSubscriptionUpgrade} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl py-3 text-[11px] uppercase tracking-widest transition shadow-md">
              Upgrade Workspace License (₹4,999/Yr)
            </button>
            <button onClick={() => setShowPaywallModal(false)} className="text-[9px] text-slate-400 hover:text-slate-800 font-black uppercase tracking-widest block mx-auto transition">Dismiss Overlay Engine</button>
          </div>
        </div>
      )}

    </div>
  );
}