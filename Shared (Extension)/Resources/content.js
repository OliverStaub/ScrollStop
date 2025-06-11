// content.js - Main coordinator for ScrollStop extension modules
// This file orchestrates the interaction between all modules

class ScrollStopCoordinator {
  constructor() {
    this.doomscrollDetector = null;
    this.doomscrollAnimation = null;
    this.transitionScreen = null;
    this.blockingScreen = null;
    this.timerTracker = null;

    this.isInitialized = false;
    this.currentHostname = window.location.hostname;

    // Bind event handlers
    this.handleDoomscrollDetected = this.handleDoomscrollDetected.bind(this);
    this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
    this.handleTransitionComplete = this.handleTransitionComplete.bind(this);
    this.handleTimeBlockRemoved = this.handleTimeBlockRemoved.bind(this);
  }

  /**
   * Initialize the coordinator and set up event listeners
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Set up event listeners for module communication
      this.setupEventListeners();

      // Initialize timer tracker first (for all tracked sites)
      await this.initializeTimerTracker();

      // Check if current site should be monitored
      await this.checkCurrentSite();

      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing ScrollStop coordinator:", error);
    }
  }

  /**
   * Initialize timer tracker for all social media sites
   */
  async initializeTimerTracker() {
    try {
      // Check if current site is a tracked social media site
      const url = window.location.href;
      const hostname = window.location.hostname;
      const isTrackedSite = await StorageHelper.isCurrentSiteBlocked(url, hostname);
      
      if (isTrackedSite) {
        this.timerTracker = new TimerTracker();
        await this.timerTracker.initialize();
      }
    } catch (error) {
      console.error("Error initializing timer tracker:", error);
    }
  }

  /**
   * Set up event listeners for inter-module communication
   */
  setupEventListeners() {
    window.addEventListener(
      "doomscroll-detected",
      this.handleDoomscrollDetected
    );
    window.addEventListener(
      "doomscroll-animation-complete",
      this.handleAnimationComplete
    );
    window.addEventListener(
      "transition-screen-complete",
      this.handleTransitionComplete
    );
    window.addEventListener("time-block-removed", this.handleTimeBlockRemoved);
  }

  /**
   * Check current site and determine what action to take
   */
  async checkCurrentSite() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    try {
      // Check if site is in blocked list
      const isBlocked = await StorageHelper.isCurrentSiteBlocked(url, hostname);

      if (!isBlocked) {
        this.cleanup();
        return;
      }

      // Check if site is currently time-blocked
      const isTimeBlocked = await TimeManager.isTimeBlocked(hostname);

      if (isTimeBlocked) {
        this.showBlockingScreen();
      } else {
        this.startDoomscrollDetection();
      }
    } catch (error) {
      console.error("Error checking current site:", error);
    }
  }

  /**
   * Start doomscroll detection for current site
   */
  startDoomscrollDetection() {
    if (this.doomscrollDetector && this.doomscrollDetector.isActive()) {
      return; // Already active
    }

    this.doomscrollDetector = new DoomscrollDetector({
      scrollLimit: 4000, // Can be made configurable
      swipeLimit: 15, // Number of swipes for YouTube Shorts/TikTok
    });

    this.doomscrollDetector.initialize();
  }

  /**
   * Handle doomscroll detection event
   */
  async handleDoomscrollDetected(event) {

    try {
      // Create time block immediately
      await TimeManager.createTimeBlock(this.currentHostname);

      // Start warning animation
      this.doomscrollAnimation = new DoomscrollAnimation({
        flashInterval: 400,
        screenDecayTime: 7,
      });

      await this.doomscrollAnimation.startAnimation();
    } catch (error) {
      console.error("Error handling doomscroll detection:", error);
    }
  }

  /**
   * Handle animation completion event
   */
  handleAnimationComplete(event) {

    // Show transition screen
    this.transitionScreen = new TransitionScreen({
      transitionDuration: 3000,
    });

    this.transitionScreen.show();
  }

  /**
   * Handle transition screen completion event
   */
  handleTransitionComplete(event) {

    // Show blocking screen
    this.showBlockingScreen();
  }

  /**
   * Show the blocking screen
   */
  showBlockingScreen() {
    this.blockingScreen = new BlockingScreen({
      updateInterval: 1000,
    });

    this.blockingScreen.show();
  }

  /**
   * Handle time block removal event
   */
  handleTimeBlockRemoved(event) {
    if (event.detail.hostname === this.currentHostname) {
      window.location.reload();
    }
  }

  /**
   * Clean up all modules and event listeners
   */
  cleanup() {
    // Clean up modules
    if (this.doomscrollDetector) {
      this.doomscrollDetector.destroy();
      this.doomscrollDetector = null;
    }

    if (this.doomscrollAnimation) {
      this.doomscrollAnimation.cleanup();
      this.doomscrollAnimation = null;
    }

    if (this.transitionScreen) {
      this.transitionScreen.cleanup();
      this.transitionScreen = null;
    }

    if (this.blockingScreen) {
      this.blockingScreen.cleanup();
      this.blockingScreen = null;
    }

    if (this.timerTracker) {
      this.timerTracker.cleanup();
      this.timerTracker = null;
    }

    // Remove event listeners
    window.removeEventListener(
      "doomscroll-detected",
      this.handleDoomscrollDetected
    );
    window.removeEventListener(
      "doomscroll-animation-complete",
      this.handleAnimationComplete
    );
    window.removeEventListener(
      "transition-screen-complete",
      this.handleTransitionComplete
    );
    window.removeEventListener(
      "time-block-removed",
      this.handleTimeBlockRemoved
    );

    this.isInitialized = false;
  }

  /**
   * Handle messages from background script
   */
  handleMessage(message, sender, sendResponse) {
    if (message.action === "checkBlockedSite") {
      this.checkCurrentSite().then(() => {
        if (sendResponse) {
          sendResponse({ success: true });
        }
      });
      return true; // Indicates async response
    }
  }
}

// Create global coordinator instance
const scrollStopCoordinator = new ScrollStopCoordinator();

// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return scrollStopCoordinator.handleMessage(message, sender, sendResponse);
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    scrollStopCoordinator.initialize();
  });
} else {
  // DOM already loaded
  scrollStopCoordinator.initialize();
}

// Also initialize immediately for faster response
scrollStopCoordinator.initialize();
