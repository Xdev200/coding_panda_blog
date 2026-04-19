import { blogService } from "@/services/blogService";
import { supabase } from "@/lib/supabase";

const createMockBuilder = (result: any = { data: [], error: null }) => {
  const builder: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: Array.isArray(result.data) ? result.data[0] : result.data, error: result.error });
    }),
    limit: jest.fn().mockReturnThis(),
    then: jest.fn((onFulfilled: any) => {
      return Promise.resolve(result).then(onFulfilled);
    }),
  };
  return builder;
};

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
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
  let builder: any;

  beforeEach(() => {
    jest.clearAllMocks();
    builder = createMockBuilder({ data: [MOCK_DB_POST], error: null });
    (supabase.from as jest.Mock).mockReturnValue(builder);
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
      const posts = await blogService.getAllPosts();
      
      expect(supabase.from).toHaveBeenCalledWith("posts");
      expect(builder.select).toHaveBeenCalled();
      expect(builder.lte).toHaveBeenCalledWith("date", expect.any(String));
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("slug-1");
    });

    it("returns empty array on error", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Error" } });
      (supabase.from as jest.Mock).mockReturnValue(builder);

      const posts = await blogService.getAllPosts();
      expect(posts).toEqual([]);
    });
  });

  describe("getPostBySlug", () => {
    it("fetches single post by slug", async () => {
      const post = await blogService.getPostBySlug("slug-1");
      
      expect(builder.eq).toHaveBeenCalledWith("slug", "slug-1");
      expect(builder.single).toHaveBeenCalled();
      expect(post?.slug).toBe("slug-1");
    });

    it("returns undefined on error", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Error" } });
      (supabase.from as jest.Mock).mockReturnValue(builder);
      const post = await blogService.getPostBySlug("slug-1");
      expect(post).toBeUndefined();
    });
  });

  describe("getPostsByCategory", () => {
    it("filters posts by category in database", async () => {
      const posts = await blogService.getPostsByCategory("design");
      
      expect(builder.eq).toHaveBeenCalledWith("category", "design");
      expect(posts).toHaveLength(1);
    });

    it("returns all posts if category is 'all'", async () => {
      const spy = jest.spyOn(blogService, "getAllPosts").mockResolvedValue([MOCK_DB_POST as any]);
      const posts = await blogService.getPostsByCategory("all");
      expect(spy).toHaveBeenCalled();
      expect(posts).toHaveLength(1);
      spy.mockRestore();
    });

    it("returns empty array on error", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Error" } });
      (supabase.from as jest.Mock).mockReturnValue(builder);
      const posts = await blogService.getPostsByCategory("design");
      expect(posts).toEqual([]);
    });
  });

  describe("getPostsByTag", () => {
    it("filters posts by tag using contains operator", async () => {
      const posts = await blogService.getPostsByTag("tag1");
      
      expect(builder.contains).toHaveBeenCalledWith("tags", ["tag1"]);
      expect(posts).toHaveLength(1);
    });

    it("returns all posts if tag is 'all'", async () => {
      const spy = jest.spyOn(blogService, "getAllPosts").mockResolvedValue([MOCK_DB_POST as any]);
      const posts = await blogService.getPostsByTag("all");
      expect(spy).toHaveBeenCalled();
      expect(posts).toHaveLength(1);
      spy.mockRestore();
    });

    it("returns empty array on error", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Error" } });
      (supabase.from as jest.Mock).mockReturnValue(builder);
      const posts = await blogService.getPostsByTag("tag1");
      expect(posts).toEqual([]);
    });
  });

  describe("getFeaturedPosts", () => {
    it("fetches featured posts from database", async () => {
      const posts = await blogService.getFeaturedPosts();
      
      expect(builder.eq).toHaveBeenCalledWith("featured", true);
      expect(posts).toHaveLength(1);
    });

    it("returns empty array on error", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Error" } });
      (supabase.from as jest.Mock).mockReturnValue(builder);
      const posts = await blogService.getFeaturedPosts();
      expect(posts).toEqual([]);
    });
  });

  describe("getAllTags", () => {
    it("fetches tags and counts matching posts", async () => {
      const postsBuilder = createMockBuilder({ data: [{ id: 1 }, { id: 2 }], error: null });
      const tagsBuilder = createMockBuilder({ data: [{ name: "tag1" }], error: null });
      const countBuilder = createMockBuilder({ data: null, error: null });
      countBuilder.lte = jest.fn().mockResolvedValue({ count: 1, error: null });

      let postCallCount = 0;
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "posts") {
           postCallCount++;
           if (postCallCount === 1) return postsBuilder;
           return countBuilder;
        }
        if (table === "tags") return tagsBuilder;
        return builder;
      });

      const tags = await blogService.getAllTags();
      expect(tags).toHaveLength(2);
      expect(tags[1].id).toBe("tag1");
    });

    it("returns 'all' tag only on error", async () => {
       const postsBuilder = createMockBuilder({ data: [], error: null });
       const tagsBuilder = createMockBuilder({ data: null, error: { message: "Error" } });
       
       (supabase.from as jest.Mock).mockImplementation((table) => {
         if (table === "posts") return postsBuilder;
         if (table === "tags") return tagsBuilder;
         return builder;
       });

       const tags = await blogService.getAllTags();
       expect(tags).toHaveLength(1);
       expect(tags[0].id).toBe("all");
    });
  });
});
