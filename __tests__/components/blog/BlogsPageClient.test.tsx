import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogsPageClient from "@/components/blog/BlogsPageClient";
import { getPostsByTag } from "@/lib/posts";

jest.mock("@/lib/posts", () => ({
  getPostsByTag: jest.fn(),
}));

jest.mock("@/components/blog/BlogGrid", () => ({
  BlogGrid: ({ posts }: any) => <div data-testid="blog-grid">{posts.length} posts</div>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const MOCK_CATEGORIES = [
  { id: "all", label: "All", count: 2 },
  { id: "tech", label: "Tech", count: 1 },
  { id: "life", label: "Life", count: 1 },
];

const MOCK_INITIAL_POSTS = [
  { 
    id: "1", 
    slug: "p1", 
    title: "P1", 
    excerpt: "E1", 
    content: "C1", 
    date: "2024-01-01", 
    author: "A1", 
    category: "tech", 
    tags: ["tech"], 
    readTime: 5, 
    coverColor: "blue", 
    featured: false 
  },
  { 
    id: "2", 
    slug: "p2", 
    title: "P2", 
    excerpt: "E2", 
    content: "C2", 
    date: "2024-01-01", 
    author: "A2", 
    category: "life", 
    tags: ["life"], 
    readTime: 5, 
    coverColor: "green", 
    featured: false 
  },
];

describe("BlogsPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial posts on load", () => {
    render(<BlogsPageClient initialPosts={MOCK_INITIAL_POSTS} categories={MOCK_CATEGORIES} />);
    expect(screen.getByTestId("blog-grid")).toHaveTextContent("2 posts");
  });

  it("filters posts when category is selected", async () => {
    (getPostsByTag as jest.Mock).mockResolvedValue([MOCK_INITIAL_POSTS[0]]);
    render(<BlogsPageClient initialPosts={MOCK_INITIAL_POSTS} categories={MOCK_CATEGORIES} />);

    // Click Tech category button
    const techBtn = screen.getByText("Tech");
    fireEvent.click(techBtn);

    await waitFor(() => {
      expect(getPostsByTag).toHaveBeenCalledWith("tech");
      expect(screen.getByTestId("blog-grid")).toHaveTextContent("1 posts");
    });
  });

  it("shows all posts when 'all' is selected", async () => {
    render(<BlogsPageClient initialPosts={MOCK_INITIAL_POSTS} categories={MOCK_CATEGORIES} />);
    
    // First select tech
    (getPostsByTag as jest.Mock).mockResolvedValue([MOCK_INITIAL_POSTS[0]]);
    fireEvent.click(screen.getByText("Tech"));
    
    // Then select all
    fireEvent.click(screen.getByText("All"));
    
    expect(screen.getByTestId("blog-grid")).toHaveTextContent("2 posts");
  });
});
