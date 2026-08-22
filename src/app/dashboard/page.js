"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [funnels, setFunnels] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. User ke banaye hue funnels fetch karein
        const { data: funnelData, error: funnelError } = await supabase
          .from("funnels")
          .select("*");

        if (funnelError) throw funnelError;
        setFunnels(funnelData || []);

        // 2. Total leads count karein
        const { count, error: leadError } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });

        if (!leadError) {
          setTotalLeads(count || 0);
        }

      } catch (err) {
        console.error("Dashboard data load error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0d216b] text-white p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-2xl font-black tracking-wider mb-10">FUNNELCRAFT</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="block py-2.5 px-4 rounded bg-blue-900 font-semibold">📊 Dashboard</a>
            <a href="/builder" className="block py-2.5 px-4 rounded hover:bg-blue-900 transition">🛠️ Funnel Builder</a>
          </nav>
        </div>
        <button 
          onClick={() => router.push("/login")}
          className="text-sm text-slate-300 hover:text-white text-left"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-slate-800">Overview Dashboard</h1>
          <button 
            onClick={() => router.push("/builder")}
            className="bg-[#0d216b] text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-blue-900 transition"
          >
            + Create New Funnel
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading Analytics...</div>
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-bold text-slate-400 uppercase">Total Funnels</p>
                <h3 className="text-4xl font-black text-slate-800 mt-2">{funnels.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-bold text-slate-400 uppercase">Total Leads Captured</p>
                <h3 className="text-4xl font-black text-indigo-600 mt-2">{totalLeads}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-bold text-slate-400 uppercase">Test Revenue Generated</p>
                <h3 className="text-4xl font-black text-green-600 mt-2">₹{totalLeads * 500}</h3>
              </div>
            </div>

            {/* Funnels List Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Your Active Funnels</h3>
              {funnels.length === 0 ? (
                <p className="text-slate-500 text-sm">No funnels created yet. Click on 'Create New Funnel' to start!</p>
              ) : (
                <div className="space-y-3">
                  {funnels.map((funnel) => (
                    <div key={funnel.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-800">{funnel.name || "Untitled Funnel"}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {funnel.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/builder?id=${funnel.id}`)}
                          className="px-4 py-1.5 bg-indigo-50 text-indigo-600 font-bold rounded text-sm hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open(`/preview?id=${funnel.id}`, "_blank")}
                          className="px-4 py-1.5 bg-slate-200 text-slate-700 font-bold rounded text-sm hover:bg-slate-300"
                        >
                          View Live
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}   