import { supabase } from "@/lib/supabase";
import type { BlogPost, BlogCategory } from "@/types/blog";

/**
 * Service to handle all blog related database operations with Supabase.
 */
export const blogService = {
  /**
   * Fetches all posts from Supabase.
   */
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .lte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching all posts:", error);
      return [];
    }

    return (data || []).map(this.mapSupabasePost);
  },

  /**
   * Fetches a single post by slug.
   */
  async getPostBySlug(slug: string, showUnpublished = false): Promise<BlogPost | undefined> {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("slug", slug);
    
    if (!showUnpublished) {
      query = query.eq("is_published", true).lte("date", new Date().toISOString().split("T")[0]);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      return undefined;
    }

    return data ? this.mapSupabasePost(data) : undefined;
  },

  /**
   * Fetches posts by category (maps to tag in Supabase if preferred, but we added category column).
   */
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    if (category === "all") return this.getAllPosts();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .lte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      return [];
    }

    return (data || []).map(this.mapSupabasePost);
  },

  /**
   * Fetches posts by category (maps to tag in Supabase if preferred, but we added category column).
   */
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    if (tag === "all") return this.getAllPosts();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .contains("tags", [tag])
      .eq("is_published", true)
      .lte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (error) {
      console.error(`Error fetching posts for tag ${tag}:`, error);
      return [];
    }

    return (data || []).map(this.mapSupabasePost.bind(this));
  },

  /**
   * Fetches featured posts.
   */
  async getFeaturedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("featured", true)
      .eq("is_published", true)
      .lte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }

    return (data || []).map(this.mapSupabasePost);
  },

  /**
   * Fetches all tags from Supabase.
   */
  async getAllTags(): Promise<BlogCategory[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data: posts } = await supabase
      .from("posts")
      .select("id")
      .eq("is_published", true)
      .lte("date", today);
    const totalPosts = posts?.length || 0;

    const { data: tags, error } = await supabase
      .from("tags")
      .select("name");

    if (error) {
      console.error("Error fetching tags:", error);
      return [{ id: "all", label: "All Posts", count: totalPosts }];
    }
    const categories: BlogCategory[] = [
      { id: "all", label: "All Posts", count: totalPosts },
    ];

    // For each tag, we want the count of posts that contain it
    for (const tag of tags || []) {
      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .contains("tags", [tag.name])
        .eq("is_published", true)
        .lte("date", today);
      
      categories.push({
        id: tag.name,
        label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
        count: count || 0,
      });
    }

    return categories;
  },

  /**
   * Helper to map Supabase database fields to our BlogPost type.
   */
  mapSupabasePost(dbPost: any): BlogPost {
    return {
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      date: dbPost.date,
      author: dbPost.author || "Coding Panda Team",
      category: dbPost.category || "general",
      readTime: dbPost.read_time || 5,
      coverColor: dbPost.cover_color || "#FDE047",
      coverImage: dbPost.cover_image,
      thumbnailImage: dbPost.thumbnail_image,
      likesCount: dbPost.likes_count || 0,
      dislikesCount: dbPost.dislikes_count || 0,
      tags: dbPost.tags || [],
      featured: dbPost.featured,
      isPublished: dbPost.is_published || false,
      useStaticImage: dbPost.use_static_image || false,
    };
  },
};
