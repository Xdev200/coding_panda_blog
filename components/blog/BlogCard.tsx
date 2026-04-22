import Link from "next/link";
import { Badge, CATEGORY_VARIANT_MAP } from "@/components/ui/Badge";
import { formatDate, formatReadTime } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryVariant =
    CATEGORY_VARIANT_MAP[post.category] ?? "default";

  return (
    <Link
      href={`/${post.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow"
      aria-label={`Read: ${post.title}`}
    >
      <article
        className={`
          h-full flex flex-col
          border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark bg-retro-white dark:bg-retro-dark-surface
          transition-all duration-100
          group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-neo-hover dark:group-hover:shadow-neo-dark-hover
          ${featured ? "md:flex md:flex-row md:gap-0" : ""}
        `}
      >
        {/* Visual Header (Image or Color) */}
        <div
          className={`
            border-b-2 border-retro-black dark:border-retro-white overflow-hidden
            ${featured ? "md:w-48 md:border-b-0 md:border-r-2 flex-shrink-0" : ""}
          `}
          style={{ backgroundColor: !post.thumbnailImage && !post.coverImage ? post.coverColor : undefined }}
          aria-hidden="true"
        >
          {post.thumbnailImage || post.coverImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50/50 dark:bg-retro-dark-bg/20">
              <img
                src={post.thumbnailImage || post.coverImage}
                alt=""
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            featured && (
              <div className="h-full flex items-center justify-center">
                <span className="text-5xl font-archivo font-black text-retro-black opacity-20 select-none">
                  {post.title.charAt(0)}
                </span>
              </div>
            )
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              label={post.category}
              variant={categoryVariant as "default"}
            />
            {post.featured && (
              <Badge label="Featured" variant="outline" />
            )}
          </div>

          <h2
            className={`font-archivo font-black text-retro-black dark:text-retro-white leading-tight ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {post.title}
          </h2>

          <p className="font-space text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <footer className="flex items-center justify-between mt-auto pt-2 border-t-2 border-retro-black dark:border-retro-white border-dashed">
            <span className="font-space text-xs font-semibold text-gray-600 dark:text-gray-400">
              {formatDate(post.date)}
            </span>
            <span className="font-space text-xs font-bold bg-retro-black dark:bg-retro-white text-retro-white dark:text-retro-black px-2 py-1">
              {formatReadTime(post.readTime)}
            </span>
          </footer>
        </div>
      </article>
    </Link>
  );
}
