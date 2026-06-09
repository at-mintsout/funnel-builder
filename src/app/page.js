"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Router import kiya

export default function HomePage() {
  const router = useRouter(); // 2. Router initialize kiya
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funnelName, setFunnelName] = useState("");

  const handleCreateFunnel = (e) => {
    e.preventDefault();
    if (!funnelName.trim()) {
      alert("Bhai, funnel ka kuch naam toh rakho!");
      return;
    }
    
    setIsModalOpen(false);
    setFunnelName("");
    
    // 3. Ab alert ki jagah yeh user ko seedhe builder page par le jayega
    router.push("/builder");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans relative">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-wider text-indigo-400">
            FUNNEL<span className="text-white">CRAFT</span>
          </h1>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition">
            My Account
          </button>
        </div>
      </nav>

      {/* Main Dashboard Body */}
      <main className="max-w-5xl mx-auto mt-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Apne Business ko Online Lao Aur <br />
          <span className="text-indigo-400">Sales ki Baarish</span> Shuru Karo!
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Yeh koi saadha website builder nahi hai. Yeh hai aapka personal Sales Funnel. 
          Bina coding ke high-converting pages banayein.
        </p>

        {/* Action Box */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl max-w-xl mx-auto shadow-2xl">
          <h3 className="text-xl font-bold mb-2">Chalo, Pehla Funnel Banayein!</h3>
          <p className="text-slate-400 text-sm mb-6">
            Aapka business kisi bhi category ka ho, funnel aapko customers laakar dega.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            🚀 Create New Funnel
          </button>
        </div>

        {/* Mini Analytics Preview */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 text-left">
          <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Views</p>
            <p className="text-xl font-bold mt-1">0</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-semibold">Leads Captured</p>
            <p className="text-xl font-bold mt-1">0</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</p>
            <p className="text-xl font-bold text-green-400 mt-1">₹0.00</p>
          </div>
        </div>
      </main>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Naya Funnel Banayein</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xl font-bold px-2">✕</button>
            </div>
            
            <form onSubmit={handleCreateFunnel}>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Funnel Ka Naam</label>
                <input 
                  type="text" 
                  placeholder="e.g., My Gym Rules Funnel" 
                  value={funnelName}
                  onChange={(e) => setFunnelName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-lg font-bold text-sm">Let's Go ➔</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}