// content.js - Main coordinator for ScrollStop extension modules
// This file orchestrates the interaction between all modules

class ScrollStopCoordinator {
  constructor() {
    this.doomscrollDetector = null;
    this.doomscrollAnimation = null;
    this.transitionScreen = null;
    this.blockingScreen = null;
    this.timerTracker = null;
    this.choiceDialog = null;
    this.periodicReminder = null;
    this.grayscaleFilter = null;

    this.isInitialized = false;
    this.currentHostname = window.location.hostname;
    this.userChoice = null; // 'continue', 'timer-only', 'block'

    // Bind event handlers
    this.handleDoomscrollDetected = this.handleDoomscrollDetected.bind(this);
    this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
    this.handleTransitionComplete = this.handleTransitionComplete.bind(this);
    this.handleTimeBlockRemoved = this.handleTimeBlockRemoved.bind(this);
    this.handleChoiceComplete = this.handleChoiceComplete.bind(this);
    this.handleNewsTimeLimitExceeded = this.handleNewsTimeLimitExceeded.bind(this);
  }

  /**
   * Initialize the coordinator and set up event listeners
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('ScrollStop: Already initialized, skipping');
      return;
    }

    console.log('ScrollStop: Starting initialization...');
    this.isInitialized = true; // Set immediately to prevent race conditions

    try {
      // Set up event listeners for module communication
      this.setupEventListeners();

      // Check if current site should be monitored FIRST (shows choice dialog)
      await this.checkCurrentSite();

      console.log('ScrollStop: Initialization completed successfully');
    } catch (error) {
      console.error('Error initializing ScrollStop coordinator:', error);
      this.isInitialized = false; // Reset on failure
    }
  }

  /**
   * Initialize timer tracker for all tracked sites (social media and news)
   */
  async initializeTimerTracker() {
    try {
      // Check if current site is tracked (either blocked or news site)
      const url = window.location.href;
      const hostname = window.location.hostname;
      const siteType = await StorageHelper.getCurrentSiteType(url, hostname);

      if (siteType.isBlocked || siteType.isNews || siteType.isAdult) {
        this.timerTracker = new TimerTracker();
        await this.timerTracker.initialize(siteType.isNews);
      }
    } catch (error) {
      console.error('Error initializing timer tracker:', error);
    }
  }

  /**
   * Set up event listeners for inter-module communication
   */
  setupEventListeners() {
    window.addEventListener('doomscroll-detected', this.handleDoomscrollDetected);
    window.addEventListener('doomscroll-animation-complete', this.handleAnimationComplete);
    window.addEventListener('transition-screen-complete', this.handleTransitionComplete);
    window.addEventListener('time-block-removed', this.handleTimeBlockRemoved);
    window.addEventListener('choice-dialog-complete', this.handleChoiceComplete);
    window.addEventListener('news-time-limit-exceeded', this.handleNewsTimeLimitExceeded);
  }

  /**
   * Check current site and determine what action to take
   */
  async checkCurrentSite() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    try {
      console.log('ScrollStop: Checking current site:', hostname);

      // Check if site is blocked or news site
      const siteType = await StorageHelper.getCurrentSiteType(url, hostname);
      console.log('ScrollStop: Site type:', siteType);

      if (!siteType.isBlocked && !siteType.isNews && !siteType.isAdult) {
        this.cleanup();
        return;
      }

      // Store site type for later use
      this.currentSiteType = siteType;

      // Always show choice dialog on every page load (no session persistence)
      console.log('ScrollStop: No session persistence - will show choice dialog');

      // Clear any existing stored choice to ensure dialog always shows
      await ChoiceDialog.clearSessionChoice(hostname);

      // Check if site is currently time-blocked
      const isTimeBlocked = await TimeManager.isTimeBlocked(hostname);
      console.log('ScrollStop: Site is time-blocked:', isTimeBlocked);

      // For news sites, also check news-specific time block
      let isNewsTimeBlocked = false;
      if (siteType.isNews) {
        isNewsTimeBlocked = await TimeManager.isNewsTimeBlocked();
        console.log('ScrollStop: News sites time-blocked:', isNewsTimeBlocked);
      }

      if (isTimeBlocked || isNewsTimeBlocked) {
        this.showBlockingScreen();
      } else {
        // Show choice dialog before proceeding
        console.log('ScrollStop: Showing choice dialog');
        this.showChoiceDialog();
      }
    } catch (error) {
      console.error('Error checking current site:', error);
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
  async handleDoomscrollDetected(_event) {
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
      console.error('Error handling doomscroll detection:', error);
    }
  }

  /**
   * Handle animation completion event
   */
  handleAnimationComplete(_event) {
    // Show transition screen
    this.transitionScreen = new TransitionScreen({
      transitionDuration: 3000,
    });

    this.transitionScreen.show();
  }

