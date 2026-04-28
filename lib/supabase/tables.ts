/**
 * Utility to resolve table names based on the environment.
 * In development (localhost), it points to 'dev_*' tables.
 * In production, it points to the original tables.
 * 
 * @module lib/supabase/tables
 */

export const TABLES = {
  POSTS: 'posts',
  TAGS: 'tags',
  PROFILES: 'profiles',
  POST_INTERACTIONS: 'post_interactions',
  SITE_SETTINGS: 'site_settings',
} as const;

export type TableKey = keyof typeof TABLES;

/**
 * Resolves the correct table name based on the current environment.
 * 
 * @param key - The key of the table (e.g., 'POSTS')
 * @returns The table name (e.g., 'dev_posts' in development, 'posts' in production)
 */
export function getTable(key: TableKey): string {
  const baseTable = TABLES[key];
  
  // Detection logic for development environment
  const isDev = 
    process.env.NEXT_PUBLIC_APP_ENV === 'development' || 
    process.env.NODE_ENV === 'development';

  if (isDev) {
    return `dev_${baseTable}`;
  }
  
  return baseTable;
}
