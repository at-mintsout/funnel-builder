"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ==========================================
// 🎨 SVG ICONS FOR PRO UI
// ==========================================
const Icons = {
  Eye: () => <svg className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Google: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
  Spinner: () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
};

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        // 🔐 LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        setSuccessMessage("🎉 Access Granted! Redirecting to Workspace...");
        setTimeout(() => router.push("/dashboard"), 1500); 
        
      } else {
        // 🚀 SIGNUP LOGIC
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone_number: phone,
            }
          }
        });
        
        if (error) throw error;

        // Save user details to Database after successful signup
        if (data.user) {
          const { error: dbError } = await supabase
            .from("user_settings")
            .upsert({
              user_id: data.user.id,
              full_name: name,
              phone: phone,
              email: email,
              active_plan: "Starter Core Box" // Default free plan
            });
            
          if (dbError) console.error("Database Save Error:", dbError.message);
        }

        setSuccessMessage("🚀 Account Created Successfully! Please Sign In.");
        setTimeout(() => {
          setPassword("");
          setIsLogin(true); 
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to authenticate. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMessage("Google Login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4 font-sans selection:bg-indigo-200">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-fadeIn relative">
        
        {/* TOP ACCENT BAR */}
        <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"></div>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 bg-[#0B1536] rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-[#0B1536]/30 mb-4 transform hover:scale-105 transition-transform">
              AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1536] tracking-tight uppercase">Funnel Builder</h1>
            <p className="text-slate-500 mt-2 font-medium text-sm">
              {isLogin ? "Welcome back to your workspace" : "Join the ultimate marketing OS"}
            </p>
          </div>

          {/* STATUS MESSAGES */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-xs font-bold mb-6 border border-emerald-100 flex items-center gap-2">
              <span>✅</span> {successMessage}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* SIGNUP FIELDS (Animated) */}
            {!isLogin && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" required={!isLogin}
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Mobile Number</label>
                  <input 
                    type="tel" required={!isLogin}
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 pl-1 pr-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot?</button>}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center bg-[#0B1536] text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
            >
              {loading ? (
                <><Icons.Spinner /> {isLogin ? "Authenticating..." : "Creating Account..."}</>
              ) : (
                isLogin ? "Access Workspace ➔" : "Create Free Account ➔"
              )}
            </button>
          </form>

          {/* SOCIAL LOGIN SEPARATOR */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Icons.Google /> Google
          </button>

          <div className="text-center mt-8">
            <button onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); setSuccessMessage(""); }} className="text-xs font-bold text-slate-500 hover:text-[#0B1536] transition-colors">
              {isLogin ? (
                <span>Don't have an account? <span className="text-indigo-600 underline underline-offset-2">Sign up here</span></span>
              ) : (
                <span>Already have an account? <span className="text-indigo-600 underline underline-offset-2">Login</span></span>
              )}
            </button>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
    }
                  
