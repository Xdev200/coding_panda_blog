import React from "react";
import { render, screen } from "@testing-library/react";
import EditPostPage from "@/app/admin/posts/[id]/page";
import { adminBlogService } from "@/services/adminBlogService";
import { notFound } from "next/navigation";

jest.mock("@/services/adminBlogService", () => ({
  adminBlogService: {
    getPostById: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/components/admin/PostForm", () => ({
  PostForm: ({ post }: any) => <div data-testid="post-form">Editing: {post.title}</div>,
}));

describe("EditPostPage", () => {
  it("renders post form when post is found", async () => {
    const mockPost = { id: "p1", title: "Existing Post" };
    (adminBlogService.getPostById as jest.Mock).mockResolvedValue(mockPost);

    const Page = await EditPostPage({ params: Promise.resolve({ id: "p1" }) });
    render(Page);

    expect(screen.getByText("Edit Post")).toBeInTheDocument();
    expect(screen.getByTestId("post-form")).toHaveTextContent("Editing: Existing Post");
  });

  it("calls notFound when post is missing", async () => {
    (adminBlogService.getPostById as jest.Mock).mockResolvedValue(null);

    await EditPostPage({ params: Promise.resolve({ id: "missing" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
