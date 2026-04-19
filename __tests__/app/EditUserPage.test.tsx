import React from "react";
import { render, screen } from "@testing-library/react";
import EditUserPage from "@/app/admin/users/[id]/page";
import { userService } from "@/services/userService";
import { notFound } from "next/navigation";

jest.mock("@/services/userService", () => ({
  userService: {
    getUserById: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/components/admin/UserForm", () => ({
  UserForm: ({ user }: any) => <div data-testid="user-form">Editing: {user.full_name}</div>,
}));

describe("EditUserPage", () => {
  it("renders user form when user is found", async () => {
    const mockUser = { id: "u1", full_name: "John Doe" };
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const Page = await EditUserPage({ params: Promise.resolve({ id: "u1" }) });
    render(Page);

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByTestId("user-form")).toHaveTextContent("Editing: John Doe");
  });

  it("calls notFound when user is missing", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await EditUserPage({ params: Promise.resolve({ id: "missing" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
