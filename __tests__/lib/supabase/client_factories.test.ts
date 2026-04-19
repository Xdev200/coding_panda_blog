import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

jest.mock("@supabase/ssr");
jest.mock("@supabase/supabase-js");
jest.mock("next/headers");

describe("Supabase Client Factories", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { 
            ...originalEnv, 
            NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
            SUPABASE_SERVICE_ROLE_KEY: "service-key"
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe("createClient (Server)", () => {
        it("creates a server client with cookie storage", async () => {
            const mockCookies = {
                getAll: jest.fn().mockReturnValue([]),
                set: jest.fn(),
            };
            (cookies as jest.Mock).mockResolvedValue(mockCookies);

            await createClient();

            expect(createServerClient).toHaveBeenCalledWith(
                "https://test.supabase.co",
                "anon-key",
                expect.objectContaining({
                    cookies: expect.any(Object)
                })
            );

            // Test cookie cookie handlers
            const cookieConfig = (createServerClient as jest.Mock).mock.calls[0][2].cookies;
            cookieConfig.getAll();
            expect(mockCookies.getAll).toHaveBeenCalled();

            cookieConfig.setAll([{ name: "test", value: "val", options: {} }]);
            expect(mockCookies.set).toHaveBeenCalledWith("test", "val", {});
        });

        it("swallows error in setAll when cookies cannot be set", async () => {
            const mockCookies = {
                set: jest.fn(() => { throw new Error("Headers already sent"); }),
            };
            (cookies as jest.Mock).mockResolvedValue(mockCookies);

            await createClient();
            const cookieConfig = (createServerClient as jest.Mock).mock.calls[0][2].cookies;
            expect(() => cookieConfig.setAll([{ name: "t", value: "v" }])).not.toThrow();
        });
    });

    describe("createAdminClient", () => {
        it("creates an admin client with service role key", () => {
            createAdminClient();
            expect(createSupabaseClient).toHaveBeenCalledWith(
                "https://test.supabase.co",
                "service-key",
                expect.any(Object)
            );
        });

        it("throws error if credentials missing", () => {
            delete process.env.SUPABASE_SERVICE_ROLE_KEY;
            expect(() => createAdminClient()).toThrow("Missing Supabase admin credentials");
        });
    });
});
