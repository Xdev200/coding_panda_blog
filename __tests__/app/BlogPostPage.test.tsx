import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogPostPage from "@/app/[slug]/page";
import * as postsLib from "@/lib/posts";
import { notFound } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// Mock components
jest.mock("@/components/ui/Badge", () => ({
  Badge: ({ label }: { label: string }) => <div data-testid="badge">{label}</div>,
  CATEGORY_VARIANT_MAP: {},
}));

// Mock utils
jest.mock("@/lib/utils", () => ({
  formatDate: jest.fn(d => d),
  formatReadTime: jest.fn(m => `${m} min`),
}));

// Mock lib/posts
jest.mock("@/lib/posts", () => ({
  getPostBySlug: jest.fn(),
}));

const MOCK_POST = {
  slug: "test-post",
  title: "Test Post",
  excerpt: "Test Excerpt",
  content: "<p>Test Content</p>",
  date: "2025-01-01",
  author: "Test Author",
  category: "design",
  readTime: 5,
  coverColor: "#000",
  tags: ["tag1"],
};

describe("BlogPostPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the blog post correctly", async () => {
    (postsLib.getPostBySlug as jest.Mock).mockResolvedValue(MOCK_POST);
    
    // Server components are tricky to test with render if they are async.
    // In actual Next.js environment they are awaited. 
    // In React 18/19 testing library, we can render the result of the component call.
    
    const Page = await BlogPostPage({ params: Promise.resolve({ slug: "test-post" }) });
    render(Page);
    
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  it("calls notFound if post is missing", async () => {
    (postsLib.getPostBySlug as jest.Mock).mockResolvedValue(null);
    
    try {
        await BlogPostPage({ params: Promise.resolve({ slug: "missing" }) });
    } catch (e) {
        // next.js notFound throws
    }
    
    expect(notFound).toHaveBeenCalled();
  });
});
