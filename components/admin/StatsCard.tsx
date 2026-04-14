/**
 * Stats Card Component.
 *
 * Displays a single statistic with label, value, and icon
 * using NeoBrutalism design.
 *
 * @module components/admin/StatsCard
 */

import React from "react";

/**
 * Props for the StatsCard component.
 */
interface StatsCardProps {
  /** Display label for the statistic */
  label: string;
  /** Numeric or string value to display */
  value: string | number;
  /** Icon element to render */
  icon: React.ReactNode;
  /** Background color class (Tailwind) */
  colorClass?: string;
}

/**
 * StatsCard component with NeoBrutalism styling.
 * Used in the admin dashboard to display key metrics.
 *
 * @param props - StatsCard properties
 */
export function StatsCard({
  label,
  value,
  icon,
  colorClass = "bg-retro-yellow",
}: StatsCardProps) {
  return (
    <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo dark:shadow-neo-dark p-6 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-space text-sm text-retro-black/60 dark:text-retro-white/60 font-medium">
            {label}
          </p>
          <p className="font-archivo text-3xl text-retro-black dark:text-retro-white mt-1">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 border-2 border-retro-black dark:border-retro-white ${colorClass} flex items-center justify-center shadow-neo dark:shadow-neo-dark`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
