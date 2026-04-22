/**
 * Admin Layout.
 *
 * Wraps all /admin/* routes with the sidebar navigation.
 * Does NOT include the public Navbar/Footer since admin has its own layout.
 *
 * @module app/admin/layout
 */

"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

/**
 * Admin layout component.
 * Provides sidebar navigation and a content area for all admin pages.
 * Includes a mobile toggle for the sidebar.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 bg-retro-yellow border-2 border-retro-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar with overlay on mobile */}
      <div
        className={`
          fixed inset-0 z-50 bg-retro-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300
          ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <AdminSidebar onNavItemClick={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 bg-retro-white/50 dark:bg-retro-dark-bg p-4 sm:p-6 lg:p-8 overflow-y-auto transition-colors w-full">
        {children}
      </main>
    </div>
  );
}
