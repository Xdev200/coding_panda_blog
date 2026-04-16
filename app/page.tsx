import { Metadata } from "next";
import BlogsPageClient from "@/components/blog/BlogsPageClient";
import { getAllPosts, getCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Coding Panda Blogs | Engineering & AI/ML Insights",
  description: "Advanced articles on React, Next.js, and Generative AI for professional developers. Exploring the intersection of design and code.",
  keywords: ["Software Engineering Blog", "React Advanced Patterns", "GenAI for Developers", "Next.js SEO", "Web Performance"],
  openGraph: {
    title: "Coding Panda Blogs | Modern Web & AI Development",
    description: "Deep dives into high-performance web development and AI experimentation.",
    url: "https://codingpanda.taqnik.in",
    type: "website",
    images: [
      {
        url: "/readme-banner.png",
        width: 1200,
        height: 630,
        alt: "Coding Panda Blogs Hero",
      },
    ],
  },
};

export default async function BlogsPage() {
  const [initialPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  return (
    <BlogsPageClient 
      initialPosts={initialPosts} 
      categories={categories} 
    />
  );
}
