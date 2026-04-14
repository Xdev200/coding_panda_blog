import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogsPage from "@/app/page";
import * as postsLib from "@/lib/posts";

// Mock child components to isolate page logic
jest.mock("@/components/blog/CategoryFilter", () => ({
  CategoryFilter: ({
    categories,
    activeCategory,
    onSelect,
  }: {
    categories: { id: string; label: string; count: number }[];
    activeCategory: string;
    onSelect: (id: string) => void;
  }) => (
    <div data-testid="category-filter">
      {categories.map((cat) => (
        <button
          key={cat.id}
          data-active={activeCategory === cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/components/blog/BlogGrid", () => ({
  BlogGrid: ({ posts }: { posts: { slug: string; title: string }[] }) => (
    <div data-testid="blog-grid">
      {posts.map((p) => (
        <div key={p.slug} data-testid="post-item">
          {p.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock lib/posts
jest.mock("@/lib/posts", () => ({
  getAllPosts: jest.fn(),
  getPostsByTag: jest.fn(),
  getCategories: jest.fn(),
}));

const MOCK_POSTS = [
  { slug: "post-1", title: "Post 1", tags: ["design"], date: "2025-01-01" },
  { slug: "post-2", title: "Post 2", tags: ["tech"], date: "2024-01-01" },
];

const MOCK_CATEGORIES = [
  { id: "all", label: "All Posts", count: 2 },
  { id: "design", label: "Design", count: 1 },
  { id: "tech", label: "Tech", count: 1 },
];

describe("BlogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (postsLib.getAllPosts as jest.Mock).mockResolvedValue(MOCK_POSTS);
    (postsLib.getPostsByTag as jest.Mock).mockResolvedValue([MOCK_POSTS[0]]);
    (postsLib.getCategories as jest.Mock).mockResolvedValue(MOCK_CATEGORIES);
  });

  it("renders the page heading", async () => {
    await act(async () => {
      render(<BlogsPage />);
    });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows all posts by default", async () => {
    await act(async () => {
      render(<BlogsPage />);
    });
    await waitFor(() => {
      const postItems = screen.getAllByTestId("post-item");
      expect(postItems.length).toBe(MOCK_POSTS.length);
    });
  });

  it("filters posts when a category is selected", async () => {
    await act(async () => {
      render(<BlogsPage />);
    });
    
    // Wait for categories to load
    await waitFor(() => screen.getByText("Design"));

    await act(async () => {
      fireEvent.click(screen.getByText("Design"));
    });

    await waitFor(() => {
      const postItems = screen.getAllByTestId("post-item");
      expect(postItems.length).toBe(1);
      expect(postsLib.getPostsByTag).toHaveBeenCalledWith("design");
    });
  });

  it("shows post count summary after loading", async () => {
    await act(async () => {
      render(<BlogsPage />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
