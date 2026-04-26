"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllPosts, getPostsByTag } from "@/lib/posts";
import type { BlogPost, BlogCategory } from "@/types/blog";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";

interface BlogsPageClientProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogsPageClient({ initialPosts, categories }: BlogsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Number of posts per page
  const blogGridRef = useRef<HTMLDivElement>(null);

  // Fetch posts when category changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setCurrentPage(1); // Reset to first page on category change

      if (activeCategory === "all") {
        setPosts(initialPosts);
      } else {
        const fetchedPosts = await getPostsByTag(activeCategory);
        setPosts(fetchedPosts);
      }
      
      setIsLoading(false);
    };
    fetchPosts();
  }, [activeCategory, initialPosts]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll back to top of grid
    if (blogGridRef.current) {
      const offset = 80; // Offset for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = blogGridRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToGrid = () => {
    blogGridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full">
      {/* Page header - RetroUI styled hero */}
      <header className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col justify-center max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-retro-pink/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-retro-blue/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 text-center lg:text-left">
          <div className="w-full lg:w-1/2">
            <h1 className="sr-only">Blogs & Articles | Coding Panda</h1>
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
                Frontend & AI Journal
              </span>
            </div>
            
            <p className="font-space text-display text-retro-black dark:text-retro-white leading-tight font-bold">
              I build intelligent web experiences — where code meets AI.
            </p>
            
            <p className="font-space text-h3 text-retro-black/90 dark:text-retro-white/90 leading-relaxed border-l-8 border-retro-green pl-6 py-2">
              <span className="">Frontend Engineering,</span> System design, and hands-on Generative AI experiments that actually ship.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToGrid}
                className="px-8 py-4 bg-retro-black dark:bg-retro-white text-retro-white dark:text-retro-black font-archivo uppercase text-lg border-4 border-transparent hover:bg-retro-yellow hover:text-retro-black hover:border-retro-black shadow-[8px_8px_0_0_#FDE047] hover:shadow-none transition-all duration-200"
              >
                Start Reading
              </button>
            </div>
          </div>
        </div>
      </header>

      <div ref={blogGridRef} className="max-w-7xl mx-auto px-[var(--container-padding)] pb-[var(--section-gap)] scroll-mt-20">
        {/* Category filter */}
        <section className="mb-[var(--grid-gap)]" aria-label="Filter posts by category">
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
          <strong className="text-retro-black dark:text-retro-white">
            {startIndex + 1} to {Math.min(startIndex + pageSize, posts.length)}
          </strong>{" "}
          of{" "}
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
      <div className="min-h-[400px] relative">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner text="Loading Posts..." size={48} />
          </div>
        ) : (
          <>
            <BlogGrid posts={paginatedPosts} />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
