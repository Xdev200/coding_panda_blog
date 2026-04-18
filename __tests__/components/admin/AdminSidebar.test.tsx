import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";

jest.mock("lucide-react", () => ({
  LayoutDashboard: () => <div data-testid="icon-dashboard" />,
  FileText: () => <div data-testid="icon-posts" />,
  Users: () => <div data-testid="icon-users" />,
  LogOut: () => <div data-testid="icon-logout" />,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/app/login/actions", () => ({
  signOut: jest.fn(),
}));

describe("AdminSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/admin");
  });

  it("renders all nav items", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("highlights the active link", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin/posts");
    render(<AdminSidebar />);
    
    const postsLink = screen.getByText("Posts");
    expect(postsLink).toHaveClass("bg-retro-yellow");
    
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).not.toHaveClass("bg-retro-yellow");
  });

  it("renders sign out button", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
