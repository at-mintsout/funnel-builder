"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardMasterLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("loading...");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch Current Active User session details
  useEffect(() => {
    const checkActiveUserSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        // Redirection protocol if session unauthenticated
        router.push("/login");
      } else {
        setUserEmail(user.email);
      }
    };
    checkActiveUserSession();
  }, [router]);

  // Handle Logout Event Authentication Kill
  const handleSystemSignOut = async () => {
    const confirmation = window.confirm("Are you sure you want to terminate your active dashboard session?");
    if (!confirmation) return;
    
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      alert("Auth Engine Terminal Exception: " + err.message);
    }
  };

  // Menu Definition Objects Schema Array Matrix
  const coreNavigationMenu = [
    { name: "Funnel Studio Builder", path: "/builder", icon: "🏗️" },
    { name: "My Profile Node", path: "/profile", icon: "👤" },
    { name: "Billing & Subscription", path: "/subscription", icon: "💳" },
    { name: "Core Application Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden font-sans">
      
      {/* 🚀 SIDEBAR NAVIGATION ENGINE SHELL */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-950 flex flex-col justify-between z-30 relative`}>
        <div>
          {/* Logo Branding Vector Frame */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
              <span className="text-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-1.5 rounded-xl font-bold shadow-md">🎯</span>
              {sidebarOpen && <span className="font-black text-sm uppercase tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FunnelForge</span>}
            </div>
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 transition text-xs">
                ◂◂
              </button>
            )}
          </div>

          {/* Connected Identity Session Context Banner */}
          {sidebarOpen && (
            <div className="p-4 mx-3 my-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400 text-xs">
                U
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">ACTIVE ACCOUNT</p>
                <p className="text-xs font-bold text-slate-300 truncate tracking-wide">{userEmail}</p>
              </div>
            </div>
          )}

          {/* Dynamic Link Application Switch Navigation Modules */}
          <nav className="mt-4 px-3 space-y-1">
            {coreNavigationMenu.map((item) => {
              const isActiveRoute = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 group ${
                    isActiveRoute
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-white border border-transparent"
                  }`}
                >
                  <span className={`text-base transition-transform group-hover:scale-110 ${isActiveRoute ? "opacity-100" : "opacity-70"}`}>{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🚪 APPLICATION TERMINAL FOOTER EXIT MATRIX */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
          {!sidebarOpen ? (
            <button onClick={() => setSidebarOpen(true)} className="w-full h-11 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 flex items-center justify-center rounded-xl transition text-sm">
              ▸▸
            </button>
          ) : (
            <button
              onClick={handleSystemSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-950 bg-rose-950/20 text-rose-400 hover:bg-rose-900 hover:text-white transition-all duration-150"
            >
              <span>🚪</span>
              <span>Sign Out Session</span>
            </button>
          )}
        </div>
      </aside>

      {/* 💻 INTERACTIVE ACTION RUNTIME CONTROLLER FRAME */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Context Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs">
                ☰ Menu
              </button>
            )}
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-400">
              {coreNavigationMenu.find((m) => m.path === pathname)?.name || "Dashboard Core Console"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
              ● API Engine Sync Operational
            </span>
          </div>
        </header>

        {/* 🎬 DYNAMIC ROUTE PAGE INJECTION CONTENT MOUNT POINT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/40">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}