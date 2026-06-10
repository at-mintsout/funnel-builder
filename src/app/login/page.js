"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle bin login & signup
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // SIGNUP LOGIC
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("🎉 Signup Successful! Aap automatic login ho gaye hain.");
        router.push("/builder");
      } else {
        // LOGIN LOGIC
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/builder");
      }
    } catch (error) {
      alert(error.message || "Kuch galat hua!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-wider text-indigo-400">FUNNEL CRAFT</h2>
          <p className="text-xs text-slate-400 mt-2">
            {isSignUp ? "Naya account banayein aur shuru karein" : "Apne account mein login karein"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg transition pt-2"
          >
            {loading ? "Ruko thoda..." : isSignUp ? "Create Account 🚀" : "Sign In ➔"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-xs text-slate-400 hover:text-indigo-400 transition underline"
          >
            {isSignUp ? "Pehle se account hai? Sign In karein" : "Naya account chahiye? Sign Up karein"}
          </button>
        </div>
      </div>
    </div>
  );
}