import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsersTable } from "@/components/admin/UsersTable";

jest.mock("@/app/admin/users/actions", () => ({
  deleteUser: jest.fn(),
}));

const MOCK_USERS: any[] = [
  {
    id: "u1",
    full_name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    full_name: null,
    email: "viewer@example.com",
    role: "viewer",
    created_at: "2024-02-01T00:00:00Z",
  }
];

describe("UsersTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    it("renders table with user data", () => {
        render(<UsersTable users={MOCK_USERS} />);
        expect(screen.getByText("Admin User")).toBeInTheDocument();
        expect(screen.getByText("admin@example.com")).toBeInTheDocument();
        expect(screen.getByText("viewer@example.com")).toBeInTheDocument();
        expect(screen.getByText("—")).toBeInTheDocument(); // For null name
    });

    it("renders role badges with correct colors", () => {
        render(<UsersTable users={MOCK_USERS} />);
        const adminBadge = screen.getByText("admin");
        const viewerBadge = screen.getByText("viewer");
        expect(adminBadge).toHaveClass("bg-retro-pink");
        expect(viewerBadge).toHaveClass("bg-retro-yellow");
    });

    it("shows confirm dialog on delete", () => {
        render(<UsersTable users={MOCK_USERS} />);
        const deleteBtns = screen.getAllByText("Delete");
        fireEvent.click(deleteBtns[0]);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this user?");
    });
});
