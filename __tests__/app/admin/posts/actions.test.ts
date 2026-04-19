import { createPost, updatePost, deletePost } from "@/app/admin/posts/actions";
import { adminBlogService } from "@/services/adminBlogService";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

jest.mock("@/services/adminBlogService");
jest.mock("@/lib/supabase/server");
jest.mock("next/cache");
jest.mock("next/navigation");

describe("Post Actions", () => {
    let mockSupabase: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSupabase = {
            storage: {
                from: jest.fn().mockReturnThis(),
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: "http://example.com/img.jpg" } }),
            },
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    });

    describe("createPost", () => {
        it("creates a post without image", async () => {
            const formData = new FormData();
            formData.append("title", "New Post");
            formData.append("tags", "[\"tag1\"]");

            await createPost(formData);

            expect(adminBlogService.createPost).toHaveBeenCalledWith(expect.objectContaining({
                title: "New Post",
                tags: ["tag1"]
            }));
            expect(revalidatePath).toHaveBeenCalledWith("/admin/posts");
            expect(redirect).toHaveBeenCalledWith("/admin/posts");
        });

        it("uploads image if provided", async () => {
            const formData = new FormData();
            formData.append("title", "Post with Image");
            formData.append("cover_image_file", new File(["test"], "test.jpg", { type: "image/jpeg" }));

            await createPost(formData);

            expect(mockSupabase.storage.upload).toHaveBeenCalled();
            expect(adminBlogService.createPost).toHaveBeenCalledWith(expect.objectContaining({
                cover_image: "http://example.com/img.jpg"
            }));
        });
        
        it("throws error for invalid image type", async () => {
            const formData = new FormData();
            formData.append("cover_image_file", new File(["test"], "test.pdf", { type: "application/pdf" }));
            await expect(createPost(formData)).rejects.toThrow("Invalid image format");
        });

        it("throws error for large image", async () => {
            const formData = new FormData();
            const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
            formData.append("cover_image_file", largeFile);
            await expect(createPost(formData)).rejects.toThrow("Image size exceeds 5MB");
        });

        it("throws error if upload fails", async () => {
            const formData = new FormData();
            formData.append("cover_image_file", new File(["test"], "test.jpg", { type: "image/jpeg" }));
            mockSupabase.storage.upload.mockResolvedValue({ error: { message: "Mock Fail" } });
            await expect(createPost(formData)).rejects.toThrow("Failed to upload image");
        });
    });

    describe("updatePost", () => {
        it("updates a post", async () => {
            const formData = new FormData();
            formData.append("id", "p1");
            formData.append("title", "Updated Title");

            await updatePost(formData);

            expect(adminBlogService.updatePost).toHaveBeenCalledWith("p1", expect.objectContaining({
                title: "Updated Title"
            }));
            expect(redirect).toHaveBeenCalledWith("/admin/posts");
        });

        it("throws error if updating fails", async () => {
            const formData = new FormData();
            formData.append("id", "p1");
            (adminBlogService.updatePost as jest.Mock).mockRejectedValue(new Error("Update fail"));
            await expect(updatePost(formData)).rejects.toThrow("Update fail");
        });
    });

    describe("deletePost", () => {
        it("deletes a post", async () => {
            const formData = new FormData();
            formData.append("id", "p1");

            await deletePost(formData);

            expect(adminBlogService.deletePost).toHaveBeenCalledWith("p1");
            expect(revalidatePath).toHaveBeenCalled();
        });
    });
});
