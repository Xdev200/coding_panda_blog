import { GET as blogsGET } from "@/app/api/blogs/route";
import { GET as authGET } from "@/app/auth/callback/route";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

jest.mock("@/lib/posts");
jest.mock("@/lib/supabase/server");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body) => ({ 
        json: async () => body,
        headers: new Map()
    })),
    redirect: jest.fn().mockImplementation((url) => ({ url })),
  },
}));

describe("API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/blogs", () => {
    it("returns all posts if no category is provided", async () => {
      (getAllPosts as jest.Mock).mockResolvedValue([{ id: "1" }]);
      const req = { url: "http://localhost/api/blogs" } as any;
      
      await blogsGET(req);
      
      expect(getAllPosts).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ posts: [{ id: "1" }], total: 1 }),
        expect.any(Object)
      );
    });

    it("returns filtered posts if category is provided", async () => {
      (getPostsByCategory as jest.Mock).mockResolvedValue([{ id: "2" }]);
      const req = { url: "http://localhost/api/blogs?category=tech" } as any;
      
      await blogsGET(req);
      
      expect(getPostsByCategory).toHaveBeenCalledWith("tech");
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ posts: [{ id: "2" }], total: 1 }),
        expect.any(Object)
      );
    });
  });

  describe("GET /auth/callback", () => {
    it("exchanges code and redirects to next param", async () => {
      const mockSupabase = {
        auth: { exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }) },
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      
      const req = { url: "http://localhost/auth/callback?code=123&next=/profile" } as any;
      const res = await authGET(req);
      
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith("123");
      expect(res.url).toBe("http://localhost/profile");
    });

    it("redirects to login on error", async () => {
      const mockSupabase = {
        auth: { exchangeCodeForSession: jest.fn().mockResolvedValue({ error: { message: "Error" } }) },
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      
      const req = { url: "http://localhost/auth/callback?code=bad" } as any;
      const res = await authGET(req);
      
      expect(res.url).toContain("/login?error=invalid_credentials");
    });
  });
});
