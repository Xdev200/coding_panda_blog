/**
 * Data Table Component.
 *
 * Generic, reusable table component with NeoBrutalism styling.
 * Supports custom column definitions and row actions.
 *
 * @module components/admin/DataTable
 */

"use client";

import React from "react";

/**
 * Column definition for the DataTable.
 *
 * @template T - The row data type
 */
export interface Column<T> {
  /** Column header text */
  header: string;
  /** Key from the row data to display, or custom accessor */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Optional CSS class for the column */
  className?: string;
}

/**
 * Props for the DataTable component.
 *
 * @template T - The row data type
 */
interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Row data array */
  data: T[];
  /** Unique key accessor for each row */
  keyAccessor: keyof T;
  /** Optional action buttons renderer for each row */
  renderActions?: (row: T) => React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Generic DataTable component with NeoBrutalism styling.
 * Renders tabular data with customizable columns and row actions.
 *
 * @template T - The row data type
 * @param props - DataTable properties
 */
export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  renderActions,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  /**
   * Resolves a cell value from either a key accessor or a function.
   */
  const getCellValue = (
    row: T,
    accessor: keyof T | ((row: T) => React.ReactNode)
  ): React.ReactNode => {
    if (typeof accessor === "function") {
      return accessor(row);
    }
    const value = row[accessor];
    if (React.isValidElement(value)) return value;
    return String(value ?? "");
  };

  if (data.length === 0) {
    return (
      <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo dark:shadow-neo-dark p-8 text-center">
        <p className="font-space text-retro-black/60 dark:text-retro-white/60">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo dark:shadow-neo-dark overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-retro-black dark:border-retro-white bg-retro-yellow/30 dark:bg-retro-dark-bg">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left font-archivo text-sm text-retro-black dark:text-retro-white font-black ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-right font-archivo text-sm text-retro-black dark:text-retro-white font-black">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyAccessor])}
              className="border-b border-retro-black/20 dark:border-retro-white/20 hover:bg-retro-yellow/10 dark:hover:bg-retro-dark-bg/50 transition-colors"
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 font-space text-sm text-retro-black dark:text-retro-white ${
                    col.className || ""
                  }`}
                >
                  {getCellValue(row, col.accessor)}
                </td>
              ))}
              {renderActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {renderActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
