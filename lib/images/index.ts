/**
 * Image optimization module barrel export.
 *
 * Re-exports all public APIs from the image subsystem for clean imports:
 *
 * @example
 * import { generateSrcSet, observe, IMAGE_WIDTHS } from '@/lib/images';
 *
 * @module lib/images
 */

export {
  IMAGE_WIDTHS,
  THUMBNAIL_WIDTHS,
  ASPECT_RATIOS,
  IMAGE_SIZES,
  LOADING_STRATEGY,
  OBSERVER_ROOT_MARGIN,
  OBSERVER_THRESHOLD,
  FALLBACK_IMAGE_URL,
  FADE_DURATION_MS,
  PLACEHOLDER_COLORS,
  type ImageVariant,
} from './constants';

export {
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
} from './imageUtils';

export {
  isObserverSupported,
  observe,
  unobserve,
  destroyObserver,
} from './LazyImageObserver';
