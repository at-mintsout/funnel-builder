"use client";
import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// 🌐 CONFIG MASTER DATA WIDGET REGISTRY SYSTEMS (40 PROFESSIONAL ELEMENTS)
// =========================================================================
const ELEMENTOR_WIDGET_CATALOG = [
  // --- LAYOUT BLOCKS (4) ---
  { type: "section_row", name: "1 Column Section Row", category: "layout", icon: "⚃", defaultContent: "Full Width Layout" },
  { type: "two_col_row", name: "2 Column Split Row", category: "layout", icon: "⚄", defaultContent: "50/50 Layout Grid" },
  { type: "three_col_row", name: "3 Column Multi Grid", category: "layout", icon: "⚅", defaultContent: "33/33/33 Layout Grid" },
  { type: "four_col_row", name: "4 Column Grid Frame", category: "layout", icon: "⚂", defaultContent: "25/25/25/25 Grid" },

  // --- BASIC TYPOGRAPHY & MEDIA (10) ---
  { type: "heading", name: "Main Hero Heading Text", category: "basic", icon: "Ｔ", defaultContent: "We Create High Converting Traffic Funnels", redirectUrl: "", styles: { color: "#1e3a8a", fontSize: "32px", textAlign: "left", fontWeight: "900", fontFamily: "sans-serif" } },
  { type: "sub_heading", name: "Sub-Headline Box", category: "basic", icon: "ｔ", defaultContent: "Accelerate your inbound lead pipelines seamlessly", redirectUrl: "", styles: { color: "#16a34a", fontSize: "18px", textAlign: "left", fontWeight: "700", fontFamily: "sans-serif" } },
  { type: "paragraph", name: "Rich Text Editor Editor", category: "basic", icon: "▤", defaultContent: "We build innovative digital marketing layout structures to help creators track metrics safely.", redirectUrl: "", styles: { color: "#475569", fontSize: "14px", textAlign: "left", fontWeight: "400", fontFamily: "sans-serif", lineHeight: "1.6" } },
  { type: "image", name: "Responsive Image Box", category: "basic", icon: "🖼", defaultContent: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", redirectUrl: "", imageSourceMode: "url", styles: { alignment: "center", borderRadius: "8px", width: "100%" } },
  { type: "video", name: "Embedded Video Player", category: "basic", icon: "▷", defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { type: "button", name: "Call To Action Button", category: "basic", icon: "凸", defaultContent: "Claim Your Special Offer Now", redirectUrl: "", styles: { backgroundColor: "#e11d48", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", alignment: "center", fontSize: "15px", fontWeight: "700", fontFamily: "sans-serif" } },
  { type: "divider", name: "Structural Divider Line", category: "basic", icon: "―", defaultContent: "", styles: { thickness: "2px", color: "#cbd5e1", verticalMargin: "24px" } },
  { type: "spacer", name: "Dynamic Vertical Spacer", category: "basic", icon: "⇳", defaultContent: "40px height spacer", styles: { verticalSpace: "40px" } },
  { type: "bullet_list", name: "Feature Bullet Points List", category: "basic", icon: "✓", defaultContent: "Instant Access Setup|Lifetime Core Updates Included|Premium 24/7 Priority Support Desk", redirectUrl: "", styles: { color: "#334155", fontSize: "13px" } },
  { type: "icon_box", name: "Icon Feature Box Block", category: "basic", icon: "❂", defaultContent: "Secure Payments Secured via SSL Core Encryption Protocols", redirectUrl: "" },

  // --- CONVERSION & LEAD CAPTURE PRO FORMS (10) ---
  { type: "pro_form", name: "Opt-In Form Capture Pro", category: "pro", icon: "✉", defaultContent: "Claim Free Access Seat", fields: [{ label: "Full Name", type: "text" }, { label: "Primary Email Address", type: "email" }] },
  { type: "checkout_form", name: "Order Payment Gateway Form", category: "pro", icon: "💳", defaultContent: "Secure Gateway Checkout Terminal", fields: [{ label: "Card Number", type: "text" }, { label: "CVV Code", type: "password" }] },
  { type: "phone_capture", name: "SMS Lead Capture Target", category: "pro", icon: "📞", defaultContent: "Enter Phone Number for VIP Access text messages", fields: [{ label: "Mobile Phone Target Vector", type: "tel" }] },
  { type: "dropdown_select", name: "Survey Multiple Select Dropdown", category: "pro", icon: "▾", defaultContent: "Choose Business Model|E-Commerce Matrix|Agency Workflow Framework" },
  { type: "checkbox_verify", name: "GDPR Terms Compliance Checkbox", category: "pro", icon: "☑", defaultContent: "I accept all global terms, cookie processing policies and data tracking laws fully." },
  { type: "date_picker", name: "Booking Date Selection Calendar", category: "pro", icon: "📅", defaultContent: "Choose Consultation Call Slot Time" },
  { type: "progress_bar", name: "Multi-Step Funnel Progress Bar", category: "pro", icon: "▰", defaultContent: "Step 2 of 3 Completed (75% Active Profile Loaded Data)", styles: { color: "#16a34a" } },
  { type: "file_upload", name: "Asset Application Document Uploader", category: "pro", icon: "📤", defaultContent: "Upload KYC proof document files to system stack nodes" },
  { type: "login_node", name: "Portal User Authentication Window", category: "pro", icon: "🔓", defaultContent: "Secure Client Dashboard Area Access Gateway Panel" },
  { type: "digital_signature", name: "E-Signature Dynamic Consent Block", category: "pro", icon: "✍", defaultContent: "Draw legal execution signature validation token context here" },

  // --- SOCIAL PROOF & MARKETING TRIGGERS (8) ---
  { type: "star_rating", name: "Client Testimonial Star Ratings", category: "marketing", icon: "★", defaultContent: "5", redirectUrl: "", styles: { alignment: "left" } },
  { type: "social_icons", name: "Social Networks Hyperlinks Dock", category: "marketing", icon: "🌐", defaultContent: "fb|tw|gp|ln", redirectUrl: "", styles: { alignment: "center" } },
  { type: "counter_node", name: "Milestone Metric Counter", category: "marketing", icon: "🔢", defaultContent: "1,49,200+", metaLabel: "Active Core Global Client Server Implementations Live", redirectUrl: "" },
  { type: "countdown_timer", name: "Scarcity FOMO Countdown Clock", category: "marketing", icon: "⏳", defaultContent: "15:00 minutes remaining before deal expiry matrix sets", styles: { color: "#dc2626" } },
  { type: "pricing_card", name: "Enterprise SaaS Tier Pricing Card", category: "marketing", icon: "🏷", defaultContent: "$97 / Month Platinum Suite Allocation", metaLabel: "Includes unlimited access models", redirectUrl: "" },
  { type: "guarantee_badge", name: "30-Day Money Back Shield Badge", category: "marketing", icon: "🛡", defaultContent: "100% Risk Free Full Refund Money-Back Guarantee Clause", redirectUrl: "" },
  { type: "review_card", name: "Full Customer Review Card", category: "marketing", icon: "👤", defaultContent: "John Doe (Founder, TechMedia Corp): 'This tool boosted our inbound conversions by 420% in weeks.'", redirectUrl: "" },
  { type: "faq_accordion", name: "Collapsible FAQ Accordion Hub", category: "marketing", icon: "❓", defaultContent: "Is it easy to cancel subscription nodes?|Yes, instant cancel inside the client billing terminal panel." },

  // --- E-COMMERCE & WIDGET UTILITIES (8) ---
  { type: "cart_summary", name: "Shopping Cart Order Summary", category: "ecommerce", icon: "🛒", defaultContent: "Item: Ultimate Funnel Accelerator Masterclass Pack - $297" },
  { type: "coupon_code", name: "Discount Promo Code Validation Input", category: "ecommerce", icon: "🎟", defaultContent: "Apply code 'LAUNCH50' for half price discount access tokens" },
  { type: "product_grid", name: "Featured Physical Products Display Grid", category: "ecommerce", icon: "📦", defaultContent: "Product A - $49|Product B - $89|Product C - $129", redirectUrl: "" },
  { type: "order_bump", name: "High Conversion Order Bump Checkbox", category: "ecommerce", icon: "⚡", defaultContent: "Yes! Add Ultimate Copywriting Formula Book to my checkout for only $17 extra tokens." },
  { type: "map_location", name: "Google Maps Office Terminal Embed", category: "ecommerce", icon: "📍", defaultContent: "Silicon Valley Inbound Headquarters Node Station Location" },
  { type: "audio_player", name: "Podcast Audio Player Module", category: "ecommerce", icon: "♬", defaultContent: "Listen to Pre-Purchase Client Case Study Session Audio Track" },
  { type: "alert_bar", name: "Urgent Attention Banner Alert Bar", category: "ecommerce", icon: "⚠", defaultContent: "Warning: Only 4 discount subscription coupon slots remain for today!", styles: { backgroundColor: "#f59e0b" } },
  { type: "html_embed", name: "Custom RAW HTML/JS Frame Snippet", category: "ecommerce", icon: "🧬", defaultContent: "" }
];

export default function FunnelCraftBuilderCanvas() {
  // =========================================================================
  // 🧭 LIVE DATABASE PIPELINE PATHS (SUPABASE CONFIG MASTER CREDENTIALS)
  // =========================================================================
  const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_ANON_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const TARGET_TABLE_NAME = "funnels";

  // =========================================================================
  // 🧭 CHANNELS GLOBAL STATES
  // =========================================================================
  const [funnelPageStepsTabs, setFunnelPageStepsTabs] = useState(["landing", "checkout", "thankyou"]);
  const [activePageStep, setActivePageStep] = useState("landing"); 
  const [activeDeviceViewMode, setActiveDeviceViewMode] = useState("desktop"); 
  const [lastSystemUpdateTimeStamp, setLastSystemUpdateTimeStamp] = useState("Never updated");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [generatedClientFunnelLink, setGeneratedClientFunnelLink] = useState("");
  const [isDatabasePushLoading, setIsDatabasePushLoading] = useState(false);
  const [databaseNetworkError, setDatabaseNetworkError] = useState("");

  // =========================================================================
  // 🧠 GLOBAL MULTI-PAGE ENGINE WORKSPACE DATA TREE STORE
  // =========================================================================
  const [funnelPagesDataStore, setFunnelPagesDataStore] = useState({
    landing: [
      {
        id: "row_init_1",
        columns: [
          {
            id: "col_1_1",
            widthPercent: 60,
            widgets: [
              { id: "wdgt_1", type: "heading", content: "We Create High Converting Traffic Funnels", redirectUrl: "https://funnelcraft.io/live/client_id_lkmwijf/checkout", styles: { color: "#1e3a8a", fontSize: "32px", textAlign: "left", fontWeight: "900", fontFamily: "sans-serif" } },
              { id: "wdgt_3", type: "paragraph", content: "Welcome to FunnelCraft! Drag and drop structural layout systems to capture enterprise workflows, route client data payloads, and optimize overall site conversion safely.", redirectUrl: "", styles: { color: "#475569", fontSize: "14px", textAlign: "left", fontWeight: "400", fontFamily: "sans-serif" } }
            ]
          },
          {
            id: "col_1_2",
            widthPercent: 40,
            widgets: [
              { id: "wdgt_5", type: "pro_form", content: "Claim Free Access Seat", fields: [{ label: "Full Name", type: "text" }, { label: "Primary Email Address", type: "email" }] }
            ]
          }
        ]
      }
    ],
    checkout: [
      {
        id: "row_chk_1",
        columns: [
          {
            id: "col_chk_1_1",
            widthPercent: 100,
            widgets: [
              { id: "wdgt_chk_title", type: "heading", content: "Secure Operational Gateway Checkout Terminal", redirectUrl: "https://funnelcraft.io/live/client_id_lkmwijf/thankyou", styles: { color: "#1e3a8a", fontSize: "28px", textAlign: "center", fontWeight: "900", fontFamily: "sans-serif" } }
            ]
          }
        ]
      }
    ],
    thankyou: [
      {
        id: "row_ty_1",
        columns: [
          {
            id: "col_ty_1_1",
            widthPercent: 100,
            widgets: [
              { id: "wdgt_ty_icon", type: "feature_box", content: "Transaction Completed Successfully!", metaSubtext: "Your execution credentials and system dashboard nodes are deployed inside cloud containers.", redirectUrl: "", iconBadge: "🎉" }
            ]
          }
        ]
      }
    ]
  });

  const canvasRows = funnelPagesDataStore[activePageStep] || [];
  const [activeCatalogTab, setActiveCatalogTab] = useState("basic"); 
  const [selectedWidgetNode, setSelectedWidgetNode] = useState(null);
  const [activeWidgetSearchTerm, setActiveWidgetSearchTerm] = useState("");
  const [isCurrentlyDraggingWidget, setIsCurrentlyDraggingWidget] = useState(false);
  const internalDraggedWidgetTypeRef = useRef(null);

  const setCanvasRows = (mutatorArgumentPayload) => {
    setFunnelPagesDataStore(previousMasterStore => {
      const activeRowsBuffer = previousMasterStore[activePageStep] || [];
      const newlyComputedRows = typeof mutatorArgumentPayload === "function" 
        ? mutatorArgumentPayload(activeRowsBuffer) 
        : mutatorArgumentPayload;
      return { ...previousMasterStore, [activePageStep]: newlyComputedRows };
    });
  };

  // =========================================================================
  // ⚙️ CLIENT ROUTE DYNAMIC TAB CREATOR HUB (`+ NEW PAGE` INTERACTIVE ENGINE)
  // =========================================================================
  const instantiateDynamicNewPageChannelTab = () => {
    const rawPageNameInput = prompt("Enter Unique Custom Page Node Identity Route String Name (e.g., upsell, pricing, webinar):");
    if (!rawPageNameInput) return;
    
    const formattedPageKeyId = rawPageNameInput.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    if (!formattedPageKeyId) { alert("Invalid page string tokens."); return; }
    if (funnelPageStepsTabs.includes(formattedPageKeyId)) { alert("This route identifier already exists in database keys."); return; }

    setFunnelPageStepsTabs(prev => [...prev, formattedPageKeyId]);
    setFunnelPagesDataStore(prev => ({
      ...prev,
      [formattedPageKeyId]: [
        {
          id: `row_custom_${Date.now()}`,
          columns: [{ id: `col_custom_${Date.now()}`, widthPercent: 100, widgets: [{ id: `wdgt_head_${Date.now()}`, type: "heading", content: `New ${rawPageNameInput} Page Workspace Canvas`, styles: { color: "#1e3a8a", fontSize: "28px", textAlign: "center", fontWeight: "900" } }] }]
        }
      ]
    }));
    setActivePageStep(formattedPageKeyId);
    setSelectedWidgetNode(null);
  };
const deleteDynamicPageTab = (pageKeyToDelete, eventObj) => {
  eventObj.stopPropagation(); // Isse tab change trigger nahi hoga

  // 1. Landing, checkout, aur thankyou ko delete hone se rokna hai toh:
  if (["landing", "checkout", "thankyou"].includes(pageKeyToDelete)) {
    alert("System default pages ko delete nahi kiya ja sakta!");
    return;
  }

  if (!confirm(`Kya aap "${pageKeyToDelete}" page ko delete karna chahte hain?`)) return;

  // 2. Tabs list se remove karein
  setFunnelPageStepsTabs(prev => prev.filter(step => step !== pageKeyToDelete));

  // 3. Main Data Store se page ka data clear karein
  setFunnelPagesDataStore(prev => {
    const updatedStore = { ...prev };
    delete updatedStore[pageKeyToDelete];
    return updatedStore;
  });

  // 4. Agar active page hi delete ho raha hai, toh user ko landing par bhej dein
  if (activePageStep === pageKeyToDelete) {
    setActivePageStep("landing");
    setSelectedWidgetNode(null);
  }
};
  // =========================================================================
  // ⚙️ ENGINE TREE ACTIONS MUTATION HOOKS Preserve All Last Functions
  // =========================================================================
  const addNewSectionRowLayout = (columnCountConfig) => {
    const calculatedWidth = Math.floor(100 / columnCountConfig);
    const uniquelyGeneratedRowId = `row_vector_${Date.now()}`;
    const configuredNewRow = {
      id: uniquelyGeneratedRowId,
      columns: Array.from({ length: columnCountConfig }).map((_, idx) => ({
        id: `col_gen_${Date.now()}_${idx}`,
        widthPercent: calculatedWidth,
        widgets: []
      }))
    };
    setCanvasRows(prev => [...prev, configuredNewRow]);
  };

  const appendWidgetToColumn = (targetRowId, targetColumnId, elementWidgetType) => {
    const systemRegistryItem = ELEMENTOR_WIDGET_CATALOG.find(w => w.type === elementWidgetType);
    if (!systemRegistryItem) return;

    const uniqueWidgetNodeId = `wdgt_node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const freshWidgetInstance = {
      id: uniqueWidgetNodeId,
      type: elementWidgetType,
      content: systemRegistryItem.defaultContent,
      redirectUrl: systemRegistryItem.redirectUrl !== undefined ? "" : "",
      styles: systemRegistryItem.styles ? { ...systemRegistryItem.styles } : { color: "#000000", textAlign: "left" },
      metaSubtext: systemRegistryItem.metaSubtext || "",
      iconBadge: systemRegistryItem.iconBadge || "⚙️",
      imageSourceMode: systemRegistryItem.imageSourceMode || "url",
      fields: systemRegistryItem.fields ? [...systemRegistryItem.fields] : undefined
    };

    setCanvasRows(prev => prev.map(row => {
      if (row.id !== targetRowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== targetColumnId) return col;
          return { ...col, widgets: [...col.widgets, freshWidgetInstance] };
        })
      };
    }));
    setSelectedWidgetNode({ widget: freshWidgetInstance, rowId: targetRowId, columnId: targetColumnId });
  };

  const updateSelectedWidgetAttributes = (modifiedProperties, modifiedStyleFields = {}) => {
    if (!selectedWidgetNode) return;
    const { id: targetWidgetId } = selectedWidgetNode.widget;

    setCanvasRows(prev => prev.map(row => {
      if (row.id !== selectedWidgetNode.rowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== selectedWidgetNode.columnId) return col;
          return {
            ...col,
            widgets: col.widgets.map(w => {
              if (w.id !== targetWidgetId) return w;
              const consolidatedWidget = {
                ...w,
                ...modifiedProperties,
                styles: { ...w.styles, ...modifiedStyleFields }
              };
              setSelectedWidgetNode(prevRef => ({ ...prevRef, widget: consolidatedWidget }));
              return consolidatedWidget;
            })
          };
        })
      };
    }));
  };

  const handleWidgetLocalImageBufferStream = (htmlInputEvent) => {
    const rawLocalFile = htmlInputEvent.target.files[0];
    if (!rawLocalFile) return;
    const dataStreamFileReader = new FileReader();
    dataStreamFileReader.onloadend = () => {
      updateSelectedWidgetAttributes({ content: dataStreamFileReader.result, imageSourceMode: "upload" });
    };
    dataStreamFileReader.readAsDataURL(rawLocalFile);
  };

  const shiftWidgetVerticalOrder = (currentRowIndex, currentColumnIndex, currentWidgetIndex, verticalOffsetDirection) => {
    const operationalCanvasRows = JSON.parse(JSON.stringify(canvasRows));
    const targetWidgetsArray = operationalCanvasRows[currentRowIndex].columns[currentColumnIndex].widgets;
    const targetedDestinationIndex = currentWidgetIndex + verticalOffsetDirection;
    if (targetedDestinationIndex < 0 || targetedDestinationIndex >= targetWidgetsArray.length) return;
    const bufferElementHolder = targetWidgetsArray[currentWidgetIndex];
    targetWidgetsArray[currentWidgetIndex] = targetWidgetsArray[targetedDestinationIndex];
    targetWidgetsArray[targetedDestinationIndex] = bufferElementHolder;
    setCanvasRows(operationalCanvasRows);
  };

  const dropWidgetInstanceFromTree = (targetRowId, targetColId, targetWidgetId, eventObj) => {
    eventObj.stopPropagation();
    setCanvasRows(prev => prev.map(row => {
      if (row.id !== targetRowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== targetColId) return col;
          return { ...col, widgets: col.widgets.filter(w => w.id !== targetWidgetId) };
        })
      };
    }));
    if (selectedWidgetNode?.widget.id === targetWidgetId) setSelectedWidgetNode(null);
  };

  const purgeWholeSectionRowNode = (targetRowId, eventObj) => {
    eventObj.stopPropagation();
    setCanvasRows(prev => prev.filter(r => r.id !== targetRowId));
    if (selectedWidgetNode?.rowId === targetRowId) setSelectedWidgetNode(null);
  };

  const triggerManualHotUpdateCommit = () => {
    const rightNow = new Date();
    const formattedTime = rightNow.toTimeString().split(' ')[0] + " (" + rightNow.toLocaleDateString() + ")";
    setLastSystemUpdateTimeStamp(formattedTime);
  };

  // =========================================================================
  // 🔄 AUTO-SAVE ENGINE (DEBOUNCED DATABASE SYNC)
  // =========================================================================
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_PUBLIC_KEY || Object.keys(funnelPagesDataStore).length === 0) {
          return;
      }

      const activeFunnelId = "draft_funnel_id_001"; 

      const payloadToSave = {
        id: activeFunnelId,
        name: "My Auto-Saved Funnel", 
        canvas_state: funnelPagesDataStore,
        updated_at: new Date().toISOString()
      };

      try {
        const response = await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/${TARGET_TABLE_NAME}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_PUBLIC_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_PUBLIC_KEY}`,
            "Prefer": "resolution=merge-duplicates" 
          },
          body: JSON.stringify(payloadToSave)
        });

        if (response.ok) {
          triggerManualHotUpdateCommit(); 
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 3000); 

    return () => clearTimeout(delayDebounceFn); 
  }, [funnelPagesDataStore]); 

  // =========================================================================
  // 📥 NATIVE WORKING SUPABASE DB LIVE ENGINE PUBLISH PUSH OPERATION
  // =========================================================================
 // =========================================================================
  // 📥 NATIVE WORKING SUPABASE DB LIVE ENGINE PUBLISH PUSH OPERATION
  // =========================================================================
  const handleCompileAndPublishFunnel = async () => {
    setIsDatabasePushLoading(true);
    setDatabaseNetworkError("");
    
    // 1. DYNAMIC URL GENERATION (Fixing the funnelcraft.io issue)
    const uniqueClientUrlTokenId = crypto.randomUUID();
    
    // Use window.location.origin so it works on localhost AND vercel automatically!
   // Dhyan rakhein ki ye line aise hi likhi ho:
const verifiedPublicClientLiveRouterLink = `${window.location.origin}/preview?id=${uniqueClientUrlTokenId}`;
    // 2. Packaging structural schemas payload data tree
    const consolidatedDbPayloadSchema = {
      id: uniqueClientUrlTokenId,
      name: `Funnel - ${new Date().toLocaleDateString()}`,
      canvas_state: funnelPagesDataStore,
      updated_at: new Date().toISOString()
    };

    try {
      // FORCE CHECK: Ensure keys exist before fetching
      if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_PUBLIC_KEY) {
         throw new Error("Missing Supabase Environment Variables. Check .env.local");
      }

      // 3. Native AJAX REST Data stream pipeline query
      const dbResponseStream = await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/${TARGET_TABLE_NAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_PUBLIC_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_PUBLIC_KEY}`,
          "Prefer": "resolution=merge-duplicates" // Autoupsert row 
        },
        body: JSON.stringify(consolidatedDbPayloadSchema)
      });

      if (!dbResponseStream.ok) {
        throw new Error(`Supabase Error: ${dbResponseStream.statusText}`);
      }

      // 4. Update UI ONLY if DB save was successful
      setGeneratedClientFunnelLink(verifiedPublicClientLiveRouterLink);
      setIsPublishModalOpen(true);
      triggerManualHotUpdateCommit(); // Update save timestamp

   } catch (networkErrorObj) {
      console.error("Publishing Failed:", networkErrorObj);
      alert("⚠️ Supabase Save Error: " + networkErrorObj.message); // <-- Yeh asli error turant screen par dikhayega
      setIsPublishModalOpen(false); // Error hone par popup mat kholo
    } finally {
      setIsDatabasePushLoading(false);
    }
  };

  const activeFilteredCatalogItems = ELEMENTOR_WIDGET_CATALOG.filter(w => {
    return w.name.toLowerCase().includes(activeWidgetSearchTerm.toLowerCase()) && (activeCatalogTab === "all" ? true : w.category === activeCatalogTab);
  });

  const getSimulatedViewportWidthClassName = () => {
    if (activeDeviceViewMode === "mobile") return "max-w-sm border-x-8 border-slate-800 rounded-3xl min-h-[720px]";
    if (activeDeviceViewMode === "tablet") return "max-w-3xl border-x-4 border-slate-700 rounded-2xl min-h-[820px]";
    return "w-full max-w-5xl rounded-md min-h-[85vh]";
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans antialiased select-none relative">
      
      {/* =========================================================================
          🛸 SLEEK COMPACT HEADER INTERFACE (REDUCED HEIGHT & MINI BRAND LOGO PRESERVED)
         ========================================================================= */}
      <header className="bg-[#1e3a8a] text-white px-4 py-1.5 flex flex-col md:flex-row gap-2 items-center justify-between sticky top-0 z-40 shadow-sm border-b border-blue-900">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 bg-pink-600 rounded flex items-center justify-center text-white font-black text-[10px]">FC</div>
          <div><h1 className="text-[11px] font-black tracking-wider uppercase leading-none">FunnelCraft</h1></div>
        </div>

        {/* FUNNEL SEQUENTIAL LIVE TABS PIPELINE + CLIENT NEW DYNAMIC TAB ADDER */}
<div className="flex items-center bg-blue-950 p-0.5 rounded-md border border-blue-800/50 flex-wrap gap-1">
  {funnelPageStepsTabs.map((step) => {
    const isDefaultPage = ["landing", "checkout", "thankyou"].includes(step);
    return (
      <div key={step} className="relative flex items-center bg-blue-900/40 rounded-md overflow-hidden pr-1">
        <button
          onClick={() => { setActivePageStep(step); setSelectedWidgetNode(null); }}
          className={`px-3 py-1 rounded-l text-[9px] font-black uppercase tracking-wider transition-all ${
            activePageStep === step ? "bg-blue-800 text-white shadow-xs" : "text-blue-300 hover:text-white"
          }`}
        >
          📄 {step}
        </button>
        
        {/* Agar page custom hai (client ne banaya hai), toh chhota delete (✕) button dikhao */}
        {!isDefaultPage && (
          <button
            onClick={(e) => deleteDynamicPageTab(step, e)}
            className="text-[9px] font-bold text-red-400 hover:text-red-500 hover:bg-red-950/50 px-1.5 py-1 transition-colors"
            title="Delete Page"
          >
            ✕
          </button>
        )}
      </div>
    );
  })}
  
  <button 
    onClick={instantiateDynamicNewPageChannelTab}
    className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-all ml-1 flex items-center gap-1"
  >
    <span>➕</span> New Page
  </button>
</div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCompileAndPublishFunnel}
            disabled={isDatabasePushLoading}
            className={`${isDatabasePushLoading ? "bg-slate-600 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-500"} font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded shadow-xs transition-transform active:scale-95`}
          >
            {isDatabasePushLoading ? "Syncing Database Matrix..." : "Publish Live Client URL"}
          </button>
        </div>
      </header>

      {/* =========================================================================
          🏗️ WORKSPACE GRID INTERFACE SECTION SPLIT
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* CONTROL SIDEBAR INSIGHT COMPONENT MODULE */}
        <aside className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden relative shadow-lg z-30">
          <div className="grid grid-cols-2 text-center text-[9px] font-black uppercase tracking-wider bg-slate-50 border-b border-slate-200">
            <button onClick={() => setSelectedWidgetNode(null)} className={`py-2.5 ${!selectedWidgetNode ? "bg-white text-pink-600 border-b-2 border-pink-500" : "text-slate-400"}`}>🧱 Elements Hub</button>
            <button disabled={!selectedWidgetNode} className={`py-2.5 ${selectedWidgetNode ? "bg-white text-pink-600 border-b-2 border-pink-500" : "text-slate-200 cursor-not-allowed"}`}>⚙️ Block Inspector</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-[#f8fafc] pb-24 content-scrollbar">
            {!selectedWidgetNode ? (
              <div className="space-y-3">
                <input type="text" placeholder="Search 40 Connected Widgets..." value={activeWidgetSearchTerm} onChange={(e) => setActiveWidgetSearchTerm(e.target.value)} className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-none text-slate-700 shadow-inner" />
                
                {/* CATEGORY SELECTOR CHIPS DOCK */}
                <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded text-[8px] font-black uppercase">
                  {["basic", "pro", "marketing", "ecommerce", "all"].map(cTab => (
                    <button key={cTab} onClick={() => setActiveCatalogTab(cTab)} className={`px-2 py-0.5 rounded ${activeCatalogTab === cTab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}>{cTab}</button>
                  ))}
                </div>

                {/* DYNAMIC SCROLL SYSTEM RENDER 40 PROFESSIONAL INTERACTIVE BLOCKS */}
                <div className="grid grid-cols-2 gap-1.5 max-h-[50vh] overflow-y-auto pr-1 content-scrollbar">
                  {activeFilteredCatalogItems.map(widget => (
                    <div
                      key={widget.type}
                      draggable
                      onDragStart={() => { setIsCurrentlyDraggingWidget(true); internalDraggedWidgetTypeRef.current = widget.type; }}
                      onDragEnd={() => setIsCurrentlyDraggingWidget(false)}
                      onClick={() => {
                        if(canvasRows.length > 0) {
                          appendWidgetToColumn(canvasRows[canvasRows.length - 1].id, canvasRows[canvasRows.length - 1].columns[0].id, widget.type);
                        } else { addNewSectionRowLayout(1); }
                      }}
                      className="p-2 bg-white border border-slate-200 rounded-md text-center cursor-grab hover:border-pink-500 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[60px]"
                    >
                      <span className="text-base mb-0.5 text-slate-400">{widget.icon}</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight leading-none">{widget.name}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Quick Injection Layout Matrix Rows</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map(num => (
                      <button key={num} onClick={() => addNewSectionRowLayout(num)} className="bg-white border text-[8px] font-bold p-1.5 rounded hover:bg-slate-50 text-slate-500 uppercase">{num} Col</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // =========================================================================
              // ⚙️ UNIFIED BLOCK LAYOUT INSPECTOR (UNIVERSAL HYPERLINKING FOR EVERY SINGLE ITEM)
              // =========================================================================
              <div className="space-y-4 font-sans text-left">
                <div className="bg-[#1e3a8a] text-white p-2 rounded flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wide">Editing: {selectedWidgetNode.widget.type}</span>
                  <button onClick={() => setSelectedWidgetNode(null)} className="text-[9px] font-bold bg-blue-900 px-1.5 py-0.5 rounded">✕ Clear</button>
                </div>

                {/* 🔗 UNIVERSAL REDIRECT LINK SYSTEM (INJECTED ON ALL ELEMENTS SANS EXCEPTION) */}
                <div className="bg-pink-50/60 p-2.5 border border-pink-200 rounded-lg space-y-1">
                  <label className="text-[9px] font-black text-pink-700 uppercase tracking-wider block">🔗 Universal Action Redirect Outbound Link</label>
                  <input 
                    type="url"
                    placeholder="e.g. https://funnelcraft.io/live/client_id_lkmwijf/checkout"
                    value={selectedWidgetNode.widget.redirectUrl || ""}
                    onChange={(e) => updateSelectedWidgetAttributes({ redirectUrl: e.target.value })}
                    className="w-full text-xs p-1.5 border border-pink-300 rounded bg-white font-mono text-pink-700 outline-none shadow-3xs"
                  />
                  <span className="text-[8px] text-pink-600/80 block leading-tight font-medium">Link any action endpoint. Works for Text, Images, Buttons, Grid fields, Cards etc.</span>
                </div>

                {/* IMAGE BOX CONTENT DIRECT INSERTER WITH RE-POLISHED URL AND DEVICE PICKER BUFFER */}
                {selectedWidgetNode.widget.type === "image" && (
                  <div className="space-y-2 border p-2.5 rounded bg-white">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">🖼️ Image Asset Source URL Stream Endpoint</span>
                    <input 
                      type="text" 
                      value={selectedWidgetNode.widget.content} 
                      placeholder="Paste online external web image URL asset links..."
                      onChange={(e) => updateSelectedWidgetAttributes({ content: e.target.value })} 
                      className="w-full text-xs p-1.5 border font-mono rounded bg-slate-50"
                    />
                    <div className="relative border border-dashed p-2 text-center rounded bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="file" accept="image/*" onChange={handleWidgetLocalImageBufferStream} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <span className="text-[9px] font-bold text-slate-500">📂 Alternative: Select Local Storage File Stream</span>
                    </div>
                  </div>
                )}

                {/* CONTENT EDIT TRANSLATOR ELEMENT PANEL */}
                {!["image", "divider", "spacer"].includes(selectedWidgetNode.widget.type) && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Modify Element Inner Content Text Value</span>
                    <textarea rows={3} value={selectedWidgetNode.widget.content} onChange={(e) => updateSelectedWidgetAttributes({ content: e.target.value })} className="w-full text-xs p-1.5 border rounded outline-none" />
                  </div>
                )}

                {/* 🎨 ADVANCED SETTINGS PANEL */}
                <div className="border-t pt-3 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2 border-b pb-1">⚙️ Appearance Settings</span>
                  
                  {/* TEXT COLOR & BACKGROUND COLOR */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Text Color Hex</label>
                      <input 
                        type="color" 
                        value={selectedWidgetNode.widget.styles?.color || "#000000"} 
                        onChange={(e) => updateSelectedWidgetAttributes({}, { color: e.target.value })} 
                        className="w-full h-8 p-0 cursor-pointer border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Background Hex</label>
                      <input 
                        type="color" 
                        value={selectedWidgetNode.widget.styles?.backgroundColor || "#ffffff"} 
                        onChange={(e) => updateSelectedWidgetAttributes({}, { backgroundColor: e.target.value })} 
                        className="w-full h-8 p-0 cursor-pointer border rounded"
                      />
                    </div>
                  </div>

                  {/* TYPOGRAPHY (Size & Weight) */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <div>
                      <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Font Size (px)</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="range" min="10" max="72" 
                          value={parseInt(selectedWidgetNode.widget.styles?.fontSize || "14")} 
                          onChange={(e) => updateSelectedWidgetAttributes({}, { fontSize: `${e.target.value}px` })} 
                          className="w-full accent-pink-500"
                        />
                        <span className="text-[9px] font-mono text-slate-500 w-6 text-right">{parseInt(selectedWidgetNode.widget.styles?.fontSize || "14")}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Font Weight</label>
                      <select 
                        value={selectedWidgetNode.widget.styles?.fontWeight || "400"} 
                        onChange={(e) => updateSelectedWidgetAttributes({}, { fontWeight: e.target.value })}
                        className="w-full text-[10px] p-1 border bg-white rounded font-bold outline-none"
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="600">Semi-Bold</option>
                        <option value="700">Bold</option>
                        <option value="900">Black</option>
                      </select>
                    </div>
                  </div>

                  {/* ALIGNMENT */}
                  <div>
                    <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Alignment</label>
                    <div className="flex gap-1 p-0.5 bg-slate-200 rounded text-center text-[10px]">
                      {["left", "center", "right", "justify"].map(pos => (
                        <button 
                          key={pos} 
                          onClick={() => updateSelectedWidgetAttributes({}, { textAlign: pos })} 
                          className={`flex-1 py-1 rounded transition-colors ${selectedWidgetNode.widget.styles?.textAlign === pos ? "bg-white text-pink-600 shadow-sm font-black" : "text-slate-500 hover:text-slate-700"}`}
                        >
                          {pos === 'left' ? '⫷' : pos === 'center' ? '☰' : pos === 'right' ? '⫸' : '▤'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* SPACING (Padding) */}
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <label className="text-[8px] text-slate-400 uppercase font-black block mb-1">Inner Spacing (Padding)</label>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center gap-1">
                          <span className="text-[8px] font-mono text-slate-400">Y</span>
                          <input 
                            type="range" min="0" max="100" 
                            value={parseInt(selectedWidgetNode.widget.styles?.paddingY || "0")} 
                            onChange={(e) => {
                               const val = e.target.value;
                               updateSelectedWidgetAttributes({}, { paddingY: val, paddingTop: `${val}px`, paddingBottom: `${val}px` });
                            }} 
                            className="w-full accent-blue-500"
                          />
                       </div>
                       <div className="flex items-center gap-1">
                          <span className="text-[8px] font-mono text-slate-400">X</span>
                          <input 
                            type="range" min="0" max="100" 
                            value={parseInt(selectedWidgetNode.widget.styles?.paddingX || "0")} 
                            onChange={(e) => {
                               const val = e.target.value;
                               updateSelectedWidgetAttributes({}, { paddingX: val, paddingLeft: `${val}px`, paddingRight: `${val}px` });
                            }} 
                            className="w-full accent-emerald-500"
                          />
                       </div>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* =========================================================================
              🛰️ BLACK MATTE TOGGLE BAR DOCK (STRICT SLATE BLACK MATRIX CHANNELS PRESERVED)
             ========================================================================= */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950 text-white p-2 border-t border-slate-900 flex flex-col gap-1.5 z-40">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <span className="text-[8px] font-mono tracking-wider text-slate-500 uppercase">📺 MONITOR VIEWPORTS DEPLOYED:</span>
              <div className="flex gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                {[{ id: "desktop", icon: "💻" }, { id: "tablet", icon: "🎴" }, { id: "mobile", icon: "📱" }].map(dev => (
                  <button key={dev.id} onClick={() => setActiveDeviceViewMode(dev.id)} className={`p-1 text-xs rounded transition-all ${activeDeviceViewMode === dev.id ? "bg-pink-600 text-white shadow font-bold" : "text-slate-500 hover:text-white"}`}>{dev.icon}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <span className="text-[7px] text-slate-600 block uppercase font-mono tracking-tighter">WORKSPACE REALTIME DATA SYNC</span>
                <span className="text-[8px] text-emerald-500 block font-mono truncate tracking-tighter">{lastSystemUpdateTimeStamp}</span>
              </div>
              <button onClick={triggerManualHotUpdateCommit} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] uppercase tracking-wider font-black px-2 py-1 rounded shadow transition-all active:scale-95">🔄 Update Page</button>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            🖥️ MAIN CENTRAL GRAPHIC INTERACTIVE EDITOR CANVAS CONTAINER
           ========================================================================= */}
        <main className="flex-1 bg-[#eaeef3] p-4 overflow-y-auto flex items-start justify-center content-scrollbar">
          <div className={`w-full bg-white text-slate-900 p-6 flex flex-col relative shadow-xl border border-slate-300 bg-dot-matrix-mesh transition-all duration-300 ${getSimulatedViewportWidthClassName()}`}>
            
            <div className="space-y-4 flex-1 mt-2">
              {canvasRows.map((row, rIdx) => (
                <div key={row.id} className="relative group/row border border-dashed border-slate-200 hover:border-blue-500 p-1.5 pt-5 rounded-lg bg-slate-50/10">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 flex items-center bg-[#1e3a8a] text-white rounded text-[8px] font-mono font-black shadow-md px-1.5 py-0.5 gap-2 z-30">
                    <button onClick={(e) => { e.stopPropagation(); purgeWholeSectionRowNode(row.id, e); }} className="bg-red-600 hover:bg-red-500 px-1 rounded font-sans font-black text-center">✕ Delete Row Layer</button>
                  </div>

                  <div className={`flex gap-3 items-stretch ${activeDeviceViewMode === "mobile" ? "flex-col" : "native-row-flex"}`}>
                    {row.columns.map((column, cIdx) => (
                      <div
                        key={column.id}
                        style={{ width: activeDeviceViewMode === "mobile" ? "100%" : `${column.widthPercent}%` }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => { if (isCurrentlyDraggingWidget && internalDraggedWidgetTypeRef.current) { appendWidgetToColumn(row.id, column.id, internalDraggedWidgetTypeRef.current); } }}
                        className="border border-dashed border-slate-200 bg-white hover:border-emerald-500 rounded-md p-3 flex flex-col gap-3 relative min-h-[90px]"
                      >
                        {column.widgets.map((widget, wIdx) => {
                          const isCurrentActiveWidgetTarget = selectedWidgetNode?.widget.id === widget.id;
                          const structuralComputedWidgetStyles = {
                            color: widget.styles?.color || "inherit",
                            fontSize: widget.styles?.fontSize || "inherit",
                            textAlign: widget.styles?.textAlign || "left",
                            fontWeight: widget.styles?.fontWeight || "normal",
                            fontFamily: widget.styles?.fontFamily || "sans-serif",
                            backgroundColor: widget.styles?.backgroundColor || "transparent",
                            paddingTop: widget.styles?.paddingTop || "0px",
                            paddingBottom: widget.styles?.paddingBottom || "0px",
                            paddingLeft: widget.styles?.paddingLeft || "0px",
                            paddingRight: widget.styles?.paddingRight || "0px",
                          };

                          return (
                            <div
                              key={widget.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedWidgetNode({ widget, rowId: row.id, columnId: column.id }); }}
                              className={`relative p-2 rounded-md border-2 transition-all group/widget cursor-pointer ${isCurrentActiveWidgetTarget ? "border-pink-500 bg-pink-50/10 shadow-2xs" : "border-transparent hover:border-slate-200"}`}
                            >
                              <div className="absolute right-1 top-1 opacity-0 group-hover/widget:opacity-100 flex items-center bg-slate-900 text-white rounded p-0.5 shadow-xs z-30 text-[8px] font-mono">
                                <button onClick={(e) => { e.stopPropagation(); shiftWidgetVerticalOrder(rIdx, cIdx, wIdx, -1); }} className="px-0.5 hover:bg-slate-700">▲</button>
                                <button onClick={(e) => { e.stopPropagation(); shiftWidgetVerticalOrder(rIdx, cIdx, wIdx, 1); }} className="px-0.5 hover:bg-slate-700">▼</button>
                                <button onClick={(e) => dropWidgetInstanceFromTree(row.id, column.id, widget.id, e)} className="px-1 bg-red-700 rounded ml-1 text-white">✕</button>
                              </div>

                              {/* VISUAL REDIRECT INDICATOR LINK FLAG (RE-VERIFIED FOR ALL ACTIVE BLOCKS) */}
                              {widget.redirectUrl && (
                                <div className="absolute top-0 left-0 bg-pink-600 text-white text-[7px] font-mono px-1 rounded-br uppercase tracking-wider pointer-events-none z-20 shadow-xs">
                                  🔗 Bound Target: {widget.redirectUrl.substring(0, 30)}...
                                </div>
                              )}

                              {/* 40 WIDGETS LAYOUT COMPILER RENDER SWITCH */}
                              <div style={structuralComputedWidgetStyles}>
                                {(() => {
                                  switch (widget.type) {
                                    case "heading": return <h2 className="m-0 leading-tight font-black tracking-tight">{widget.content}</h2>;
                                    case "sub_heading": return <h3 className="m-0 leading-snug font-bold tracking-wide">{widget.content}</h3>;
                                    case "paragraph": return <p className="m-0 leading-normal font-medium">{widget.content}</p>;
                                    case "image": return <div className="w-full flex justify-center"><img src={widget.content} alt="Visual" className="max-h-64 object-contain rounded border shadow-3xs" /></div>;
                                    case "video": return <div className="aspect-video w-full border bg-black"><iframe className="w-full h-full" src={widget.content} title="Video Embed"></iframe></div>;
                                    case "button": return <button className="font-sans font-bold uppercase shadow-sm text-white px-4 py-2 bg-rose-600 rounded text-[10px] tracking-wide">{widget.content}</button>;
                                    case "divider": return <div className="w-full my-2" style={{ borderTop: `${widget.styles?.thickness || "1px"} solid ${widget.styles?.color || "#e2e8f0"}` }}></div>;
                                    case "spacer": return <div style={{ height: widget.styles?.verticalSpace || "20px" }} className="bg-slate-100/40 border border-dashed border-slate-200 flex items-center justify-center text-[8px] text-slate-300 font-mono">Spacer Area</div>;
                                    case "bullet_list": return <ul className="list-disc pl-4 text-left space-y-1">{widget.content.split("|").map((li, idx) => <li key={idx} className="text-xs font-semibold">{li}</li>)}</ul>;
                                    case "icon_box": return <div className="p-3 bg-slate-50 border rounded text-xs font-bold flex items-center gap-2"><span>🛡️</span> {widget.content}</div>;
                                    
                                    // Forms
                                    case "pro_form":
                                    case "checkout_form":
                                    case "phone_capture":
                                      return (
                                        <div className="bg-[#fdfbf7] border border-amber-200 p-4 rounded-lg space-y-2 w-full max-w-xs mx-auto text-left shadow-3xs">
                                          <span className="text-[8px] font-black text-amber-700 tracking-widest uppercase block font-mono bg-amber-100 px-1.5 py-0.5 rounded w-max">📋 {widget.name}</span>
                                          {widget.fields?.map((fld, fIdx) => (
                                            <div key={fIdx} className="space-y-0.5">
                                              <span className="text-[9px] font-bold text-slate-500 uppercase">{fld.label}</span>
                                              <input type="text" className="w-full border p-1 rounded text-xs bg-white" disabled placeholder={`Data field vector...`} />
                                            </div>
                                          ))}
                                          <button className="w-full text-[9px] bg-[#1e3a8a] font-black text-white py-1.5 rounded uppercase tracking-wider">{widget.content}</button>
                                        </div>
                                      );
                                    case "dropdown_select": return <select className="w-full text-xs p-2 border bg-white rounded font-medium" disabled>{widget.content.split("|").map((opt, i) => <option key={i}>{opt}</option>)}</select>;
                                    case "checkbox_verify": return <div className="flex gap-2 items-start text-left text-xs font-semibold"><input type="checkbox" disabled defaultChecked /> <span>{widget.content}</span></div>;
                                    case "progress_bar": return <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden"><div className="bg-emerald-500 h-full w-[75%]" style={{ backgroundColor: widget.styles?.color }}></div></div>;
                                    case "file_upload": return <div className="border border-dashed p-3 text-center rounded text-xs bg-slate-50 font-bold text-slate-400">📤 {widget.content}</div>;
                                    
                                    // Triggers
                                    case "star_rating": return <div className="text-amber-500 text-xs py-0.5">{Array.from({ length: 5 }).map((_, i) => (i < parseInt(widget.content || "5") ? "★" : "☆"))}</div>;
                                    case "social_icons": return <div className="flex gap-1.5 justify-center py-0.5">{widget.content.split("|").map((sc, sIdx) => <div key={sIdx} className="h-6 w-6 rounded-full text-white font-black text-[9px] uppercase flex items-center justify-center bg-blue-600 shadow-3xs">{sc.trim()}</div>)}</div>;
                                    case "counter_node": return <div className="text-center bg-[#fdfbf7] p-2 rounded border max-w-xs mx-auto"><span className="block text-lg font-black text-[#1e3a8a] font-mono">{widget.content}</span><span className="block text-[8px] font-bold text-slate-400 mt-0.5">{widget.metaLabel}</span></div>;
                                    case "countdown_timer": return <div className="text-center p-2 bg-red-50 border border-red-200 rounded text-xs font-mono font-black text-red-600">⏳ {widget.content}</div>;
                                    case "pricing_card": return <div className="border border-blue-200 bg-blue-50/20 p-4 rounded-lg text-center"><h4 className="text-xl font-black text-blue-900 m-0">{widget.content}</h4><p className="text-[10px] text-slate-500 m-0">{widget.metaLabel}</p></div>;
                                    case "guarantee_badge": return <div className="p-2 border border-emerald-300 bg-emerald-50/50 rounded-lg text-center text-[10px] font-bold text-emerald-800">🛡️ {widget.content}</div>;
                                    case "review_card": return <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left italic text-xs text-slate-600">"{widget.content}"</div>;
                                    case "faq_accordion": return <div className="space-y-1 text-left">{widget.content.split("|").map((faq, idx) => <div key={idx} className="p-2 bg-white border rounded text-xs font-bold text-slate-700">❓ {faq}</div>)}</div>;
                                    
                                    // Ecommerce
                                    case "cart_summary": return <div className="p-3 bg-slate-50 border border-dashed rounded text-xs font-mono text-left bg-yellow-50/20">🛒 {widget.content}</div>;
                                    case "coupon_code": return <div className="flex gap-1"><input type="text" value={widget.content} disabled className="border p-1 text-xs rounded bg-white flex-1" /><button className="bg-slate-900 text-white text-[10px] px-2 rounded font-bold">Apply</button></div>;
                                    case "order_bump": return <div className="p-2 bg-amber-50 border border-amber-300 rounded text-xs font-bold text-amber-900 flex gap-2"><input type="checkbox" defaultChecked disabled /> <span>{widget.content}</span></div>;
                                    case "alert_bar": return <div style={{ backgroundColor: widget.styles?.backgroundColor }} className="p-2 text-white rounded text-center text-xs font-black uppercase tracking-wide">{widget.content}</div>;
                                    case "html_embed": return <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[9px] rounded text-left shadow-inner">Code Output Vector Embed: {widget.content.substring(0, 40)}...</div>;
                                    
                                    default: return <div className="p-2 bg-slate-100 text-[9px]">{widget.content || "Custom Element Template Matrix Node"}</div>;
                                  }
                                })()}
                              </div>

                            </div>
                          );
                        })}
                        {column.widgets.length === 0 && (
                          <div className="flex-1 border border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-center p-2 bg-slate-50/30">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Empty column cell layout area</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* =========================================================================
          🎨 LIVE STACK MODAL OVERLAY (NATIVE REAL TIME NETWORK CONNECTOR STATUS)
         ========================================================================= */}
      {isPublishModalOpen && generatedClientFunnelLink && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col animate-fadeIn">
            
            <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider m-0">FunnelCraft Production Grid Live</h3>
                  <p className="text-[9px] text-blue-200 font-mono m-0">Payload deployed securely on Supabase relational infrastructure</p>
                </div>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="bg-blue-900/80 hover:bg-red-600 text-white h-6 w-6 flex items-center justify-center rounded-full font-black text-sm">✕</button>
            </div>

            <div className="p-5 space-y-4 bg-slate-50 text-left font-sans">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-3 rounded-lg flex items-center gap-2">
                <span>⚡</span>
                <span>Handshake Complete: Row data synchronized with ID columns mapping vectors securely!</span>
              </div>

              {/* LIVE CLIENT RE-ROUTED DIRECT LINK INTERACTIVE ELEMENT */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">🔗 Live Client Routing URL (Direct Functional Web Link):</span>
                <div className="flex gap-2 items-center bg-white p-2.5 border rounded-lg shadow-inner group">
                  <input type="text" readOnly value={generatedClientFunnelLink} className="flex-1 text-xs font-mono font-bold text-[#1e3a8a] bg-transparent outline-none select-all" />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedClientFunnelLink);
                      alert("📋 Live Link copied! This URL triggers direct payload rendering via your Supabase DB data values.");
                    }}
                    className="bg-pink-600 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded transition-transform active:scale-95 shrink-0"
                  >
                    Copy Client URL
                  </button>
                </div>
                {databaseNetworkError && (
                  <p className="text-[9px] text-amber-600 font-mono font-bold bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ Demo Note: Local Supabase credentials key is unconfigured. Showing generated schema preview framework fallback logs.
                  </p>
                )}
              </div>

              {/* INTEGRATED PIPELINE SCHEMATICS DEBUGGER */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Database Storage Structural Topology Output Manifest:</span>
                <pre className="w-full text-[9px] font-mono bg-slate-900 text-pink-400 p-3 rounded-lg overflow-x-auto border border-slate-950 max-h-[140px] select-text shadow-md">
                  {JSON.stringify({
                    databaseEngineHost: "Supabase Relational Network DB via REST API",
                    targetRecordIdKey: "client_id_lkmwijf",
                    targetTableSchema: TARGET_TABLE_NAME,
                    registeredClientPages: funnelPageStepsTabs,
                    payloadDataTree: funnelPagesDataStore
                  }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-slate-100 border-t p-3 flex justify-end gap-2">
              <button onClick={() => setIsPublishModalOpen(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-md transition-colors">Close Log Engine Terminal</button>
            </div>

          </div>
        </div>
      )}

      {/* CORE FRAMEWORK DESIGN STYLES SHIELD EMBEDDINGS ONLY */}
      <style jsx global>{`
        .content-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .content-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .content-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .bg-dot-matrix-mesh {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 16px 16px;
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.12s ease-out forwards; }
        @media(max-width: 768px) {
          .native-row-flex { flex-direction: column !important; gap: 12px !important; }
          .native-row-flex > div { width: 100% !important; }
        }
      `}</style>

    </div>
  );
}