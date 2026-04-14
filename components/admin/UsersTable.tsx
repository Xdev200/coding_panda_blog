/**
 * Users Table Client Component.
 *
 * Wraps DataTable with user-specific column definitions and actions.
 * Must be a client component because columns use function accessors.
 *
 * @module components/admin/UsersTable
 */

"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { deleteUser } from "@/app/admin/users/actions";
import Link from "next/link";
import type { UserProfile } from "@/types/user";

/**
 * Role color mapping for the badge display.
 */
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-retro-pink",
  editor: "bg-retro-blue",
  viewer: "bg-retro-yellow",
};

/**
 * User columns for the DataTable.
 */
const columns: Column<UserProfile>[] = [
  {
    header: "Name",
    accessor: (row) => (
      <span className="font-bold">{row.full_name || "—"}</span>
    ),
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Role",
    accessor: (row) => (
      <span
        className={`inline-block px-2 py-1 border-2 border-retro-black dark:border-retro-white ${
          ROLE_COLORS[row.role] || "bg-retro-white"
        } text-retro-black text-xs font-space font-bold uppercase`}
      >
        {row.role}
      </span>
    ),
  },
  {
    header: "Joined",
    accessor: (row) =>
      new Date(row.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];

/**
 * Props for UsersTable.
 */
interface UsersTableProps {
  /** Array of user profiles to display */
  users: UserProfile[];
}

/**
 * Client-side users table with edit/delete actions.
 *
 * @param props - UsersTable properties
 */
export function UsersTable({ users }: UsersTableProps) {
  return (
    <DataTable
      columns={columns}
      data={users}
      keyAccessor="id"
      emptyMessage="No users found."
      renderActions={(user) => (
        <>
          <Link
            href={`/admin/users/${user.id}`}
            className="px-3 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-yellow text-retro-black font-space text-xs font-bold shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
          >
            Edit
          </Link>
          <form action={deleteUser}>
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              className="px-3 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-pink text-retro-black font-space text-xs font-bold shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
              onClick={(e) => {
                if (!confirm("Are you sure you want to delete this user?")) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </button>
          </form>
        </>
      )}
    />
  );
}
