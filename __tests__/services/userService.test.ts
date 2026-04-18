import { userService } from "@/services/userService";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const createMockBuilder = (result: any = { data: [], error: null }) => {
  const builder: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: Array.isArray(result.data) ? result.data[0] : result.data, error: result.error });
    }),
    then: jest.fn((onFulfilled: any) => {
      return Promise.resolve(result).then(onFulfilled);
    }),
  };
  return builder;
};

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  full_name: "Test User",
  role: "admin",
  created_at: "2025-01-01",
};

describe("userService", () => {
  let builder: any;
  let mockSupabase: any;
  let mockAdminSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    builder = createMockBuilder({ data: [MOCK_USER], error: null });
    mockSupabase = {
      from: jest.fn(() => builder),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    mockAdminSupabase = {
      auth: {
        admin: {
          createUser: jest.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
          updateUserById: jest.fn().mockResolvedValue({ data: {}, error: null }),
          deleteUser: jest.fn().mockResolvedValue({ error: null }),
        },
      },
    };
    (createAdminClient as jest.Mock).mockReturnValue(mockAdminSupabase);
  });

  describe("getAllUsers", () => {
    it("fetches all users ordered by created_at", async () => {
      const users = await userService.getAllUsers();
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
      expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: false });
      expect(users).toHaveLength(1);
    });

    it("throws error if fetch fails", async () => {
        builder = createMockBuilder({ data: null, error: { message: "Fail" } });
        await expect(userService.getAllUsers()).rejects.toThrow("Fail");
    });
  });

  describe("getUserById", () => {
    it("fetches single user by id", async () => {
      const user = await userService.getUserById("user-1");
      expect(builder.eq).toHaveBeenCalledWith("id", "user-1");
      expect(user?.id).toBe("user-1");
    });

    it("returns null if fetch fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Fail" } });
      const user = await userService.getUserById("user-1");
      expect(user).toBeNull();
    });
  });

  describe("createUser", () => {
    it("creates auth user then fetches profile", async () => {
      const input = { email: "a@b.com", password: "p", full_name: "N", role: "admin" };
      const user = await userService.createUser(input as any);
      
      expect(mockAdminSupabase.auth.admin.createUser).toHaveBeenCalled();
      expect(builder.eq).toHaveBeenCalledWith("id", "user-1");
      expect(user.id).toBe("user-1");
    });

    it("throws error if auth creation fails", async () => {
      mockAdminSupabase.auth.admin.createUser.mockResolvedValue({ data: null, error: { message: "Auth error" } });
      const input = { email: "a@b.com", password: "p", full_name: "N", role: "admin" };
      await expect(userService.createUser(input as any)).rejects.toThrow("Auth error");
    });

    it("throws error if profile fetch fails after creation", async () => {
      mockAdminSupabase.auth.admin.createUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
      builder = createMockBuilder({ data: null, error: { message: "DB error" } });
      const input = { email: "a@b.com", password: "p", full_name: "N", role: "admin" };
      await expect(userService.createUser(input as any)).rejects.toThrow("DB error");
    });
  });

  describe("updateUser", () => {
    it("updates profile and metadata if role changed", async () => {
      await userService.updateUser("user-1", { 
        full_name: "New Name", 
        role: "editor",
        avatar_url: "http://avatar.com"
      });
      expect(builder.update).toHaveBeenCalledWith({ 
        full_name: "New Name", 
        role: "editor",
        avatar_url: "http://avatar.com"
      });
      expect(mockAdminSupabase.auth.admin.updateUserById).toHaveBeenCalledWith("user-1", {
        user_metadata: { role: "editor" },
      });
    });

    it("does not update auth metadata if role not changed", async () => {
        await userService.updateUser("user-1", { full_name: "Just Name" });
        expect(mockAdminSupabase.auth.admin.updateUserById).not.toHaveBeenCalled();
    });

    it("throws error if update fails", async () => {
      builder = createMockBuilder({ data: null, error: { message: "Fail" } });
      await expect(userService.updateUser("user-1", { role: "editor" })).rejects.toThrow("Fail");
    });
  });

  describe("deleteUser", () => {
    it("calls admin.deleteUser", async () => {
      await userService.deleteUser("user-1");
      expect(mockAdminSupabase.auth.admin.deleteUser).toHaveBeenCalledWith("user-1");
    });

    it("throws error if delete fails", async () => {
      mockAdminSupabase.auth.admin.deleteUser.mockResolvedValue({ error: { message: "Delete fail" } });
      await expect(userService.deleteUser("user-1")).rejects.toThrow("Delete fail");
    });
  });

  describe("getStats", () => {
    it("calculates user counts by role", async () => {
      builder = createMockBuilder({ 
        data: [{ role: "admin" }, { role: "editor" }, { role: "viewer" }, { role: "viewer" }], 
        error: null 
      });
      const stats = await userService.getStats();
      expect(stats.totalUsers).toBe(4);
      expect(stats.adminCount).toBe(1);
      expect(stats.editorCount).toBe(1);
      expect(stats.viewerCount).toBe(2);
    });

    it("returns zeros on error", async () => {
        builder = createMockBuilder({ data: null, error: { message: "Fail" } });
        const stats = await userService.getStats();
        expect(stats.totalUsers).toBe(0);
        expect(stats.adminCount).toBe(0);
    });

    it("returns zeros when no data returned", async () => {
        builder = createMockBuilder({ data: null, error: null });
        const stats = await userService.getStats();
        expect(stats.totalUsers).toBe(0);
    });
  });
});
