import { createUser, updateUser, deleteUser } from "@/app/admin/users/actions";
import { userService } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

jest.mock("@/services/userService");
jest.mock("next/cache");
jest.mock("next/navigation");

describe("User Actions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("calls userService.createUser and redirects", async () => {
            const formData = new FormData();
            formData.append("email", "test@test.com");
            formData.append("password", "pass123");
            formData.append("full_name", "Test User");
            formData.append("role", "admin");

            await createUser(formData);

            expect(userService.createUser).toHaveBeenCalledWith({
                email: "test@test.com",
                password: "pass123",
                full_name: "Test User",
                role: "admin"
            });
            expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
            expect(redirect).toHaveBeenCalledWith("/admin/users");
        });
    });

    describe("updateUser", () => {
        it("calls userService.updateUser and redirects", async () => {
            const formData = new FormData();
            formData.append("id", "u1");
            formData.append("full_name", "New Name");
            formData.append("role", "editor");

            await updateUser(formData);

            expect(userService.updateUser).toHaveBeenCalledWith("u1", {
                full_name: "New Name",
                role: "editor"
            });
            expect(redirect).toHaveBeenCalledWith("/admin/users");
        });
    });

    describe("deleteUser", () => {
        it("calls userService.deleteUser and redirects", async () => {
            const formData = new FormData();
            formData.append("id", "u1");

            await deleteUser(formData);

            expect(userService.deleteUser).toHaveBeenCalledWith("u1");
            expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
            expect(redirect).toHaveBeenCalledWith("/admin/users");
        });
    });
});
