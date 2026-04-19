import { middleware } from "@/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

jest.mock("@/lib/supabase/middleware", () => ({
  updateSession: jest.fn(),
}));

describe("middleware", () => {
  it("calls updateSession with the request", async () => {
    const request = { url: "https://example.com/admin" } as any;
    await middleware(request);
    expect(updateSession).toHaveBeenCalledWith(request);
  });
});
