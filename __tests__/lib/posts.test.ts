import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getFeaturedPosts,
  getCategories,
  getAllTags,
} from "@/lib/posts";
import { blogService } from "@/services/blogService";

// Mock the blogService
jest.mock("@/services/blogService", () => ({
  blogService: {
    getAllPosts: jest.fn(),
    getPostBySlug: jest.fn(),
    getPostsByCategory: jest.fn(),
    getPostsByTag: jest.fn(),
    getFeaturedPosts: jest.fn(),
    getAllTags: jest.fn(),
  },
}));

const MOCK_POSTS = [
  {
    slug: "post-1",
    title: "Post 1",
    excerpt: "Excerpt 1",
    date: "2025-01-01",
    author: "Author 1",
    category: "design",
    readTime: 5,
    coverColor: "#000",
    tags: ["tag1"],
    featured: true,
  },
  {
    slug: "post-2",
    title: "Post 2",
    excerpt: "Excerpt 2",
    date: "2024-01-01",
    author: "Author 2",
    category: "tech",
    readTime: 10,
    coverColor: "#fff",
    tags: ["tag2"],
    featured: false,
  },
];

describe("lib/posts functions (async)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPosts", () => {
    it("calls blogService.getAllPosts and returns result", async () => {
      (blogService.getAllPosts as jest.Mock).mockResolvedValue(MOCK_POSTS);
      const posts = await getAllPosts();
      expect(blogService.getAllPosts).toHaveBeenCalledTimes(1);
      expect(posts).toEqual(MOCK_POSTS);
    });
  });

  describe("getPostBySlug", () => {
    it("returns the correct post for a valid slug", async () => {
      (blogService.getPostBySlug as jest.Mock).mockResolvedValue(MOCK_POSTS[0]);
      const post = await getPostBySlug("post-1");
      expect(blogService.getPostBySlug).toHaveBeenCalledWith("post-1");
      expect(post?.slug).toBe("post-1");
    });

    it("returns undefined for an unknown slug", async () => {
      (blogService.getPostBySlug as jest.Mock).mockResolvedValue(undefined);
      const post = await getPostBySlug("unknown");
      expect(post).toBeUndefined();
    });
  });

  describe("getPostsByCategory", () => {
    it("calls blogService.getPostsByCategory", async () => {
      (blogService.getPostsByCategory as jest.Mock).mockResolvedValue([MOCK_POSTS[0]]);
      const posts = await getPostsByCategory("design");
      expect(blogService.getPostsByCategory).toHaveBeenCalledWith("design");
      expect(posts).toHaveLength(1);
    });
  });

  describe("getFeaturedPosts", () => {
    it("calls blogService.getFeaturedPosts", async () => {
      (blogService.getFeaturedPosts as jest.Mock).mockResolvedValue([MOCK_POSTS[0]]);
      const featured = await getFeaturedPosts();
      expect(blogService.getFeaturedPosts).toHaveBeenCalledTimes(1);
      expect(featured).toHaveLength(1);
    });
  });

  describe("getCategories", () => {
    it("calls blogService.getAllTags", async () => {
      (blogService.getAllTags as jest.Mock).mockResolvedValue([{ id: "all", label: "All Posts", count: 2 }]);
      const categories = await getCategories();
      expect(blogService.getAllTags).toHaveBeenCalledTimes(1);
      expect(categories).toHaveLength(1);
    });
  });

  describe("getAllTags", () => {
    it("calls blogService.getAllTags", async () => {
      (blogService.getAllTags as jest.Mock).mockResolvedValue([]);
      const tags = await getAllTags();
      expect(blogService.getAllTags).toHaveBeenCalledTimes(1);
      expect(tags).toEqual([]);
    });
  });
});
