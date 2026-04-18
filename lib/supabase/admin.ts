/**
 * Supabase Admin Client.
 *
 * This client uses the SERVICE_ROLE_KEY to bypass RLS and perform
 * administrative tasks (like creating users via Auth Admin API).
 *
 * IMPORTANT: This should ONLY be used in server-side code (Server Actions, 
 * Route Handlers, or Server Components).
 *
 * @module lib/supabase/admin
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client.
 *
 * @returns Supabase client with service_role privileges
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
