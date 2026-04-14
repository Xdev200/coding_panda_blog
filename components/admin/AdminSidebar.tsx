/**
 * Admin Sidebar Component.
 *
 * Provides navigation within the admin dashboard using
 * NeoBrutalism-styled nav links with active state detection.
 *
 * @module components/admin/AdminSidebar
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/login/actions";

/**
 * Navigation item type definition.
 */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Admin sidebar navigation items.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/posts", label: "Posts", icon: <FileText size={20} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
];

/**
 * AdminSidebar component with NeoBrutalism styling.
 * Highlights the active route and provides sign-out action.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  /**
   * Determines if a path is active based on exact or prefix match.
   *
   * @param href - The nav item href to check
   * @returns true if the current path matches
   */
  const isActive = (href: string): boolean => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface transition-colors">
      {/* Admin Badge */}
      <div className="p-4 border-b-2 border-retro-black dark:border-retro-white">
        <div className="inline-block border-2 border-retro-black dark:border-retro-white bg-retro-green px-3 py-1 shadow-neo dark:shadow-neo-dark">
          <span className="font-archivo text-sm text-retro-black font-black">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 border-2 font-space text-sm font-medium transition-all ${
              isActive(item.href)
                ? "border-retro-black dark:border-retro-white bg-retro-yellow text-retro-black shadow-neo dark:shadow-neo-dark"
                : "border-transparent text-retro-black/70 dark:text-retro-white/70 hover:border-retro-black dark:hover:border-retro-white hover:bg-retro-yellow/20 hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t-2 border-retro-black dark:border-retro-white mt-auto">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-pink text-retro-black font-space text-sm font-medium shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
