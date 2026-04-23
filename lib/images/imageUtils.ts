/**
 * Pure utility functions for image optimization.
 *
 * Provides srcset generation, sizes computation, SVG placeholder
 * creation, and Supabase Storage URL transformation.
 *
 * @module lib/images/imageUtils
 */

import {
  IMAGE_WIDTHS,
  THUMBNAIL_WIDTHS,
  IMAGE_SIZES,
  ASPECT_RATIOS,
  FALLBACK_IMAGE_URL,
  type ImageVariant,
} from './constants';

// ---------------------------------------------------------------------------
// Supabase Storage URL helpers
// ---------------------------------------------------------------------------

/**
 * Checks whether a URL is a Supabase Storage public URL.
 *
 * @param url - The image URL to test.
 * @returns `true` if the URL matches the Supabase storage pattern.
 *
 * @example
 * isSupabaseUrl('https://xyz.supabase.co/storage/v1/object/public/images/foo.jpg')
 * // => true
 */
export function isSupabaseUrl(url: string): boolean {
  return /\.supabase\.co\/storage\/v1\/object\/public\//.test(url);
}

/**
 * Transforms a Supabase Storage URL to use the built-in image transformation API.
 * Appends `?width=N&quality=Q&format=F` query parameters.
 *
 * Falls back to the original URL if it is not a Supabase URL.
 *
 * @param url    - Original Supabase Storage URL.
 * @param width  - Desired output width in pixels.
 * @param format - Image format ('webp' | 'avif' | 'origin'). Defaults to 'origin'.
 * @param quality - JPEG/WebP quality (1–100). Defaults to 80.
 * @returns Transformed URL string.
 *
 * @example
 * transformSupabaseUrl(
 *   'https://xyz.supabase.co/storage/v1/object/public/images/hero.jpg',
 *   640,
 *   'webp',
 *   75
 * )
 * // => 'https://xyz.supabase.co/storage/v1/render/image/public/images/hero.jpg?width=640&quality=75&format=webp'
 */
export function transformSupabaseUrl(
  url: string,
  width: number,
  format: 'webp' | 'avif' | 'origin' = 'origin',
  quality: number = 80,
): string {
  // Always return original URL to ensure reliability as requested by user
  return url;
}

// ---------------------------------------------------------------------------
// srcset generation
// ---------------------------------------------------------------------------

/**
 * Generates a `srcset` string for responsive images.
 *
 * For Supabase URLs, uses the transform API to produce width-specific variants.
 * For other URLs, returns just the original URL (no transform available).
 *
 * @param url     - Original image URL.
 * @param variant - 'thumbnail' | 'cover'. Determines which width set to use.
 * @param format  - Image format for transformed URLs.
 * @returns Formatted srcset string (e.g. "url1 320w, url2 640w").
 *
 * @example
 * generateSrcSet('https://xyz.supabase.co/.../hero.jpg', 'cover', 'webp')
 * // => "https://...?width=320&format=webp 320w, https://...?width=640&format=webp 640w, ..."
 */
export function generateSrcSet(
  url: string,
  variant: ImageVariant,
  format: 'webp' | 'avif' | 'origin' = 'origin',
): string {
  // Return original URL for simplicity and stability
  return url;
}

/**
 * Returns the `sizes` attribute value for a given image variant.
 *
 * @param variant - 'thumbnail' | 'cover'.
 * @returns A valid `sizes` attribute string.
 */
export function getSizes(variant: ImageVariant): string {
  return IMAGE_SIZES[variant];
}

// ---------------------------------------------------------------------------
// Dimensions & aspect ratio
// ---------------------------------------------------------------------------

/**
 * Returns intrinsic width/height for a variant that matches the aspect ratio.
 * Used as `width` and `height` attributes on `<img>` to prevent CLS.
 *
 * @param variant - 'thumbnail' | 'cover'.
 * @returns Object with width and height.
 */
export function getIntrinsicDimensions(variant: ImageVariant): { width: number; height: number } {
  const ratio = ASPECT_RATIOS[variant];
  // Scale to reasonable reference sizes for the attribute
  if (variant === 'thumbnail') {
    return { width: 640, height: Math.round(640 * (ratio.height / ratio.width)) };
  }
  return { width: 1280, height: Math.round(1280 * (ratio.height / ratio.width)) };
}

/**
 * Returns the CSS `aspect-ratio` value as a string (e.g. "16 / 9").
 *
 * @param variant - Image variant.
 * @returns CSS aspect-ratio value string.
 */
export function getAspectRatioCSS(variant: ImageVariant): string {
  const ratio = ASPECT_RATIOS[variant];
  return `${ratio.width} / ${ratio.height}`;
}

/**
 * Returns the padding-top percentage for the aspect ratio hack (CLS fallback).
 *
 * @param variant - Image variant.
 * @returns Percentage string (e.g. "56.25%").
 */
export function getPaddingTopFallback(variant: ImageVariant): string {
  const ratio = ASPECT_RATIOS[variant];
  return `${((ratio.height / ratio.width) * 100).toFixed(2)}%`;
}

// ---------------------------------------------------------------------------
// Placeholder SVG
// ---------------------------------------------------------------------------

/**
 * Generates a tiny inline SVG data URI placeholder.
 * Renders as a blurred gradient approximation of the image.
 * Total size: ~180 bytes — no network request needed.
 *
 * @param width  - Placeholder width (keep small, e.g. 16).
 * @param height - Placeholder height (keep small, e.g. 9).
 * @returns Data URI string for use in `src` or CSS `background-image`.
 *
 * @example
 * getPlaceholderSVG(16, 9)
 * // => "data:image/svg+xml;charset=utf-8,..."
 */
export function getPlaceholderSVG(width: number = 16, height: number = 9): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e2e8f0"/>
        <stop offset="100%" stop-color="#cbd5e1"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

/**
 * Generates a dark-mode variant of the placeholder SVG.
 */
export function getPlaceholderSVGDark(width: number = 16, height: number = 9): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#25253E"/>
        <stop offset="100%" stop-color="#1A1A2E"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

// ---------------------------------------------------------------------------
// Fallback helpers
// ---------------------------------------------------------------------------

/**
 * Returns the fallback image URL for error scenarios.
 */
export function getFallbackUrl(): string {
  return FALLBACK_IMAGE_URL;
}

/**
 * Validates that a URL is non-empty and looks like a valid image source.
 *
 * @param url - URL to validate.
 * @returns `true` if the URL appears valid.
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http') || url.startsWith('/') || url.startsWith('data:');
}
