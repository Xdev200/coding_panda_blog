/**
 * Admin Users Server Actions.
 *
 * Handles create, update, and delete operations for users
 * via form-based server actions.
 *
 * @module app/admin/users/actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { userService } from "@/services/userService";
import type { CreateUserInput, UpdateUserInput } from "@/types/user";

/**
 * Creates a new user from form data.
 *
 * @param formData - Form data containing user fields
 * @returns Redirects to /admin/users on success
 */
export async function createUser(formData: FormData) {
  const input: CreateUserInput = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
    role: formData.get("role") as "admin" | "editor" | "viewer",
  };

  await userService.createUser(input);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/**
 * Updates an existing user from form data.
 *
 * @param formData - Form data containing user ID and updated fields
 * @returns Redirects to /admin/users on success
 */
export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;

  const input: UpdateUserInput = {
    full_name: formData.get("full_name") as string,
    role: formData.get("role") as "admin" | "editor" | "viewer",
  };

  await userService.updateUser(id, input);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/**
 * Deletes a user by ID.
 *
 * @param formData - Form data containing the user ID
 * @returns Redirects to /admin/users on success
 */
export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  await userService.deleteUser(id);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
