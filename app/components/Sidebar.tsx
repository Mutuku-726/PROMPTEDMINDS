"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const supabase = createClient();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const navItems = [
    {
      href: "/",
      icon: "📊",
      label: "Dashboard",
    },
    {
      href: "/captions",
      icon: "✍️",
      label: "AI Captions",
    },
    {
      href: "/ads",
      icon: "📢",
      label: "AI Ads",
    },
    {
      href: "/leads",
      icon: "👥",
      label: "Leads",
    },
    {
      href: "/analytics",
      icon: "📈",
      label: "Analytics",
    },
    {
      href: "/settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="w-20 md:w-64 min-h-screen flex-shrink-0 bg-slate-900 border-r border-slate-800 p-3 md:p-6 text-white">
      
      {/* Brand */}
      <div className="text-center md:text-left">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          <span className="md:hidden">PM</span>
          <span className="hidden md:inline">PromptedMinds</span>
        </h1>

        <p className="hidden md:block text-slate-400 text-sm mt-1">
          AI Marketing OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-3">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center justify-center md:justify-start gap-3 w-full px-2 md:px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg md:text-base">
                {item.icon}
              </span>

              <span className="hidden md:inline">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Log Out"
        className="mt-8 flex items-center justify-center md:justify-start gap-3 w-full px-2 md:px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition"
      >
        <span>🚪</span>

        <span className="hidden md:inline">
          Log Out
        </span>
      </button>

    </aside>
  );
}