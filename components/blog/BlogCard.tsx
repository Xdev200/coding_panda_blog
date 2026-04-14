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
      className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow"
      aria-label={`Read: ${post.title}`}
    >
      <article
        className={`
          border-2 border-retro-black shadow-neo bg-retro-white
          transition-all duration-100
          group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-neo-hover
          ${featured ? "md:flex md:gap-0" : ""}
        `}
      >
        {/* Color cover strip */}
        <div
          className={`
            border-b-2 border-retro-black
            ${featured ? "md:w-48 md:border-b-0 md:border-r-2 flex-shrink-0" : "h-40"}
          `}
          style={{ backgroundColor: post.coverColor }}
          aria-hidden="true"
        >
          {featured && (
            <div className="h-40 md:h-full flex items-center justify-center">
              <span className="text-5xl font-archivo font-black text-retro-black opacity-20 select-none">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-3">
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
            className={`font-archivo font-black text-retro-black leading-tight ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {post.title}
          </h2>

          <p className="font-space text-sm text-gray-700 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <footer className="flex items-center justify-between mt-auto pt-2 border-t-2 border-retro-black border-dashed">
            <span className="font-space text-xs font-semibold text-gray-600">
              {formatDate(post.date)}
            </span>
            <span className="font-space text-xs font-bold bg-retro-black text-retro-white px-2 py-1">
              {formatReadTime(post.readTime)}
            </span>
          </footer>
        </div>
      </article>
    </Link>
  );
}
