import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogPostPage, { generateStaticParams, generateMetadata } from "@/app/[slug]/page";
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
  getAllPosts: jest.fn(),
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
    (postsLib.getPostBySlug as jest.Mock).mockResolvedValue({
      ...MOCK_POST,
      coverImage: "https://example.com/image.jpg"
    });
    
    const Page = await BlogPostPage({ params: Promise.resolve({ slug: "test-post" }) });
    render(Page);
    
    expect(screen.getByRole("heading", { level: 1, name: "Test Post" })).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/image.jpg");
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

  it("renders fallback when cover image and content are missing", async () => {
    (postsLib.getPostBySlug as jest.Mock).mockResolvedValue({
        ...MOCK_POST,
        coverImage: undefined,
        content: undefined
    });

    const Page = await BlogPostPage({ params: Promise.resolve({ slug: "test-post" }) });
    render(Page);

    expect(screen.getByText(/This is a demo article page/i)).toBeInTheDocument();
    // Verify fallback heart pattern / svg exists
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  describe("generateStaticParams", () => {
    it("returns slugs for all posts", async () => {
        (postsLib.getAllPosts as jest.Mock).mockResolvedValue([
            { slug: "slug-1" },
            { slug: "slug-2" }
        ]);
        const params = await generateStaticParams();
        expect(params).toEqual([{ slug: "slug-1" }, { slug: "slug-2" }]);
    });
  });

  describe("generateMetadata", () => {
    it("returns correct metadata for a post", async () => {
        (postsLib.getPostBySlug as jest.Mock).mockResolvedValue(MOCK_POST);
        const metadata = await generateMetadata({ params: Promise.resolve({ slug: "test-post" }) });
        expect(metadata.title).toBe("Test Post");
        expect(metadata.openGraph?.type).toBe("article");
    });

    it("returns 'Post Not Found' title if post missing", async () => {
        (postsLib.getPostBySlug as jest.Mock).mockResolvedValue(null);
        const metadata = await generateMetadata({ params: Promise.resolve({ slug: "missing" }) });
        expect(metadata.title).toBe("Post Not Found");
    });
  });
});
