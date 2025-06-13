// modules/grayscale-filter/grayscale-filter.js
// Module for applying grayscale filter to social media and news sites after 5 minutes

class GrayscaleFilter {
  constructor(options = {}) {
    this.config = {
      TIME_LIMIT: options.timeLimit || 5 * 60 * 1000, // 5 minutes in milliseconds
      FILTER_DURATION: options.filterDuration || 60 * 60 * 1000, // 1 hour in milliseconds
      ...options,
    };

    this.filterActive = false;
    this.timeTrackingStarted = false;
    this.sessionStartTime = null;
    this.checkInterval = null;
    this.isActive = false;
    this.currentSiteType = null;

    // Storage keys
    this.STORAGE_KEYS = {
      FIRST_VISIT_TIME: 'scrollstop_first_social_news_visit',
      FILTER_END_TIME: 'scrollstop_grayscale_filter_end',
      TOTAL_TIME_SPENT: 'scrollstop_total_social_news_time',
      LAST_RESET_DATE: 'scrollstop_grayscale_last_reset',
    };

    // Cross-browser storage wrapper
    this.storage = {
      async get(keys) {
        try {
          if (typeof browser !== 'undefined' && browser.storage) {
            return await browser.storage.local.get(keys);
          } else if (typeof chrome !== 'undefined' && chrome.storage) {
            return await chrome.storage.local.get(keys);
          } else {
            const result = {};
            for (const key of keys) {
              const value = localStorage.getItem(key);
              if (value !== null) {
                try {
                  result[key] = JSON.parse(value);
                } catch {
                  result[key] = value;
                }
              }
            }
            return result;
          }
        } catch (error) {
          console.error('GrayscaleFilter: Storage get error:', error);
          return {};
        }
      },

      async set(data) {
        try {
          if (typeof browser !== 'undefined' && browser.storage) {
            return await browser.storage.local.set(data);
          } else if (typeof chrome !== 'undefined' && chrome.storage) {
            return await chrome.storage.local.set(data);
          } else {
            for (const [key, value] of Object.entries(data)) {
              localStorage.setItem(key, JSON.stringify(value));
            }
            return Promise.resolve();
          }
        } catch (error) {
          console.error('GrayscaleFilter: Storage set error:', error);
          return Promise.reject(error);
        }
      },
    };

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    this.checkTimeLimit = this.checkTimeLimit.bind(this);
  }

  /**
   * Initialize the grayscale filter system
   * @param {Object} siteType - Current site type info
   */
  async initialize(siteType) {
    if (this.isActive) {
      return;
    }

    this.currentSiteType = siteType;
    this.isActive = true;

    console.log('GrayscaleFilter: Initializing for site type:', siteType);

    try {
      // Check daily reset
      await this.checkDailyReset();

      // Check if filter should already be active
      const existingFilterEndTime = await this.getFilterEndTime();
      if (existingFilterEndTime && Date.now() < existingFilterEndTime) {
        console.log('GrayscaleFilter: Filter already active from previous session');
        this.applyGrayscaleFilter();
        return;
      }

      // Only track time for social media and news sites
      if (siteType.isBlocked || siteType.isNews) {
        await this.startTimeTracking();
        this.setupEventListeners();
      } else {
        console.log('GrayscaleFilter: Not a tracked site type, skipping');
      }
    } catch (error) {
      console.error('GrayscaleFilter: Error during initialization:', error);
    }
  }

  /**
   * Check if we need to reset tracking for a new day
   */
  async checkDailyReset() {
    try {
      const today = new Date().toDateString();
      const result = await this.storage.get([this.STORAGE_KEYS.LAST_RESET_DATE]);
      const lastResetDate = result[this.STORAGE_KEYS.LAST_RESET_DATE];

      if (lastResetDate !== today) {
        // New day - reset all tracking
        console.log('GrayscaleFilter: New day - resetting all tracking');
        await this.storage.set({
          [this.STORAGE_KEYS.FIRST_VISIT_TIME]: null,
          [this.STORAGE_KEYS.FILTER_END_TIME]: null,
          [this.STORAGE_KEYS.TOTAL_TIME_SPENT]: 0,
          [this.STORAGE_KEYS.LAST_RESET_DATE]: today,
        });
      }
    } catch (error) {
      console.error('GrayscaleFilter: Error checking daily reset:', error);
    }
  }

