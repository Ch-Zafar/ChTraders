"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { NAV_ITEMS } from "./Sidebar";
import { PanelLeftOpen, Search } from "lucide-react";

export default function Shell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Load preference from localStorage once mounted on client
  useEffect(() => {
    const saved = localStorage.getItem("meridian_sidebar_open");
    if (saved !== null) {
      setSidebarOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("meridian_sidebar_open", String(next));
      return next;
    });
  };

  // Find active nav item to display in the breadcrumb
  const currentItem =
    NAV_ITEMS.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href))
    ) || { label: "Overview", code: "OV" };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* 1. Mobile Backdrop overlay to close sidebar on click */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-ink/40 z-30 md:hidden backdrop-blur-xs"
          aria-hidden="true"
        />
      )}

      {/* 2. Fixed & Toggleable Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* 3. Main Workspace Container that adapts to sidebar width */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "md:pl-64" : "pl-0"
        }`}
      >
        {/* Sticky Top Header */}
        <header className="h-14 shrink-0 bg-white border-b border-line flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Show toggle button when sidebar is collapsed or on mobile */}
            {!sidebarOpen && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1.5 rounded text-inksoft hover:text-ink hover:bg-surface transition-colors"
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <PanelLeftOpen size={18} strokeWidth={1.75} />
              </button>
            )}

            {/* Breadcrumb navigation */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-inksoft">{currentItem.code}</span>
              <span className="text-inksoft/60">/</span>
              <span className="font-medium text-ink">{currentItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick search input */}
            <div className="relative hidden sm:block">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-inksoft"
              />
              <input
                type="text"
                placeholder="Search transactions, accounts (Ctrl+K)..."
                className="w-72 pl-8 pr-3 py-1.5 text-xs bg-surface border border-line rounded-md text-ink placeholder:text-inksoft/70 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* User Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-accentsoft text-accent text-xs font-semibold flex items-center justify-center border border-accent/20 cursor-pointer"
              title="User: System Admin (ZF)"
            >
              ZF
            </div>
          </div>
        </header>

        {/* Page Content Canvas */}
        <main className="flex-1 p-6 bg-surface overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
