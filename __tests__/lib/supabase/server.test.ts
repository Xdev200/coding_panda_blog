import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("lib/supabase/server", () => {
    let mockCookieStore: any;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
        mockCookieStore = {
            getAll: jest.fn().mockReturnValue([{ name: "session", value: "abc" }]),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    it("creates a server client and configures cookie handlers", async () => {
        await createClient();

        expect(createServerClient).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                cookies: expect.objectContaining({
                    getAll: expect.any(Function),
                    setAll: expect.any(Function),
                }),
            })
        );
    });

    it("getAll handler calls cookieStore.getAll", async () => {
        await createClient();
        const config = (createServerClient as jest.Mock).mock.calls[0][2];
        const result = config.cookies.getAll();
        
        expect(mockCookieStore.getAll).toHaveBeenCalled();
        expect(result).toEqual([{ name: "session", value: "abc" }]);
    });

    it("setAll handler calls cookieStore.set", async () => {
        await createClient();
        const config = (createServerClient as jest.Mock).mock.calls[0][2];
        const cookiesToSet = [{ name: "a", value: "b", options: {} }];
        config.cookies.setAll(cookiesToSet);
        
        expect(mockCookieStore.set).toHaveBeenCalledWith("a", "b", {});
    });

    it("setAll handler catches errors gracefully", async () => {
        mockCookieStore.set.mockImplementation(() => {
            throw new Error("Cannot set cookie in server component");
        });
        await createClient();
        const config = (createServerClient as jest.Mock).mock.calls[0][2];
        
        expect(() => config.cookies.setAll([{ name: "a", value: "b" }])).not.toThrow();
    });
});
