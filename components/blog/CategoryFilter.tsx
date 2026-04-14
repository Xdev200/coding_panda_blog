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
            "font-space font-bold text-sm px-4 py-2 border-2 border-retro-black transition-all duration-100",
            "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow",
            activeCategory === cat.id
              ? "bg-retro-black text-retro-white shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-retro-white text-retro-black shadow-neo"
          )}
        >
          {cat.label}
          <span
            className={cn(
              "ml-2 text-xs px-1.5 py-0.5 border border-current",
              activeCategory === cat.id
                ? "bg-retro-yellow text-retro-black border-retro-yellow"
                : "border-retro-black"
            )}
          >
            {cat.count}
          </span>
        </button>
      ))}
    </nav>
  );
}
