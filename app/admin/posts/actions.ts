/**
 * Admin Posts Server Actions.
 *
 * Handles create, update, and delete operations for posts
 * via form-based server actions.
 *
 * @module app/admin/posts/actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminBlogService } from "@/services/adminBlogService";
import type { CreatePostInput, UpdatePostInput } from "@/types/blog";

/**
 * Creates a new blog post from form data.
 *
 * @param formData - Form data containing all post fields
 * @returns Redirects to /admin/posts on success
 */
export async function createPost(formData: FormData) {
  const input: CreatePostInput = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    featured: formData.get("featured") === "on",
    cover_color: (formData.get("cover_color") as string) || "#FDE047",
    read_time: parseInt(formData.get("read_time") as string) || 5,
  };

  await adminBlogService.createPost(input);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  redirect("/admin/posts");
}

/**
 * Updates an existing blog post from form data.
 *
 * @param formData - Form data containing post ID and updated fields
 * @returns Redirects to /admin/posts on success
 */
export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;

  const input: UpdatePostInput = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    featured: formData.get("featured") === "on",
    cover_color: (formData.get("cover_color") as string) || "#FDE047",
    read_time: parseInt(formData.get("read_time") as string) || 5,
  };

  await adminBlogService.updatePost(id, input);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  redirect("/admin/posts");
}

/**
 * Deletes a blog post by ID.
 *
 * @param formData - Form data containing the post ID
 * @returns Redirects to /admin/posts on success
 */
export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;
  await adminBlogService.deletePost(id);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  redirect("/admin/posts");
}
