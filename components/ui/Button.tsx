import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

const SIZE_STYLES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

const VARIANT_STYLES = {
  primary:
    "bg-retro-yellow text-retro-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover",
  secondary:
    "bg-retro-black dark:bg-retro-white text-retro-white dark:text-retro-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover",
  outline:
    "bg-transparent text-retro-black dark:text-retro-white hover:bg-retro-yellow hover:text-retro-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_STYLES;
  size?: keyof typeof SIZE_STYLES;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-bold font-space border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
