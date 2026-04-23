/**
 * Unit tests for components/ui/OptimizedImage.tsx
 *
 * Tests the React component rendering, variant behavior,
 * error handling, and placeholder display.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Mock the image utilities
jest.mock("@/lib/images", () => ({
  LOADING_STRATEGY: {
    thumbnail: { loading: "lazy", fetchPriority: "auto", decoding: "async" },
    cover: { loading: "eager", fetchPriority: "high", decoding: "sync" },
  },
  generateSrcSet: jest.fn((url: string) => url),
  getSizes: jest.fn(() => "(max-width: 640px) 100vw, 33vw"),
  getIntrinsicDimensions: jest.fn((variant: string) =>
    variant === "thumbnail"
      ? { width: 640, height: 360 }
      : { width: 1280, height: 720 }
  ),
  getPlaceholderSVG: jest.fn(() => "data:image/svg+xml;charset=utf-8,mock"),
  getFallbackUrl: jest.fn(() => "/fallback.png"),
  isValidImageUrl: jest.fn((url: string) => !!url && url.startsWith("http")),
  isObserverSupported: jest.fn(() => false), // Bypass IO in tests
  observe: jest.fn(() => false),
  unobserve: jest.fn(),
  isSupabaseUrl: jest.fn(() => false),
}));

describe("OptimizedImage", () => {
  const defaultProps = {
    src: "https://example.com/image.jpg",
    alt: "Test image",
    variant: "thumbnail" as const,
  };

  it("renders with correct alt text", () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
  });

  it("sets correct width and height attributes for CLS prevention", () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("width", "640");
    expect(img).toHaveAttribute("height", "360");
  });

  it("applies loading='lazy' for thumbnail variant", () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("applies loading='eager' for cover variant", () => {
    render(<OptimizedImage {...defaultProps} variant="cover" />);
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("applies variant-specific container class", () => {
    const { container } = render(<OptimizedImage {...defaultProps} />);
    expect(container.firstChild).toHaveClass("optimized-img-container--thumbnail");
  });

  it("renders placeholder div", () => {
    const { container } = render(<OptimizedImage {...defaultProps} />);
    const placeholder = container.querySelector(".optimized-img-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("adds loaded class after image load event", () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByAltText("Test image");

    // Before load
    expect(img).not.toHaveClass("optimized-img--loaded");

    // Simulate load
    fireEvent.load(img);
    expect(img).toHaveClass("optimized-img--loaded");
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <OptimizedImage {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("calls onLoad callback when image loads", () => {
    const onLoad = jest.fn();
    render(<OptimizedImage {...defaultProps} onLoad={onLoad} />);

    fireEvent.load(screen.getByAltText("Test image"));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("renders placeholder only for invalid URLs", () => {
    const { container } = render(
      <OptimizedImage src="" alt="Invalid" variant="thumbnail" />
    );
    // Should render container with placeholder but no <img>
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".optimized-img-placeholder")).toBeInTheDocument();
  });

  it("handles custom width/height overrides", () => {
    render(
      <OptimizedImage
        {...defaultProps}
        width={800}
        height={600}
      />
    );
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "600");
  });
});
