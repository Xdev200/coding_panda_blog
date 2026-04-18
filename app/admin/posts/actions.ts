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
import { createClient } from "@/lib/supabase/server";
import type { CreatePostInput, UpdatePostInput } from "@/types/blog";

/**
 * Creates a new blog post from form data.
 *
 * @param formData - Form data containing all post fields
 * @returns Redirects to /admin/posts on success
 */
export async function createPost(formData: FormData) {
  // Handle Image Upload
  const coverFile = formData.get("cover_image_file") as File;
  let coverImageUrl = undefined;

  if (coverFile && coverFile.size > 0) {
    // Server-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(coverFile.type)) {
      throw new Error("Invalid image format. Please use JPG, PNG, or WebP.");
    }
    if (coverFile.size > 5 * 1024 * 1024) {
      throw new Error("Image size exceeds 5MB limit.");
    }

    const supabase = await createClient();
    const fileExt = coverFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, coverFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Admin: Error uploading cover image:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      coverImageUrl = publicUrl;
    }
  }

  const input: CreatePostInput = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    featured: formData.get("featured") === "on",
    cover_color: "#FDE047", // Default or omitted if not used in DB strictly
    cover_image: coverImageUrl,
    read_time: parseInt(formData.get("read_time") as string) || 5,
    date: (formData.get("date") as string) || undefined,
  };

  try {
    await adminBlogService.createPost(input);
  } catch (error: any) {
    console.error("Admin: Error creating post:", error);
    throw new Error(error.message);
  }
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

  // Handle Image Upload
  const coverFile = formData.get("cover_image_file") as File;
  let coverImageUrl: string | undefined =
    (formData.get("existing_cover_image") as string) || undefined;

  if (coverFile && coverFile.size > 0) {
    // Server-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(coverFile.type)) {
      throw new Error("Invalid image format. Please use JPG, PNG, or WebP.");
    }
    if (coverFile.size > 5 * 1024 * 1024) {
      throw new Error("Image size exceeds 5MB limit.");
    }

    const supabase = await createClient();
    const fileExt = coverFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, coverFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Admin: Error uploading cover image:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      coverImageUrl = publicUrl;
    }
  }

  const input: UpdatePostInput = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    featured: formData.get("featured") === "on",
    cover_image: coverImageUrl,
    read_time: parseInt(formData.get("read_time") as string) || 5,
    date: (formData.get("date") as string) || undefined,
  };

  try {
    await adminBlogService.updatePost(id, input);
  } catch (error: any) {
    console.error(`Admin: Error updating post ${id}:`, error);
    throw new Error(error.message);
  }

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
