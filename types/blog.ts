/**
 * Blog-related type definitions.
 *
 * @module types/blog
 */

/**
 * Represents a blog post entity.
 * Maps to the `public.posts` table with camelCase field names.
 */
export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  category: string;
  readTime: number; // For backward compatibility with UI
  coverColor: string; // For backward compatibility with UI
  coverImage?: string; // S3 bucket image URL
  thumbnailImage?: string; // New: Thumbnail image URL
  likesCount?: number; // New: Like count
  dislikesCount?: number; // New: Dislike count
  tags: string[];
  featured?: boolean;
}

/**
 * Represents a user interaction with a post (like/dislike).
 */
export interface PostInteraction {
  id: string;
  postId: string;
  sessionId: string;
  type: 'like' | 'dislike';
  createdAt: string;
}

/**
 * Represents a blog category/tag grouping with post counts.
 */
export interface BlogCategory {
  id: string;
  label: string;
  count: number;
}

/**
 * Input type for creating a new blog post via admin.
 * Slug is auto-generated from the title if not provided.
 */
export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  cover_color: string;
  cover_image?: string;
  thumbnail_image?: string; // New
  read_time: number;
  date?: string;
}

/**
 * Input type for updating an existing blog post.
 * All fields are optional since partial updates are allowed.
 */
export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  cover_color?: string;
  cover_image?: string;
  thumbnail_image?: string; // New
  read_time?: number;
  date?: string;
}

