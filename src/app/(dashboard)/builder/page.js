"use client";
import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* 🚀 NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">F</div>
          <span className="text-xl font-black tracking-tight text-white">FREE AI FUNNEL BUILDER</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Success Stories</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden md:block">Log In</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-white text-slate-900 text-sm font-black uppercase tracking-wider rounded-full hover:bg-indigo-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105">
            Try for Free ➔
          </Link>
        </div>
      </nav> 

      {/* 💥 HERO SECTION (Inspired by CF "One funnel away" & Email Opt-in) */}
      <main className="pt-20 pb-32 px-4 text-center max-w-5xl mx-auto relative">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/30 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
          The Ultimate SaaS Funnel Builder
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400">
          You're exactly one funnel away from scaling your empire.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10">
          Build landing pages, capture leads, process Razorpay payments, and automate your CRM. The complete pipeline to unlock the marketer inside you.
        </p>

        {/* Email Opt-in Box */}
        <form className="max-w-md mx-auto flex flex-col gap-3 relative z-10">
          <input 
            type="email" 
            placeholder="Enter your Email Address" 
            className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-center text-lg backdrop-blur-sm"
            required
          />
          <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1">
            Get Started For Free
          </button>
          <p className="text-xs text-slate-500 mt-2 font-medium">Not ready to get started? <a href="#learn-more" className="text-indigo-400 underline">Learn More</a></p>
        </form>
      </main>

      {/* ⚙️ THE FUNNEL MINDSET SECTION (Attract, Sell, Ascend, Repeat) */}
      <section id="learn-more" className="py-24 bg-slate-900/30 border-y border-slate-800">
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
              <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{step.icon}</div>
                <h3 className="text-xl font-black mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS (Social Proof) */}
      <section id="testimonials" className="py-24 px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 text-9xl text-indigo-500/10 font-serif">"</div>
          <h2 className="text-2xl md:text-4xl font-black leading-tight text-white mb-8 relative z-10">
            "Once we put a FREE AI FUNNEL BUILDER pipeline in place, I wouldn't even say it 10x'd, it 20x, 30x'd our business closing rate."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-black text-xl">S</div>
            <div className="text-left">
              <div className="font-black text-white">Sandeep Choudhary</div>
              <div className="text-xs text-indigo-400 font-bold tracking-widest uppercase">Verified FREE AI FUNNEL BUILDER User</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 BOTTOM CTA */}
      <section className="py-24 text-center px-4">
        <h2 className="text-4xl font-black mb-6">Ready to get started?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Stop duct-taping different software together. Build your entire digital ecosystem in one place.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter Your Email Address" 
            className="flex-1 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
          <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all whitespace-nowrap shadow-lg shadow-white/10 hover:scale-105">
            Try for Free ➔
          </button>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="border-t border-slate-800 bg-[#010409] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center font-black text-xs text-slate-400">F</div>
            <span className="font-black tracking-tight text-slate-500">FREE AI FUNNEL BUILDER</span>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">API Docs</a>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            © 2026 FREE AI FUNNEL BUILDER Inc. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}