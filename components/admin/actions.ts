"use server";

import { settingsService } from "@/services/settingsService";
import { revalidatePath } from "next/cache";

/**
 * Server action to update the active theme.
 * 
 * @param themeId - The ID of the theme to set as active
 */
export async function updateThemeAction(themeId: string) {
  try {
    await settingsService.updateActiveTheme(themeId);
    
    // Revalidate paths to reflect theme changes
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    
    return { success: true };
  } catch (error) {
    console.error("Action Error: updateThemeAction:", error);
    throw new Error("Failed to update theme");
  }
}
