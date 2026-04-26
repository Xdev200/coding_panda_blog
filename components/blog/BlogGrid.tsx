import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/blog";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark bg-retro-yellow dark:bg-retro-dark-surface p-12 text-center">
        <p className="font-archivo text-2xl font-black text-retro-black dark:text-retro-yellow">
          No posts found.
        </p>
        <p className="font-space text-sm mt-2 text-gray-700 dark:text-gray-300">
          Try selecting a different category.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const hasFeatured = featured?.featured;

  return (
    <div className="flex flex-col gap-6">
      {hasFeatured && (
        <BlogCard key={featured.slug} post={featured} featured />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--grid-gap)]">
        {(hasFeatured ? rest : posts).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
