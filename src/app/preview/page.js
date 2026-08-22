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

  const [funnelData, setFunnelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeId) {
      setLoading(false);
      return;
    }

    const fetchFunnel = async () => {
      try {
        // Fetch matching row from Supabase 'funnels' table by UUID/id
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">Loading Funnel Canvas...</div>;
  }

  if (!activeId || !funnelData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Funnel Not Found</h1>
        <p className="text-xs text-slate-400 mt-1">The requested funnel ID does not exist or was deleted.</p>
        <button onClick={() => router.push("/builder")} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase">
          Return to Studio
        </button>
      </div>
    );
  }

  // Check if canvas_state exists, otherwise fallback to displaying standard table row data (like headline/name)
  const canvasRows = funnelData.canvas_state?.landing || [];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* If canvas has elements, render them dynamically */}
        {canvasRows.length > 0 ? (
          canvasRows.map((row) => (
            <div key={row.id} className="flex gap-4 w-full">
              {row.columns.map((col) => (
                <div key={col.id} style={{ width: `${col.widthPercent}%` }} className="flex flex-col gap-3 w-full">
                  {col.widgets.map((widget) => (
                    <div key={widget.id} style={{ color: widget.styles?.color, fontSize: widget.styles?.fontSize, textAlign: widget.styles?.textAlign, fontWeight: widget.styles?.fontWeight }}>
                      {widget.type === "heading" && <h1 className="font-black text-3xl">{widget.content}</h1>}
                      {widget.type === "paragraph" && <p className="text-slate-600">{widget.content}</p>}
                      {widget.type === "button" && <button className="px-6 py-3 bg-rose-600 text-white font-bold rounded">{widget.content}</button>}
                      {widget.type !== "heading" && widget.type !== "paragraph" && widget.type !== "button" && <div>{widget.content}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          /* Fallback view using the table columns visible in your screenshot */
          <div className="text-center space-y-4 p-8 bg-slate-50 rounded-2xl border">
            <h1 className="text-3xl font-black text-indigo-900">{funnelData.name || "Cloud Funnel"}</h1>
            <p className="text-lg font-semibold text-slate-700">{funnelData.headline || "Welcome to our platform!"}</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs">
              Get Started Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}