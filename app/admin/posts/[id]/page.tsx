/**
 * Edit Post Page.
 *
 * Fetches existing post data and renders the PostForm in edit mode.
 *
 * @module app/admin/posts/[id]/page
 */

import { adminBlogService } from "@/services/adminBlogService";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";

/**
 * Edit post page component.
 * Fetches the post by ID and renders the form with pre-filled data.
 */
export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await adminBlogService.getPostById(id);

  if (!post) {
    notFound();
  }

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
          Edit Post
        </h1>
      </div>

      {/* Form */}
      <div className="border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo-lg dark:shadow-neo-dark-lg p-6">
        <PostForm post={post} formAction={updatePost} />
      </div>
    </div>
  );
}
