/**
 * Admin Settings Page.
 * 
 * Allows admins to configure site-wide settings such as the active theme.
 * 
 * @module app/admin/settings/page
 */

import { Suspense } from "react";
import { settingsService } from "@/services/settingsService";
import { ThemeSelector } from "@/components/admin/ThemeSelector";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Settings | Admin Panel",
};

export default async function SettingsPage() {
  const settings = await settingsService.getSettings();

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 font-archivo text-3xl font-black text-retro-black dark:text-retro-white uppercase tracking-tight">
          <Settings size={32} />
          Site Settings
        </h1>
        <p className="text-retro-black/60 dark:text-retro-white/60 font-space max-w-2xl">
          Configure global application behavior, appearance, and branding. 
          Select a theme to change the overall look and feel of your blog.
        </p>
      </header>

      <section className="bg-white dark:bg-retro-dark-surface border-2 border-retro-black dark:border-retro-white p-6 md:p-8 shadow-neo dark:shadow-neo-dark transition-all">
        <div className="flex flex-col gap-6">
          <div className="border-l-4 border-retro-yellow pl-4">
            <h2 className="font-archivo text-xl font-black text-retro-black dark:text-retro-white uppercase">
              Brand Theme
            </h2>
            <p className="text-sm text-retro-black/60 dark:text-retro-white/60 font-space">
              Choose a design system to apply across the entire public blog.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 flex items-center justify-center font-space">Loading themes...</div>}>
            <ThemeSelector currentTheme={settings.activeTheme} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
