/**
 * Spinner Component.
 *
 * A NeoBrutalism-styled loading spinner using Lucide's Loader2.
 * Supports different sizes and optional text.
 *
 * @module components/ui/Spinner
 */

"use client";

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  /** Size of the spinner in pixels (default: 24) */
  size?: number;
  /** Optional loading text to display */
  text?: string;
  /** Additional CSS classes */
  className?: string;
  /** Full screen centered mode */
  fullScreen?: boolean;
}

/**
 * NeoBrutalism Loading Spinner.
 */
export function Spinner({
  size = 24,
  text,
  className = "",
  fullScreen = false,
}: SpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        {/* Shadow/Backing for NeoBrutalism effect */}
        <div 
          className="absolute inset-0 translate-x-1 translate-y-1 bg-retro-black dark:bg-retro-white rounded-full opacity-20"
          style={{ width: size, height: size }}
        />
        <Loader2 
          size={size} 
          className="animate-spin text-retro-black dark:text-retro-white relative z-10" 
        />
      </div>
      {text && (
        <span className="font-space text-sm font-bold text-retro-black dark:text-retro-white uppercase tracking-wider">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-retro-white/80 dark:bg-retro-dark-bg/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
