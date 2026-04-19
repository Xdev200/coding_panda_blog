import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserForm } from "@/components/admin/UserForm";

describe("UserForm", () => {
    const mockFormAction = jest.fn();

    const MOCK_USER: any = {
        id: "u1",
        full_name: "Test User",
        email: "test@example.com",
        role: "admin",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders create mode with password field", () => {
        render(<UserForm formAction={mockFormAction} />);
        expect(screen.getByText("Create User")).toBeInTheDocument();
        expect(screen.getByLabelText("Password *")).toBeInTheDocument();
        expect(screen.getByLabelText("Email Address *")).not.toBeDisabled();
    });

    it("renders edit mode with disabled email and no password", () => {
        render(<UserForm user={MOCK_USER} formAction={mockFormAction} />);
        expect(screen.getByText("Update User")).toBeInTheDocument();
        expect(screen.queryByLabelText("Password *")).not.toBeInTheDocument();
        expect(screen.getByLabelText("Email Address *")).toBeDisabled();
    });

    it("calls formAction with user id in edit mode", () => {
        render(<UserForm user={MOCK_USER} formAction={mockFormAction} />);
        
        const submitBtn = screen.getByText("Update User");
        fireEvent.click(submitBtn);

        expect(mockFormAction).toHaveBeenCalled();
        const formData = mockFormAction.mock.calls[0][0];
        expect(formData.get("id")).toBe("u1");
    });
});
