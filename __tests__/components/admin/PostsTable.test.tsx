import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostsTable } from "@/components/admin/PostsTable";

jest.mock("@/app/admin/posts/actions", () => ({
  deletePost: jest.fn(),
}));

const MOCK_POSTS: any[] = [
  {
    id: "p1",
    title: "Post 1",
    category: "tech",
    author: "Author 1",
    date: "2025-01-01",
    tags: ["a", "b"],
    featured: true,
  },
  {
    id: "p2",
    title: "Post 2",
    category: "life",
    author: "Author 2",
    date: "2099-01-01", // Future date
    tags: [],
    featured: false,
  }
];

describe("PostsTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    it("renders table with post data", () => {
        render(<PostsTable posts={MOCK_POSTS} />);
        expect(screen.getByText("Post 1")).toBeInTheDocument();
        expect(screen.getByText("Post 2")).toBeInTheDocument();
        expect(screen.getByText("Published")).toBeInTheDocument();
        expect(screen.getByText("Scheduled")).toBeInTheDocument(); // Post 2 is in 2099
    });

    it("renders custom column accessors (Image, Tags, Featured)", () => {
        render(<PostsTable posts={MOCK_POSTS} />);
        expect(screen.getByText("Yes")).toBeInTheDocument(); // Featured
        expect(screen.getByText("a")).toBeInTheDocument(); // Tag
        expect(screen.getByText("None")).toBeInTheDocument(); // No tags for p2
    });

    it("shows confirm dialog on delete", () => {
        render(<PostsTable posts={MOCK_POSTS} />);
        const deleteBtns = screen.getAllByText("Delete");
        fireEvent.click(deleteBtns[0]);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this post?");
    });
});
