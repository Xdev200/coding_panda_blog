/**
 * Admin Layout.
 *
 * Wraps all /admin/* routes with the sidebar navigation.
 * Does NOT include the public Navbar/Footer since admin has its own layout.
 *
 * @module app/admin/layout
 */

import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Admin layout component.
 * Provides sidebar navigation and a content area for all admin pages.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-retro-white/50 dark:bg-retro-dark-bg p-6 overflow-y-auto transition-colors">
        {children}
      </main>
    </div>
  );
}
