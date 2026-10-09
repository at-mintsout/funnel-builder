"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ==========================================
// 🎨 SVG ICONS FOR PRO LOOK
// ==========================================
const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  More: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>,
  Chart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>,
  Sparkles: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>,
};

export default function DashboardPage() {
  const router = useRouter();
  
  // -- Global States --
  const [funnels, setFunnels] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // -- CRM / Analytics View States --
  const [selectedFunnelAnalytics, setSelectedFunnelAnalytics] = useState(null);
  const [funnelLeads, setFunnelLeads] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [dateRange, setDateRange] = useState("Last 30 Days");

  // ==========================================
  // 🔄 FETCH DATA
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: funnelData, error: funnelError } = await supabase.from("funnels").select("*");
        if (funnelError) throw funnelError;
        
        // Mocking extra analytics data for Pro Dashboard look
        const enhancedFunnels = (funnelData || []).map(f => ({
          ...f,
          status: f.status || (Math.random() > 0.3 ? "Live" : "Draft"),
          views: Math.floor(Math.random() * 5000) + 500,
          leadsCount: Math.floor(Math.random() * 500) + 10,
          revenue: Math.floor(Math.random() * 50000) + 5000
        }));
        
        setFunnels(enhancedFunnels);

        const { count, error: leadError } = await supabase.from("leads").select("*", { count: "exact", head: true });
        if (!leadError) setTotalLeads(count || enhancedFunnels.reduce((acc, curr) => acc + curr.leadsCount, 0));

      } catch (err) {
        console.error("Dashboard error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ==========================================
  // ⚙️ FUNNEL ACTIONS
  // ==========================================
  const toggleFunnelStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Live" ? "Draft" : "Live";
    setFunnels(funnels.map(f => f.id === id ? { ...f, status: newStatus } : f));
    setActiveMenuId(null);
    // In production: await supabase.from("funnels").update({ status: newStatus }).eq("id", id);
  };

  const handleShare = (id) => {
    const link = `${window.location.origin}/preview?id=${id}`;
    navigator.clipboard.writeText(link);
    alert("🔗 Funnel Link Copied to Clipboard!");
    setActiveMenuId(null);
  };

  // ==========================================
  // 📊 OPEN ANALYTICS & CRM
  // ==========================================
  const openAnalytics = (funnel) => {
    setSelectedFunnelAnalytics(funnel);
    setActiveMenuId(null);
    
    // Generating Mock CRM Data for the selected funnel
    const mockLeads = Array.from({ length: 15 }).map((_, i) => {
      const isPaid = Math.random() > 0.5;
      const aiScoreNum = Math.random();
      let aiScore = "Cold"; let aiColor = "bg-slate-100 text-slate-600";
      if (aiScoreNum > 0.8) { aiScore = "Hot 🔥"; aiColor = "bg-red-100 text-red-600"; }
      else if (aiScoreNum > 0.4) { aiScore = "Warm"; aiColor = "bg-orange-100 text-orange-600"; }

      return {
        id: `ld_${i}_${Date.now()}`,
        name: `Customer ${i + 1}`,
        email: `customer${i+1}@example.com`,
        phone: "+91 98765 4321" + i,
        status: isPaid ? "Paid" : "Lead",
        amount: isPaid ? funnel.revenue / 10 : 0,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        aiScore, aiColor
      };
    });
    setFunnelLeads(mockLeads);
  };

  // ==========================================
  // 📥 EXPORT TO CSV / EXCEL
  // ==========================================
  const exportToCSV = () => {
    if (!funnelLeads.length) return alert("No data to export.");
    const headers = ["Name", "Email", "Phone", "Status", "Amount Paid", "Date", "AI Score"];
    const csvRows = funnelLeads.map(l => `${l.name},${l.email},${l.phone},${l.status},${l.amount},${l.date},${l.aiScore}`);
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFunnelAnalytics.name}_CRM_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🔍 Filter Logic
  const filteredFunnels = funnels.filter(f => (f.name || "Untitled Funnel").toLowerCase().includes(searchQuery.toLowerCase()));

  // ==========================================
  // 🖥️ UI RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* 🚀 PRO SIDEBAR */}
      <div className="w-64 bg-[#0B1536] text-white flex flex-col justify-between hidden md:flex border-r border-slate-800 shadow-2xl relative z-20">
        <div>
          <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
             <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]">AI</div>
             <div>
               <h2 className="text-lg font-black tracking-widest uppercase leading-none">Studio</h2>
               <p className="text-[10px] text-indigo-400 font-medium">Marketing OS v2.0</p>
             </div>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button onClick={() => setSelectedFunnelAnalytics(null)} className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all ${!selectedFunnelAnalytics ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <Icons.Chart /> Overview
            </button>
            <button onClick={() => router.push("/builder")} className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all">
              <span className="text-lg">🛠️</span> Funnel Builder
            </button>
            <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all">
              <span className="text-lg">👥</span> CRM Contacts
            </button>
            <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all">
              <span className="text-lg">⚙️</span> Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6 border-t border-slate-800/50">
          <button onClick={() => router.push("/login")} className="w-full py-2 bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg text-xs font-bold uppercase transition-colors">
            Logout Session
          </button>
        </div>
      </div>

      {/* 🚀 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0 z-10 shadow-sm">
          {!selectedFunnelAnalytics ? (
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Search /></div>
              <input type="text" placeholder="Search funnels, leads, or campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedFunnelAnalytics(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"><Icons.ArrowLeft /></button>
              <h1 className="text-xl font-black text-slate-800">{selectedFunnelAnalytics.name || "Untitled Funnel"} <span className="text-slate-400 font-medium text-sm">/ Analytics</span></h1>
            </div>
          )}

          <div className="flex items-center gap-4">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-2 px-3 rounded-lg outline-none cursor-pointer">
              <option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>All Time</option>
            </select>
            <div className="h-9 w-9 bg-indigo-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-indigo-700 text-sm">SC</div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 content-scrollbar">
          
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <div className="animate-spin text-4xl mb-4">🌀</div>
               <p className="font-bold tracking-widest uppercase text-xs">Loading Marketing OS...</p>
             </div>
          ) : !selectedFunnelAnalytics ? (
            /* =========================================================================
               🟢 VIEW 1: GLOBAL OVERVIEW DASHBOARD
               ========================================================================= */
            <div className="animate-fadeIn">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketing Overview</h1>
                  <p className="text-sm text-slate-500 mt-1">Monitor your funnels, leads, and revenue in real-time.</p>
                </div>
                <button onClick={() => router.push("/builder")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2">
                  <span className="text-lg">+</span> Create New Funnel
                </button>
              </div>

              {/* 4 PRO METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Funnels</p><span className="p-2 bg-indigo-50 rounded-lg text-indigo-500">🛠️</span></div>
                  <h3 className="text-3xl font-black text-slate-800 mt-4">{funnels.length}</h3>
                  <p className="text-xs text-emerald-500 font-bold mt-2">↑ 2 active this week</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</p><span className="p-2 bg-emerald-50 rounded-lg text-emerald-500">👥</span></div>
                  <h3 className="text-3xl font-black text-slate-800 mt-4">{totalLeads}</h3>
                  <p className="text-xs text-emerald-500 font-bold mt-2">↑ +14% vs last month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p><span className="p-2 bg-green-50 rounded-lg text-green-600">💰</span></div>
                  <h3 className="text-3xl font-black text-slate-800 mt-4">₹{funnels.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</h3>
                  <p className="text-xs text-emerald-500 font-bold mt-2">↑ +22% vs last month</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-4 -translate-y-4">🤖</div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1"><Icons.Sparkles/> AI Prediction</p>
                    <h3 className="text-2xl font-black mt-4 text-white">₹1.2L <span className="text-sm font-medium opacity-80">Expected</span></h3>
                    <p className="text-xs text-indigo-200 mt-2 leading-relaxed">Based on current traffic, your "Digital Product" funnel will peak tomorrow.</p>
                  </div>
                </div>
              </div>

              {/* ADVANCED FUNNELS TABLE */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800">Your Campaigns & Funnels</h3>
                  <button className="text-xs font-bold text-indigo-600 uppercase tracking-wider">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                        <th className="px-6 py-4 rounded-tl-lg">Funnel Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Views</th>
                        <th className="px-6 py-4">Leads</th>
                        <th className="px-6 py-4">Revenue</th>
                        <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {filteredFunnels.length === 0 ? (
                        <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">No funnels found.</td></tr>
                      ) : (
                        filteredFunnels.map((funnel) => (
                          <tr key={funnel.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => openAnalytics(funnel)}>{funnel.name || "Untitled Funnel"}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {funnel.id.substring(0, 8)}...</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${funnel.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {funnel.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{funnel.views.toLocaleString()}</td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{funnel.leadsCount.toLocaleString()}</td>
                            <td className="px-6 py-4 font-black text-slate-800">₹{funnel.revenue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right relative">
                              <button onClick={() => setActiveMenuId(activeMenuId === funnel.id ? null : funnel.id)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                <Icons.More />
                              </button>
                              
                              {/* ACTIONS DROPDOWN */}
                              {activeMenuId === funnel.id && (
                                <div className="absolute right-8 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-2 flex flex-col text-left overflow-hidden animate-fadeIn">
                                  <button onClick={() => router.push(`/builder?id=${funnel.id}`)} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-left w-full">✏️ Edit in Builder</button>
                                  <button onClick={() => openAnalytics(funnel)} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-left w-full">📊 View Performance</button>
                                  <button onClick={() => handleShare(funnel.id)} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-left w-full">🔗 Copy Live Link</button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={() => toggleFunnelStatus(funnel.id, funnel.status)} className="px-4 py-2.5 text-xs font-bold text-left w-full text-slate-700 hover:bg-slate-50">
                                    {funnel.status === "Live" ? "🚫 Unpublish (Draft)" : "🟢 Make Live"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          ) : (
            /* =========================================================================
               🟢 VIEW 2: INDIVIDUAL FUNNEL CRM & PERFORMANCE (ANALYTICS)
               ========================================================================= */
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${selectedFunnelAnalytics.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                     {selectedFunnelAnalytics.status}
                  </span>
                  <button onClick={() => router.push(`/builder?id=${selectedFunnelAnalytics.id}`)} className="text-xs font-bold text-indigo-600 hover:underline">Edit Funnel Page ➔</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportToCSV} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors">
                    <Icons.Download /> Export CRM (CSV)
                  </button>
                  <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                    PDF Report
                  </button>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">Total Views</span>
                   <span className="text-2xl font-black text-slate-800 mt-1">{selectedFunnelAnalytics.views.toLocaleString()}</span>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">Leads Captured</span>
                   <span className="text-2xl font-black text-indigo-600 mt-1">{selectedFunnelAnalytics.leadsCount.toLocaleString()}</span>
                   <span className="text-[10px] text-emerald-500 font-bold mt-1 inline-block bg-emerald-50 w-max px-2 py-0.5 rounded">Conversion: {((selectedFunnelAnalytics.leadsCount/selectedFunnelAnalytics.views)*100).toFixed(1)}%</span>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">Revenue Collected</span>
                   <span className="text-2xl font-black text-green-600 mt-1">₹{selectedFunnelAnalytics.revenue.toLocaleString()}</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* CSS BASED BAR CHART (NO EXTERNAL LIBRARY REQUIRED) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-6">Traffic & Lead Performance (Last 7 Days)</h3>
                   <div className="h-48 flex items-end justify-between gap-2 px-2">
                     {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                       <div key={i} className="w-full flex flex-col justify-end items-center group relative cursor-pointer">
                         <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h * 15} Views</div>
                         <div style={{height: `${h}%`}} className="w-full max-w-[40px] bg-indigo-100 group-hover:bg-indigo-200 rounded-t-sm relative">
                            {/* Inner bar for leads */}
                            <div style={{height: `${h * 0.3}%`}} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm"></div>
                         </div>
                         <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Day {i+1}</span>
                       </div>
                     ))}
                   </div>
                   <div className="flex gap-4 mt-6 justify-center">
                     <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-100 rounded-sm"></span><span className="text-[10px] font-bold text-slate-500 uppercase">Page Views</span></div>
                     <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-500 rounded-sm"></span><span className="text-[10px] font-bold text-slate-500 uppercase">Leads Captured</span></div>
                   </div>
                </div>

                {/* AI MARKETING INSIGHTS */}
                <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🧠</div>
                  <h3 className="font-bold text-indigo-300 flex items-center gap-2 mb-4"><Icons.Sparkles/> AI Smart Insights</h3>
                  <div className="space-y-4 flex-1">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-xs font-bold text-white mb-1">🔥 Conversion Spike Alert</p>
                      <p className="text-[10px] text-slate-400">Traffic from Mobile devices converted 24% higher yesterday. Consider increasing mobile ad spend.</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-xs font-bold text-white mb-1">💡 Funnel Optimization</p>
                      <p className="text-[10px] text-slate-400">Users are dropping off at the Checkout page. Try adding a Trust Badge widget to increase sales.</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">Ask AI a Question</button>
                </div>
              </div>

              {/* ADVANCED CRM / CUSTOMER DATA TABLE */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-black text-slate-800">CRM: Lead & Customer Data</h3>
                    <input type="text" placeholder="Search customer email..." className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 w-64" />
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                         <th className="px-6 py-4">Customer Name & Contact</th>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Purchase Status</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4 text-right">🤖 AI Lead Score</th>
                       </tr>
                     </thead>
                     <tbody className="text-sm divide-y divide-slate-100">
                       {funnelLeads.map(lead => (
                         <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-3">
                             <p className="font-bold text-slate-800">{lead.name}</p>
                             <p className="text-xs text-slate-500">{lead.email} • {lead.phone}</p>
                           </td>
                           <td className="px-6 py-3 text-xs text-slate-500 font-medium">{lead.date}</td>
                           <td className="px-6 py-3">
                              <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${lead.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {lead.status}
                              </span>
                           </td>
                           <td className="px-6 py-3 font-black text-slate-700">{lead.amount > 0 ? `₹${lead.amount}` : '-'}</td>
                           <td className="px-6 py-3 text-right">
                              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${lead.aiColor}`}>
                                {lead.aiScore}
                              </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>

            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .content-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .content-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .content-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
