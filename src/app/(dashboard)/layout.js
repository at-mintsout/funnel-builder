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

  useEffect(() => {
    const checkActiveUserSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
      } else {
        setUserEmail(user.email);
      }
    };
    checkActiveUserSession();
  }, [router, pathname]);

  const handleSystemSignOut = async () => {
    const confirmation = window.confirm("Are you sure you want to log out?");
    if (!confirmation) return;
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      alert("Signout Error: " + err.message);
    }
  };

  const coreNavigationMenu = [
    { name: "Builder Studio", path: "/builder", icon: "🏗️" },
    { name: "My Profile", path: "/profile", icon: "👤" },
    { name: "Billing & Sub", path: "/subscription", icon: "💳" },
    { name: "Core Settings", path: "/settings", icon: "⚙️" },
  ];

  // 🚀 NO MORE NESTED HTML/BODY TAGS (Saves you from all 4 errors)
  return (
    <div className="min-h-screen flex overflow-hidden w-full h-screen selection:bg-blue-500/20">
      
      {/* 📂 ULTRA-COMPACT SIDEBAR NAVIGATION PANEL */}
      <aside className={`${sidebarOpen ? "w-60" : "w-[64px]"} transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 relative z-30 shadow-sm`}>
        <div>
          {/* Header/Branding Mini Frame */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
            <div className={`flex items-center gap-2.5 ${!sidebarOpen && "justify-center w-full"}`}>
              <span className="text-base bg-gradient-to-br from-blue-500 to-blue-600 text-white p-1 rounded-lg font-bold shadow-sm shadow-blue-500/20">🎯</span>
              {sidebarOpen && <span className="font-extrabold text-xs uppercase tracking-widest bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">FunnelForge</span>}
            </div>
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-[10px]">◂◂</button>
            )}
          </div>

          {/* Minimal User Identity Session Info */}
          {sidebarOpen && (
            <div className="p-2.5 mx-2.5 my-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2.5">
              <div className="w-6 h-6 shrink-0 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">U</div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-700 truncate tracking-wide">{userEmail}</p>
              </div>
            </div>
          )}

          {/* Menu Links Map Container */}
          <nav className="mt-2 px-2 space-y-0.5">
            {coreNavigationMenu.map((item) => {
              const isActiveRoute = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150 group border ${
                    isActiveRoute
                      ? "bg-blue-50 text-blue-600 shadow-xs border-blue-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                  }`}
                >
                  <span className={`text-sm transition-transform duration-150 group-hover:scale-105 ${isActiveRoute ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Micro Logout Footer Section */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          {!sidebarOpen ? (
            <button onClick={() => setSidebarOpen(true)} className="w-full h-8 bg-white border border-slate-200 text-blue-600 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-xs shadow-xs">▸▸</button>
          ) : (
            <button onClick={handleSystemSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100/60 transition-all duration-150">
              <span className="text-xs">🚪</span> <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* 💻 MAIN RUNTIME WORKSPACE CONTENT DISPLAY */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        
        {/* Slim Header Bar Frame */}
        <header className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-5 shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-[10px] shadow-xs transition-colors">☰ Menu</button>
            )}
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              {coreNavigationMenu.find((m) => m.path === pathname)?.name || "Dashboard Console"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-mono font-bold border border-emerald-200/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              API Sync Live
            </span>
          </div>
        </header>

        {/* Main Interactive App Body Container Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="w-full h-full text-slate-800">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}