  /**
   * Start tracking time spent on social/news sites
   */
  async startTimeTracking() {
    try {
      this.sessionStartTime = Date.now();
      this.timeTrackingStarted = true;

      // Record first visit time if not already set
      const result = await this.storage.get([this.STORAGE_KEYS.FIRST_VISIT_TIME]);
      if (!result[this.STORAGE_KEYS.FIRST_VISIT_TIME]) {
        await this.storage.set({
          [this.STORAGE_KEYS.FIRST_VISIT_TIME]: this.sessionStartTime,
        });
        console.log('GrayscaleFilter: First social/news visit recorded');
      }

      // Start checking time limit every 30 seconds
      this.checkInterval = setInterval(this.checkTimeLimit, 30000);

      // Check immediately
      await this.checkTimeLimit();

      console.log('GrayscaleFilter: Time tracking started');
    } catch (error) {
      console.error('GrayscaleFilter: Error starting time tracking:', error);
    }
  }

  /**
   * Check if time limit has been exceeded
   */
  async checkTimeLimit() {
    try {
      // Get total time spent across all social/news sites
      const result = await this.storage.get([
        this.STORAGE_KEYS.FIRST_VISIT_TIME,
        this.STORAGE_KEYS.TOTAL_TIME_SPENT,
        this.STORAGE_KEYS.FILTER_END_TIME,
      ]);

      const firstVisitTime = result[this.STORAGE_KEYS.FIRST_VISIT_TIME];
      const totalTimeSpent = result[this.STORAGE_KEYS.TOTAL_TIME_SPENT] || 0;
      const filterEndTime = result[this.STORAGE_KEYS.FILTER_END_TIME];

      // If filter is already active and hasn't expired, don't check further
      if (filterEndTime && Date.now() < filterEndTime) {
        if (!this.filterActive) {
          this.applyGrayscaleFilter();
        }
        return;
      }

      if (!firstVisitTime) {
        return;
      }

      // Calculate current session time
      const currentSessionTime = this.sessionStartTime ? Date.now() - this.sessionStartTime : 0;

      // Total time = previously stored time + current session time
      const totalTimeIncludingCurrent = totalTimeSpent + currentSessionTime;

      console.log(
        'GrayscaleFilter: Total time spent on social/news sites:',
        Math.round(totalTimeIncludingCurrent / 1000),
        'seconds'
      );

      // Check if 5-minute limit exceeded
      if (totalTimeIncludingCurrent >= this.config.TIME_LIMIT) {
        console.log('GrayscaleFilter: 5-minute limit exceeded! Applying grayscale filter');
        await this.activateGrayscaleFilter();
      }
    } catch (error) {
      console.error('GrayscaleFilter: Error checking time limit:', error);
    }
  }

  /**
   * Activate grayscale filter for 1 hour
   */
  async activateGrayscaleFilter() {
    try {
      const now = Date.now();
      const filterEndTime = now + this.config.FILTER_DURATION;

      // Save current session time before activating filter
      await this.saveCurrentSessionTime();

      // Set filter end time
      await this.storage.set({
        [this.STORAGE_KEYS.FILTER_END_TIME]: filterEndTime,
      });

      // Apply the grayscale filter
      this.applyGrayscaleFilter();

      console.log('GrayscaleFilter: Grayscale filter activated for 1 hour');

      // Dispatch event for other modules
      window.dispatchEvent(
        new CustomEvent('grayscale-filter-activated', {
          detail: {
            endTime: filterEndTime,
            duration: this.config.FILTER_DURATION,
          },
        })
      );
    } catch (error) {
      console.error('GrayscaleFilter: Error activating grayscale filter:', error);
    }
  }

