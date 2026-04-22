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
    header: "Images",
    accessor: (row) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {row.coverImage ? (
            <div className="w-10 h-10 border border-retro-black dark:border-retro-white shadow-neo-sm overflow-hidden" title="Cover Image">
              <img src={row.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 border border-retro-black/20 dark:border-retro-white/20 flex items-center justify-center text-[10px] italic text-retro-black/40" title="No Cover">None</div>
          )}
          {row.thumbnailImage ? (
            <div className="w-10 h-10 border border-retro-black dark:border-retro-white shadow-neo-sm overflow-hidden" title="Thumbnail Image">
              <img src={row.thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 border border-retro-black/20 dark:border-retro-white/20 flex items-center justify-center text-[10px] italic text-retro-black/40" title="No Thumbnail">None</div>
          )}
        </div>
        <div className="flex gap-2">
          {row.coverImage && <a href={row.coverImage} target="_blank" rel="noopener" className="text-[10px] font-bold text-retro-blue hover:underline">Cover</a>}
          {row.thumbnailImage && <a href={row.thumbnailImage} target="_blank" rel="noopener" className="text-[10px] font-bold text-retro-blue hover:underline">Thumb</a>}
        </div>
      </div>
    ),
  },
  {
    header: "Category",
    accessor: (row) => (
      <span className="inline-block px-2 py-1 border-2 border-retro-black dark:border-retro-white bg-retro-blue/20 text-xs font-space">
        {row.category}
      </span>
    ),
    className: "hidden sm:table-cell",
  },
  {
    header: "Author",
    accessor: "author",
    className: "hidden lg:table-cell",
  },
  {
    header: "Date",
    accessor: (row) =>
      new Date(row.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    className: "hidden md:table-cell",
  },
  {
    header: "Tags",
    accessor: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.tags && row.tags.length > 0 ? (
          row.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 border border-retro-black dark:border-retro-white bg-retro-blue/10 text-[10px] font-space font-bold uppercase"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-retro-black/40 dark:text-retro-white/40 text-xs italic">
            None
          </span>
        )}
      </div>
    ),
    className: "hidden xl:table-cell",
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
    className: "hidden sm:table-cell",
  },
  {
    header: "Status",
    accessor: (row) => {
      const today = new Date().toISOString().split("T")[0];
      const isFuture = row.date > today;
      return (
        <span
          className={`inline-block px-2 py-1 border-2 border-retro-black dark:border-retro-white text-xs font-space font-bold ${
            isFuture
              ? "bg-retro-yellow animate-pulse"
              : "bg-retro-green"
          }`}
        >
          {isFuture ? "Scheduled" : "Published"}
        </span>
      );
    },
    className: "hidden md:table-cell",
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
