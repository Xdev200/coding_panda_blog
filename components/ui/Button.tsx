import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

const SIZE_STYLES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

const VARIANT_STYLES = {
  primary:
    "bg-retro-yellow text-retro-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover",
  secondary:
    "bg-retro-black text-retro-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover",
  outline:
    "bg-transparent text-retro-black hover:bg-retro-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover",
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
        "font-bold font-space border-2 border-retro-black shadow-neo transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer",
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
