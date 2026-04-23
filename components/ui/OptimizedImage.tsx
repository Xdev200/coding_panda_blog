"use client";

/**
 * OptimizedImage — Production-grade responsive image component.
 *
 * Features:
 * - Intersection Observer lazy loading with native `loading="lazy"` fallback
 * - `<picture>` + `<source>` for AVIF → WebP → JPEG format negotiation
 * - Responsive `srcset` with multiple widths via Supabase transform API
 * - CLS prevention with `aspect-ratio` CSS + `width`/`height` attributes
 * - SVG LQIP (Low Quality Image Placeholder) with blur effect
 * - Smooth fade-in animation on load
 * - Error handling with graceful fallback image
 * - Dark mode compatible placeholder
 * - `fetchpriority` and `decoding` hints per variant
 * - Fully accessible with proper `alt`, `role`, `aria-*` attributes
 * - Respects `prefers-reduced-motion` for animations
 *
 * @module components/ui/OptimizedImage
 *
 * @example
 * // Thumbnail in a blog card
 * <OptimizedImage
 *   src="/images/thumb.jpg"
 *   alt="Blog post thumbnail"
 *   variant="thumbnail"
 * />
 *
 * @example
 * // Cover/hero on a post page (eager loaded, preloaded)
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Article cover image"
 *   variant="cover"
 *   className="rounded-none"
 * />
 */

import { useRef, useState, useEffect, useCallback, memo } from "react";
import {
  type ImageVariant,
  LOADING_STRATEGY,
  generateSrcSet,
  getSizes,
  getIntrinsicDimensions,
  getPlaceholderSVG,
  getFallbackUrl,
  isValidImageUrl,
  isObserverSupported,
  observe,
  unobserve,
  isSupabaseUrl,
} from "@/lib/images";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OptimizedImageProps {
  /** Source URL of the image. Supabase URLs get automatic responsive transforms. */
  src: string;
  /** Descriptive alt text for accessibility. Required. */
  alt: string;
  /** Usage context — controls loading strategy, sizing, and priority. */
  variant: ImageVariant;
  /** Additional CSS classes applied to the outermost container. */
  className?: string;
  /** Additional CSS classes applied to the `<img>` element itself. */
  imgClassName?: string;
  /** Override fallback image URL on error. */
  fallbackSrc?: string;
  /** Custom placeholder URL (e.g., a tiny LQIP from a CDN). Overrides SVG default. */
  placeholderSrc?: string;
  /** Called when the image has fully loaded. */
  onLoad?: () => void;
  /** Called when the image fails to load. */
  onError?: () => void;
  /** Override intrinsic width (for CLS attributes). */
  width?: number;
  /** Override intrinsic height (for CLS attributes). */
  height?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function OptimizedImageInner({
  src,
  alt,
  variant,
  className = "",
  imgClassName = "",
  fallbackSrc,
  placeholderSrc,
  onLoad,
  onError,
  width: widthOverride,
  height: heightOverride,
}: OptimizedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(
    // Hero/cover images are eager — mark visible immediately
    LOADING_STRATEGY[variant].loading === "eager"
  );

  // Derived values
  const strategy = LOADING_STRATEGY[variant];
  const dimensions = (() => {
    if (widthOverride && heightOverride) {
      return { width: widthOverride, height: heightOverride };
    }
    return getIntrinsicDimensions(variant);
  })();

  const placeholder = placeholderSrc || getPlaceholderSVG(dimensions.width, dimensions.height);
  const effectiveFallback = fallbackSrc || getFallbackUrl();
  const effectiveSrc = hasError ? effectiveFallback : src;

  // -------------------------------------------------------------------------
  // Intersection Observer setup (lazy images only)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Skip IO for eager images (hero/cover) — they are already visible
    if (strategy.loading === "eager") return;

    const element = containerRef.current;
    if (!element) return;

    // If IO is not supported, fall back to immediate load (native lazy handles it)
    if (!isObserverSupported()) {
      setIsVisible(true);
      return;
    }

    const observed = observe(element, () => {
      setIsVisible(true);
    });

    // If observation failed, load immediately
    if (!observed) {
      setIsVisible(true);
    }

    return () => {
      if (element) {
        unobserve(element);
      }
    };
  }, [strategy.loading]);

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      onError?.();
    }
  }, [hasError, onError]);

  // -------------------------------------------------------------------------
  // Validate src
  // -------------------------------------------------------------------------
  if (!isValidImageUrl(src) && !hasError) {
    // Invalid src — render placeholder only
    return (
      <div
        className={`optimized-img-container optimized-img-container--${variant} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="optimized-img-placeholder" />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Determine whether to use <picture> (Supabase URLs with transform support)
  // -------------------------------------------------------------------------
  const usesPicture = isSupabaseUrl(effectiveSrc);

  return (
    <div
      ref={containerRef}
      className={`optimized-img-container optimized-img-container--${variant} ${className}`}
      data-loaded={isLoaded}
      data-variant={variant}
    >
      {/* LQIP placeholder — always rendered, fades out when image loads */}
      <div
        className={`optimized-img-placeholder ${isLoaded ? "optimized-img-placeholder--hidden" : ""}`}
        style={{
          backgroundImage: `url("${placeholder}")`,
        }}
        aria-hidden="true"
      />

      {/* Render actual image only when visible (IO triggered or eager) */}
      {isVisible && (
        <>
          {usesPicture ? (
            <picture>
              {/* AVIF source — best compression, modern browsers */}
              <source
                type="image/avif"
                srcSet={generateSrcSet(effectiveSrc, variant, "avif")}
                sizes={getSizes(variant)}
              />
              {/* WebP source — good compression, wide support */}
              <source
                type="image/webp"
                srcSet={generateSrcSet(effectiveSrc, variant, "webp")}
                sizes={getSizes(variant)}
              />
              {/* Original format fallback */}
              <img
                ref={imgRef}
                src={effectiveSrc}
                srcSet={generateSrcSet(effectiveSrc, variant, "origin")}
                sizes={getSizes(variant)}
                alt={alt}
                width={dimensions.width}
                height={dimensions.height}
                loading={strategy.loading}
                decoding={strategy.decoding}
                fetchPriority={strategy.fetchPriority}
                className={`optimized-img ${isLoaded ? "optimized-img--loaded" : ""} ${imgClassName}`}
                onLoad={handleLoad}
                onError={handleError}
              />
            </picture>
          ) : (
            /* Non-Supabase URLs — standard <img> with native attributes */
            <img
              ref={imgRef}
              src={effectiveSrc}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              loading={strategy.loading}
              decoding={strategy.decoding}
              fetchPriority={strategy.fetchPriority}
              className={`optimized-img ${isLoaded ? "optimized-img--loaded" : ""} ${imgClassName}`}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </>
      )}

      {/* Error indicator — subtle, non-disruptive */}
      {hasError && (
        <div className="optimized-img-error" role="alert" aria-live="polite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Memoized OptimizedImage to prevent unnecessary re-renders.
 * Only re-renders when src, alt, variant, or className changes.
 */
export const OptimizedImage = memo(OptimizedImageInner);
OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
