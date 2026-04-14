import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/blog";

// Mock next/link to render a plain anchor
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

const BASE_POST: BlogPost = {
  slug: "test-post",
  title: "Test Post Title",
  excerpt: "This is a test excerpt for the blog post.",
  date: "2025-09-01",
  author: "Test Author",
  category: "design",
  readTime: 5,
  coverColor: "#FDE047",
  tags: ["test", "design"],
};

describe("BlogCard", () => {
  it("renders the post title", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders the post excerpt", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(
      screen.getByText(/This is a test excerpt/)
    ).toBeInTheDocument();
  });

  it("renders the formatted date", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByText(/September/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("renders the read time", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("renders a link to the correct blog post URL", () => {
    render(<BlogCard post={BASE_POST} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-post");
  });

  it("has an accessible aria-label on the link", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "aria-label",
      "Read: Test Post Title"
    );
  });

  it("renders the category badge", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByText("design")).toBeInTheDocument();
  });

  it("does not show Featured badge when featured is undefined", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("shows Featured badge when post.featured is true", () => {
    render(<BlogCard post={{ ...BASE_POST, featured: true }} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders the cover color strip", () => {
    render(<BlogCard post={BASE_POST} />);
    const colorStrip = document.querySelector('[style*="background-color"]');
    expect(colorStrip).toBeInTheDocument();
  });

  it("uses featured layout when featured prop is true", () => {
    const { container } = render(
      <BlogCard post={{ ...BASE_POST, featured: true }} featured />
    );
    // featured layout uses md:flex on the article
    const article = container.querySelector("article");
    expect(article?.className).toContain("md:flex");
  });

  it("does not use featured layout when featured prop is false", () => {
    const { container } = render(<BlogCard post={BASE_POST} />);
    const article = container.querySelector("article");
    expect(article?.className).not.toContain("md:flex");
  });

  it("renders an article element", () => {
    render(<BlogCard post={BASE_POST} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("applies neo shadow class to the article", () => {
    const { container } = render(<BlogCard post={BASE_POST} />);
    const article = container.querySelector("article");
    expect(article?.className).toContain("shadow-neo");
  });
});
