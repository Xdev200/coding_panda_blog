/**
 * User Service — Server-side CRUD operations for user management.
 *
 * Uses the Supabase SSR server client for authenticated operations.
 * All operations require admin authentication via RLS policies.
 *
 * @module services/userService
 */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserProfile, CreateUserInput, UpdateUserInput } from "@/types/user";

/**
 * User Service object providing CRUD operations for user profiles.
 * All methods create a fresh server client for cookie-based auth.
 */
export const userService = {
  /**
   * Fetches all user profiles.
   * Requires admin role via RLS policy.
   *
   * @returns Array of all user profiles ordered by creation date
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Fetches a single user profile by UUID.
   *
   * @param id - The user UUID
   * @returns The matching UserProfile or null if not found
   */
  async getUserById(id: string): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }

    return data;
  },

  /**
   * Creates a new user via Supabase Auth and sets up their profile.
   * Uses admin API to create the auth user, then the trigger
   * automatically creates the profile row.
   *
   * @param input - The user creation data (email, password, full_name, role)
   * @returns The created UserProfile
   * @throws Error if creation fails
   */
  async createUser(input: CreateUserInput): Promise<UserProfile> {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Create auth user with metadata
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.full_name,
        role: input.role,
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw new Error(authError.message);
    }

    // The trigger should auto-create the profile, but let's fetch it
    // Wait a moment for the trigger to execute
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching created profile:", profileError);
      throw new Error(profileError.message);
    }

    return profile;
  },

  /**
   * Updates an existing user profile.
   *
   * @param id - The user UUID to update
   * @param input - Partial profile data to update
   * @returns The updated UserProfile
   * @throws Error if update fails
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const supabase = await createClient();

    // Update profile table
    const updateData: Record<string, unknown> = {};
    if (input.full_name !== undefined) updateData.full_name = input.full_name;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new Error(error.message);
    }

    // Also update user_metadata if role changed
    if (input.role) {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.updateUserById(id, {
        user_metadata: { role: input.role },
      });
    }

    return data;
  },

  /**
   * Deletes a user by UUID.
   * Removes both the auth user and profile (cascade handles profile).
   *
   * @param id - The user UUID to delete
   * @throws Error if deletion fails
   */
  async deleteUser(id: string): Promise<void> {
    const adminClient = createAdminClient();

    // Delete from auth (profile cascades)
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw new Error(error.message);
    }
  },

  /**
   * Gets aggregate statistics for user management.
   *
   * @returns Object containing total users and counts by role
   */
  async getStats(): Promise<{
    totalUsers: number;
    adminCount: number;
    editorCount: number;
    viewerCount: number;
  }> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("role");

    if (error) {
      console.error("Error fetching user stats:", error);
      return { totalUsers: 0, adminCount: 0, editorCount: 0, viewerCount: 0 };
    }

    const users = data || [];
    return {
      totalUsers: users.length,
      adminCount: users.filter((u: Record<string, unknown>) => u.role === "admin").length,
      editorCount: users.filter((u: Record<string, unknown>) => u.role === "editor").length,
      viewerCount: users.filter((u: Record<string, unknown>) => u.role === "viewer").length,
    };
  },
};
