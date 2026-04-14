import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BlogGrid } from "@/components/blog/BlogGrid";
import type { BlogPost } from "@/types/blog";

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

const makePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  slug: "default-post",
  title: "Default Post",
  excerpt: "Default excerpt.",
  date: "2025-09-01",
  author: "Author",
  category: "design",
  readTime: 4,
  coverColor: "#FDE047",
  tags: [],
  ...overrides,
});

const POSTS: BlogPost[] = [
  makePost({ slug: "post-1", title: "Post One", featured: true }),
  makePost({ slug: "post-2", title: "Post Two" }),
  makePost({ slug: "post-3", title: "Post Three" }),
];

describe("BlogGrid", () => {
  it("renders all posts", () => {
    render(<BlogGrid posts={POSTS} />);
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
    expect(screen.getByText("Post Three")).toBeInTheDocument();
  });

  it("shows empty state when posts array is empty", () => {
    render(<BlogGrid posts={[]} />);
    expect(screen.getByText("No posts found.")).toBeInTheDocument();
  });

  it("shows helpful message in empty state", () => {
    render(<BlogGrid posts={[]} />);
    expect(
      screen.getByText(/Try selecting a different category/)
    ).toBeInTheDocument();
  });

  it("renders a single post without errors", () => {
    render(<BlogGrid posts={[makePost({ slug: "solo", title: "Solo Post" })]} />);
    expect(screen.getByText("Solo Post")).toBeInTheDocument();
  });

  it("renders featured post with featured prop when first post is featured", () => {
    const { container } = render(<BlogGrid posts={POSTS} />);
    // Featured article gets md:flex class
    const articles = container.querySelectorAll("article");
    expect(articles[0].className).toContain("md:flex");
  });

  it("renders non-featured posts in a grid", () => {
    const { container } = render(<BlogGrid posts={POSTS} />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("all posts go into grid when first post is not featured", () => {
    const nonFeaturedPosts = [
      makePost({ slug: "a", title: "A" }),
      makePost({ slug: "b", title: "B" }),
    ];
    const { container } = render(<BlogGrid posts={nonFeaturedPosts} />);
    const grid = container.querySelector(".grid");
    // Both posts inside the grid
    const links = grid?.querySelectorAll("a");
    expect(links?.length).toBe(2);
  });

  it("renders correct number of article elements", () => {
    render(<BlogGrid posts={POSTS} />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(POSTS.length);
  });
});
