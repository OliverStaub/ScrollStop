// modules/doomscroll-detector/doomscroll-detector.js
// Module for detecting excessive scrolling behavior

if (typeof window.DoomscrollDetector === 'undefined') {
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
      console.log('DoomscrollDetector: YouTube Shorts detected:', this.isYouTubeShorts);

      this.scrollHandler = this.handleScroll.bind(this);
      window.addEventListener('scroll', this.scrollHandler, { passive: true });

      // Add touch listeners for swipe detection (especially for YouTube Shorts)
      if (this.isYouTubeShorts || window.location.hostname.includes('tiktok')) {
        console.log('DoomscrollDetector: Setting up touch/swipe detection');
        document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: true });

        // Also detect YouTube Shorts navigation changes
        if (this.isYouTubeShorts) {
          console.log('DoomscrollDetector: Setting up YouTube Shorts navigation detection');
          this.setupShortsNavigationDetection();
        }
      }

      // For YouTube, also set up periodic re-detection in case page changes to/from Shorts
      if (window.location.hostname.includes('youtube.com')) {
        this.setupPeriodicShortsDetection();
      }

      this.isInitialized = true;
    }

    /**
     * Set up periodic re-detection of YouTube Shorts (in case of navigation changes)
     */
    setupPeriodicShortsDetection() {
      // Check every 2 seconds if we've switched to/from Shorts
      this.periodicDetectionInterval = setInterval(() => {
        const wasShorts = this.isYouTubeShorts;
        const isNowShorts = this.detectYouTubeShorts();

        if (wasShorts !== isNowShorts) {
          console.log(
            `DoomscrollDetector: YouTube Shorts state changed: ${wasShorts} -> ${isNowShorts}`
          );
          this.isYouTubeShorts = isNowShorts;

          if (isNowShorts && !wasShorts) {
            // Just switched to Shorts - set up touch listeners and navigation detection
            console.log('DoomscrollDetector: Switched to Shorts - setting up touch detection');
            document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
            document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
            this.setupShortsNavigationDetection();
          } else if (!isNowShorts && wasShorts) {
            // Switched away from Shorts - clean up Shorts-specific detection
            console.log('DoomscrollDetector: Switched away from Shorts - cleaning up');
            document.removeEventListener('touchstart', this.handleTouchStart);
            document.removeEventListener('touchend', this.handleTouchEnd);
            if (this.shortsObserver) {
              this.shortsObserver.disconnect();
              this.shortsObserver = null;
            }
          }
        }
      }, 2000);
    }

    /**
     * Destroy the detector and clean up event listeners
     */
    destroy() {
      if (this.scrollHandler) {
        window.removeEventListener('scroll', this.scrollHandler);
        this.scrollHandler = null;
      }

      // Remove touch listeners
      document.removeEventListener('touchstart', this.handleTouchStart);
      document.removeEventListener('touchend', this.handleTouchEnd);

      // Clean up Shorts observer
      if (this.shortsObserver) {
        this.shortsObserver.disconnect();
        this.shortsObserver = null;
      }

      // Clean up periodic detection interval
      if (this.periodicDetectionInterval) {
        clearInterval(this.periodicDetectionInterval);
        this.periodicDetectionInterval = null;
      }

      // Clean up YouTube event listeners
      window.removeEventListener('yt-navigate-finish', this.handleYouTubeNavigation);
      window.removeEventListener('yt-player-state-change', this.handleYouTubePlayerState);

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
      const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
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
        new CustomEvent('doomscroll-detected', {
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
      if (!window.location.hostname.includes('youtube.com')) {
        return false;
      }

      // Check URL path
      if (window.location.pathname.includes('/shorts/')) {
        return true;
      }

      // Check for various Shorts-related selectors (more comprehensive)
      const shortsSelectors = [
        'ytd-shorts',
        '[is-shorts]',
        'ytd-reel-video-renderer',
        'ytd-shorts-player',
        '#shorts-player',
        '.ytd-shorts',
        '[data-shorts]',
        'ytd-app[is-shorts-mode]',
        '#player[is-shorts]',
      ];

      for (const selector of shortsSelectors) {
        if (document.querySelector(selector)) {
          return true;
        }
      }

      // Check for Shorts-specific page indicators
      const bodyClasses = document.body.className;
      if (bodyClasses.includes('shorts') || bodyClasses.includes('reel')) {
        return true;
      }

      // Check if the current video container has vertical orientation (typical for Shorts)
      const videoElement = document.querySelector('video');
      if (videoElement && this.isVerticalVideo(videoElement)) {
        // Additional check for Shorts context
        const container = videoElement.closest('[role="main"], ytd-app, #page-manager');
        if (container && container.querySelector('[data-shorts], [is-shorts], ytd-reel')) {
          return true;
        }
      }

      return false;
    }

    /**
     * Check if a video element has vertical (portrait) orientation
     */
    isVerticalVideo(videoElement) {
      const rect = videoElement.getBoundingClientRect();
      return rect.height > rect.width;
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
      if (!this.touchStartY) {
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = this.touchStartY - touchEndY;
      const swipeTime = Date.now() - this.touchStartTime;

      // More lenient swipe detection for YouTube Shorts
      // Detect upward swipes (positive distance) that are reasonably intentional
      let isValidSwipe = false;

      if (this.isYouTubeShorts) {
        // For YouTube Shorts, be more lenient:
        // - Minimum 30px swipe distance (reduced from 50px)
        // - Allow slower swipes (up to 800ms instead of 500ms)
        // - Also detect significant downward swipes (going to previous video)
        const minDistance = 30;
        const maxTime = 800;

        if (Math.abs(swipeDistance) > minDistance && swipeTime < maxTime) {
          isValidSwipe = true;
        }
      } else {
        // For other platforms (like TikTok), keep original logic
        if (swipeDistance > 50 && swipeTime < 500) {
          isValidSwipe = true;
        }
      }

      if (isValidSwipe) {
        this.swipeCount++;
        console.log(
          `DoomscrollDetector: Swipe detected (${this.swipeCount}/${this.config.SWIPE_LIMIT}), distance: ${swipeDistance}px, time: ${swipeTime}ms`
        );

        // Check if we've reached the swipe limit
        if (this.swipeCount >= this.config.SWIPE_LIMIT) {
          console.log(
            `DoomscrollDetector: Swipe limit reached (${this.config.SWIPE_LIMIT}), triggering doomscroll detection`
          );
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
      let lastVideoId = this.extractVideoIdFromUrl(lastUrl);

      // Use a more reliable observer for Shorts navigation
      const observer = new MutationObserver((mutations) => {
        const currentUrl = window.location.href;
        const currentVideoId = this.extractVideoIdFromUrl(currentUrl);

        // Check for URL changes (traditional navigation)
        if (currentUrl !== lastUrl && currentUrl.includes('/shorts/')) {
          this.swipeCount++;
          console.log(
            `DoomscrollDetector: Navigation detected via URL change (${this.swipeCount}/${this.config.SWIPE_LIMIT})`
          );

          if (this.swipeCount >= this.config.SWIPE_LIMIT) {
            this.triggerDoomscrollDetected('navigation');
            return;
          }

          lastUrl = currentUrl;
          lastVideoId = currentVideoId;
        }

        // Check for video ID changes (in-app navigation without URL change)
        if (currentVideoId && currentVideoId !== lastVideoId) {
          this.swipeCount++;
          console.log(
            `DoomscrollDetector: Navigation detected via video change (${this.swipeCount}/${this.config.SWIPE_LIMIT})`
          );

          if (this.swipeCount >= this.config.SWIPE_LIMIT) {
            this.triggerDoomscrollDetected('navigation');
            return;
          }

          lastVideoId = currentVideoId;
        }

        // Also check for specific DOM changes that indicate new video loading
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            // Look for new video elements or containers being added
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                if (
                  element.matches &&
                  (element.matches('ytd-reel-video-renderer') ||
                    element.matches('[data-shorts]') ||
                    element.querySelector('ytd-reel-video-renderer, [data-shorts]'))
                ) {
                  this.swipeCount++;
                  console.log(
                    `DoomscrollDetector: Navigation detected via DOM change (${this.swipeCount}/${this.config.SWIPE_LIMIT})`
                  );

                  if (this.swipeCount >= this.config.SWIPE_LIMIT) {
                    this.triggerDoomscrollDetected('navigation');
                    return;
                  }
                }
              }
            }
          }
        }
      });

      // Observe changes to the document with more specific targeting
      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-shorts', 'is-shorts', 'src'],
      });

      // Store observer for cleanup
      this.shortsObserver = observer;

      // Also listen for YouTube's custom navigation events
      this.setupYouTubeEventListeners();
    }

    /**
     * Extract video ID from YouTube URL
     */
    extractVideoIdFromUrl(url) {
      if (!url.includes('youtube.com/shorts/')) {
        return null;
      }

      const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }

    /**
     * Set up YouTube-specific event listeners
     */
    setupYouTubeEventListeners() {
      // Listen for YouTube's internal navigation events
      window.addEventListener('yt-navigate-finish', () => {
        if (this.isYouTubeShorts && window.location.href.includes('/shorts/')) {
          this.swipeCount++;
          console.log(
            `DoomscrollDetector: Navigation detected via yt-navigate-finish (${this.swipeCount}/${this.config.SWIPE_LIMIT})`
          );

          if (this.swipeCount >= this.config.SWIPE_LIMIT) {
            this.triggerDoomscrollDetected('navigation');
          }
        }
      });

      // Listen for video player state changes
      window.addEventListener('yt-player-state-change', (event) => {
        if (this.isYouTubeShorts && event.detail && event.detail.state === 'playing') {
          // New video started playing - likely indicates navigation
          this.swipeCount++;
          console.log(
            `DoomscrollDetector: Navigation detected via video state change (${this.swipeCount}/${this.config.SWIPE_LIMIT})`
          );

          if (this.swipeCount >= this.config.SWIPE_LIMIT) {
            this.triggerDoomscrollDetected('navigation');
          }
        }
      });
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
      return Math.min(100, (this.scrollDistance / this.config.SCROLL_LIMIT) * 100);
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
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DoomscrollDetector;
  } else {
    window.DoomscrollDetector = DoomscrollDetector;
  }
}
