/**
 * Unit tests for lib/images/imageUtils.ts
 *
 * Tests pure utility functions: srcset generation, Supabase URL
 * transformation, placeholder SVG creation, aspect ratio computation,
 * and URL validation.
 */
import {
  isSupabaseUrl,
  transformSupabaseUrl,
  generateSrcSet,
  getSizes,
  getIntrinsicDimensions,
  getAspectRatioCSS,
  getPaddingTopFallback,
  getPlaceholderSVG,
  getPlaceholderSVGDark,
  getFallbackUrl,
  isValidImageUrl,
} from "@/lib/images/imageUtils";

describe("imageUtils", () => {
  // -----------------------------------------------------------------------
  // isSupabaseUrl
  // -----------------------------------------------------------------------
  describe("isSupabaseUrl", () => {
    it("returns true for valid Supabase storage URLs", () => {
      expect(
        isSupabaseUrl(
          "https://xyz.supabase.co/storage/v1/object/public/images/hero.jpg"
        )
      ).toBe(true);
    });

    it("returns false for non-Supabase URLs", () => {
      expect(isSupabaseUrl("https://example.com/image.jpg")).toBe(false);
      expect(isSupabaseUrl("/local-image.jpg")).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // transformSupabaseUrl
  // -----------------------------------------------------------------------
  describe("transformSupabaseUrl", () => {
    const baseUrl =
      "https://xyz.supabase.co/storage/v1/object/public/images/hero.jpg";

    it("transforms Supabase URL to render endpoint with width and quality", () => {
      const result = transformSupabaseUrl(baseUrl, 640);
      expect(result).toContain("/storage/v1/render/image/public/");
      expect(result).toContain("width=640");
      expect(result).toContain("quality=80");
    });

    it("appends format parameter when specified", () => {
      const result = transformSupabaseUrl(baseUrl, 640, "webp");
      expect(result).toContain("format=webp");
    });

    it("does not append format when origin is specified", () => {
      const result = transformSupabaseUrl(baseUrl, 640, "origin");
      expect(result).not.toContain("format=");
    });

    it("returns original URL for non-Supabase URLs", () => {
      const url = "https://example.com/image.jpg";
      expect(transformSupabaseUrl(url, 640)).toBe(url);
    });

    it("accepts custom quality parameter", () => {
      const result = transformSupabaseUrl(baseUrl, 640, "webp", 50);
      expect(result).toContain("quality=50");
    });
  });

  // -----------------------------------------------------------------------
  // generateSrcSet
  // -----------------------------------------------------------------------
  describe("generateSrcSet", () => {
    const supabaseUrl =
      "https://xyz.supabase.co/storage/v1/object/public/images/hero.jpg";

    it("generates multi-width srcset for Supabase thumbnail URLs", () => {
      const srcSet = generateSrcSet(supabaseUrl, "thumbnail");
      // Thumbnail uses [320, 640] widths
      expect(srcSet).toContain("320w");
      expect(srcSet).toContain("640w");
      expect(srcSet).not.toContain("1920w");
    });

    it("generates multi-width srcset for Supabase cover URLs", () => {
      const srcSet = generateSrcSet(supabaseUrl, "cover");
      // Cover uses all widths
      expect(srcSet).toContain("320w");
      expect(srcSet).toContain("1920w");
    });

    it("generates format-specific srcset for webp", () => {
      const srcSet = generateSrcSet(supabaseUrl, "cover", "webp");
      expect(srcSet).toContain("format=webp");
    });

    it("returns plain URL for non-Supabase sources", () => {
      const url = "/local-image.jpg";
      expect(generateSrcSet(url, "thumbnail")).toBe(url);
    });
  });

  // -----------------------------------------------------------------------
  // getSizes
  // -----------------------------------------------------------------------
  describe("getSizes", () => {
    it("returns correct sizes string for thumbnail", () => {
      const sizes = getSizes("thumbnail");
      expect(sizes).toContain("33vw");
    });

    it("returns correct sizes string for cover", () => {
      const sizes = getSizes("cover");
      expect(sizes).toContain("100vw");
    });
  });

  // -----------------------------------------------------------------------
  // getIntrinsicDimensions
  // -----------------------------------------------------------------------
  describe("getIntrinsicDimensions", () => {
    it("returns 640x360 for thumbnail (16:9)", () => {
      const dim = getIntrinsicDimensions("thumbnail");
      expect(dim.width).toBe(640);
      expect(dim.height).toBe(360);
    });

    it("returns 1280x720 for cover (16:9)", () => {
      const dim = getIntrinsicDimensions("cover");
      expect(dim.width).toBe(1280);
      expect(dim.height).toBe(720);
    });
  });

  // -----------------------------------------------------------------------
  // getAspectRatioCSS
  // -----------------------------------------------------------------------
  describe("getAspectRatioCSS", () => {
    it("returns '16 / 9' for both variants", () => {
      expect(getAspectRatioCSS("thumbnail")).toBe("16 / 9");
      expect(getAspectRatioCSS("cover")).toBe("16 / 9");
    });
  });

  // -----------------------------------------------------------------------
  // getPaddingTopFallback
  // -----------------------------------------------------------------------
  describe("getPaddingTopFallback", () => {
    it("returns 56.25% for 16:9 ratio", () => {
      expect(getPaddingTopFallback("thumbnail")).toBe("56.25%");
      expect(getPaddingTopFallback("cover")).toBe("56.25%");
    });
  });

  // -----------------------------------------------------------------------
  // Placeholder SVGs
  // -----------------------------------------------------------------------
  describe("getPlaceholderSVG", () => {
    it("returns a data URI SVG string", () => {
      const svg = getPlaceholderSVG();
      expect(svg).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
    });

    it("includes viewBox dimensions", () => {
      const svg = getPlaceholderSVG(16, 9);
      expect(svg).toContain("viewBox");
    });
  });

  describe("getPlaceholderSVGDark", () => {
    it("returns a dark variant data URI", () => {
      const svg = getPlaceholderSVGDark();
      expect(svg).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
    });
  });

  // -----------------------------------------------------------------------
  // getFallbackUrl
  // -----------------------------------------------------------------------
  describe("getFallbackUrl", () => {
    it("returns the fallback image path", () => {
      expect(getFallbackUrl()).toBe("/readme-banner.png");
    });
  });

  // -----------------------------------------------------------------------
  // isValidImageUrl
  // -----------------------------------------------------------------------
  describe("isValidImageUrl", () => {
    it("returns true for http URLs", () => {
      expect(isValidImageUrl("https://example.com/img.jpg")).toBe(true);
    });

    it("returns true for relative paths", () => {
      expect(isValidImageUrl("/images/foo.png")).toBe(true);
    });

    it("returns true for data URIs", () => {
      expect(isValidImageUrl("data:image/svg+xml;charset=utf-8,...")).toBe(true);
    });

    it("returns false for null/undefined/empty", () => {
      expect(isValidImageUrl(null)).toBe(false);
      expect(isValidImageUrl(undefined)).toBe(false);
      expect(isValidImageUrl("")).toBe(false);
    });

    it("returns false for random strings", () => {
      expect(isValidImageUrl("not-a-url")).toBe(false);
    });
  });
});
