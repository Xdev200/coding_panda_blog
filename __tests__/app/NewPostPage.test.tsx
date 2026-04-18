import React from "react";
import { render, screen } from "@testing-library/react";
import NewPostPage from "@/app/admin/posts/new/page";

jest.mock("@/components/admin/PostForm", () => ({
  PostForm: () => <div data-testid="post-form">New Post Form</div>,
}));

describe("NewPostPage", () => {
  it("renders new post form", () => {
    render(<NewPostPage />);
    expect(screen.getByText("New Post")).toBeInTheDocument();
    expect(screen.getByTestId("post-form")).toBeInTheDocument();
  });
});
