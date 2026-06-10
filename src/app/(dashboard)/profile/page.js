"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserProfileManagementModule() {
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [savingState, setSavingState] = useState(false);

  useEffect(() => {
    const loadProfileDataPipeline = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            setProfileName(data.full_name || "");
            setProfilePhone(data.phone_number || "");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfileDataPipeline();
  }, []);

  const handleUpdateProfileMeta = async (e) => {
    e.preventDefault();
    setSavingState(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profileName,
        phone_number: profilePhone,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      alert("System Matrix Broadcast: Profile state metadata synchronized successfully!");
    } catch (err) {
      alert("Data Storage Profile Write Error: " + err.message);
    } finally {
      setSavingState(false);
    }
  };

  if (loading) return <div className="text-xs font-mono text-slate-500 animate-pulse">Synchronizing Identity Arrays...</div>;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-xl shadow-xl">
      <h3 className="font-black text-sm uppercase tracking-widest text-slate-200 mb-1">Identity Configuration Grid</h3>
      <p className="text-xs text-slate-500 font-bold mb-6">Manage your core admin metadata account records mapping pipelines.</p>

      <form onSubmit={handleUpdateProfileMeta} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Operator Display Name</label>
          <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. Maverick Hunter" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mobile Verification Number Context</label>
          <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-indigo-500 transition" placeholder="+91 XXXXX XXXXX" />
        </div>
        <button type="submit" disabled={savingState} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-md transition-all mt-2">
          {savingState ? "Saving Schema..." : "🔒 Mutate Profile Data Grid"}
        </button>
      </form>
    </div>
  );
}