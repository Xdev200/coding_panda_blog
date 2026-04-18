import React from "react";
import { render, screen } from "@testing-library/react";
import NewUserPage from "@/app/admin/users/new/page";

jest.mock("@/components/admin/UserForm", () => ({
  UserForm: () => <div data-testid="user-form">New User Form</div>,
}));

describe("NewUserPage", () => {
  it("renders new user form", () => {
    render(<NewUserPage />);
    expect(screen.getByText("New User")).toBeInTheDocument();
    expect(screen.getByTestId("user-form")).toBeInTheDocument();
  });
});
