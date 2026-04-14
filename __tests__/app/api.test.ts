import { GET } from "@/app/api/blogs/route";
import * as postsLib from "@/lib/posts";
import { NextResponse } from "next/server";

// Mock lib/posts
jest.mock("@/lib/posts", () => ({
  getAllPosts: jest.fn(),
  getPostsByCategory: jest.fn(),
}));

// Mock NextResponse.json
jest.spyOn(NextResponse, "json").mockImplementation((data, init) => {
  return {
    status: init?.status || 200,
    json: async () => data,
  } as any;
});

const MOCK_POSTS = [
  { slug: "post-1", title: "Post 1", category: "design", date: "2025-01-01" },
  { slug: "post-2", title: "Post 2", category: "tech", date: "2024-01-01" },
];

const makeRequest = (url: string) => ({
  url,
} as any);

describe("GET /api/blogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (postsLib.getAllPosts as jest.Mock).mockResolvedValue(MOCK_POSTS);
    (postsLib.getPostsByCategory as jest.Mock).mockImplementation(async (cat) => 
      MOCK_POSTS.filter(p => p.category === cat)
    );
  });

  it("returns 200 status", async () => {
    const req = makeRequest("http://localhost/api/blogs");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(NextResponse.json).toHaveBeenCalled();
  });

  it("returns all posts when no category param is given", async () => {
    const req = makeRequest("http://localhost/api/blogs");
    const res = await GET(req);
    const body = await res.json();
    expect(body.posts).toHaveLength(MOCK_POSTS.length);
  });

  it("filters posts by category param", async () => {
    const req = makeRequest("http://localhost/api/blogs?category=design");
    const res = await GET(req);
    const body = await res.json();
    expect(body.posts.every((p: { category: string }) => p.category === "design")).toBe(true);
    expect(body.posts).toHaveLength(1);
  });

  it("returns empty array for unknown category", async () => {
    const req = makeRequest("http://localhost/api/blogs?category=unicorn");
    const res = await GET(req);
    const body = await res.json();
    expect(body.posts).toHaveLength(0);
  });
});
