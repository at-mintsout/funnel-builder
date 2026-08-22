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
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        alert("🎉 Login Successful!");
        router.push("/builder"); 
        
      } else {
        // SIGNUP (With Name & Phone)
        const { error } = await supabase.auth.signUp({
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

        alert("🚀 Account Created Successfully!");
        router.push("/builder");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#0d216b]">FUNNELCRAFT</h1>
          <p className="text-slate-500 mt-2">
            {isLogin ? "Login to your account" : "Create your account"}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Sirf Signup ke time Name aur Phone dikhayenge */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required={!isLogin}
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0d216b] outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" required={!isLogin}
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0d216b] outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0d216b] outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0d216b] outline-none"
              placeholder="Min 6 characters"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#0d216b] text-white font-bold py-3 rounded-md hover:bg-blue-900 transition-all">
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-600 hover:underline font-semibold">
            {isLogin ? "Need an account? Sign up here" : "Already have an account? Login"}
          </button>
        </div>

      </div>
    </div>
  );
}