/**
 * Root Next.js middleware.
 *
 * Intercepts all matched requests to refresh the Supabase session
 * and enforce authentication on protected routes.
 *
 * @module middleware
 */

import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

/**
 * Middleware function invoked on every matching request.
 * Delegates to the Supabase session updater for auth management.
 *
 * @param request - The incoming Next.js request
 * @returns NextResponse with session cookies
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Matcher configuration.
 * Excludes static assets, images, and favicon from middleware processing.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets (icons, manifest, images)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
