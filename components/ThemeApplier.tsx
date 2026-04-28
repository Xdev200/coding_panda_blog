"use client";

import { useEffect } from "react";

interface ThemeApplierProps {
  activeTheme: string;
}

/**
 * Client component that applies the database-selected theme to the document element.
 * 
 * @param activeTheme - The ID of the theme to apply (e.g., 'medium', 'substack')
 */
export function ThemeApplier({ activeTheme }: ThemeApplierProps) {
  useEffect(() => {
    // Apply the theme to the <html> element
    const root = document.documentElement;
    
    // Remote any existing theme attributes (except dark mode handled by next-themes)
    if (activeTheme && activeTheme !== "default") {
      root.setAttribute("data-theme", activeTheme);
    } else {
      root.removeAttribute("data-theme");
    }
    
    // Cleanup if needed (though layout persists)
  }, [activeTheme]);

  return null; // This component doesn't render anything
}
