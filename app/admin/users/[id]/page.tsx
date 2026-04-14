/**
 * Edit User Page.
 *
 * Fetches existing user data and renders the UserForm in edit mode.
 *
 * @module app/admin/users/[id]/page
 */

import { userService } from "@/services/userService";
import { UserForm } from "@/components/admin/UserForm";
import { updateUser } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";

/**
 * Edit user page component.
 * Fetches the user by ID and renders the form with pre-filled data.
 */
export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await userService.getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="px-4 py-2 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface text-retro-black dark:text-retro-white font-space text-sm shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
        >
          ← Back
        </Link>
        <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
          Edit User
        </h1>
      </div>

      {/* Form */}
      <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo-lg dark:shadow-neo-dark-lg p-6">
        <UserForm user={user} formAction={updateUser} />
      </div>
    </div>
  );
}
