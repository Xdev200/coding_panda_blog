/**
 * Server Actions for authentication (login/logout).
 *
 * Uses the Supabase SSR server client for secure credential handling.
 * These actions are invoked from the login form and admin layout.
 *
 * @module app/login/actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Authenticates a user with email and password.
 * Validates admin role after successful auth.
 *
 * @param formData - Form data containing email and password fields
 * @returns Redirects to /admin on success or /login with error on failure
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  // Verify admin role
  const role = data.user?.user_metadata?.role;
  if (role !== "admin") {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  const redirectTo = formData.get("redirectTo") as string;
  revalidatePath("/", "layout");
  redirect(redirectTo || "/admin");
}

/**
 * Signs out the current user and redirects to home.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
