/**
 * User Form Component.
 *
 * NeoBrutalism-styled form for creating and editing users.
 * Handles both create and edit modes.
 *
 * @module components/admin/UserForm
 */

"use client";

import React from "react";
import type { UserProfile } from "@/types/user";
import { USER_ROLES } from "@/types/user";

/**
 * Props for the UserForm component.
 */
interface UserFormProps {
  /** Existing user data for edit mode (null for create) */
  user?: UserProfile | null;
  /** Server action to invoke on form submission */
  formAction: (formData: FormData) => void;
  /** Whether the form is in a loading/pending state */
  isPending?: boolean;
}

/**
 * UserForm component with NeoBrutalism styling.
 * Shows password field only in create mode.
 *
 * @param props - UserForm properties
 */
export function UserForm({ user, formAction, isPending }: UserFormProps) {
  const isEdit = Boolean(user);

  /**
   * Wraps the form action to include user ID for updates.
   */
  const handleSubmit = (formData: FormData) => {
    if (user?.id) {
      formData.set("id", user.id);
    }
    formAction(formData);
  };

  /**
   * Shared input className for NeoBrutalism style.
   */
  const inputClassName =
    "w-full px-4 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-bg text-retro-black dark:text-retro-white font-space shadow-neo dark:shadow-neo-dark focus:shadow-neo-hover dark:focus:shadow-neo-dark-hover focus:outline-none transition-shadow";

  const labelClassName =
    "block font-space font-bold text-sm text-retro-black dark:text-retro-white mb-2";

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className={labelClassName}>
            Full Name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            defaultValue={user?.full_name || ""}
            placeholder="John Doe"
            className={inputClassName}
          />
        </div>

        {/* Email — only editable in create mode */}
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isEdit}
            defaultValue={user?.email || ""}
            placeholder="user@codingpanda.dev"
            className={`${inputClassName} ${
              isEdit ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Password — only shown in create mode */}
        {!isEdit && (
          <div>
            <label htmlFor="password" className={labelClassName}>
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className={inputClassName}
            />
          </div>
        )}

        {/* Role */}
        <div>
          <label htmlFor="role" className={labelClassName}>
            Role *
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue={user?.role || "viewer"}
            className={inputClassName}
          >
            {USER_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-green text-retro-black font-archivo font-black text-lg shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Saving..."
            : isEdit
            ? "Update User"
            : "Create User"}
        </button>
      </div>
    </form>
  );
}
