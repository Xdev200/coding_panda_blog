/**
 * New Post Page.
 *
 * Renders the PostForm in create mode.
 *
 * @module app/admin/posts/new/page
 */

import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "../actions";
import Link from "next/link";

/**
 * New post page component.
 */
export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="px-4 py-2 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface text-retro-black dark:text-retro-white font-space text-sm shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
        >
          ← Back
        </Link>
        <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
          New Post
        </h1>
      </div>

      {/* Form */}
      <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo-lg dark:shadow-neo-dark-lg p-6">
        <PostForm formAction={createPost} />
      </div>
    </div>
  );
}
