import { cn } from "@/lib/utils";

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-retro-yellow text-retro-black",
  pink: "bg-retro-pink text-retro-black",
  blue: "bg-retro-blue text-retro-black",
  green: "bg-retro-green text-retro-black",
  orange: "bg-retro-orange text-retro-black",
  purple: "bg-retro-purple text-retro-black",
  outline: "bg-transparent text-retro-black dark:text-retro-white border-2 border-retro-black dark:border-retro-white",
};

export const CATEGORY_VARIANT_MAP: Record<string, string> = {
  design: "pink",
  tutorials: "blue",
  accessibility: "green",
  announcements: "purple",
  all: "default",
};

interface BadgeProps {
  label: string;
  variant?: keyof typeof VARIANT_STYLES;
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-bold font-space uppercase tracking-wider border-2 border-retro-black dark:border-retro-white shadow-neo-hover dark:shadow-neo-dark-hover",
        VARIANT_STYLES[variant] ?? VARIANT_STYLES.default,
        className
      )}
    >
      {label}
    </span>
  );
}
