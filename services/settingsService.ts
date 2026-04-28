/**
 * Settings Service — Server-side operations for site settings.
 *
 * @module services/settingsService
 */

import { createClient } from "@/lib/supabase/server";
import { getTable } from "@/lib/supabase/tables";

export interface SiteSettings {
  id: string;
  activeTheme: string;
  updatedAt: string;
}

/**
 * Maps a Supabase database row to a SiteSettings type.
 *
 * @param dbSettings - Raw database row from the site_settings table
 * @returns Mapped SiteSettings object
 */
function mapSupabaseSettings(dbSettings: Record<string, unknown>): SiteSettings {
  return {
    id: dbSettings.id as string,
    activeTheme: (dbSettings.active_theme as string) || "default",
    updatedAt: dbSettings.updated_at as string,
  };
}

/**
 * Settings Service object providing operations for site-wide configuration.
 */
export const settingsService = {
  /**
   * Fetches the current site settings.
   *
   * @returns SiteSettings object
   */
  async getSettings(): Promise<SiteSettings> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(getTable("SITE_SETTINGS"))
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching site settings:", error);
      // Return default settings if not found or error
      return {
        id: "default",
        activeTheme: "default",
        updatedAt: new Date().toISOString(),
      };
    }

    return mapSupabaseSettings(data);
  },

  /**
   * Updates the active theme for the site.
   *
   * @param theme - The theme ID to set as active
   * @returns The updated SiteSettings
   */
  async updateActiveTheme(theme: string): Promise<SiteSettings> {
    const supabase = await createClient();
    
    // Check if a record exists
    const { data: current, error: fetchError } = await supabase
      .from(getTable("SITE_SETTINGS"))
      .select("id")
      .single();

    let result;
    
    if (current && !fetchError) {
      // Update existing
      result = await supabase
        .from(getTable("SITE_SETTINGS"))
        .update({ active_theme: theme, updated_at: new Date().toISOString() })
        .eq("id", current.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from(getTable("SITE_SETTINGS"))
        .insert({ active_theme: theme })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error updating active theme:", result.error);
      throw new Error(result.error.message);
    }

    return mapSupabaseSettings(result.data);
  },
};
