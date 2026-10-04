"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isLogin) {
        // 🔐 LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        alert("🎉 Login Successful!");
        router.push("/builder"); 
        
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
            
          if (dbError) {
            console.error("Database Save Error:", dbError.message);
          }
        }

        alert("🚀 Account Created Successfully! Please Sign In.");
        // Clear fields and switch to login tab
        setPassword("");
        setIsLogin(true); 
      }
    } catch (error) {
      // Clean error message fallback
      setErrorMessage(error.message || "Failed to fetch. Please check your internet or Supabase URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">FREE AI FUNNEL BUILDER</h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isLogin ? "Login to your workspace" : "Create your account"}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-semibold mb-6 border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Sirf Signup ke time Name aur Phone dikhayenge */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" required={!isLogin}
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Maverick Hunter"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Mobile Number</label>
                <input 
                  type="tel" required={!isLogin}
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#0f172a] text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 mt-2 shadow-md">
            {loading ? "Processing Protocol..." : isLogin ? "Access Workspace" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
            {isLogin ? "Need an account? Sign up here ➔" : "Already have an account? Login ➔"}
          </button>
        </div>

      </div>
    </div>
  );
}