"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Router import kiya[cite: 20]
import Link from "next/link";

export default function HomePage() {
  const router = useRouter(); // Router initialize kiya[cite: 20]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funnelName, setFunnelName] = useState("");
  
  // Dark/Light Mode State
  const [isDark, setIsDark] = useState(true);

  const handleCreateFunnel = (e) => {
    e.preventDefault();
    if (!funnelName.trim()) {
      alert("Bhai, funnel ka kuch naam toh rakho!");
      return;
    }
    
    setIsModalOpen(false);
    setFunnelName("");
    
    // Alert ki jagah yeh user ko seedhe builder page par le jayega[cite: 20]
    router.push("/builder");
  };

  // Dynamic Theme Classes
  const themeBg = isDark ? "bg-[#0b0f19]" : "bg-slate-50";
  const themeText = isDark ? "text-slate-100" : "text-slate-900";
  const cardBg = isDark ? "bg-[#111827]" : "bg-white";
  const borderColor = isDark ? "border-slate-800" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${themeBg} ${themeText} font-sans transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white`}>
      
      {/* 🚀 PREMIUM HEADER & NAVIGATION */}
      <nav className={`fixed top-0 w-full z-40 border-b ${borderColor} ${isDark ? "bg-[#0b0f19]/90" : "bg-white/90"} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg group-hover:scale-105 transition-transform">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">FREE AI</span>
              <span className={`text-[11px] font-bold tracking-widest uppercase ${mutedText}`}>Funnel Builder</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <Link href="/" className={`${mutedText} hover:text-indigo-500 transition-colors`}>Home</Link>
            <a href="#templates" className={`${mutedText} hover:text-indigo-500 transition-colors`}>Templates</a>
            <Link href="/about" className={`${mutedText} hover:text-indigo-500 transition-colors`}>About Us</Link>
            <Link href="/contact" className={`${mutedText} hover:text-indigo-500 transition-colors`}>Contact Us</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Dark/Light Mode Toggle Button */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${borderColor} ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-colors text-lg`}
              title="Toggle Theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            
            <Link href="/login" className={`hidden md:block text-sm font-bold ${mutedText} hover:text-indigo-500 transition-colors`}>
              Log In
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* 💥 DYNAMIC HERO SECTION */}
      <main className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <span className={`inline-block py-1.5 px-4 rounded-full ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-700"} border text-xs font-black uppercase tracking-widest mb-8`}>
          Built for Marketers, Powered by AI
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
          Build High-Converting Funnels <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Without Writing Code.</span>
        </h1>
        
        <p className={`text-lg md:text-xl ${mutedText} max-w-2xl mx-auto mb-12`}>
          Generate landing pages, checkout flows, and upsell sequences instantly using Artificial Intelligence. Launch your next million-dollar campaign today for absolutely free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105"
          >
            🚀 Start Building For Free
          </button>
          <Link href="/builder" className={`w-full sm:w-auto px-8 py-4 ${cardBg} border ${borderColor} hover:border-indigo-500 font-bold text-lg rounded-2xl shadow-sm transition-all`}>
            Explore The Builder ➔
          </Link>
        </div>
      </main>

      {/* 🖼️ EXPANDED TEMPLATES SECTION */}
      <section id="templates" className={`py-24 ${isDark ? "bg-[#0f1523]" : "bg-slate-100"} border-y ${borderColor}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Premium Pre-Built Blueprints</h2>
            <p className={`${mutedText} text-lg max-w-2xl mx-auto`}>Stop starting from scratch. Our AI has analyzed millions of conversions to bring you these fully expanded, ready-to-launch templates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Template 1 */}
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group flex flex-col`}>
              <div className={`aspect-video rounded-xl mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border ${borderColor} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform`}>
                💻
              </div>
              <h3 className="text-2xl font-black mb-2">SaaS & Digital Products</h3>
              <p className={`${mutedText} text-sm mb-6 flex-1`}>A complete 3-step pipeline featuring a high-converting Video Sales Letter (VSL), secure Stripe/Razorpay checkout, and an automated digital delivery thank-you page.</p>
              <ul className={`space-y-2 mb-8 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Hero VSL Section</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> 2-Step Checkout Integration</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Automated Upsell Triggers</li>
              </ul>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white font-bold rounded-xl transition-colors">
                Use This Blueprint
              </button>
            </div>

            {/* Template 2 */}
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group flex flex-col`}>
              <div className={`aspect-video rounded-xl mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border ${borderColor} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform`}>
                🎥
              </div>
              <h3 className="text-2xl font-black mb-2">Evergreen Webinar</h3>
              <p className={`${mutedText} text-sm mb-6 flex-1`}>Capture leads effectively with scarcity timers and auto-redirect them to your automated webinar room. Perfect for high-ticket coaching and courses.</p>
              <ul className={`space-y-2 mb-8 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Urgency Countdown Timers</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Email Opt-in Popups</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Live Chat Simulation</li>
              </ul>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white font-bold rounded-xl transition-colors">
                Use This Blueprint
              </button>
            </div>

            {/* Template 3 */}
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group flex flex-col`}>
              <div className={`aspect-video rounded-xl mb-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border ${borderColor} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform`}>
                📦
              </div>
              <h3 className="text-2xl font-black mb-2">E-Commerce Dropship</h3>
              <p className={`${mutedText} text-sm mb-6 flex-1`}>Designed for physical products. Features image carousels, customer review blocks, and one-click order bumps to maximize your Average Order Value (AOV).</p>
              <ul className={`space-y-2 mb-8 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Dynamic Image Galleries</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Trust Badges & Social Proof</li>
                <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> One-Click Order Bumps</li>
              </ul>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white font-bold rounded-xl transition-colors">
                Use This Blueprint
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 PROFESSIONAL FOOTER */}
      <footer className={`${isDark ? "bg-[#070a12]" : "bg-white"} border-t ${borderColor} pt-20 pb-10 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg">AI</div>
              <span className="text-lg font-black tracking-tight">FREE AI FUNNELS</span>
            </Link>
            <p className={`${mutedText} text-sm leading-relaxed`}>Empowering creators and marketers to build high-converting sales pipelines using the power of generative AI. 100% Free.</p>
            
            {/* Social Media Logos (Placeholders) */}
            <div className="flex gap-4 pt-4">
              <a href="#" className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xl`}>𝕏</a>
              <a href="#" className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xl`}>📸</a>
              <a href="#" className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xl`}>▶️</a>
              <a href="#" className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xl`}>💼</a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className={`space-y-3 text-sm ${mutedText}`}>
              <li><Link href="/builder" className="hover:text-indigo-500 transition-colors">Funnel Builder Studio</Link></li>
              <li><a href="#templates" className="hover:text-indigo-500 transition-colors">Template Gallery</a></li>
              <li><Link href="/login" className="hover:text-indigo-500 transition-colors">My Account / Login</Link></li>
              <li><Link href="/signup" className="hover:text-indigo-500 transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className={`space-y-3 text-sm ${mutedText}`}>
              <li><Link href="/about" className="hover:text-indigo-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-500 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Blog & Tutorials</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className={`space-y-3 text-sm ${mutedText}`}>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${borderColor} pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${mutedText}`}>
          <p>© {new Date().getFullYear()} Free AI Funnel Builder. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span>Made with ❤️ for Marketers</span>
          </div>
        </div>
      </footer>

      {/* 🔮 POPUP MODAL (PRESERVED FUNCTIONALITY) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`${cardBg} border ${borderColor} p-8 rounded-3xl w-full max-w-md shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Naya Funnel Banayein</h3>
              <button onClick={() => setIsModalOpen(false)} className={`${mutedText} hover:text-red-500 text-2xl font-bold px-2 transition-colors`}>✕</button>
            </div>
            
            <form onSubmit={handleCreateFunnel}>
              <div className="mb-8">
                <label className={`block text-xs font-bold ${mutedText} uppercase tracking-wider mb-3`}>Funnel Ka Naam</label>
                <input 
                  type="text" 
                  placeholder="e.g., Q4 Product Launch" 
                  value={funnelName}
                  onChange={(e) => setFunnelName(e.target.value)}
                  className={`w-full ${isDark ? "bg-[#0b0f19]" : "bg-slate-100"} border ${borderColor} rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold`}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-6 py-3 rounded-xl font-bold text-sm ${isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"} transition-colors`}>
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30">
                  Let's Go ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Animation for Modal */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}