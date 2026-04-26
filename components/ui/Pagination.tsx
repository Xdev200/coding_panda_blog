/**
 * Pagination Component.
 *
 * NeoBrutalism-styled pagination controls.
 *
 * @module components/admin/Pagination
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}

/**
 * NeoBrutalism Pagination component.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 border-2 border-retro-black dark:border-retro-white shadow-neo-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
          currentPage === 1
            ? "bg-retro-white/50 dark:bg-retro-dark-bg/50"
            : "bg-retro-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="text-retro-black" />
      </button>

      {/* Page Info */}
      <div className="px-4 py-2 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo-sm font-space font-bold text-sm">
        <span className="text-retro-black dark:text-retro-white">
          PAGE <span className="text-retro-pink">{currentPage}</span> OF {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 border-2 border-retro-black dark:border-retro-white shadow-neo-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
          currentPage === totalPages
            ? "bg-retro-white/50 dark:bg-retro-dark-bg/50"
            : "bg-retro-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} className="text-retro-black" />
      </button>
    </div>
  );
}