  /**
   * Handle transition screen completion event
   */
  handleTransitionComplete(_event) {
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
   * Handle news time limit exceeded event
   */
  async handleNewsTimeLimitExceeded(_event) {
    console.log('ScrollStop: News time limit exceeded');

    // Show blocking screen for news sites
    this.showBlockingScreen();
  }

  /**
   * Show choice dialog to user
   */
  showChoiceDialog() {
    // Prevent showing dialog multiple times
    if (this.choiceDialog && this.choiceDialog.isShown) {
      console.log('ScrollStop: Choice dialog already shown, skipping');
      return;
    }

    try {
      console.log('ScrollStop: Creating choice dialog for:', this.currentHostname);

      this.choiceDialog = new ChoiceDialog({
        siteTitle: this.currentHostname,
        onChoiceMade: (choice) => {
          console.log('ScrollStop: User chose:', choice);
          this.userChoice = choice;
          this.proceedWithChoice(choice);
        },
      });

      console.log('ScrollStop: Showing choice dialog');
      this.choiceDialog.show();
    } catch (error) {
      console.error('ScrollStop: Error showing choice dialog:', error);
      // Fallback to continue mode if dialog fails
      this.proceedWithChoice('continue');
    }
  }

  /**
   * Handle choice dialog completion
   */
  handleChoiceComplete(event) {
    const choice = event.detail.choice;
    this.userChoice = choice;
    this.proceedWithChoice(choice);
  }

  /**
   * Proceed based on user's choice
   */
  async proceedWithChoice(choice) {
    switch (choice) {
      case 'continue':
        // Full ScrollStop functionality - initialize timer then start detection
        await this.initializeTimerTracker();
        // Only start doomscroll detection for blocked sites, not news sites
        if (this.currentSiteType && this.currentSiteType.isBlocked) {
          this.startDoomscrollDetection();
        }
        break;

      case 'timer-only':
        // Only show timer, no blocking
        await this.initializeTimerOnly();
        break;

      case 'block':
        // Initialize timer first, then immediately block the site
        await this.initializeTimerTracker();
        if (this.currentSiteType && this.currentSiteType.isNews) {
          // For news sites, create news time block
          await TimeManager.createNewsTimeBlock();
        } else {
          // For social media sites, create regular time block
          await TimeManager.createTimeBlock(this.currentHostname);
        }
        this.showBlockingScreen();
        break;

      default:
        console.warn('Unknown choice:', choice);
        // Default to continue
        await this.initializeTimerTracker();
        if (this.currentSiteType && this.currentSiteType.isBlocked) {
          this.startDoomscrollDetection();
        }
        break;
    }

    // Start periodic reminder for all choices (except when immediately blocked)
    if (choice !== 'block') {
      this.startPeriodicReminder();
    }

    // Start grayscale filter tracking for all choices (except when immediately blocked)
    if (choice !== 'block') {
      this.startGrayscaleFilter();
    }
  }

  /**
   * Initialize timer-only mode
   */
  async initializeTimerOnly() {
    try {
      // Initialize timer but not doomscroll detection
      if (!this.timerTracker) {
        this.timerTracker = new TimerTracker();
        await this.timerTracker.initialize();
      }

      // Set timer to timer-only mode to prevent hiding
      if (this.timerTracker.setTimerOnlyMode) {
        this.timerTracker.setTimerOnlyMode(true);
      }
    } catch (error) {
      console.error('Error initializing timer-only mode:', error);
    }
  }

  /**
   * Start periodic reminder system (5-minute intervals)
   */
  startPeriodicReminder() {
    try {
      console.log('ScrollStop: Starting periodic reminder system');

      if (!this.periodicReminder) {
        this.periodicReminder = new window.PeriodicReminder({
          reminderInterval: 5 * 60 * 1000, // 5 minutes
        });
      }

      this.periodicReminder.initialize(this.currentSiteType, this);
    } catch (error) {
      console.error('Error starting periodic reminder:', error);
    }
  }

  /**
   * Start grayscale filter system (5-minute limit, 1-hour filter)
   */
  startGrayscaleFilter() {
    try {
      console.log('ScrollStop: Starting grayscale filter tracking');

      if (!this.grayscaleFilter) {
        this.grayscaleFilter = new window.GrayscaleFilter({
          timeLimit: 5 * 60 * 1000, // 5 minutes
          filterDuration: 60 * 60 * 1000, // 1 hour
        });
      }

      this.grayscaleFilter.initialize(this.currentSiteType);
    } catch (error) {
      console.error('Error starting grayscale filter:', error);
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

    if (this.choiceDialog) {
      this.choiceDialog.cleanup();
      this.choiceDialog = null;
    }

    if (this.periodicReminder) {
      this.periodicReminder.cleanup();
      this.periodicReminder = null;
    }

    if (this.grayscaleFilter) {
      this.grayscaleFilter.cleanup();
      this.grayscaleFilter = null;
    }

    // Remove event listeners
    window.removeEventListener('doomscroll-detected', this.handleDoomscrollDetected);
    window.removeEventListener('doomscroll-animation-complete', this.handleAnimationComplete);
    window.removeEventListener('transition-screen-complete', this.handleTransitionComplete);
    window.removeEventListener('time-block-removed', this.handleTimeBlockRemoved);
    window.removeEventListener('choice-dialog-complete', this.handleChoiceComplete);
    window.removeEventListener('news-time-limit-exceeded', this.handleNewsTimeLimitExceeded);

    this.isInitialized = false;
  }

  /**
   * Handle messages from background script
   */
  handleMessage(message, sender, sendResponse) {
    if (message.action === 'checkBlockedSite') {
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

// Initialize when DOM is ready (single initialization point)
function initializeScrollStop() {
  console.log('ScrollStop: Attempting initialization, readyState:', document.readyState);
  scrollStopCoordinator.initialize();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScrollStop);
} else {
  // DOM already loaded, initialize immediately
  initializeScrollStop();
}
