/**
 * Admin Users List Page.
 *
 * Server component that fetches users and delegates rendering
 * to the UsersTable client component.
 *
 * @module app/admin/users/page
 */

import { userService } from "@/services/userService";
import { UsersTable } from "@/components/admin/UsersTable";
import Link from "next/link";

/**
 * Admin Users list page.
 * Server component that fetches all users and passes data to client table.
 */
export default async function AdminUsersPage() {
  const users = await userService.getAllUsers();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
            Users
          </h1>
          <p className="font-space text-retro-black/60 dark:text-retro-white/60 mt-1">
            Manage user accounts ({users.length} total)
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-6 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-green text-retro-black font-archivo font-black shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
        >
          + New User
        </Link>
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  );
}
