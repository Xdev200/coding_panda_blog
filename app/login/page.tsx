/**
 * Admin Login Page.
 *
 * NeoBrutalism-styled login form for admin authentication.
 * Handles error states from redirects and passes redirectTo context.
 *
 * @module app/login/page
 */

import { login } from "./actions";
import Link from "next/link";

/**
 * Error message mapping for user-friendly display.
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Invalid email or password. Please try again.",
  unauthorized: "Access denied. You don't have admin privileges.",
};

/**
 * Login page component with NeoBrutalism styling.
 * Reads search params for error messages and redirect targets.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-retro-white dark:bg-retro-dark-bg p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border-2 border-retro-black dark:border-retro-white bg-retro-yellow px-4 py-2 shadow-neo dark:shadow-neo-dark mb-4">
            <span className="font-archivo text-2xl text-retro-black">🔐</span>
          </div>
          <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
            Admin Login
          </h1>
          <p className="font-space text-retro-black/60 dark:text-retro-white/60 mt-2">
            Sign in to manage your blog
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="border-2 border-retro-black dark:border-retro-white bg-retro-pink/30 p-4 shadow-neo dark:shadow-neo-dark mb-6">
            <p className="font-space text-sm text-retro-black dark:text-retro-white font-medium">
              ⚠️ {errorMessage}
            </p>
          </div>
        )}

        {/* Login Form */}
        <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo-lg dark:shadow-neo-dark-lg p-6">
          <form className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block font-space font-bold text-sm text-retro-black dark:text-retro-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@codingpanda.dev"
                className="w-full px-4 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-bg text-retro-black dark:text-retro-white font-space shadow-neo dark:shadow-neo-dark focus:shadow-neo-hover dark:focus:shadow-neo-dark-hover focus:outline-none transition-shadow placeholder:text-retro-black/40 dark:placeholder:text-retro-white/40"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block font-space font-bold text-sm text-retro-black dark:text-retro-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-bg text-retro-black dark:text-retro-white font-space shadow-neo dark:shadow-neo-dark focus:shadow-neo-hover dark:focus:shadow-neo-dark-hover focus:outline-none transition-shadow placeholder:text-retro-black/40 dark:placeholder:text-retro-white/40"
              />
            </div>

            {/* Hidden redirect field */}
            <input
              type="hidden"
              name="redirectTo"
              value={params.redirectTo || "/admin"}
            />

            {/* Submit Button */}
            <button
              formAction={login}
              type="submit"
              className="w-full px-6 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-yellow text-retro-black font-archivo font-black text-lg shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Sign In →
            </button>
          </form>
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="font-space text-sm text-retro-black/60 dark:text-retro-white/60 hover:text-retro-black dark:hover:text-retro-white underline transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
