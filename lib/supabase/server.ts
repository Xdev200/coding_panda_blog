/**
 * Server-side Supabase client using @supabase/ssr.
 *
 * Used in Server Components, Server Actions, and Route Handlers.
 * Creates a new client per request with cookie-based session persistence.
 *
 * @module lib/supabase/server
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client configured for server-side usage.
 * Reads and writes cookies via Next.js headers for session management.
 *
 * @returns Promise resolving to Supabase server client instance
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` is called from a Server Component where cookies
            // cannot be set. This is safe to ignore if middleware refreshes
            // the session on every request.
          }
        },
      },
    }
  );
}
