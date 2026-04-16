/**
 * Post Form Component.
 *
 * NeoBrutalism-styled form for creating and editing blog posts.
 * Handles both create and edit modes via form action pattern.
 *
 * @module components/admin/PostForm
 */

"use client";

import React, { useState } from "react";
import type { BlogPost } from "@/types/blog";

/**
 * Props for the PostForm component.
 */
interface PostFormProps {
  /** Existing post data for edit mode (null for create) */
  post?: BlogPost | null;
  /** Server action to invoke on form submission */
  formAction: (formData: FormData) => void;
  /** Whether the form is in a loading/pending state */
  isPending?: boolean;
}



/**
 * PostForm component with NeoBrutalism styling.
 * Supports both create and edit operations.
 *
 * @param props - PostForm properties
 */
export function PostForm({ post, formAction, isPending }: PostFormProps) {
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.coverImage || null
  );

  const isEdit = Boolean(post);

  /**
   * Handles adding a new tag via Enter key or comma separator.
   */
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  /**
   * Removes a tag from the list.
   */
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  /**
   * Handles image file selection with validation.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      // 1. Format Validation
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Invalid format. Please use JPG, PNG, or WebP.");
        return;
      }

      // 2. Size Validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size exceeds 5MB limit.");
        return;
      }

      // 3. Dimension Validation
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 600 || img.height < 300) {
          setImageError("Image dimensions too small. Minimum 600x300px required.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      };
      
      img.onerror = () => {
        setImageError("Error reading image file.");
      };
    }
  };

  /**
   * Wraps the form action to include tags and post ID.
   */
  const handleSubmit = (formData: FormData) => {
    if (imageError) {
      alert("Please fix image errors before saving.");
      return;
    }
    formData.set("tags", JSON.stringify(tags));
    if (post?.id) {
      formData.set("id", post.id);
    }
    formAction(formData);
  };

  /**
   * Shared input className for NeoBrutalism style.
   */
  const inputClassName =
    "w-full px-4 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-bg text-retro-black dark:text-retro-white font-space shadow-neo dark:shadow-neo-dark focus:shadow-neo-hover dark:focus:shadow-neo-dark-hover focus:outline-none transition-shadow";

  const labelClassName =
    "block font-space font-bold text-sm text-retro-black dark:text-retro-white mb-2";

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClassName}>
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title || ""}
            placeholder="Enter post title..."
            className={inputClassName}
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelClassName}>
            Slug (auto-generated if empty)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post?.slug || ""}
            placeholder="my-post-slug"
            className={inputClassName}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className={labelClassName}>
            Category *
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            defaultValue={post?.category || ""}
            placeholder="e.g., react, ai, webdev"
            className={inputClassName}
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className={labelClassName}>
            Author *
          </label>
          <input
            id="author"
            name="author"
            type="text"
            required
            defaultValue={post?.author || "Coding Panda Team"}
            placeholder="Author name"
            className={inputClassName}
          />
        </div>

        {/* Read Time */}
        <div>
          <label htmlFor="read_time" className={labelClassName}>
            Read Time (minutes)
          </label>
          <input
            id="read_time"
            name="read_time"
            type="number"
            min="1"
            max="60"
            defaultValue={post?.readTime || 5}
            className={inputClassName}
          />
        </div>

        {/* Cover Image Upload */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-archivo font-black uppercase tracking-wider text-retro-black dark:text-retro-white">
              Cover Image
            </label>
            <ul className="text-[10px] font-space text-retro-black/60 dark:text-retro-white/60 list-disc list-inside">
              <li>JPG, PNG or WebP</li>
              <li>Max size 5MB</li>
              <li>Min 600x300px</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className={`relative group border-4 ${imageError ? 'border-retro-pink' : 'border-dashed border-retro-black dark:border-retro-white'}`}>
              <input
                type="file"
                name="cover_image_file"
                accept="image/*.jpg,image/*.jpeg,image/*.png,image/*.webp"
                onChange={handleImageChange}
                className="hidden"
                id="coverImageInput"
              />
              <label
                htmlFor="coverImageInput"
                className="flex flex-col items-center justify-center w-full aspect-[21/9] bg-retro-white dark:bg-retro-dark-surface cursor-pointer hover:bg-retro-blue/5 transition-colors overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-retro-black dark:text-retro-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-space font-bold text-xs">
                      Click to upload cover image
                    </span>
                  </div>
                )}
              </label>
            </div>

            {imageError && (
              <p className="text-retro-pink font-space font-bold text-xs bg-retro-pink/10 px-3 py-1 border-l-4 border-retro-pink">
                ⚠️ {imageError}
              </p>
            )}

            {/* Hidden input to pass existing cover image URL if no new file is selected */}
            {post?.coverImage && (
              <input
                type="hidden"
                name="existing_cover_image"
                value={post.coverImage}
              />
            )}
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={post?.featured || false}
            className="w-5 h-5 border-2 border-retro-black dark:border-retro-white accent-retro-yellow"
          />
          <label
            htmlFor="featured"
            className="font-space font-bold text-sm text-retro-black dark:text-retro-white"
          >
            Featured Post
          </label>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className={labelClassName}>Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-blue/30 text-retro-black dark:text-retro-white font-space text-sm shadow-neo dark:shadow-neo-dark"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-retro-black dark:text-retro-white hover:text-retro-pink ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter..."
            className={inputClassName}
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label htmlFor="excerpt" className={labelClassName}>
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={3}
            defaultValue={post?.excerpt || ""}
            placeholder="A brief summary of the post..."
            className={`${inputClassName} resize-y`}
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label htmlFor="content" className={labelClassName}>
            Content * (HTML or Markdown supported)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            defaultValue={post?.content || ""}
            placeholder="Write your post content in markdown..."
            className={`${inputClassName} resize-y font-mono text-sm`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-green text-retro-black font-archivo font-black text-lg shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Saving..."
            : isEdit
            ? "Update Post"
            : "Create Post"}
        </button>
      </div>
    </form>
  );
}
