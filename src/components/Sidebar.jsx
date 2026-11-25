"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  ShoppingCart,
  Package,
  Factory,
  Truck,
  Users,
  PanelLeftClose,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", code: "OV", icon: LayoutDashboard },
  { href: "/financial", label: "Financial Accounting", code: "FI", icon: Landmark },
  { href: "/sales", label: "Sales & Distribution", code: "SD", icon: ShoppingCart },
  { href: "/materials", label: "Materials Management", code: "MM", icon: Package },
  { href: "/production", label: "Production Planning", code: "PP", icon: Factory },
  { href: "/transportation", label: "Transportation", code: "TM", icon: Truck },
  { href: "/hcm", label: "Human Capital", code: "HCM", icon: Users },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-ink text-white flex flex-col transition-transform duration-200 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      aria-label="Application Sidebar"
    >
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-white">
              Meridian ERP
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80">
              6.0
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">Enterprise Resource Planning</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Collapse Sidebar"
          aria-label="Collapse Sidebar"
        >
          <PanelLeftClose size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-2.5 text-sm border-l-2 transition-colors ${isActive
                    ? "bg-white/[0.07] border-accent text-white font-medium"
                    : "border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={17} strokeWidth={1.75} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 shrink-0 ml-2">
                    {item.code}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status Footer */}
      <div className="px-5 py-4 border-t border-white/10 text-[11px] text-white/40 font-mono flex items-center justify-between">
        <span>Client 100 · System PRD</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" title="Online" />
      </div>
    </aside>
  );
}
