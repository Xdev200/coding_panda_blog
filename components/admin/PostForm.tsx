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
 * Color options for the post cover.
 */
const COVER_COLORS = [
  { value: "#FDE047", label: "Yellow" },
  { value: "#F472B6", label: "Pink" },
  { value: "#60A5FA", label: "Blue" },
  { value: "#4ADE80", label: "Green" },
  { value: "#FB923C", label: "Orange" },
  { value: "#C084FC", label: "Purple" },
];

/**
 * PostForm component with NeoBrutalism styling.
 * Supports both create and edit operations.
 *
 * @param props - PostForm properties
 */
export function PostForm({ post, formAction, isPending }: PostFormProps) {
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");

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
   * Wraps the form action to include tags and post ID.
   */
  const handleSubmit = (formData: FormData) => {
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

        {/* Cover Color */}
        <div>
          <label htmlFor="cover_color" className={labelClassName}>
            Cover Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COVER_COLORS.map((color) => (
              <label key={color.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="cover_color"
                  value={color.value}
                  defaultChecked={
                    (post?.coverColor || "#FDE047") === color.value
                  }
                  className="sr-only peer"
                />
                <div
                  className="w-10 h-10 border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark peer-checked:ring-4 peer-checked:ring-retro-black dark:peer-checked:ring-retro-white transition-all"
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              </label>
            ))}
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
            Content * (Markdown supported)
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
