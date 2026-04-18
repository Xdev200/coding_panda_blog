import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "@/app/admin/page";
import { adminBlogService } from "@/services/adminBlogService";
import { userService } from "@/services/userService";

jest.mock("@/services/adminBlogService", () => ({
  adminBlogService: {
    getStats: jest.fn(),
  },
}));

jest.mock("@/services/userService", () => ({
  userService: {
    getStats: jest.fn(),
  },
}));

jest.mock("lucide-react", () => ({
  FileText: () => <div data-testid="icon-posts" />,
  Users: () => <div data-testid="icon-users" />,
  Star: () => <div data-testid="icon-star" />,
  FolderOpen: () => <div data-testid="icon-folder" />,
}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (adminBlogService.getStats as jest.Mock).mockResolvedValue({
      totalPosts: 10,
      featuredPosts: 2,
      categories: 3,
    });
    (userService.getStats as jest.Mock).mockResolvedValue({
      totalUsers: 5,
      adminCount: 1,
      editorCount: 2,
      viewerCount: 2,
    });
  });

  it("renders stats cards correctly from services", async () => {
    const Component = await AdminDashboard();
    render(Component);

    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Featured
    expect(screen.getByText("3")).toBeInTheDocument(); // Categories
    expect(screen.getByText("5")).toBeInTheDocument(); // Total Users
  });

  it("renders quick action links", async () => {
    const Component = await AdminDashboard();
    render(Component);

    expect(screen.getByText("✏️ New Post")).toBeInTheDocument();
    expect(screen.getByText("📋 Manage Posts")).toBeInTheDocument();
    expect(screen.getByText("👥 Manage Users")).toBeInTheDocument();
  });
});
