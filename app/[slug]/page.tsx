import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Badge, CATEGORY_VARIANT_MAP } from "@/components/ui/Badge";
import { formatDate, formatReadTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const categoryVariant = CATEGORY_VARIANT_MAP[post.category] ?? "default";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-space font-bold text-sm text-retro-black dark:text-retro-white border-2 border-retro-black dark:border-retro-white px-4 py-2 shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all duration-100 mb-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow bg-retro-white dark:bg-retro-dark-surface"
      >
        ← All Posts
      </Link>

      {/* Cover color strip */}
      <div
        className="w-full h-48 border-2 border-b-0 border-retro-black dark:border-retro-white flex items-center justify-center"
        style={{ backgroundColor: post.coverColor }}
        aria-hidden="true"
      >
        <span className="font-archivo font-black text-8xl text-retro-black opacity-15 select-none">
          {post.title.charAt(0)}
        </span>
      </div>

      {/* Article card */}
      <article className="border-2 border-retro-black dark:border-retro-white shadow-neo-xl dark:shadow-neo-dark-xl bg-retro-white dark:bg-retro-dark-surface">
        <div className="p-8 sm:p-12">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge label={post.category} variant={categoryVariant as "default"} />
            {post.featured && <Badge label="Featured" variant="outline" />}
          </div>

          <h1 className="font-archivo font-black text-3xl sm:text-4xl lg:text-5xl text-retro-black dark:text-retro-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Post meta */}
          <div className="flex flex-wrap gap-4 items-center border-y-2 border-retro-black dark:border-retro-white py-4 mb-8 border-dashed">
            <div className="font-space text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-retro-black dark:text-retro-white">{post.author}</span>
            </div>
            <div className="font-space text-sm text-gray-600 dark:text-gray-400">
              {formatDate(post.date)}
            </div>
            <div className="font-space text-sm font-bold bg-retro-black dark:bg-retro-white text-retro-white dark:text-retro-black px-2 py-1 ml-auto">
              {formatReadTime(post.readTime)}
            </div>
          </div>

          {/* Excerpt / content */}
          <div className="font-space text-base leading-relaxed text-gray-800 dark:text-gray-200 space-y-4">
            <p className="text-lg font-medium text-retro-black dark:text-retro-white">{post.excerpt}</p>
            {post.content ? (
              <div 
                className="prose prose-retro dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            ) : (
              <>
                <p>
                  This is a demo article page. In a full implementation, the blog
                  post content would be loaded from MDX files or a CMS, rendered
                  with a markdown processor, and displayed here with full
                  typography styling.
                </p>
                <p>
                  NeoBrutalism design combines raw, unrefined aesthetics with modern
                  usability. Thick borders, flat drop shadows, and high-contrast
                  color palettes create interfaces that stand out in a sea of
                  identical-looking websites.
                </p>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t-2 border-retro-black dark:border-retro-white border-dashed">
              {post.tags.map((tag) => (
                <Badge key={tag} label={`#${tag}`} variant="outline" />
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
