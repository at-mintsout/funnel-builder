"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CRMDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Database se Leads fetch karna
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLeads(data || []);
      } catch (err) {
        console.error("Error fetching leads:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Search Filter Logic
  const filteredLeads = leads.filter(lead => 
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to CSV Feature (Premium SaaS Vibe)
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "Funnel ID", "Date"];
    const rows = filteredLeads.map(lead => [
      lead.name || "N/A",
      lead.email || "N/A",
      lead.phone || "N/A",
      lead.funnel_id || "Direct",
      new Date(lead.created_at).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `funnelcraft_leads_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* ⬅️ LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col hidden md:flex shrink-0 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-sm shadow-lg">FC</div>
          <span className="font-black text-lg tracking-widest uppercase">FunnelCraft</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold transition-all">
            📊 Overview
          </button>
          <button onClick={() => router.push("/dashboard/leads")} className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-900/20 transition-all">
            👥 Leads CRM
          </button>
          <button onClick={() => router.push("/builder")} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold transition-all mt-6">
            🛠️ Funnel Builder
          </button>
        </nav>
      </aside>

      {/* ⬜ MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Lead Management</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and export your captured funnel leads</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
            <button onClick={downloadCSV} className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              📥 Export CSV
            </button>
          </div>
        </header>

        {/* DATA TABLE SECTION */}
        <div className="flex-1 p-8 overflow-y-auto content-scrollbar bg-[#f1f5f9]">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl">👥</div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{leads.length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">✨</div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">New This Week</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{leads.length}</h3>
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Lead Profile</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Contact Info</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Source Funnel</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Date Captured</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-400 font-semibold">
                        ⏳ Loading your leads database...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center flex flex-col items-center">
                        <span className="text-4xl mb-3">📭</span>
                        <h4 className="text-lg font-bold text-slate-700">No leads found</h4>
                        <p className="text-sm text-slate-400">Share your funnel link to start capturing leads!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-sm uppercase">
                              {(lead.name || lead.email || "?").charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{lead.name || "Unknown Lead"}</p>
                              <p className="text-xs text-slate-500 font-medium">ID: {lead.id?.substring(0, 8) || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><span>✉️</span> {lead.email || "No Email"}</p>
                          {lead.phone && <p className="text-xs text-slate-500 font-medium flex items-center gap-2"><span>📞</span> {lead.phone}</p>}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-slate-200">
                            {lead.funnel_id || "Direct Entry"}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-slate-700">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {lead.created_at ? new Date(lead.created_at).toLocaleTimeString() : ""}
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors opacity-0 group-hover:opacity-100">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}