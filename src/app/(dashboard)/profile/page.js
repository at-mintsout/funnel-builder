"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const CURRENT_USER_ID = "demo-user-123";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetching user mock/profile details
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

  // Profile Details Update Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("🎉 Profile details updated successfully!");
    } catch (err) {
      alert("❌ Error updating profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔐 Password Reset / Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Supabase direct password update for logged-in user
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert("🔒 Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("❌ Password update failed: " + err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) return <div className="p-10 font-bold text-slate-400">Loading Profile...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Profile & Security</h1>
        <p className="text-slate-500 mt-1">Manage your personal information, security credentials, and preferences.</p>
      </div>

      {/* 1. PERSONAL INFORMATION CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center gap-5">
          <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner border-2 border-indigo-400/30">
            {fullName ? fullName.charAt(0) : "S"}
          </div>
          <div>
            <h2 className="text-xl font-bold m-0">{fullName}</h2>
            <p className="text-xs text-slate-300 font-mono mt-1 m-0">{email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Pro Account Active
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-indigo-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address (Locked)</label>
              <input type="email" value={email} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Workspace / Agency Name</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-70 text-sm">
              {isSaving ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. PASSWORD RESET & SECURITY CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-6">Security & Password Reset</h3>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:border-indigo-500" 
              required 
            />
            <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters long.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:border-indigo-500" 
              required 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isUpdatingPassword}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 text-sm"
            >
              {isUpdatingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}