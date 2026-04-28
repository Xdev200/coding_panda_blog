"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateThemeAction } from "./actions";

/**
 * Theme definition interface.
 */
interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // Path to generated thumbnail
}

/**
 * List of available themes with metadata.
 */
const THEMES: ThemeMeta[] = [
  {
    id: "default",
    name: "RetroUI (Default)",
    description: "Original bold NeoBrutalist design with vibrant yellows and sharp shadows.",
    thumbnail: "/themes/default/thumbnail.png",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Classic minimalist serif typography with high focus on readability.",
    thumbnail: "/themes/medium/thumbnail.png",
  },
  {
    id: "substack",
    name: "Substack",
    description: "Warm, professional editorial feel with warm backgrounds and Lora serif.",
    thumbnail: "/themes/substack/thumbnail.png",
  },
  {
    id: "ghost",
    name: "Ghost Casper",
    description: "Modern, airy blog layout with clean cards and blue accents.",
    thumbnail: "/themes/ghost/thumbnail.png",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    description: "Developer-focused clean interface with blue tints and rounded UI elements.",
    thumbnail: "/themes/hashnode/thumbnail.png",
  },
  {
    id: "editorial",
    name: "Journalist Ink",
    description: "Near-black editorial theme with warm cream text and Playfair Display serif.",
    thumbnail: "/themes/editorial/thumbnail.png",
  },
  {
    id: "notion",
    name: "Notion Wiki",
    description: "Clean, productive aesthetic with Inter sans-serif and callout blocks.",
    thumbnail: "/themes/notion/thumbnail.png",
  },
  {
    id: "brutalist",
    name: "Type Brutalist",
    description: "Massive headlines and sharp hairlines. A pure typographic statement.",
    thumbnail: "/themes/brutalist/thumbnail.png",
  },
  {
    id: "pastel",
    name: "Personal Pastel",
    description: "Soft colors, handwritten flourishes, and a cozy personal touch.",
    thumbnail: "/themes/pastel/thumbnail.png",
  },
  {
    id: "devto",
    name: "DEV.to",
    description: "High-contrast dark developer community theme with topic-coded tags.",
    thumbnail: "/themes/devto/thumbnail.png",
  },
  {
    id: "magazine",
    name: "Full-bleed Magazine",
    description: "Full-width hero section and multi-column magazine editorial layout.",
    thumbnail: "/themes/magazine/thumbnail.png",
  },
  {
    id: "atomic",
    name: "Atomic Micro",
    description: "Clean micro-blogging style optimized for short-form punchy notes.",
    thumbnail: "/themes/atomic/thumbnail.png",
  },
  {
    id: "colorful",
    name: "Topic First",
    description: "Vivid, category-coded theme that changes accent based on content topic.",
    thumbnail: "/themes/colorful/thumbnail.png",
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
}

/**
 * ThemeSelector component.
 * Renders a grid of clickable theme cards.
 */
export function ThemeSelector({ currentTheme }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  /**
   * Handles theme selection and persistence.
   */
  const handleThemeChange = async (themeId: string) => {
    if (themeId === selectedTheme || isUpdating) return;

    setIsUpdating(true);
    setSelectedTheme(themeId);

    try {
      await updateThemeAction(themeId);
      router.refresh();
      // Optional: Show success toast
    } catch (error) {
      console.error("Failed to update theme:", error);
      setSelectedTheme(currentTheme); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          disabled={isUpdating}
          onClick={() => handleThemeChange(theme.id)}
          className={`
            group relative flex flex-col border-2 transition-all text-left overflow-hidden
            ${
              selectedTheme === theme.id
                ? "border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark ring-4 ring-retro-yellow/30"
                : "border-transparent bg-retro-black/5 dark:bg-retro-white/5 hover:border-retro-black/30 dark:hover:border-retro-white/30"
            }
          `}
        >
          {/* Thumbnail Placeholder/Image */}
          <div className="aspect-[3/2] w-full bg-retro-black/10 dark:bg-retro-white/10 relative overflow-hidden">
            <img 
              src={theme.thumbnail} 
              alt={theme.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${selectedTheme === theme.id ? 'scale-110' : 'group-hover:scale-110'}`}
              onError={(e) => {
                // Fallback for missing images
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                e.currentTarget.parentElement!.innerHTML = `<span class="text-3xl font-black opacity-20">${theme.name[0]}</span>`;
              }}
            />
            {selectedTheme === theme.id && (
              <div className="absolute inset-0 bg-retro-yellow/20 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-retro-black text-retro-white p-2 rounded-full shadow-neo border-2 border-retro-white">
                  <Check size={24} />
                </div>
              </div>
            )}
            {isUpdating && selectedTheme === theme.id && (
              <div className="absolute inset-0 bg-white/60 dark:bg-retro-black/60 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-retro-black dark:text-retro-white" size={32} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col gap-1">
            <h3 className="font-archivo text-lg font-black uppercase tracking-tight text-retro-black dark:text-retro-white">
              {theme.name}
            </h3>
            <p className="text-xs text-retro-black/60 dark:text-retro-white/60 font-space line-clamp-2">
              {theme.description}
            </p>
          </div>

          {/* Selection indicator bar */}
          <div 
            className={`h-1.5 transition-all duration-300 ${
              selectedTheme === theme.id ? 'bg-retro-yellow w-full' : 'bg-transparent w-0'
            }`} 
          />
        </button>
      ))}
    </div>
  );
}
