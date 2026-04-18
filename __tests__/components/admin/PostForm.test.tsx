import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { PostForm } from "@/components/admin/PostForm";

describe("PostForm", () => {
    const mockFormAction = jest.fn();

    const MOCK_POST: any = {
        id: "1",
        title: "Test Post",
        slug: "test-post",
        category: "test",
        author: "Panda",
        readTime: 5,
        date: "2025-01-01",
        tags: ["react", "jest"],
        excerpt: "Small summary",
        content: "# Big content",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock URL methods for image preview
        global.URL.createObjectURL = jest.fn();
        global.URL.revokeObjectURL = jest.fn();
    });

    it("renders create mode correctly", () => {
        render(<PostForm formAction={mockFormAction} />);
        expect(screen.getByText("Create Post")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter post title...")).toHaveValue("");
    });

    it("renders edit mode with initial data", () => {
        render(<PostForm post={MOCK_POST} formAction={mockFormAction} />);
        expect(screen.getByText("Update Post")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Test Post")).toBeInTheDocument();
        expect(screen.getByText("react")).toBeInTheDocument();
        expect(screen.getByText("jest")).toBeInTheDocument();
    });

    it("allows adding and removing tags", () => {
        render(<PostForm formAction={mockFormAction} />);
        const tagInput = screen.getByPlaceholderText("Type a tag and press Enter...");
        
        // Add tag
        fireEvent.change(tagInput, { target: { value: "newtag" } });
        fireEvent.keyDown(tagInput, { key: "Enter", code: "Enter" });
        
        expect(screen.getByText("newtag")).toBeInTheDocument();
        
        // Remove tag
        const removeBtn = screen.getByText("×");
        fireEvent.click(removeBtn);
        expect(screen.queryByText("newtag")).not.toBeInTheDocument();
    });

    it("calls formAction on submit with correct data", () => {
        render(<PostForm post={MOCK_POST} formAction={mockFormAction} />);
        
        const submitBtn = screen.getByText("Update Post");
        fireEvent.click(submitBtn);

        expect(mockFormAction).toHaveBeenCalled();
        const formData = mockFormAction.mock.calls[0][0];
        expect(formData.get("title")).toBe("Test Post");
        expect(formData.get("id")).toBe("1");
        expect(formData.get("tags")).toBe(JSON.stringify(["react", "jest"]));
    });

    it("shows error for invalid image type", () => {
        render(<PostForm formAction={mockFormAction} />);
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        
        fireEvent.change(input, {
            target: {
                files: [new File([""], "test.txt", { type: "text/plain" })],
            },
        });
        
        expect(screen.getByText(/Invalid format/i)).toBeInTheDocument();
    });

    it("shows error for large image file", () => {
        render(<PostForm formAction={mockFormAction} />);
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        
        const largeFile = new File([""], "large.jpg", { type: "image/jpeg" });
        Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

        fireEvent.change(input, {
            target: { files: [largeFile] },
        });
        
        expect(screen.getByText(/Image size exceeds 5MB/i)).toBeInTheDocument();
    });

    it("allows adding tags using comma", () => {
        render(<PostForm formAction={mockFormAction} />);
        const tagInput = screen.getByPlaceholderText("Type a tag and press Enter...");
        
        fireEvent.change(tagInput, { target: { value: "tag1" } });
        fireEvent.keyDown(tagInput, { key: ",", code: "Comma" });
        
        expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    it("prevents submission if image error exists", () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<PostForm formAction={mockFormAction} />);
        
        // Trigger error
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        fireEvent.change(input, {
            target: { files: [new File([""], "test.txt", { type: "text/plain" })] },
        });

        // Submit form
        const form = screen.getByRole("form");
        fireEvent.submit(form);

        expect(alertMock).toHaveBeenCalledWith("Please fix image errors before saving.");
        expect(mockFormAction).not.toHaveBeenCalled();
        alertMock.mockRestore();
    });

    it("disables button when isPending is true", () => {
        render(<PostForm formAction={mockFormAction} isPending={true} />);
        const submitBtn = screen.getByText("Saving...");
        expect(submitBtn).toBeDisabled();
    });

    it("validates image dimensions and updates preview", async () => {
        // Mock URL and Image
        const mockCreateObjectURL = jest.fn(() => "mock-url");
        const mockRevokeObjectURL = jest.fn();
        global.URL.createObjectURL = mockCreateObjectURL;
        global.URL.revokeObjectURL = mockRevokeObjectURL;

        const mockImage = {
            set src(s: string) {},
            get src() { return "mock-url"; },
            onload: (null as any),
            onerror: (null as any),
            width: 800,
            height: 400
        };
        global.Image = jest.fn(() => mockImage) as any;

        // Mock FileReader
        const mockReader = {
            readAsDataURL: jest.fn(),
            onloadend: (null as any),
            result: "data:image/png;base64,mock"
        };
        global.FileReader = jest.fn(() => mockReader) as any;

        render(<PostForm formAction={mockFormAction} />);
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        
        fireEvent.change(input, {
            target: { files: [new File([""], "test.png", { type: "image/png" })] },
        });

        // Trigger onload
        act(() => {
            mockImage.onload();
        });

        // Trigger FileReader onloadend
        act(() => {
            mockReader.onloadend();
        });

        expect(mockRevokeObjectURL).toHaveBeenCalledWith("mock-url");
        expect(screen.getByRole("img", { name: /Preview/i })).toBeInTheDocument();
        expect(screen.getByRole("img", { name: /Preview/i })).toHaveAttribute("src", "data:image/png;base64,mock");
    });

    it("shows error for small image dimensions", async () => {
        const mockImage = {
            set src(s: string) {},
            get src() { return "mock-url"; },
            onload: (null as any),
            onerror: (null as any),
            width: 100,
            height: 100
        };
        global.Image = jest.fn(() => mockImage) as any;

        render(<PostForm formAction={mockFormAction} />);
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        
        fireEvent.change(input, {
            target: { files: [new File([""], "small.png", { type: "image/png" })] },
        });

        act(() => {
            mockImage.onload();
        });

        expect(screen.getByText(/Image dimensions too small/i)).toBeInTheDocument();
    });

    it("shows error if image fails to load", async () => {
        const mockImage = {
            set src(s: string) {},
            onload: (null as any),
            onerror: (null as any),
        };
        global.Image = jest.fn(() => mockImage) as any;

        render(<PostForm formAction={mockFormAction} />);
        const input = screen.getByLabelText(/Cover Image/i) as HTMLInputElement;
        
        fireEvent.change(input, {
            target: { files: [new File([""], "corrupt.png", { type: "image/png" })] },
        });

        act(() => {
            mockImage.onerror();
        });

        expect(screen.getByText(/Error reading image file/i)).toBeInTheDocument();
    });
});
