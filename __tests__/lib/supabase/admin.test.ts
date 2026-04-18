import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

describe("lib/supabase/admin", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("creates an admin client when env vars are present", () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

        createAdminClient();

        expect(createClient).toHaveBeenCalledWith(
            "https://example.supabase.co",
            "service-key",
            expect.objectContaining({
                auth: expect.objectContaining({
                    persistSession: false,
                }),
            })
        );
    });

    it("throws error when URL is missing", () => {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

        expect(() => createAdminClient()).toThrow(/Missing Supabase admin credentials/);
    });

    it("throws error when Service Role Key is missing", () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
        delete process.env.SUPABASE_SERVICE_ROLE_KEY;

        expect(() => createAdminClient()).toThrow(/Missing Supabase admin credentials/);
    });
});
