/**
 * Browser-side Supabase client using @supabase/ssr.
 *
 * Used in Client Components. Creates a singleton browser client
 * that automatically handles cookie-based session management.
 *
 * @module lib/supabase/client
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client configured for browser-side usage.
 * Reads environment variables at runtime for URL and anon key.
 *
 * @returns Supabase browser client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
