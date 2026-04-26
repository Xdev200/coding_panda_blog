import { blogService } from "@/services/blogService";
import type { BlogPost, BlogCategory } from "@/types/blog";

/**
 * Wrapper for blogService to maintain backward compatibility with existing codebase.
 * Most calls are now async, so callers may need to await them.
 */

export const getAllPosts = async (): Promise<BlogPost[]> => {
  return blogService.getAllPosts();
};

export const getPostBySlug = async (slug: string, showUnpublished = false): Promise<BlogPost | undefined> => {
  return blogService.getPostBySlug(slug, showUnpublished);
};

export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  return blogService.getPostsByCategory(category);
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  return blogService.getPostsByTag(tag);
};

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  return blogService.getFeaturedPosts();
};

export const getCategories = async (): Promise<BlogCategory[]> => {
  return blogService.getAllTags();
};

export const getAllTags = async (): Promise<BlogCategory[]> => {
  return blogService.getAllTags();
};

// Re-export constants that might still be used if needed (for defaults)
export const BLOG_POSTS: BlogPost[] = []; // Empty for now, but will be fetched from DB
export const CATEGORIES: BlogCategory[] = [];
export const CATEGORY_MAP: Record<string, string> = {};
