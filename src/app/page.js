"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BUILDERLandingPage() {
  const router = useRouter();
  const [heroEmail, setHeroEmail] = useState("");

  // Smart redirect: User email daal kar sidha signup par jayega
  const handleGetStarted = (e) => {
    e.preventDefault();
    if (heroEmail) {
      router.push(`/login?email=${encodeURIComponent(heroEmail)}`); // Aapke login/signup combined page par
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      
      {/* 🚀 STICKY NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">F</div>
            <span className="text-xl font-black tracking-tight text-white">BUILDER</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#mindset" className="hover:text-white transition-colors">The Mindset</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real Login Link */}
            <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden md:block">
              Log In
            </Link>
            {/* Real Signup Link */}
            <Link href="/login" className="px-5 py-2.5 bg-white text-slate-900 text-sm font-black uppercase tracking-wider rounded-full hover:bg-indigo-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105">
              Try for Free ➔
            </Link>
          </div>
        </div>
      </nav>

      {/* 💥 HERO SECTION */}
      <main className="pt-40 pb-32 px-4 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6 animate-pulse">
          Next-Gen SaaS Funnel Builder
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400">
          You're exactly one funnel away from scaling your empire.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10">
          Build landing pages, capture leads, process payments, and automate your CRM. The complete pipeline to unlock the marketer inside you.
        </p>

        {/* Dynamic Interactive Form */}
        <form onSubmit={handleGetStarted} className="max-w-md mx-auto flex flex-col gap-3 relative z-10">
          <input 
            type="email" 
            value={heroEmail}
            onChange={(e) => setHeroEmail(e.target.value)}
            placeholder="Enter your Email Address" 
            className="w-full px-6 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-center text-lg backdrop-blur-sm transition-all"
            required
          />
          <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1 active:scale-95">
            Get Started For Free
          </button>
        </form>
      </main>

      {/* ⚙️ THE FUNNEL MINDSET SECTION */}
      <section id="mindset" className="py-24 bg-slate-900/30 border-y border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">The Funnel Mindset</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Funnels aren't just a feature, they're a mentality. From leads to sales, your entire business operates on this proven framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Attract", icon: "🧲", desc: "Landing Pages, Lead Magnets, Opt-in Forms, & Fast Websites." },
              { title: "Sell", icon: "💳", desc: "Smart Checkouts, Order Forms, and built-in Razorpay pipelines." },
              { title: "UpSell", icon: "📈", desc: "One-Click Upsells, One Time Offers, and Order Form Bumps." },
              { title: "Ascend & Repeat", icon: "🚀", desc: "CRM sync, automated webhook triggers, and Email Sequences." }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-900 transition-all group cursor-default shadow-lg hover:shadow-indigo-500/10">
                <div className="text-4xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform origin-left">{step.icon}</div>
                <h3 className="text-xl font-black mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 APP FEATURES SECTION */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Build your entire digital ecosystem in one place.</h2>
            <ul className="space-y-4">
              {[
                "Drag & Drop Page Builder", 
                "A/B Testing & Analytics", 
                "Global Products & E-Commerce", 
                "Automated Workflows"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-semibold text-lg">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✓</div>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/login" className="inline-block px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl transition-all">
              Explore All Features ➔
            </Link>
          </div>
          <div className="flex-1 w-full bg-gradient-to-tr from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            {/* Mockup UI Window */}
            <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative">
              <div className="h-8 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="w-1/3 h-4 bg-slate-800 rounded-full animate-pulse"></div>
                <div className="w-3/4 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg"></div>
                <div className="w-1/2 h-4 bg-slate-800 rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 💰 PRICING PREVIEW */}
      <section id="pricing" className="py-24 bg-slate-900/30 border-t border-slate-800 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Simple, transparent pricing.</h2>
          <p className="text-slate-400 mb-12">Start for free. Upgrade when you need more power.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl">
              <h3 className="text-2xl font-black text-white mb-2">Starter Core</h3>
              <div className="text-4xl font-black mb-6">₹0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              <p className="text-sm text-slate-400 mb-8">For entry level sandbox automation and testing.</p>
              <Link href="/login" className="block w-full text-center py-3 rounded-xl border border-slate-700 hover:bg-slate-800 font-bold transition-all">Start Free</Link>
            </div>
            
            <div className="bg-gradient-to-b from-indigo-950 to-slate-950 border border-indigo-500/50 p-8 rounded-3xl shadow-xl shadow-indigo-900/20 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>
              <h3 className="text-2xl font-black text-white mb-2">Growth Plan</h3>
              <div className="text-4xl font-black mb-6">₹2,999<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              <p className="text-sm text-slate-400 mb-8">Unlimited funnels, Razorpay pipelines, and CRM.</p>
              <Link href="/login" className="block w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg">Upgrade to Growth</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="border-t border-slate-800 bg-[#010409] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center font-black text-xs text-slate-400">F</div>
            <span className="font-black tracking-tight text-slate-500">BUILDER</span>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">API Docs</a>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            © 2026 BUILDER Inc. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}