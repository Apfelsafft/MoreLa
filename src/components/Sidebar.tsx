"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, BarChart3, Shield, MessageCircle } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/org", label: "Organigramm", icon: Users },
  { href: "/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/finanzen", label: "Finanzen", icon: BarChart3 },
];

interface SidebarProps {
  onChatOpen?: () => void;
}

export default function Sidebar({ onChatOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">IT Support</p>
          <p className="text-xs text-gray-400 leading-tight">Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Chat Button */}
      <div className="px-3 pb-4 border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500 px-3 mb-2 uppercase tracking-wider">Assistent</p>
        <button
          onClick={onChatOpen}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          Chat öffnen
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">TechCorp AG © 2025</p>
      </div>
    </aside>
  );
}
