// modules/doomscroll-detector/doomscroll-detector.js
// Module for detecting excessive scrolling behavior

class DoomscrollDetector {
  constructor(config = {}) {
    this.config = {
      SCROLL_LIMIT: config.scrollLimit || 4000, // Pixels scrolled before triggering
      ...config,
    };

    this.scrollDistance = 0;
    this.isInitialized = false;
    this.scrollHandler = null;
  }

  /**
   * Initialize the doomscroll detector
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }

    this.scrollHandler = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    this.isInitialized = true;

    console.log(
      "DoomscrollDetector initialized with scroll limit:",
      this.config.SCROLL_LIMIT
    );
  }

  /**
   * Destroy the detector and clean up event listeners
   */
  destroy() {
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }
    this.isInitialized = false;
    this.scrollDistance = 0;
  }

  /**
   * Handle scroll events and detect doomscrolling
   */
  handleScroll() {
    const currentScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollDelta = currentScrollTop - this.scrollDistance;
    this.scrollDistance = currentScrollTop;

    // Only trigger on downward scrolling
    if (scrollDelta > 0 && this.scrollDistance > this.config.SCROLL_LIMIT) {
      this.triggerDoomscrollDetected();
    }
  }

  /**
   * Trigger doomscroll detection event and cleanup
   */
  triggerDoomscrollDetected() {
    // Dispatch custom event that other modules can listen to
    window.dispatchEvent(
      new CustomEvent("doomscroll-detected", {
        detail: {
          scrollDistance: this.scrollDistance,
          scrollLimit: this.config.SCROLL_LIMIT,
          hostname: window.location.hostname,
        },
      })
    );

    // Clean up after detection
    this.destroy();
  }

  /**
   * Reset scroll distance counter
   */
  resetScrollDistance() {
    this.scrollDistance = 0;
  }

  /**
   * Get current scroll distance
   * @returns {number} Current scroll distance in pixels
   */
  getCurrentScrollDistance() {
    return this.scrollDistance;
  }

  /**
   * Get scroll progress as percentage
   * @returns {number} Progress from 0 to 100
   */
  getScrollProgress() {
    return Math.min(
      100,
      (this.scrollDistance / this.config.SCROLL_LIMIT) * 100
    );
  }

  /**
   * Check if detector is active
   * @returns {boolean} True if detector is initialized and listening
   */
  isActive() {
    return this.isInitialized;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DoomscrollDetector;
} else {
  window.DoomscrollDetector = DoomscrollDetector;
}
