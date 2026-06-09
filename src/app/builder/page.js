"use client";
import { useState } from "react";
import Link from "next/link";

export default function BuilderPage() {
  // Yeh states user ki customization ko live yaad rakhengi
  const [headline, setHeadline] = useState("Apna Mahaan Offer Yahan Likhein!");
  const [subheadline, setSubheadline] = useState("Ek aisi line jo customer ko majboor kar de product khareedne par.");
  const [buttonText, setButtonText] = useState("Join Now ➔");
  const [buttonColor, setButtonColor] = useState("bg-indigo-600");

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col md:flex-row">
      
      {/* LEFT SIDE: CUSTOMIZATION PANEL (Yahan user settings badlega) */}
      <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black tracking-wider text-indigo-400">FUNNEL EDITOR</h2>
            <Link href="/" className="text-xs text-slate-400 hover:text-white bg-slate-900 px-2 py-1 rounded border border-slate-800">
              ➔ Dashboard
            </Link>
          </div>

          <div className="space-y-6">
            {/* 1. Headline Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Main Headline</label>
              <textarea 
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 2. Subheadline Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sub-Headline</label>
              <textarea 
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 3. Button Text Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Button Text</label>
              <input 
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 4. Button Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Button Color</label>
              <div className="flex gap-2">
                <button onClick={() => setButtonColor("bg-indigo-600")} className="w-8 h-8 rounded-full bg-indigo-600 border border-white/20"></button>
                <button onClick={() => setButtonColor("bg-emerald-600")} className="w-8 h-8 rounded-full bg-emerald-600 border border-white/20"></button>
                <button onClick={() => setButtonColor("bg-rose-600")} className="w-8 h-8 rounded-full bg-rose-600 border border-white/20"></button>
                <button onClick={() => setButtonColor("bg-amber-500")} className="w-8 h-8 rounded-full bg-amber-500 border border-white/20"></button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={() => alert("Funnel Saved Successfully! (Abhi database nahi hai par code mast chal raha hai)")}
          className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold text-sm shadow-lg mt-6 transition"
        >
          💾 Save Funnel
        </button>
      </div>


      {/* RIGHT SIDE: LIVE PREVIEW (Yahan user ko live dikhega uska page kaisa lag raha hai) */}
      <div className="flex-1 bg-slate-900 p-8 flex items-center justify-center relative overflow-y-auto">
        {/* Fake Browser Window Top Bar */}
        <div className="absolute top-4 left-8 right-8 bg-slate-950/40 border border-slate-800 p-2 rounded-t-lg flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-slate-500 ml-4 font-mono select-none">https://youruserbusiness.com/funnel-live</span>
        </div>

        {/* Live Landing Page Container */}
        <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 p-12 rounded-2xl shadow-2xl text-center mt-8 animate-in fade-in duration-300">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            EXCLUSIVE OFFER
          </span>
          
          {/* Live Headline */}
          <h1 className="text-3xl md:text-4xl font-black mt-6 mb-4 text-white leading-tight">
            {headline}
          </h1>

          {/* Live Subheadline */}
          <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
            {subheadline}
          </p>

          {/* Live Form Inputs */}
          <div className="max-w-md mx-auto space-y-3 mb-6">
            <input type="text" placeholder="Apna Naam Likhein" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none" disabled />
            <input type="email" placeholder="Apna Email Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none" disabled />
          </div>

          {/* Live Button */}
          <button className={`max-w-md w-full text-white font-bold py-3 px-6 rounded-lg shadow-lg text-sm transition transform active:scale-95 ${buttonColor}`}>
            {buttonText}
          </button>
          
          <p className="text-xs text-slate-500 mt-4">🔒 We respect your privacy. No spam ever.</p>
        </div>
      </div>

    </div>
  );
}