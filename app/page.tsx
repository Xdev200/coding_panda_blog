"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllPosts, getPostsByTag, getCategories } from "@/lib/posts";
import type { BlogPost, BlogCategory } from "@/types/blog";

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Fetch posts when category changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const fetchedPosts =
        activeCategory === "all"
          ? await getAllPosts()
          : await getPostsByTag(activeCategory);
      setPosts(fetchedPosts);
      setIsLoading(false);
    };
    fetchPosts();
  }, [activeCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h1 className="sr-only">Blogs & Articles</h1>
            <div className="relative w-full aspect-[680/660] max-w-xl mx-auto md:mx-0">
              <Image
                src="/coding_panda_3d_hero.svg"
                alt="Coding Panda 3D Hero"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <p className="font-space text-xl sm:text-2xl text-retro-black dark:text-retro-white leading-relaxed">
              I write about <span className="font-black underline decoration-retro-yellow decoration-4 underline-offset-4">Web Development</span>,{" "}
              <span className="font-black underline decoration-retro-yellow decoration-4 underline-offset-4">Frontend</span>, and{" "}
              <span className="font-black underline decoration-retro-yellow decoration-4 underline-offset-4">AI/ML (Gen AI)</span> — sharing what I learn, build, and experiment with along the way.
            </p>
          </div>
        </div>
      </header>

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
        <p className="font-space text-sm text-gray-500 mb-6" aria-live="polite">
          Showing{" "}
          <strong className="text-retro-black">{posts.length}</strong>{" "}
          {posts.length === 1 ? "post" : "posts"}
          {activeCategory !== "all" && (
            <>
              {" "}in{" "}
              <strong className="text-retro-black capitalize">
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
          <div className="w-12 h-12 border-4 border-retro-black border-t-retro-yellow rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
