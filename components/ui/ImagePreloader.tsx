/**
 * ImagePreloader — Injects `<link rel="preload" as="image">` into the document head.
 *
 * Used on single post pages to preload the cover image, reducing LCP latency.
 * The `fetchpriority="high"` hint tells the browser to prioritize this resource.
 *
 * This component uses the original database URL directly to ensure visibility
 * while still providing the performance benefit of early discovery.
 *
 * @module components/ui/ImagePreloader
 */

import { isValidImageUrl } from "@/lib/images";

export interface ImagePreloaderProps {
  /** The image URL to preload. */
  src: string;
}

/**
 * Server-compatible preload link injection.
 *
 * @returns A `<link rel="preload">` element or `null` if the src is invalid.
 */
export function ImagePreloader({ src }: ImagePreloaderProps) {
  if (!isValidImageUrl(src)) return null;

  return (
    <link
      rel="preload"
      as="image"
      href={src}
      fetchPriority="high"
    />
  );
}

export default ImagePreloader;
