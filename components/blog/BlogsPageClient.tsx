"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllPosts, getPostsByTag } from "@/lib/posts";
import type { BlogPost, BlogCategory } from "@/types/blog";

interface BlogsPageClientProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogsPageClient({ initialPosts, categories }: BlogsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setPosts(initialPosts);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      const fetchedPosts = await getPostsByTag(activeCategory);
      setPosts(fetchedPosts);
      setIsLoading(false);
    };
    fetchPosts();
  }, [activeCategory, initialPosts]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="w-full">
      {/* Page header */}
      <header className="min-h-[calc(100vh-8px)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 text-center lg:text-left">
          <div className="w-full lg:w-1/2">
            <h1 className="sr-only">Blogs &amp; Articles | Coding Panda</h1>
            <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[460px] lg:max-w-[560px] mx-auto lg:mx-0 border-4 border-retro-black shadow-[12px_12px_0_rgba(0,0,0,1)] rounded-xl overflow-hidden bg-white dark:bg-gray-100">
              <Image
                src="/coding_panda_hero.png"
                alt="Coding Panda Hero"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <p className="font-space text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-retro-black dark:text-retro-white leading-relaxed xl:leading-relaxed">
              I write about <span className="font-black underline decoration-retro-yellow decoration-[6px] underline-offset-4">Web Development</span>,{" "}
              <span className="font-black underline decoration-retro-yellow decoration-[6px] underline-offset-4">Frontend Engineering</span>, and{" "}
              <span className="font-black underline decoration-retro-yellow decoration-[6px] underline-offset-4">AI/ML (Generative AI)</span> — sharing the real-world lessons, exciting experiments, and hands-on projects I build along the way.
            </p>
            <p className="font-space text-lg sm:text-xl lg:text-2xl text-retro-black/80 dark:text-retro-white/90 leading-relaxed">
              From crafting pixel-perfect interfaces to integrating cutting-edge AI into modern web applications, I dive deep into the technologies shaping tomorrow’s digital experiences.
            </p>
            <p className="font-space text-lg sm:text-xl lg:text-2xl text-retro-black/80 dark:text-retro-white/90 leading-relaxed">
              Join me on this journey of continuous learning, building, and pushing the boundaries of what’s possible on the web.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Category filter */}
        <section className="mb-10" aria-label="Filter posts by category">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
      </section>

      {/* Post count */}
      {!isLoading && (
        <p className="font-space text-sm text-gray-500 dark:text-gray-400 mb-6" aria-live="polite">
          Showing{" "}
          <strong className="text-retro-black dark:text-retro-white">{posts.length}</strong>{" "}
          {posts.length === 1 ? "post" : "posts"}
          {activeCategory !== "all" && (
            <>
              {" "}in{" "}
              <strong className="text-retro-black dark:text-retro-white capitalize">
                {activeCategory}
              </strong>
            </>
          )}
        </p>
      )}

      {/* Blog grid */}
      <BlogGrid posts={posts} />

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-retro-black dark:border-retro-white border-t-retro-yellow rounded-full animate-spin"></div>
        </div>
      )}
      </div>
    </div>
  );
}
