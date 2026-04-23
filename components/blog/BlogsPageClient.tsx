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
      {/* Page header - RetroUI styled hero */}
      <header className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-retro-pink/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-retro-blue/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 text-center lg:text-left">
          <div className="w-full lg:w-1/2">
            <h1 className="sr-only">Blogs &amp; Articles | Coding Panda</h1>
            <div className="relative group">
              {/* Image Container with RetroUI NeoBrutalism */}
              <div className="relative w-full aspect-square max-w-[400px] sm:max-w-[480px] lg:max-w-[580px] mx-auto lg:mx-0 
                border-[6px] border-retro-black dark:border-retro-white 
                bg-white dark:bg-retro-black
                shadow-[12px_12px_0_0_#0A0A0A] dark:shadow-[12px_12px_0_0_#FAFAFA]
                hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#0A0A0A] dark:hover:shadow-[4px_4px_0_0_#FAFAFA]
                transition-all duration-200 ease-in-out
                rounded-none overflow-hidden"
              >
                <Image
                  src="/coding_panda_hero.png"
                  alt="Male Coding Panda Hero"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* RetroUI Accent Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-retro-yellow border-4 border-retro-black hidden sm:block rotate-12 z-10" />
              <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-retro-blue border-4 border-retro-black hidden sm:block -rotate-12 z-10" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-block px-4 py-2 bg-retro-yellow border-4 border-retro-black shadow-[4px_4px_0_0_#0A0A0A] mb-4">
              <span className="font-archivo text-retro-black uppercase tracking-widest text-sm font-bold">
                Developer Journal
              </span>
            </div>
            
            <p className="font-space text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-black dark:text-retro-white leading-tight font-bold">
              I code, <span className="bg-retro-pink dark:text-retro-black px-2 py-0.5 border-b-4 border-retro-black inline-block transform -rotate-1">design</span>, and build{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Generative AI</span>
                <span className="absolute bottom-1 left-0 w-full h-4 bg-retro-blue/40 -z-10" />
              </span> — bridging the gap between code and creativity.
            </p>
            
            <p className="font-space text-xl sm:text-2xl text-retro-black/90 dark:text-retro-white/90 leading-relaxed border-l-8 border-retro-green pl-6 py-2">
              Deep dives into <span className="font-bold underline decoration-retro-yellow">Frontend Engineering</span>, cloud architectures, and the future of web experiences.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-retro-black dark:bg-retro-white text-retro-white dark:text-retro-black font-archivo uppercase text-lg border-4 border-transparent hover:bg-retro-yellow hover:text-retro-black hover:border-retro-black shadow-[8px_8px_0_0_#FDE047] hover:shadow-none transition-all duration-200">
                Start Reading
              </button>
            </div>
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
