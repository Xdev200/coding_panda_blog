/**
 * Singleton IntersectionObserver manager for lazy-loading images.
 *
 * Uses the Singleton pattern to share a single IntersectionObserver
 * instance across all `OptimizedImage` components. This avoids the
 * performance overhead of creating one observer per image.
 *
 * Falls back to native `loading="lazy"` + `decoding="async"` when
 * IntersectionObserver is not available (SSR, very old browsers).
 *
 * @module lib/images/LazyImageObserver
 */

import { OBSERVER_ROOT_MARGIN, OBSERVER_THRESHOLD } from './constants';

// ---------------------------------------------------------------------------
// Type declarations
// ---------------------------------------------------------------------------

/**
 * Callback invoked when an observed image enters the viewport.
 * The image element is passed so the component can swap `data-src` → `src`.
 */
type OnVisibleCallback = (entry: IntersectionObserverEntry) => void;

// ---------------------------------------------------------------------------
// Module-level singleton state
// ---------------------------------------------------------------------------

let observer: IntersectionObserver | null = null;
const callbackMap = new WeakMap<Element, OnVisibleCallback>();

/**
 * IntersectionObserver callback handler.
 * Fires the registered callback for each intersecting entry,
 * then immediately unobserves the element (load-once semantics).
 */
function handleIntersection(entries: IntersectionObserverEntry[]): void {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;

    const callback = callbackMap.get(entry.target);
    if (callback) {
      callback(entry);
      callbackMap.delete(entry.target);
    }

    // Unobserve after first intersection — images only need to load once
    observer?.unobserve(entry.target);
  }
}

/**
 * Lazily creates and returns the shared IntersectionObserver instance.
 *
 * @returns The singleton observer, or `null` if IntersectionObserver
 *          is not supported (e.g., SSR environment).
 */
function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  if (!('IntersectionObserver' in window)) return null;

  if (!observer) {
    observer = new IntersectionObserver(handleIntersection, {
      root: null, // viewport
      rootMargin: OBSERVER_ROOT_MARGIN,
      threshold: OBSERVER_THRESHOLD,
    });
  }

  return observer;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether IntersectionObserver is available in the current environment.
 *
 * @returns `true` if IO is supported (client-side with browser support).
 */
export function isObserverSupported(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Starts observing an element for viewport entry.
 *
 * When the element becomes visible (within `rootMargin`), the `onVisible`
 * callback fires exactly once, then the element is automatically unobserved.
 *
 * @param element   - DOM element to observe (typically the `<img>` or its container).
 * @param onVisible - Callback fired when the element enters the viewport.
 * @returns `true` if observation started, `false` if IO is unavailable.
 *
 * @example
 * ```ts
 * observe(imgRef.current, (entry) => {
 *   const img = entry.target as HTMLImageElement;
 *   img.src = img.dataset.src!;
 * });
 * ```
 */
export function observe(element: Element, onVisible: OnVisibleCallback): boolean {
  const io = getObserver();
  if (!io) return false;

  callbackMap.set(element, onVisible);
  io.observe(element);
  return true;
}

/**
 * Stops observing an element and removes its callback.
 *
 * Call this in cleanup/unmount to prevent memory leaks.
 *
 * @param element - The element to stop observing.
 */
export function unobserve(element: Element): void {
  const io = getObserver();
  if (io) {
    io.unobserve(element);
  }
  callbackMap.delete(element);
}

/**
 * Destroys the singleton observer and clears all state.
 *
 * Useful for testing or full-page teardown. In production,
 * you typically never need to call this.
 */
export function destroyObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
