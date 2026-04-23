/**
 * Unit tests for lib/images/LazyImageObserver.ts
 *
 * Tests the singleton IntersectionObserver manager including
 * observe, unobserve, feature detection, and cleanup.
 */

// Mock IntersectionObserver before importing the module
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

let observerCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
}

// Install mock before module loads
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

import {
  isObserverSupported,
  observe,
  unobserve,
  destroyObserver,
} from "@/lib/images/LazyImageObserver";

describe("LazyImageObserver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    destroyObserver(); // Reset singleton between tests
  });

  describe("isObserverSupported", () => {
    it("returns true when IntersectionObserver exists in window", () => {
      expect(isObserverSupported()).toBe(true);
    });
  });

  describe("observe", () => {
    it("starts observing an element and returns true", () => {
      const el = document.createElement("div");
      const callback = jest.fn();

      const result = observe(el, callback);

      expect(result).toBe(true);
      expect(mockObserve).toHaveBeenCalledWith(el);
    });

    it("fires callback when element intersects", () => {
      const el = document.createElement("div");
      const callback = jest.fn();

      observe(el, callback);

      // Simulate intersection
      const entry = {
        isIntersecting: true,
        target: el,
      } as unknown as IntersectionObserverEntry;

      observerCallback([entry], {} as IntersectionObserver);

      expect(callback).toHaveBeenCalledWith(entry);
    });

    it("unobserves element after first intersection", () => {
      const el = document.createElement("div");
      const callback = jest.fn();

      observe(el, callback);

      const entry = {
        isIntersecting: true,
        target: el,
      } as unknown as IntersectionObserverEntry;

      observerCallback([entry], {} as IntersectionObserver);

      expect(mockUnobserve).toHaveBeenCalledWith(el);
    });

    it("does not fire callback for non-intersecting entries", () => {
      const el = document.createElement("div");
      const callback = jest.fn();

      observe(el, callback);

      const entry = {
        isIntersecting: false,
        target: el,
      } as unknown as IntersectionObserverEntry;

      observerCallback([entry], {} as IntersectionObserver);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("unobserve", () => {
    it("stops observing an element", () => {
      const el = document.createElement("div");
      observe(el, jest.fn()); // Initialize observer

      unobserve(el);

      expect(mockUnobserve).toHaveBeenCalledWith(el);
    });
  });

  describe("destroyObserver", () => {
    it("disconnects the observer", () => {
      const el = document.createElement("div");
      observe(el, jest.fn()); // Initialize observer

      destroyObserver();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
