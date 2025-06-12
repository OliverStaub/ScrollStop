// modules/doomscroll-detector/doomscroll-detector.js
// Module for detecting excessive scrolling behavior

if (typeof window.DoomscrollDetector === "undefined") {
  class DoomscrollDetector {
    constructor(config = {}) {
      this.config = {
        SCROLL_LIMIT: config.scrollLimit || 4000, // Pixels scrolled before triggering
        SWIPE_LIMIT: config.swipeLimit || 15, // Number of swipes before triggering (for Shorts)
        ...config,
      };

      this.scrollDistance = 0;
      this.swipeCount = 0;
      this.isInitialized = false;
      this.scrollHandler = null;
      this.touchStartY = 0;
      this.touchStartTime = 0;
      this.isYouTubeShorts = false;
      
      // Bind touch handlers
      this.handleTouchStart = this.handleTouchStart.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Initialize the doomscroll detector
     */
    initialize() {
      if (this.isInitialized) {
        return;
      }

      // Check if we're on YouTube Shorts
      this.isYouTubeShorts = this.detectYouTubeShorts();

      this.scrollHandler = this.handleScroll.bind(this);
      window.addEventListener("scroll", this.scrollHandler, { passive: true });
      
      // Add touch listeners for swipe detection (especially for YouTube Shorts)
      if (this.isYouTubeShorts || window.location.hostname.includes('tiktok')) {
        document.addEventListener("touchstart", this.handleTouchStart, { passive: true });
        document.addEventListener("touchend", this.handleTouchEnd, { passive: true });
        
        // Also detect YouTube Shorts navigation changes
        if (this.isYouTubeShorts) {
          this.setupShortsNavigationDetection();
        }
      }
      
      this.isInitialized = true;
    }

    /**
     * Destroy the detector and clean up event listeners
     */
    destroy() {
      if (this.scrollHandler) {
        window.removeEventListener("scroll", this.scrollHandler);
        this.scrollHandler = null;
      }
      
      // Remove touch listeners
      document.removeEventListener("touchstart", this.handleTouchStart);
      document.removeEventListener("touchend", this.handleTouchEnd);
      
      // Clean up Shorts observer
      if (this.shortsObserver) {
        this.shortsObserver.disconnect();
        this.shortsObserver = null;
      }
      
      this.isInitialized = false;
      this.scrollDistance = 0;
      this.swipeCount = 0;
      this.touchStartY = 0;
      this.touchStartTime = 0;
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
    triggerDoomscrollDetected(triggerType = 'scroll') {
      // Dispatch custom event that other modules can listen to
      window.dispatchEvent(
        new CustomEvent("doomscroll-detected", {
          detail: {
            scrollDistance: this.scrollDistance,
            scrollLimit: this.config.SCROLL_LIMIT,
            swipeCount: this.swipeCount,
            swipeLimit: this.config.SWIPE_LIMIT,
            triggerType: triggerType, // 'scroll' or 'swipe'
            hostname: window.location.hostname,
          },
        })
      );

      // Clean up after detection
      this.destroy();
    }

    /**
     * Detect if we're on YouTube Shorts
     */
    detectYouTubeShorts() {
      return window.location.hostname.includes('youtube.com') && 
             (window.location.pathname.includes('/shorts/') || 
              document.querySelector('ytd-shorts') !== null ||
              document.querySelector('[is-shorts]') !== null);
    }

    /**
     * Handle touch start for swipe detection
     */
    handleTouchStart(e) {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
    }

    /**
     * Handle touch end for swipe detection
     */
    handleTouchEnd(e) {
      if (!this.touchStartY) {return;}
      
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = this.touchStartY - touchEndY;
      const swipeTime = Date.now() - this.touchStartTime;
      
      // Detect upward swipes (positive distance) of at least 50px that are quick (under 500ms)
      // This helps distinguish intentional swipes from slow scrolls
      if (swipeDistance > 50 && swipeTime < 500) {
        this.swipeCount++;
        
        // Check if we've reached the swipe limit
        if (this.swipeCount >= this.config.SWIPE_LIMIT) {
          this.triggerDoomscrollDetected('swipe');
        }
      }
      
      this.touchStartY = 0;
      this.touchStartTime = 0;
    }

    /**
     * Set up YouTube Shorts navigation detection
     */
    setupShortsNavigationDetection() {
      // Track URL changes in Shorts
      let lastUrl = window.location.href;
      
      // Use a more reliable observer for Shorts navigation
      const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl && currentUrl.includes('/shorts/')) {
          this.swipeCount++;
          
          if (this.swipeCount >= this.config.SWIPE_LIMIT) {
            this.triggerDoomscrollDetected('navigation');
          }
          
          lastUrl = currentUrl;
        }
      });
      
      // Observe changes to the document
      observer.observe(document, { 
        childList: true, 
        subtree: true 
      });
      
      // Store observer for cleanup
      this.shortsObserver = observer;
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
}
