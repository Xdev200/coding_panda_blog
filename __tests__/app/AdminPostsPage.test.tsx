import React from "react";
import { render, screen } from "@testing-library/react";
import AdminPostsPage from "@/app/admin/posts/page";
import { adminBlogService } from "@/services/adminBlogService";

jest.mock("@/services/adminBlogService", () => ({
  adminBlogService: {
    getAllPosts: jest.fn(),
  },
}));

// Mock PostsTable to avoid deep rendering complexity in page test
jest.mock("@/components/admin/PostsTable", () => ({
  PostsTable: ({ posts }: any) => <div data-testid="posts-table">{posts.length} posts</div>,
}));

describe("AdminPostsPage", () => {
  it("fetches and displays posts", async () => {
    (adminBlogService.getAllPosts as jest.Mock).mockResolvedValue([
      { id: "1", title: "Test Post" },
    ]);

    const Page = await AdminPostsPage();
    render(Page);

    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText(/Manage your blog posts/)).toBeInTheDocument();
    expect(screen.getByTestId("posts-table")).toHaveTextContent("1 posts");
  });
});
