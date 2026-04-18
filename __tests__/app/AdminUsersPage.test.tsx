import React from "react";
import { render, screen } from "@testing-library/react";
import AdminUsersPage from "@/app/admin/users/page";
import { userService } from "@/services/userService";

jest.mock("@/services/userService", () => ({
  userService: {
    getAllUsers: jest.fn(),
  },
}));

// Mock UsersTable to avoid deep rendering complexity in page test
jest.mock("@/components/admin/UsersTable", () => ({
  UsersTable: ({ users }: any) => <div data-testid="users-table">{users.length} users</div>,
}));

describe("AdminUsersPage", () => {
  it("fetches and displays users", async () => {
    (userService.getAllUsers as jest.Mock).mockResolvedValue([
      { id: "1", full_name: "Test User" },
    ]);

    const Page = await AdminUsersPage();
    render(Page);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText(/Manage user accounts/)).toBeInTheDocument();
    expect(screen.getByTestId("users-table")).toHaveTextContent("1 users");
  });
});
