import { cn, formatDate, formatReadTime, slugify, truncate } from "@/lib/utils";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("handles conditional objects", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("returns empty string with no args", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats ISO date strings into human-readable format", () => {
    const result = formatDate("2025-08-24");
    expect(result).toMatch(/August/);
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/24/);
  });

  it("handles different months", () => {
    const result = formatDate("2025-01-01");
    expect(result).toMatch(/January/);
  });
});

describe("formatReadTime", () => {
  it("returns singular for 1 minute", () => {
    expect(formatReadTime(1)).toBe("1 min read");
  });

  it("returns plural for multiple minutes", () => {
    expect(formatReadTime(5)).toBe("5 min read");
    expect(formatReadTime(10)).toBe("10 min read");
  });

  it("handles zero", () => {
    expect(formatReadTime(0)).toBe("0 min read");
  });
});

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple spaces/dashes", () => {
    expect(slugify("foo   bar--baz")).toBe("foo-bar-baz");
  });

  it("trims leading/trailing dashes", () => {
    expect(slugify("-hello-")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("truncate", () => {
  it("returns text unchanged when within limit", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("returns text unchanged when exactly at limit", () => {
    expect(truncate("exact", 5)).toBe("exact");
  });

  it("truncates and appends ellipsis when over limit", () => {
    const result = truncate("Hello World", 5);
    expect(result).toMatch(/…$/);
    expect(result.length).toBeLessThanOrEqual(6);
  });

  it("trims trailing whitespace before ellipsis", () => {
    const result = truncate("Hello     World", 7);
    expect(result).not.toMatch(/ …$/);
  });
});
