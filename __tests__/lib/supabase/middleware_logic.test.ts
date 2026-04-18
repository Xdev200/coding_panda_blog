import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

jest.mock("@supabase/ssr");
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn().mockReturnValue({ cookies: { set: jest.fn() } }),
    redirect: jest.fn().mockImplementation((url) => ({ url })),
  },
}));

describe("middleware updateSession", () => {
  let mockSupabase: any;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
    };
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    mockRequest = {
      cookies: { getAll: jest.fn().mockReturnValue([]), set: jest.fn() },
      nextUrl: {
        pathname: "/admin",
        clone: jest.fn().mockReturnThis(),
        searchParams: { set: jest.fn() },
      },
      url: "http://localhost:3000/admin",
    };
  });

  it("redirects to login if user is not authenticated for /admin", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalled();
    expect((response as any).url.pathname).toBe("/login");
  });

  it("redirects to login if user is not an admin for /admin", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { user_metadata: { role: "viewer" } } },
    });

    const response = await updateSession(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it("allows access if user is an admin for /admin", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { user_metadata: { role: "admin" } } },
    });

    const response = await updateSession(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).not.toHaveProperty("url"); // it's a next() response
  });

  it("redirects logged-in admin from /login to /admin", async () => {
    mockRequest.nextUrl.pathname = "/login";
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { user_metadata: { role: "admin" } } },
    });

    const response = await updateSession(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalled();
    expect((response as any).url.pathname).toBe("/admin");
  });

  it("handles cookies configuration correctly", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    await updateSession(mockRequest);

    const callArgs = (createServerClient as jest.Mock).mock.calls[0][2];
    expect(callArgs.cookies).toBeDefined();

    // Test getAll
    callArgs.cookies.getAll();
    expect(mockRequest.cookies.getAll).toHaveBeenCalled();

    // Test setAll
    const mockNextResponse = { cookies: { set: jest.fn() } };
    (NextResponse.next as jest.Mock).mockReturnValue(mockNextResponse);
    
    const cookiesToSet = [{ name: "my-cookie", value: "my-value", options: { path: "/" } }];
    callArgs.cookies.setAll(cookiesToSet);
    
    expect(mockRequest.cookies.set).toHaveBeenCalledWith("my-cookie", "my-value");
    expect(mockNextResponse.cookies.set).toHaveBeenCalledWith("my-cookie", "my-value", { path: "/" });
  });
});