  /**
   * Apply grayscale CSS filter to the page
   */
  applyGrayscaleFilter() {
    if (this.filterActive) {
      return;
    }

    try {
      console.log('GrayscaleFilter: Applying grayscale filter to page');

      // Create or update style element
      let styleElement = document.getElementById('scrollstop-grayscale-filter');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'scrollstop-grayscale-filter';
        document.head.appendChild(styleElement);
      }

      // Apply grayscale filter to entire page
      styleElement.textContent = `
        html {
          filter: grayscale(100%) !important;
          -webkit-filter: grayscale(100%) !important;
        }
        
        /* Ensure filter applies to all content */
        body, body * {
          filter: inherit !important;
          -webkit-filter: inherit !important;
        }
        
        /* Add a subtle notification */
        body::before {
          content: "🔄 Grayscale mode active for excessive social media usage" !important;
          position: fixed !important;
          top: 10px !important;
          right: 10px !important;
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          opacity: 0.7 !important;
        }
      `;

      this.filterActive = true;

      // Check periodically if filter should be removed
      this.startFilterExpirationCheck();
    } catch (error) {
      console.error('GrayscaleFilter: Error applying grayscale filter:', error);
    }
  }

  /**
   * Start checking for filter expiration
   */
  startFilterExpirationCheck() {
    // Check every minute if filter should be removed
    const expirationCheck = setInterval(async () => {
      try {
        const filterEndTime = await this.getFilterEndTime();
        if (!filterEndTime || Date.now() >= filterEndTime) {
          this.removeGrayscaleFilter();
          clearInterval(expirationCheck);

          // Dispatch event
          window.dispatchEvent(
            new CustomEvent('grayscale-filter-expired', {
              detail: {},
            })
          );
        }
      } catch (error) {
        console.error('GrayscaleFilter: Error checking filter expiration:', error);
      }
    }, 60000); // Check every minute
  }

  /**
   * Remove grayscale filter from the page
   */
  removeGrayscaleFilter() {
    try {
      console.log('GrayscaleFilter: Removing grayscale filter');

      const styleElement = document.getElementById('scrollstop-grayscale-filter');
      if (styleElement) {
        styleElement.remove();
      }

      this.filterActive = false;
    } catch (error) {
      console.error('GrayscaleFilter: Error removing grayscale filter:', error);
    }
  }

  /**
   * Get filter end time from storage
   */
  async getFilterEndTime() {
    try {
      const result = await this.storage.get([this.STORAGE_KEYS.FILTER_END_TIME]);
      return result[this.STORAGE_KEYS.FILTER_END_TIME];
    } catch (error) {
      console.error('GrayscaleFilter: Error getting filter end time:', error);
      return null;
    }
  }

  /**
   * Save current session time to storage
   */
  async saveCurrentSessionTime() {
    if (!this.sessionStartTime) {
      return;
    }

    try {
      const sessionTime = Date.now() - this.sessionStartTime;
      const result = await this.storage.get([this.STORAGE_KEYS.TOTAL_TIME_SPENT]);
      const currentTotal = result[this.STORAGE_KEYS.TOTAL_TIME_SPENT] || 0;

      await this.storage.set({
        [this.STORAGE_KEYS.TOTAL_TIME_SPENT]: currentTotal + sessionTime,
      });

      // Reset session start time
      this.sessionStartTime = Date.now();
    } catch (error) {
      console.error('GrayscaleFilter: Error saving session time:', error);
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Handle tab visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Tab hidden - save current session time
      this.saveCurrentSessionTime();
    } else {
      // Tab visible - restart session tracking
      this.sessionStartTime = Date.now();
    }
  }

  /**
   * Handle page unload
   */
  async handleBeforeUnload() {
    await this.saveCurrentSessionTime();
  }

  /**
   * Clean up the grayscale filter system
   */
  cleanup() {
    console.log('GrayscaleFilter: Cleaning up');

    this.isActive = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Save current session before cleanup
    if (this.timeTrackingStarted) {
      this.saveCurrentSessionTime();
    }

    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    // Note: Don't remove grayscale filter on cleanup as it should persist across page loads
    this.timeTrackingStarted = false;
    this.sessionStartTime = null;
  }

  /**
   * Check if filter is currently active
   * @returns {boolean} True if grayscale filter is active
   */
  isFilterActive() {
    return this.filterActive;
  }

  /**
   * Get remaining time before filter activation
   * @returns {Promise<number>} Time in milliseconds, or 0 if limit exceeded
   */
  async getRemainingTime() {
    try {
      const result = await this.storage.get([
        this.STORAGE_KEYS.TOTAL_TIME_SPENT,
        this.STORAGE_KEYS.FILTER_END_TIME,
      ]);

      const filterEndTime = result[this.STORAGE_KEYS.FILTER_END_TIME];
      if (filterEndTime && Date.now() < filterEndTime) {
        return 0; // Filter already active
      }

      const totalTimeSpent = result[this.STORAGE_KEYS.TOTAL_TIME_SPENT] || 0;
      const currentSessionTime = this.sessionStartTime ? Date.now() - this.sessionStartTime : 0;

      const totalTime = totalTimeSpent + currentSessionTime;
      return Math.max(0, this.config.TIME_LIMIT - totalTime);
    } catch (error) {
      console.error('GrayscaleFilter: Error getting remaining time:', error);
      return 0;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GrayscaleFilter;
} else {
  window.GrayscaleFilter = GrayscaleFilter;
}
