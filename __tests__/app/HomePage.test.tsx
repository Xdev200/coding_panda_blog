import React from "react";
import { render, screen } from "@testing-library/react";
import BlogsPage from "@/app/page";
import { getAllPosts, getCategories } from "@/lib/posts";

jest.mock("@/lib/posts", () => ({
  getAllPosts: jest.fn(),
  getCategories: jest.fn(),
}));

jest.mock("@/components/blog/BlogsPageClient", () => ({
  __esModule: true,
  default: ({ initialPosts }: any) => <div data-testid="client-page">{initialPosts.length} posts</div>,
}));

describe("BlogsPage (Home)", () => {
  it("fetches and renders initial posts", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue([{ id: "1", title: "P1" }]);
    (getCategories as jest.Mock).mockResolvedValue(["Tech"]);

    const Page = await BlogsPage();
    render(Page);

    expect(screen.getByTestId("client-page")).toHaveTextContent("1 posts");
  });
});
