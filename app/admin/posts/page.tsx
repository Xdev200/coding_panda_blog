/**
 * Admin Posts List Page.
 *
 * Server component that fetches posts and delegates rendering
 * to the PostsTable client component.
 *
 * @module app/admin/posts/page
 */

import { adminBlogService } from "@/services/adminBlogService";
import { PostsTable } from "@/components/admin/PostsTable";
import Link from "next/link";

/**
 * Admin Posts list page.
 * Server component that fetches all posts and passes data to client table.
 */
export default async function AdminPostsPage() {
  const posts = await adminBlogService.getAllPosts();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
            Posts
          </h1>
          <p className="font-space text-retro-black/60 dark:text-retro-white/60 mt-1">
            Manage your blog posts ({posts.length} total)
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 border-2 border-retro-black dark:border-retro-white bg-retro-green text-retro-black font-archivo font-black shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
        >
          + New Post
        </Link>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts} />
    </div>
  );
}
