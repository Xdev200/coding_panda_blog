import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Badge, CATEGORY_VARIANT_MAP } from "@/components/ui/Badge";
import { formatDate, formatReadTime } from "@/lib/utils";
import PostActions from "@/components/blog/PostActions";
import { ImagePreloader } from "@/components/ui/ImagePreloader";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = await searchParams;
  const isPreview = sParams.preview === "true";
  
  const post = await getPostBySlug(slug, isPreview);
  if (!post) return { title: "Post Not Found" };

  const url = `https://codingpanda.taqnik.in/${slug}`;

  // Handle static images for metadata
  const coverImage = post.useStaticImage ? "/readme-banner.png" : post.coverImage;
  const thumbImage = post.useStaticImage ? "/readme-banner.png" : post.thumbnailImage;

  const images = [];
  if (thumbImage) {
    images.push({
      url: thumbImage,
      width: 400,
      height: 400,
      alt: `Thumbnail for ${post.title}`,
    });
  }
  if (coverImage) {
    images.push({
      url: coverImage,
      width: 1200,
      height: 630,
      alt: post.title,
    });
  }
  if (images.length === 0) {
    images.push({
      url: "/readme-banner.png",
      width: 1200,
      height: 630,
      alt: post.title,
    });
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: url,
      publishedTime: post.date,
      authors: [post.author],
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: images.map(img => img.url),
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const isPreview = sParams.preview === "true";
  
  const post = await getPostBySlug(slug, isPreview);

  if (!post) notFound();

  // Handle static images
  const coverImage = post.useStaticImage ? "/readme-banner.png" : post.coverImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": coverImage || "https://codingpanda.taqnik.in/readme-banner.png",
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Coding Panda",
      "logo": {
        "@type": "ImageObject",
        "url": "https://codingpanda.taqnik.in/icons/icon-192x192.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://codingpanda.taqnik.in/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-retro-yellow border-b-4 border-retro-black dark:border-retro-white py-2 px-4 text-center sticky top-0 z-50">
          <p className="font-space font-bold text-retro-black">
            PREVIEW MODE: This post is not yet published.
          </p>
        </div>
      )}

      {/* Preload critical cover image for LCP optimization */}
      {coverImage && (
        <ImagePreloader src={coverImage} />
      )}

      <article className="max-w-3xl mt-8 mx-auto px-4 sm:px-6 lg:px-0 pb-16">
      {/* ── Header Section ── */}
      <div className="border-b-2 border-retro-black dark:border-retro-white pb-8 mb-8">
        {/* Date + Category Badges Row */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <p className="font-space text-sm font-medium text-gray-500 dark:text-gray-400">
            {formatDate(post.date)}
          </p>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="font-space text-base text-gray-400 dark:text-gray-500" aria-hidden="true">|</span>
              <div className="flex items-center gap-3 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} label={tag} variant="outline" />
                ))}
              </div>
            </>
          )}
          {post.featured && <Badge label="Featured" variant="outline" />}
        </div>

        {/* Title */}
        <h1 className="font-archivo font-black text-3xl sm:text-4xl lg:text-5xl text-retro-black dark:text-retro-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="font-space text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          {post.excerpt}
        </p>

        {/* Author + Share Row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            {/* Author Avatar */}
            <div className="relative flex h-12 w-12 border-2 border-retro-black dark:border-retro-white rounded-full overflow-hidden bg-retro-yellow items-center justify-center">
              <span className="font-archivo font-black text-lg text-retro-black select-none">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            {/* Author Name */}
            <div>
              <h5 className="font-archivo text-lg font-black text-retro-black dark:text-retro-white">
                {post.author}
              </h5>
              <p className="font-space text-sm text-gray-500 dark:text-gray-400">
                {formatReadTime(post.readTime)}
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* ── Banner Image ── */}
      <div className="relative w-full mb-10 border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark overflow-hidden bg-retro-white dark:bg-retro-dark-surface">
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            width={1280}
            height={720}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full aspect-video object-contain"
          />
        ) : (
          <>
            {/* Decorative fallback pattern */}
            <div
              className="absolute inset-0 opacity-10 bg-retro-yellow aspect-video"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #0A0A0A 25%, transparent 25%), linear-gradient(-45deg, #0A0A0A 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0A0A0A 75%), linear-gradient(-45deg, transparent 75%, #0A0A0A 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />

            {/* Center icon + label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 aspect-video">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-retro-black/40 dark:text-retro-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-archivo font-black text-sm tracking-widest uppercase text-retro-black/40 dark:text-retro-white/40 select-none">
                {post.title}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Article Content ── */}
      <div className="font-space text-lg text-retro-black dark:text-retro-white leading-relaxed">
        {post.content ? (
          <div
            className="prose prose-lg prose-neutral dark:prose-invert max-w-none
              prose-headings:font-archivo prose-headings:font-black prose-headings:text-retro-black dark:prose-headings:text-retro-white
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-10
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:font-space prose-p:text-lg prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed
              prose-a:text-retro-black dark:prose-a:text-retro-yellow prose-a:underline prose-a:underline-offset-4 prose-a:decoration-retro-yellow hover:prose-a:decoration-retro-black
              prose-strong:text-retro-black dark:prose-strong:text-retro-white
              prose-img:mx-auto prose-img:max-w-[600px] prose-img:w-full prose-img:my-8 prose-img:border-2 prose-img:border-retro-black dark:prose-img:border-retro-white prose-img:shadow-neo dark:prose-img:shadow-neo-dark
              prose-blockquote:border-l-4 prose-blockquote:border-retro-yellow prose-blockquote:bg-retro-yellow/10 prose-blockquote:px-6 prose-blockquote:py-4
              prose-code:bg-retro-black prose-code:text-retro-yellow prose-code:px-2 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:rounded-none prose-code:border-2 prose-code:border-retro-black
              prose-pre:bg-retro-black prose-pre:border-2 prose-pre:border-retro-black dark:prose-pre:border-retro-white prose-pre:shadow-neo dark:prose-pre:shadow-neo-dark
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:font-space prose-li:text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              This is a demo article page. In a full implementation, the blog
              post content would be loaded from MDX files or a CMS, rendered
              with a markdown processor, and displayed here with full
              typography styling.
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              NeoBrutalism design combines raw, unrefined aesthetics with modern
              usability. Thick borders, flat drop shadows, and high-contrast
              color palettes create interfaces that stand out in a sea of
              identical-looking websites.
            </p>
          </div>
        )}
      </div>

      <PostActions 
        postId={post.id!} 
        title={post.title} 
        slug={post.slug} 
        likes={post.likesCount || 0} 
        dislikes={post.dislikesCount || 0} 
        thumbnailImage={post.thumbnailImage}
      />

      {/* ── Tags ── */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t-2 border-retro-black dark:border-retro-white border-dashed">
          {post.tags.map((tag) => (
            <Badge key={tag} label={`#${tag}`} variant="outline" />
          ))}
        </div>
      )}

      {/* ── Separator ── */}
      <hr className="my-12 border-t-2 border-retro-black dark:border-retro-white" />

      {/* ── Back Button ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-archivo font-bold text-sm border-2 border-retro-black dark:border-retro-white px-5 py-3 shadow-neo dark:shadow-neo-dark hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all duration-100 bg-retro-yellow text-retro-black focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-yellow"
      >
        ← Back to blogs
      </Link>
    </article>
    </>
  );
}
