/**
 * Auth Callback Route.
 *
 * Handles the OAuth/email confirmation callback from Supabase.
 * Exchanges the auth code for a session.
 *
 * @module app/auth/callback/route
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET handler for auth callback.
 * Exchanges the code parameter for a valid session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no code or error, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=invalid_credentials`);
}
