import { blogService } from "@/services/blogService";
import { supabase } from "@/lib/supabase";

// Mock Supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        eq: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
    })),
  },
}));

const MOCK_DB_POST = {
  id: "uuid-1",
  slug: "slug-1",
  title: "Title 1",
  excerpt: "Excerpt 1",
  content: "Content 1",
  date: "2025-01-01",
  author: "Author 1",
  category: "design",
  read_time: 5,
  cover_color: "#000",
  tags: ["tag1"],
  featured: true,
};

describe("blogService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("mapSupabasePost", () => {
    it("maps database fields to BlogPost type correctly", () => {
      const result = blogService.mapSupabasePost(MOCK_DB_POST);
      expect(result.id).toBe(MOCK_DB_POST.id);
      expect(result.slug).toBe(MOCK_DB_POST.slug);
      expect(result.readTime).toBe(MOCK_DB_POST.read_time);
      expect(result.coverColor).toBe(MOCK_DB_POST.cover_color);
    });

    it("provides defaults for missing optional fields", () => {
      const result = blogService.mapSupabasePost({
        slug: "s",
        title: "t",
        excerpt: "e",
        date: "d",
      });
      expect(result.author).toBe("Coding Panda Team");
      expect(result.category).toBe("general");
      expect(result.readTime).toBe(5);
      expect(result.coverColor).toBe("#FDE047");
    });
  });

  describe("getAllPosts", () => {
    it("fetches posts from supabase and maps them", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [MOCK_DB_POST], error: null });
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getAllPosts();
      
      expect(supabase.from).toHaveBeenCalledWith("posts");
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("slug-1");
    });

    it("returns empty array on error", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getAllPosts();
      expect(posts).toEqual([]);
    });
  });

  describe("getPostBySlug", () => {
    it("fetches single post by slug", async () => {
      const mockSingle = jest.fn().mockResolvedValue({ data: MOCK_DB_POST, error: null });
      const mockEq = jest.fn(() => ({ single: mockSingle }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const post = await blogService.getPostBySlug("slug-1");
      
      expect(mockEq).toHaveBeenCalledWith("slug", "slug-1");
      expect(post?.slug).toBe("slug-1");
    });
  });

  describe("getPostsByCategory", () => {
    it("filters posts by category in database", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [MOCK_DB_POST], error: null });
      const mockEq = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getPostsByCategory("design");
      
      expect(mockEq).toHaveBeenCalledWith("category", "design");
      expect(posts).toHaveLength(1);
    });

    it("returns all posts if category is 'all'", async () => {
      jest.spyOn(blogService, "getAllPosts").mockResolvedValue([MOCK_DB_POST as any]);
      const posts = await blogService.getPostsByCategory("all");
      expect(blogService.getAllPosts).toHaveBeenCalled();
      expect(posts).toHaveLength(1);
    });

    it("returns empty array for empty data", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });
      const posts = await blogService.getAllPosts();
      expect(posts).toEqual([]);
    });

    it("returns empty array on error", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });
      const mockEq = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getPostsByCategory("design");
      expect(posts).toEqual([]);
    });
  });

  describe("getPostBySlug edge cases", () => {
     it("returns undefined if no data found and no error", async () => {
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEq = jest.fn(() => ({ single: mockSingle }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const post = await blogService.getPostBySlug("slug-1");
      expect(post).toBeUndefined();
    });
  });

  describe("getPostsByTag", () => {
    it("filters posts by tag using contains operator", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [MOCK_DB_POST], error: null });
      const mockContains = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ contains: mockContains }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getPostsByTag("tag1");
      
      expect(mockContains).toHaveBeenCalledWith("tags", ["tag1"]);
      expect(posts).toHaveLength(1);
    });

    it("returns all posts if tag is 'all'", async () => {
      jest.spyOn(blogService, "getAllPosts").mockResolvedValue([MOCK_DB_POST as any]);
      const posts = await blogService.getPostsByTag("all");
      expect(blogService.getAllPosts).toHaveBeenCalled();
      expect(posts).toHaveLength(1);
    });

    it("returns empty array on error", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });
      const mockContains = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ contains: mockContains }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getPostsByTag("tag1");
      expect(posts).toEqual([]);
    });
  });

  describe("getAllTags", () => {
    it("fetches tags from table and counts matching posts", async () => {
      // Mock for posts total count
      const mockSelectPosts = jest.fn().mockResolvedValue({ data: [{ id: 1 }, { id: 2 }], error: null });
      
      // Mock for fetching tags
      const mockSelectTags = jest.fn().mockResolvedValue({ data: [{ name: "tag1" }], error: null });
      
      // Mock for tag count per tag
      const mockSelectCount = jest.fn().mockResolvedValue({ count: 1, error: null });
      const mockContains = jest.fn(() => ({ count: mockSelectCount })); // This needs to match the actual implementation chain
      
      // Setup stateful mock for from()
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "posts") {
          return {
            select: jest.fn((query, options) => {
              if (options?.count) {
                return { contains: jest.fn(() => Promise.resolve({ count: 1, error: null })) };
              }
              return Promise.resolve({ data: [{ id: 1 }, { id: 2 }], error: null });
            })
          };
        }
        if (table === "tags") {
          return { select: jest.fn().mockResolvedValue({ data: [{ name: "tag1" }], error: null }) };
        }
        return {};
      });

      const tags = await blogService.getAllTags();
      
      expect(tags).toHaveLength(2); // "all" + "tag1"
      expect(tags[0].id).toBe("all");
      expect(tags[0].count).toBe(2);
      expect(tags[1].id).toBe("tag1");
      expect(tags[1].count).toBe(1);
    });

    it("returns error fallback if tags fetch fails", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
         if (table === "posts") return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
         if (table === "tags") return { select: jest.fn().mockResolvedValue({ data: null, error: { message: "Fail" } }) };
         return {};
      });

      const tags = await blogService.getAllTags();
      expect(tags[0].id).toBe("all");
      expect(tags).toHaveLength(1);
    });
  });

  describe("getFeaturedPosts", () => {
    it("fetches featured posts from database", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [MOCK_DB_POST], error: null });
      const mockEq = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getFeaturedPosts();
      
      expect(mockEq).toHaveBeenCalledWith("featured", true);
      expect(posts).toHaveLength(1);
    });

    it("returns empty array on error", async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });
      const mockEq = jest.fn(() => ({ order: mockOrder }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const posts = await blogService.getFeaturedPosts();
      expect(posts).toEqual([]);
    });
  });

  describe("getPostBySlug error handling", () => {
    it("returns undefined on error", async () => {
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });
      const mockEq = jest.fn(() => ({ single: mockSingle }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const post = await blogService.getPostBySlug("slug-1");
      expect(post).toBeUndefined();
    });
  });
});
