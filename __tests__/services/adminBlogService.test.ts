import { adminBlogService } from "@/services/adminBlogService";
import { createClient } from "@/lib/supabase/server";

const createMockBuilder = (result: any = { data: [], error: null }) => {
  const builder: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: Array.isArray(result.data) ? result.data[0] : result.data, error: result.error });
    }),
    then: jest.fn((onFulfilled: any) => {
      return Promise.resolve(result).then(onFulfilled);
    }),
  };
  return builder;
};

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
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

describe("adminBlogService", () => {
  let builder: any;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    builder = createMockBuilder({ data: [MOCK_DB_POST], error: null });
    mockSupabase = {
      from: jest.fn(() => builder),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("getAllPosts", () => {
    it("fetches all posts ordered by date", async () => {
      const posts = await adminBlogService.getAllPosts();
      expect(mockSupabase.from).toHaveBeenCalledWith("posts");
      expect(builder.order).toHaveBeenCalledWith("date", { ascending: false });
      expect(posts).toHaveLength(1);
    });

    it("throws error if fetch fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Fail" } });
      await expect(adminBlogService.getAllPosts()).rejects.toThrow("Fail");
    });
  });

  describe("getPostById", () => {
    it("fetches single post by id", async () => {
      const post = await adminBlogService.getPostById("uuid-1");
      expect(builder.eq).toHaveBeenCalledWith("id", "uuid-1");
      expect(post?.id).toBe("uuid-1");
    });

    it("returns null if not found", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Not found", code: "PGRST116" } });
      const post = await adminBlogService.getPostById("uuid-missing");
      expect(post).toBeNull();
    });
  });

  describe("createPost", () => {
    it("inserts new post and returns it", async () => {
      const input = { title: "New Post", excerpt: "Ez", author: "Me", category: "c" };
      const post = await adminBlogService.createPost(input as any);
      
      expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({ title: "New Post" }));
      expect(post.title).toBe("Title 1"); // Builder returns MOCK_DB_POST
    });

    it("generates slug if missing", async () => {
      const input = { title: "Hello World", excerpt: "Ez" };
      await adminBlogService.createPost(input as any);
      expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({ slug: "hello-world" }));
    });

    it("throws error if creation fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Create fail" } });
      await expect(adminBlogService.createPost({ title: "Error Post" } as any)).rejects.toThrow("Create fail");
    });
  });

  describe("updatePost", () => {
    it("updates post with matching id", async () => {
      await adminBlogService.updatePost("uuid-1", { title: "Updated" });
      expect(builder.update).toHaveBeenCalledWith({ title: "Updated" });
      expect(builder.eq).toHaveBeenCalledWith("id", "uuid-1");
    });

    it("updates cover color and image correctly", async () => {
        await adminBlogService.updatePost("uuid-1", { 
            cover_color: "#fff", 
            cover_image: "img.png",
            slug: "new-slug",
            excerpt: "new-ex",
            content: "new-cont",
            author: "new-auth",
            category: "new-cat",
            tags: ["t"],
            featured: false,
            read_time: 10,
            date: "2025-01-02"
        });
        expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({
            cover_color: "#fff",
            cover_image: "img.png"
        }));
    });

    it("throws error if update fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Update fail" } });
      await expect(adminBlogService.updatePost("uuid-1", {})).rejects.toThrow("Update fail");
    });
  });

  describe("deletePost", () => {
    it("deletes post with id", async () => {
      await adminBlogService.deletePost("uuid-1");
      expect(builder.delete).toHaveBeenCalled();
      expect(builder.eq).toHaveBeenCalledWith("id", "uuid-1");
    });

    it("throws error if delete fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Delete fail" } });
      await expect(adminBlogService.deletePost("uuid-1")).rejects.toThrow("Delete fail");
    });
  });

  describe("getStats", () => {
    it("calculates aggregate stats", async () => {
      // Stats uses Promise.all with 3 calls
      const totalBuilder = createMockBuilder({ data: null, error: null });
      totalBuilder.then = jest.fn((resolve) => resolve({ count: 10, error: null }));
      
      const featuredBuilder = createMockBuilder({ data: null, error: null });
      featuredBuilder.then = jest.fn((resolve) => resolve({ count: 2, error: null }));
      
      const categoryBuilder = createMockBuilder({ data: [{ category: "a" }, { category: "b" }, { category: "a" }], error: null });

      let callIndex = 0;
      mockSupabase.from.mockImplementation(() => {
        callIndex++;
        if (callIndex === 1) return totalBuilder;
        if (callIndex === 2) return featuredBuilder;
        return categoryBuilder;
      });

      const stats = await adminBlogService.getStats();
      expect(stats.totalPosts).toBe(10);
      expect(stats.featuredPosts).toBe(2);
      expect(stats.categories).toBe(2); // unique 'a', 'b'
    });
  });
});
