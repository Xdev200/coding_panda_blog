/**
 * User-related type definitions for the admin backend.
 *
 * @module types/user
 */

/**
 * Represents a user profile in the system.
 * Maps to the `public.profiles` table.
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor" | "viewer";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new user.
 * Used in admin user creation forms.
 */
export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "editor" | "viewer";
}

/**
 * Input type for updating an existing user profile.
 * All fields are optional since partial updates are allowed.
 */
export interface UpdateUserInput {
  full_name?: string;
  role?: "admin" | "editor" | "viewer";
  avatar_url?: string;
}

/**
 * Available user roles with display labels.
 */
export const USER_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
] as const;
