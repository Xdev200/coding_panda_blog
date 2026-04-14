import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
  })),
}));

describe("lib/supabase", () => {
  it("initializes supabase client", () => {
    expect(supabase).toBeDefined();
    expect(createClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });
});
