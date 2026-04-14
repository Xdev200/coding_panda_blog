"use client";

import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/types/blog";

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <nav
      aria-label="Blog categories"
      className="flex flex-wrap gap-2"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          aria-pressed={activeCategory === cat.id}
          className={cn(
            "font-space font-bold text-sm px-4 py-2 border-2 border-retro-black dark:border-retro-white transition-all duration-100",
            "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow",
            activeCategory === cat.id
              ? "bg-retro-black dark:bg-retro-yellow text-retro-white dark:text-retro-black shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-retro-white dark:bg-retro-dark-surface text-retro-black dark:text-retro-white shadow-neo dark:shadow-neo-dark"
          )}
        >
          {cat.label}
          <span
            className={cn(
              "ml-2 text-xs px-1.5 py-0.5 border border-current",
              activeCategory === cat.id
                ? "bg-retro-yellow text-retro-black border-retro-yellow"
                : "border-retro-black dark:border-retro-white"
            )}
          >
            {cat.count}
          </span>
        </button>
      ))}
    </nav>
  );
}
