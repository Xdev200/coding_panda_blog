/**
 * Posts Table Client Component.
 *
 * Wraps DataTable with post-specific column definitions and actions.
 * Must be a client component because columns use function accessors.
 *
 * @module components/admin/PostsTable
 */

"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { deletePost } from "@/app/admin/posts/actions";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

/**
 * Post columns for the DataTable.
 */
const columns: Column<BlogPost>[] = [
  {
    header: "Title",
    accessor: (row) => <span className="font-bold">{row.title}</span>,
  },
  {
    header: "Category",
    accessor: (row) => (
      <span className="inline-block px-2 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-blue/20 text-xs font-space">
        {row.category}
      </span>
    ),
  },
  {
    header: "Author",
    accessor: "author",
  },
  {
    header: "Date",
    accessor: (row) =>
      new Date(row.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    header: "Featured",
    accessor: (row) => (
      <span
        className={`inline-block px-2 py-1 border-2 border-retro-black dark:border-retro-white text-xs font-space font-bold ${
          row.featured
            ? "bg-retro-green"
            : "bg-retro-white dark:bg-retro-dark-surface"
        }`}
      >
        {row.featured ? "Yes" : "No"}
      </span>
    ),
  },
];

/**
 * Props for PostsTable.
 */
interface PostsTableProps {
  /** Array of blog posts to display */
  posts: BlogPost[];
}

/**
 * Client-side posts table with edit/delete actions.
 *
 * @param props - PostsTable properties
 */
export function PostsTable({ posts }: PostsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={posts}
      keyAccessor="id"
      emptyMessage="No posts yet. Create your first post!"
      renderActions={(post) => (
        <>
          <Link
            href={`/admin/posts/${post.id}`}
            className="px-3 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-yellow text-retro-black font-space text-xs font-bold shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
          >
            Edit
          </Link>
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="px-3 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-pink text-retro-black font-space text-xs font-bold shadow-neo dark:shadow-neo-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all"
              onClick={(e) => {
                if (!confirm("Are you sure you want to delete this post?")) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </button>
          </form>
        </>
      )}
    />
  );
}
