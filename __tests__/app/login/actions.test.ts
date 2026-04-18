import { login, signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/supabase/server");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Login Actions", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("login", () => {
    it("redirects to admin on successful login", async () => {
      const formData = new FormData();
      formData.append("email", "admin@test.com");
      formData.append("password", "password");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { user_metadata: { role: "admin" } } },
        error: null,
      });

      try {
        await login(formData);
      } catch (e) {
        // next.js redirect throws
      }

      expect(redirect).toHaveBeenCalledWith("/admin");
      expect(revalidatePath).toHaveBeenCalled();
    });

    it("redirects with error if auth fails", async () => {
      const formData = new FormData();
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid" },
      });

      try {
        await login(formData);
      } catch (e) {}

      expect(redirect).toHaveBeenCalledWith("/login?error=invalid_credentials");
    });

    it("redirects with unauthorized if not an admin", async () => {
      const formData = new FormData();
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { user_metadata: { role: "viewer" } } },
        error: null,
      });

      try {
        await login(formData);
      } catch (e) {}

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/login?error=unauthorized");
    });

    it("redirects to custom redirectTo if provided", async () => {
        const formData = new FormData();
        formData.append("redirectTo", "/test-path");
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: { user: { user_metadata: { role: "admin" } } },
          error: null,
        });
  
        try {
          await login(formData);
        } catch (e) {}
  
        expect(redirect).toHaveBeenCalledWith("/test-path");
      });
  });

  describe("signOut", () => {
    it("signs out and redirects home", async () => {
      await signOut();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });
});
