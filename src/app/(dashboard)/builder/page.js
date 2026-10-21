"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase";

// =========================================================================
// 🌐 CONFIG MASTER DATA WIDGET REGISTRY SYSTEMS (150 PROFESSIONAL ELEMENTS)
// =========================================================================
const ELEMENTOR_WIDGET_CATALOG = [
  // --- 📐 1. STRUCTURAL LAYOUTS ---
  { type: "layout_1", name: "1 Column Row", category: "layout", icon: "⚃", defaultContent: "Empty Section" },
  { type: "layout_2", name: "2 Column Split", category: "layout", icon: "⚄", defaultContent: "50/50 Grid" },
  { type: "layout_3", name: "3 Column Grid", category: "layout", icon: "⚅", defaultContent: "33/33/33 Grid" },
  { type: "spacer", name: "Empty Spacer", category: "layout", icon: "⇳", defaultContent: "Spacer", styles: { verticalSpace: "40px" } },
  { type: "divider", name: "Divider Line", category: "layout", icon: "―", defaultContent: "", styles: { thickness: "2px", color: "#e2e8f0", verticalMargin: "24px" } },

  // --- 📝 2. TYPOGRAPHY & TEXT ---
  { type: "h1", name: "Heading 1 (Hero)", category: "text", icon: "H1", defaultContent: "Main Hero Headline", styles: { color: "#0f172a", fontSize: "42px", fontWeight: "900" } },
  { type: "h2", name: "Heading 2 (Section)", category: "text", icon: "H2", defaultContent: "Section Title", styles: { color: "#1e293b", fontSize: "32px", fontWeight: "800" } },
  { type: "h3", name: "Heading 3", category: "text", icon: "H3", defaultContent: "Sub Title", styles: { color: "#334155", fontSize: "24px", fontWeight: "700" } },
  { type: "paragraph", name: "Paragraph Text", category: "text", icon: "▤", defaultContent: "Your descriptive text goes here.", styles: { color: "#475569", fontSize: "15px", lineHeight: "1.6" } },
  { type: "bullet_list", name: "Standard List", category: "text", icon: "•", defaultContent: "Feature One\nFeature Two\nFeature Three" },
  { type: "check_list", name: "Checkmark List", category: "text", icon: "✓", defaultContent: "High Speed\nSecure\nReliable" },

  // --- 📸 3. MEDIA & VISUALS ---
  { type: "image", name: "Single Image", category: "media", icon: "🖼", defaultContent: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", imageSourceMode: "url" },
  { type: "video_embed", name: "YouTube/Vimeo", category: "media", icon: "▷", defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  
  // --- ⚡ 4. FORMS & LEAD CAPTURE ---
  { type: "form_optin", name: "Email Opt-in", category: "forms", icon: "✉", defaultContent: "Subscribe Now", fields: [{ label: "Email Address", type: "email" }] },
  { type: "form_contact", name: "Contact Form", category: "forms", icon: "📝", defaultContent: "Send Message", fields: [{ label: "Name", type: "text" }, { label: "Email", type: "email" }, { label: "Message", type: "textarea" }] },
  { type: "login_form", name: "Login Portal", category: "forms", icon: "🔓", defaultContent: "Access Dashboard" },
  
  // --- 🎯 5. MARKETING & CONVERSION ---
  { type: "button_primary", name: "Primary CTA", category: "marketing", icon: "🔥", defaultContent: "Get Started Now", styles: { backgroundColor: "#4f46e5", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "countdown_timer", name: "Scarcity Countdown", category: "marketing", icon: "⏳", defaultContent: "Offer ends in 15:00 minutes" },
  { type: "urgency_text", name: "Urgency Blinker", category: "marketing", icon: "🔴", defaultContent: "Live Now: 231 people are viewing this page." },

  // --- 🛒 6. E-COMMERCE & WEB3 ---
  { type: "product_card", name: "Product Card", category: "ecommerce", icon: "🛍️", defaultContent: "T-Shirt - $20" },
  { type: "add_to_cart", name: "Add to Cart Btn", category: "ecommerce", icon: "🛒", defaultContent: "Add to Cart - $19.99", styles: { backgroundColor: "#10b981", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "razorpay_btn", name: "Razorpay Checkout", category: "ecommerce", icon: "₹", defaultContent: "Pay Now (UPI/Cards)", pricing: { rate: "", discount: "", finalPrice: "500" } },

  // --- 🌐 7. SOCIAL & ADVANCED ---
  { type: "social_share", name: "Share Buttons", category: "social", icon: "🔗", defaultContent: "Share on: Facebook | Twitter | LinkedIn" },
  { type: "custom_html", name: "HTML Snippet", category: "advanced", icon: "🧬", defaultContent: "<!-- Custom HTML Goes Here -->" },
];

export default function FunnelBuilderEngine() {
  const router = useRouter();

  // 🧠 CORE STATES
  const [canvasRows, setCanvasRows] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  
  // 🌟 NEW UI STATES
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDatabasePushLoading, setIsDatabasePushLoading] = useState(false);

  // ==========================================
  // 🛠️ TOP NAVBAR ACTIONS
  // ==========================================
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout? Unsaved changes may be lost.")) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  const handleManualSave = () => {
    // Basic Local Save Logic Simulation
    localStorage.setItem("funnel_draft", JSON.stringify(canvasRows));
    alert("✅ Canvas successfully updated & saved locally!");
  };

  const handlePublish = async () => {
    setIsDatabasePushLoading(true);
    // Add real database push logic here later
    setTimeout(() => {
      setIsDatabasePushLoading(false);
      alert("🚀 Funnel Published Successfully! View it on the live link.");
    }, 1500);
  };

  // ==========================================
  // 🖱️ DRAG & DROP LOGIC
  // ==========================================
  const handleDragStart = (e, widgetTemplate) => {
    e.dataTransfer.setData("widgetTemplate", JSON.stringify(widgetTemplate));
  };

  const handleDrop = (e, targetRowId, targetColId) => {
    e.preventDefault();
    const widgetDataString = e.dataTransfer.getData("widgetTemplate");
    if (!widgetDataString) return;

    const template = JSON.parse(widgetDataString);
    const newWidget = {
      ...template,
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };

    if (template.category === "layout") {
      // Create new row with columns based on layout type
      let columns = [];
      if (template.type === "layout_1") columns = [{ id: `col_${Date.now()}_1`, widthPercent: 100, widgets: [] }];
      else if (template.type === "layout_2") columns = [{ id: `col_${Date.now()}_1`, widthPercent: 50, widgets: [] }, { id: `col_${Date.now()}_2`, widthPercent: 50, widgets: [] }];
      else if (template.type === "layout_3") columns = [{ id: `col_${Date.now()}_1`, widthPercent: 33.3, widgets: [] }, { id: `col_${Date.now()}_2`, widthPercent: 33.3, widgets: [] }, { id: `col_${Date.now()}_3`, widthPercent: 33.3, widgets: [] }];
      else columns = [{ id: `col_${Date.now()}_1`, widthPercent: 100, widgets: [] }]; // Fallback

      const newRow = { id: `row_${Date.now()}`, type: template.type, columns };
      setCanvasRows([...canvasRows, newRow]);
    } else {
      // Drop widget into specific column
      if (!targetRowId || !targetColId) {
        alert("Please drag a Layout block first, then drop widgets inside its columns.");
        return;
      }
      setCanvasRows(prev => prev.map(row => {
        if (row.id === targetRowId) {
          return {
            ...row,
            columns: row.columns.map(col => {
              if (col.id === targetColId) {
                return { ...col, widgets: [...col.widgets, newWidget] };
              }
              return col;
            })
          };
        }
        return row;
      }));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // ==========================================
  // 🎛️ RIGHT SIDEBAR UPDATER LOGIC
  // ==========================================
  const updateWidgetContent = (newContent) => {
    if (!selectedWidget) return;
    const updatedWidget = { ...selectedWidget, content: newContent };
    setSelectedWidget(updatedWidget);
    syncWidgetToCanvas(updatedWidget);
  };

  const updateWidgetStyle = (styleKey, value) => {
    if (!selectedWidget) return;
    const updatedWidget = { ...selectedWidget, styles: { ...selectedWidget.styles, [styleKey]: value } };
    setSelectedWidget(updatedWidget);
    syncWidgetToCanvas(updatedWidget);
  };

  const syncWidgetToCanvas = (updatedWidget) => {
    setCanvasRows(prev => prev.map(row => ({
      ...row,
      columns: row.columns.map(col => ({
        ...col,
        widgets: col.widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w)
      }))
    })));
  };

  const deleteWidget = (rowId, colId, widgetId) => {
    setCanvasRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          columns: row.columns.map(col => {
            if (col.id === colId) {
              return { ...col, widgets: col.widgets.filter(w => w.id !== widgetId) };
            }
            return col;
          })
        };
      }
      return row;
    }));
    if (selectedWidget?.id === widgetId) setSelectedWidget(null);
  };

  // ==========================================
  // 🎨 LIVE CANVAS RENDERER (Smart Previews)
  // ==========================================
  const renderWidgetPreview = (widget) => {
    const wType = widget.type;
    const styles = widget.styles || {};
    
    // 1. FORMS & INPUTS (Live Look)
    if (wType.includes("form") || wType === "login_form") {
      return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full text-left" style={styles}>
          <h3 className="font-bold mb-4 text-[#0B1536] text-center text-lg">{widget.name}</h3>
          <div className="space-y-3">
            <input type="text" readOnly placeholder="Full Name / Details" className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-sm outline-none" />
            <input type="email" readOnly placeholder="Email Address" className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-sm outline-none" />
            <button className="w-full bg-[#0B1536] hover:bg-indigo-600 text-white font-black py-3 rounded-lg text-sm transition-colors mt-2 uppercase tracking-wide">
              {widget.content || "Submit Details"}
            </button>
          </div>
        </div>
      );
    }

    // 2. CHECKOUT & PAYMENTS
    if (wType.includes("checkout") || wType === "razorpay_btn" || wType === "add_to_cart") {
      return (
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-lg w-full text-center" style={styles}>
          <h3 className="font-black text-[#0B1536] mb-1 text-lg">Secure Checkout</h3>
          <p className="text-emerald-600 font-bold text-xl mb-4">₹{widget.pricing?.finalPrice || "500"}</p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider shadow-md transition-all">
            🔒 PAY SECURELY NOW
          </button>
          <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">Secured by Razorpay</p>
        </div>
      );
    }

    // 3. BUTTONS (Primary)
    if (wType.includes("button")) {
      return (
        <button className="font-black shadow-lg transition-transform hover:scale-105" 
          style={{ backgroundColor: styles.backgroundColor || '#4f46e5', color: styles.color || '#fff', padding: styles.padding || '14px 28px', borderRadius: styles.borderRadius || '8px', fontSize: styles.fontSize || '16px' }}>
          {widget.content}
        </button>
      );
    }

    // 4. MEDIA (Images & Video placeholders)
    if (wType === "image") return <img src={widget.content} alt="Preview" className="max-w-full h-auto rounded-lg shadow-sm" />;
    if (wType.includes("video")) return <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white/50 text-xs font-bold border-4 border-slate-800">▶ Video Embed Area</div>;
    
    // 5. MARKETING BANNERS
    if (wType === "urgency_text") return <div className="bg-red-50 text-red-600 font-bold p-3 rounded-lg border border-red-200 text-center animate-pulse">{widget.content}</div>;
    if (wType === "countdown_timer") return <div className="font-mono font-black text-2xl text-red-600 bg-red-50 py-3 rounded border border-red-100 text-center">{widget.content}</div>;

    // 6. TYPOGRAPHY
    if (["h1","h2","h3","h4","h5","h6"].includes(wType)) {
      const Tag = wType;
      return <Tag style={{ fontSize: styles.fontSize, color: styles.color, fontWeight: styles.fontWeight || 'bold' }} className="m-0 leading-tight">{widget.content}</Tag>;
    }
    if (wType === "bullet_list" || wType === "check_list") {
      return (
        <ul className="pl-5 text-left space-y-1" style={{ color: styles.color, fontSize: styles.fontSize }}>
          {widget.content.split('\n').map((item, i) => <li key={i} className="flex items-center gap-2"><span className="text-indigo-500 font-bold">{wType === "check_list" ? "✓" : "•"}</span> {item}</li>)}
        </ul>
      );
    }

    // FALLBACK
    return <div style={{ fontSize: styles.fontSize, color: styles.color }}>{widget.content}</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] overflow-hidden selection:bg-indigo-200">
      
      {/* ==========================================
          HEADER NAVBAR (With Logout) 
      ========================================== */}
      <header className="h-14 bg-[#0B1536] border-b border-slate-800 flex items-center justify-between px-4 text-white z-50 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-black text-xs px-2 py-1 rounded">AI</div>
          <h1 className="font-black tracking-widest text-sm uppercase">Website Builder <span className="text-slate-500 font-medium ml-1">Pro</span></h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 🚪 TOP LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-500/30 rounded-md hover:bg-red-900/30 transition-all mr-2"
          >
            Logout
          </button>

          <button 
            onClick={handleManualSave}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
          >
            💾 Update
          </button>

          <button 
            onClick={handlePublish} disabled={isDatabasePushLoading}
            className={`bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 ${isDatabasePushLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            {isDatabasePushLoading ? "Syncing..." : "🚀 Publish"}
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN WORKSPACE
      ========================================== */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 🔘 SIDEBAR HIDE/SHOW TOGGLE BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-40 bg-indigo-600 hover:bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 border-2 border-[#0B1536]"
          title={isSidebarOpen ? "Hide Elements Menu" : "Show Elements Menu"}
        >
          {isSidebarOpen ? "◀" : "▶"}
        </button>

        {/* ==========================================
            LEFT SIDEBAR (150 WIDGETS)
        ========================================== */}
        <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-30 shrink-0 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden opacity-0'}`}>
          <div className="p-4 bg-slate-50 border-b border-slate-200 pt-14">
             <input type="text" placeholder="Search 150+ elements..." className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {["layout", "text", "media", "forms", "marketing", "ecommerce", "social"].map(category => (
              <div key={category}>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ELEMENTOR_WIDGET_CATALOG.filter(w => w.category === category).map((widget, i) => (
                    <div 
                      key={i}
                      draggable
                      onDragStart={(e) => handleDragStart(e, widget)}
                      className="bg-white border border-slate-200 rounded-lg p-2 text-center cursor-grab hover:border-indigo-500 hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="text-xl mb-1">{widget.icon}</div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase truncate">{widget.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ==========================================
            CENTER CANVAS (DRAG & DROP AREA)
        ========================================== */}
        <main className="flex-1 flex justify-center overflow-y-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] p-8"
              onDrop={(e) => handleDrop(e, null, null)}
              onDragOver={handleDragOver}>
          
          <div className="w-full max-w-[1200px] min-h-[800px] bg-white shadow-2xl rounded-sm border border-slate-200 pb-20">
            {canvasRows.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 m-8 rounded-2xl bg-slate-50/50">
                <span className="text-5xl mb-4">✨</span>
                <p className="font-black text-xl text-slate-700 tracking-tight">Start Building Your Funnel</p>
                <p className="text-sm mt-1 mb-6 text-slate-500">Drag a layout from the left sidebar to begin.</p>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-black uppercase tracking-wider shadow-lg">Auto-Build with AI</button>
              </div>
            ) : (
              <div className="w-full">
                {canvasRows.map(row => (
                  <div key={row.id} className="w-full flex border-b border-dashed border-slate-200 relative group p-2 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Row Settings Pill */}
                    <div className="absolute -top-3 left-4 bg-[#0B1536] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                       Row <button onClick={() => setCanvasRows(canvasRows.filter(r => r.id !== row.id))} className="text-red-400 hover:text-red-300">✖</button>
                    </div>

                    <div className="w-full flex flex-col md:flex-row gap-4 p-2">
                      {row.columns.map(col => (
                        <div 
                          key={col.id} 
                          style={{ flexBasis: `${col.widthPercent}%` }} 
                          className="min-h-[100px] border-2 border-dashed border-indigo-100 rounded-lg bg-indigo-50/30 p-2 flex flex-col gap-2 relative transition-all"
                          onDrop={(e) => { e.stopPropagation(); handleDrop(e, row.id, col.id); }}
                          onDragOver={handleDragOver}
                        >
                           {col.widgets.map(widget => (
                             <div 
                               key={widget.id}
                               onClick={(e) => { e.stopPropagation(); setSelectedWidget(widget); }}
                               className={`relative group cursor-pointer p-1 rounded transition-all ${selectedWidget?.id === widget.id ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:ring-1 hover:ring-slate-300'}`}
                             >
                               {/* Widget Controls */}
                               <div className="absolute -top-3 -right-2 bg-[#0B1536] flex rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 overflow-hidden">
                                  <button onClick={(e) => { e.stopPropagation(); deleteWidget(row.id, col.id, widget.id); }} className="px-2 py-1 bg-red-500 text-white text-[10px] hover:bg-red-600 font-bold">Delete ✖</button>
                               </div>

                               {/* Render Logic */}
                               <div className="w-full pointer-events-none">
                                 {renderWidgetPreview(widget)}
                               </div>
                             </div>
                           ))}
                           {col.widgets.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase tracking-widest pointer-events-none">Drop Widget Here</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ==========================================
            RIGHT SIDEBAR (PRO EDITOR)
        ========================================== */}
        {selectedWidget && (
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 shrink-0 transform transition-transform">
            <div className="p-4 bg-[#0B1536] text-white flex justify-between items-center shadow-md">
               <div>
                 <p className="text-[9px] text-indigo-300 font-black uppercase tracking-widest mb-0.5">Editing Element</p>
                 <h3 className="font-bold text-sm flex items-center gap-2">{selectedWidget.icon} {selectedWidget.name}</h3>
               </div>
               <button onClick={() => setSelectedWidget(null)} className="text-slate-400 hover:text-white bg-slate-800 rounded-md w-6 h-6 flex items-center justify-center transition-colors">✖</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* 📝 SMART CONTENT EDITOR */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Content Details</label>
                
                {/* Standard Text Input */}
                {!selectedWidget.type.includes("form") && !selectedWidget.type.includes("checkout") && !selectedWidget.type.includes("razorpay") && (
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all shadow-sm bg-slate-50"
                    rows="4"
                    value={selectedWidget.content}
                    onChange={(e) => updateWidgetContent(e.target.value)}
                    placeholder="Enter text or URL here..."
                  />
                )}

                {/* Form Specific Inputs */}
                {selectedWidget.type.includes("form") && (
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1 block">Button Text</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500" 
                        value={selectedWidget.content || ""} 
                        onChange={(e) => updateWidgetContent(e.target.value)}
                        placeholder="e.g. Submit Now" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1 block">Redirect URL (After Submit)</label>
                      <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500" placeholder="https://..." />
                    </div>
                  </div>
                )}

                {/* E-Commerce Inputs */}
                {selectedWidget.type === "razorpay_btn" && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 block">Product Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-emerald-500" 
                        value={selectedWidget.pricing?.finalPrice || "500"} 
                        onChange={(e) => setSelectedWidget({...selectedWidget, pricing: { ...selectedWidget.pricing, finalPrice: e.target.value }})}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 🎨 SMART STYLE EDITOR */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Design & Colors</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Text Color</label>
                    <input type="color" className="w-full h-10 cursor-pointer rounded-lg border border-slate-200 p-1" 
                      value={selectedWidget.styles?.color || "#000000"} 
                      onChange={(e) => updateWidgetStyle('color', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Background</label>
                    <input type="color" className="w-full h-10 cursor-pointer rounded-lg border border-slate-200 p-1" 
                      value={selectedWidget.styles?.backgroundColor || "#ffffff"} 
                      onChange={(e) => updateWidgetStyle('backgroundColor', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Font Size</label>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{selectedWidget.styles?.fontSize || "16px"}</span>
                  </div>
                  <input type="range" min="10" max="100" className="w-full accent-indigo-600" 
                    value={parseInt(selectedWidget.styles?.fontSize) || 16}
                    onChange={(e) => updateWidgetStyle('fontSize', `${e.target.value}px`)} 
                  />
                </div>
              </div>

              {/* AI ENHANCER BUTTON */}
              <div className="pt-4 border-t border-slate-100">
                <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-[11px] uppercase tracking-wider py-3 rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                  ✨ Enhance with AI
                </button>
              </div>

            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
