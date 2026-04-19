import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getAllPosts } from "@/lib/posts";

jest.mock("@/lib/posts", () => ({
  getAllPosts: jest.fn(),
}));

describe("SEO files", () => {
  describe("robots.ts", () => {
    it("returns correct robots configuration", () => {
      const result = robots();
      expect(result).toEqual({
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
        sitemap: "https://codingpanda.taqnik.in/sitemap.xml",
      });
    });
  });

  describe("sitemap.ts", () => {
    it("returns correct sitemap configuration", async () => {
      const mockPosts = [
        { slug: "post-1", date: "2024-03-20" },
        { slug: "post-2", date: "2024-03-21" },
      ];
      (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);

      const result = await sitemap();
      
      expect(result).toHaveLength(3); // Home + 2 posts
      expect(result[0].url).toBe("https://codingpanda.taqnik.in");
      expect(result[1].url).toBe("https://codingpanda.taqnik.in/post-1");
      expect(result[2].url).toBe("https://codingpanda.taqnik.in/post-2");
      expect(result[1].lastModified).toBeInstanceOf(Date);
    });
  });
});
