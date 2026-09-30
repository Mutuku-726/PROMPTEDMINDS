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
      label: "📊 Dashboard",
    },
    {
      href: "/captions",
      label: "✍️ AI Captions",
    },
    {
      href: "/ads",
      label: "📢 AI Ads",
    },
    {
      href: "/leads",
      label: "👥 Leads",
    },
    {
      href: "/analytics",
      label: "📈 Analytics",
    },
    {
      href: "/settings",
      label: "⚙️ Settings",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 text-white">

      {/* Brand */}
      <div>
        <h1 className="text-2xl font-bold text-blue-400">
          PromptedMinds
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          AI Marketing OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-10 space-y-2">

        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block w-full px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-10 w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition"
      >
        🚪 Log Out
      </button>

    </aside>
  );
}