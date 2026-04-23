/**
 * Image optimization constants.
 *
 * Centralizes all configuration for responsive image breakpoints,
 * aspect ratios, fallback URLs, and observer tuning parameters.
 *
 * @module lib/images/constants
 */

// ---------------------------------------------------------------------------
// Responsive breakpoints (widths in pixels)
// ---------------------------------------------------------------------------

/**
 * Standard srcset widths for responsive images.
 * Covers mobile (320), tablet (640), desktop (960, 1280), and retina (1920).
 */
export const IMAGE_WIDTHS = [320, 640, 960, 1280, 1920] as const;

/**
 * Thumbnail-specific widths — smaller set to avoid unnecessary variants.
 */
export const THUMBNAIL_WIDTHS = [320, 640] as const;

// ---------------------------------------------------------------------------
// Image variants
// ---------------------------------------------------------------------------

/**
 * Defines the two image usage contexts in the blog.
 * Each variant has distinct loading strategy, sizing, and priority hints.
 */
export type ImageVariant = 'thumbnail' | 'cover';

/**
 * Aspect ratio definitions by variant.
 * Used for CLS prevention via CSS `aspect-ratio` and `padding-top` fallback.
 */
export const ASPECT_RATIOS: Record<ImageVariant, { width: number; height: number }> = {
  thumbnail: { width: 16, height: 9 },
  cover: { width: 16, height: 9 },
};

/**
 * `sizes` attribute values for responsive image rendering.
 * Describes how wide the image will be rendered at each viewport.
 */
export const IMAGE_SIZES: Record<ImageVariant, string> = {
  thumbnail: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  cover: '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 816px',
};

// ---------------------------------------------------------------------------
// Loading strategy per variant
// ---------------------------------------------------------------------------

export const LOADING_STRATEGY: Record<ImageVariant, {
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'low' | 'auto';
  decoding: 'async' | 'sync' | 'auto';
}> = {
  thumbnail: {
    loading: 'lazy',
    fetchPriority: 'auto',
    decoding: 'async',
  },
  cover: {
    loading: 'eager',
    fetchPriority: 'high',
    decoding: 'sync',
  },
};

// ---------------------------------------------------------------------------
// IntersectionObserver tuning
// ---------------------------------------------------------------------------

/**
 * Root margin for the lazy loading observer.
 * 200px vertical margin starts loading images before they scroll into view.
 */
export const OBSERVER_ROOT_MARGIN = '200px 0px';

/**
 * Threshold at which the observer fires.
 * 0.01 = fire as soon as 1% of the image enters the margin zone.
 */
export const OBSERVER_THRESHOLD = 0.01;

// ---------------------------------------------------------------------------
// Fallback & placeholder
// ---------------------------------------------------------------------------

/**
 * Fallback image shown when the primary image fails to load.
 * Points to a local asset that should always be available.
 */
export const FALLBACK_IMAGE_URL = '/readme-banner.png';

/**
 * CSS transition duration for the fade-in animation (ms).
 */
export const FADE_DURATION_MS = 300;

/**
 * Placeholder background colors matching the design system.
 */
export const PLACEHOLDER_COLORS = {
  light: '#FAFAFA',
  dark: '#25253E',
} as const;
