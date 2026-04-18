/**
 * Admin Blog Service — Server-side CRUD operations for posts.
 *
 * Uses the Supabase SSR server client for authenticated operations.
 * All mutations (create, update, delete) require admin authentication.
 *
 * @module services/adminBlogService
 */

import { createClient } from "@/lib/supabase/server";
import type { BlogPost, CreatePostInput, UpdatePostInput } from "@/types/blog";

/**
 * Generates a URL-friendly slug from a title string.
 *
 * @param title - The post title to slugify
 * @returns URL-safe slug string
 *
 * @example
 * generateSlug("Hello World Post!") // "hello-world-post"
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Maps a Supabase database row to a BlogPost type.
 *
 * @param dbPost - Raw database row from the posts table
 * @returns Mapped BlogPost object with camelCase fields
 */
function mapSupabasePost(dbPost: Record<string, unknown>): BlogPost {
  return {
    id: dbPost.id as string,
    slug: dbPost.slug as string,
    title: dbPost.title as string,
    excerpt: dbPost.excerpt as string,
    content: dbPost.content as string | undefined,
    date: dbPost.date as string,
    author: (dbPost.author as string) || "Coding Panda Team",
    category: (dbPost.category as string) || "general",
    readTime: (dbPost.read_time as number) || 5,
    coverColor: (dbPost.cover_color as string) || "#FDE047",
    coverImage: dbPost.cover_image as string | undefined,
    tags: (dbPost.tags as string[]) || [],
    featured: dbPost.featured as boolean | undefined,
  };
}

/**
 * Admin Blog Service object providing CRUD operations for posts.
 * All methods create a fresh server client for cookie-based auth.
 */
export const adminBlogService = {
  /**
   * Fetches all posts (admin view — includes all fields).
   *
   * @returns Array of all blog posts ordered by date descending
   */
  async getAllPosts(): Promise<BlogPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Admin: Error fetching all posts:", error);
      throw new Error(error.message);
    }

    return (data || []).map(mapSupabasePost);
  },

  /**
   * Fetches a single post by its UUID.
   *
   * @param id - The post UUID
   * @returns The matching BlogPost or null if not found
   */
  async getPostById(id: string): Promise<BlogPost | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Admin: Error fetching post ${id}:`, error);
      return null;
    }

    return data ? mapSupabasePost(data) : null;
  },

  /**
   * Creates a new blog post.
   * Auto-generates slug from title if not provided.
   *
   * @param input - The post creation data
   * @returns The newly created BlogPost
   * @throws Error if creation fails
   */
  async createPost(input: CreatePostInput): Promise<BlogPost> {
    const supabase = await createClient();
    const slug = input.slug || generateSlug(input.title);

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: input.title,
        slug,
        excerpt: input.excerpt,
        content: input.content,
        author: input.author,
        category: input.category,
        tags: input.tags,
        featured: input.featured,
        cover_color: input.cover_color,
        cover_image: input.cover_image,
        read_time: input.read_time,
        date: input.date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Admin: Error creating post:", error);
      throw new Error(error.message);
    }

    return mapSupabasePost(data);
  },

  /**
   * Updates an existing blog post.
   *
   * @param id - The post UUID to update
   * @param input - Partial post data to update
   * @returns The updated BlogPost
   * @throws Error if update fails
   */
  async updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
    const supabase = await createClient();
    const updateData: Record<string, unknown> = {};

    // Only include fields that are present in the input
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.author !== undefined) updateData.author = input.author;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.featured !== undefined) updateData.featured = input.featured;
    if (input.cover_color !== undefined)
      updateData.cover_color = input.cover_color;
    if (input.cover_image !== undefined)
      updateData.cover_image = input.cover_image;
    if (input.read_time !== undefined) updateData.read_time = input.read_time;
    if (input.date !== undefined) updateData.date = input.date;

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Admin: Error updating post ${id}:`, error);
      throw new Error(error.message);
    }

    return mapSupabasePost(data);
  },

  /**
   * Deletes a blog post by its UUID.
   *
   * @param id - The post UUID to delete
   * @throws Error if deletion fails
   */
  async deletePost(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error(`Admin: Error deleting post ${id}:`, error);
      throw new Error(error.message);
    }
  },

  /**
   * Gets aggregate statistics for the admin dashboard.
   *
   * @returns Object containing total posts, featured posts, and category counts
   */
  async getStats(): Promise<{
    totalPosts: number;
    featuredPosts: number;
    categories: number;
  }> {
    const supabase = await createClient();

    const [
      { count: totalPosts },
      { count: featuredPosts },
      { data: categoryData },
    ] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("featured", true),
      supabase.from("posts").select("category"),
    ]);

    const uniqueCategories = new Set(
      (categoryData || []).map(
        (p: Record<string, unknown>) => p.category as string
      )
    );

    return {
      totalPosts: totalPosts || 0,
      featuredPosts: featuredPosts || 0,
      categories: uniqueCategories.size,
    };
  },
};
