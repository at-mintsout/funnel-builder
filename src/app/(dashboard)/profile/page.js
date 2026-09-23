"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const CURRENT_USER_ID = "demo-user-123";

  // Fetch Profile Data on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("user_id, razorpay_key_id") // Fallback fetch, ya aap apni profile table use kar sakte hain
          .eq("user_id", CURRENT_USER_ID)
          .maybeSingle();

        if (error) throw error;
        
        // Mock / Initial Data binding
        setFullName("Sandeep Kumar Choudhary");
        setEmail("kumar.sandeepchoudhary01@gmail.com");
        setPhone("+91 98765 43210");
        setCompany("FunnelForge Inc.");
      } catch (err) {
        console.error("Profile load error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate save or update database logic here
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("🎉 Profile updated successfully!");
    } catch (err) {
      alert("❌ Error updating profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 font-bold text-slate-400">Loading Profile...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information, security, and account preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Banner / Header section */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center gap-5">
          <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner border-2 border-indigo-400/30">
            {fullName ? fullName.charAt(0) : "S"}
          </div>
          <div>
            <h2 className="text-xl font-bold m-0">{fullName || "Sandeep Kumar Choudhary"}</h2>
            <p className="text-xs text-slate-300 font-mono mt-1 m-0">{email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Pro Account Active
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address (Locked)</label>
              <input 
                type="email" 
                value={email} 
                disabled 
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Workspace / Agency Name</label>
              <input 
                type="text" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">Last profile synchronization was successful.</p>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 text-sm"
            >
              {isSaving ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}