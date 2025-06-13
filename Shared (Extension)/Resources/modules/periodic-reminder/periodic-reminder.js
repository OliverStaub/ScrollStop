// modules/periodic-reminder/periodic-reminder.js
// Module for showing periodic choice dialog reminders every 5 minutes

class PeriodicReminder {
  constructor(options = {}) {
    this.config = {
      REMINDER_INTERVAL: options.reminderInterval || 5 * 60 * 1000, // 5 minutes in milliseconds
      ...options,
    };

    this.reminderInterval = null;
    this.isActive = false;
    this.lastReminderTime = 0;
    this.currentSiteType = null;
    this.coordinator = null;

    // Bind methods
    this.showReminder = this.showReminder.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Initialize the periodic reminder system
   * @param {Object} siteType - Current site type info
   * @param {Object} coordinator - Reference to ScrollStop coordinator
   */
  initialize(siteType, coordinator) {
    if (this.isActive) {
      return;
    }

    this.currentSiteType = siteType;
    this.coordinator = coordinator;
    this.isActive = true;
    this.lastReminderTime = Date.now();

    console.log('PeriodicReminder: Starting 5-minute reminder system');

    // Start the periodic reminder
    this.startReminder();

    // Handle tab visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Start the reminder interval
   */
  startReminder() {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }

    this.reminderInterval = setInterval(() => {
      // Only show reminder if tab is visible
      if (!document.hidden) {
        this.showReminder();
      }
    }, this.config.REMINDER_INTERVAL);

    console.log('PeriodicReminder: Reminder interval started - every 5 minutes');
  }

  /**
   * Show the choice dialog reminder
   */
  async showReminder() {
    try {
      console.log('PeriodicReminder: Showing 5-minute reminder dialog');

      // Update last reminder time
      this.lastReminderTime = Date.now();

      // Create and show choice dialog
      const choiceDialog = new ChoiceDialog({
        siteTitle: window.location.hostname,
        onChoiceMade: (choice) => {
          console.log('PeriodicReminder: User chose:', choice);
          this.handleReminderChoice(choice);
        },
      });

      await choiceDialog.show();
    } catch (error) {
      console.error('PeriodicReminder: Error showing reminder dialog:', error);
    }
  }

  /**
   * Handle user choice from reminder dialog
   * @param {string} choice - User's choice: 'continue', 'timer-only', 'block'
   */
  async handleReminderChoice(choice) {
    console.log('PeriodicReminder: Processing reminder choice:', choice);

    switch (choice) {
      case 'continue':
        // Continue with current functionality - no change needed
        console.log('PeriodicReminder: User chose to continue - no action needed');
        break;

      case 'timer-only':
        // Switch to timer-only mode
        console.log('PeriodicReminder: Switching to timer-only mode');
        if (this.coordinator) {
          // Clean up doomscroll detection if active
          if (this.coordinator.doomscrollDetector) {
            this.coordinator.doomscrollDetector.destroy();
            this.coordinator.doomscrollDetector = null;
          }
          // Ensure timer tracker is in timer-only mode
          if (this.coordinator.timerTracker) {
            this.coordinator.timerTracker.setTimerOnlyMode(true);
          }
        }
        break;

      case 'block':
        // Block the site immediately
        console.log('PeriodicReminder: Blocking site immediately');
        if (this.coordinator) {
          if (this.currentSiteType && this.currentSiteType.isNews) {
            // For news sites, create news time block
            await TimeManager.createNewsTimeBlock();
          } else {
            // For social media sites, create regular time block
            await TimeManager.createTimeBlock(window.location.hostname);
          }
          this.coordinator.showBlockingScreen();
        }
        break;

      default:
        console.warn('PeriodicReminder: Unknown choice:', choice);
        break;
    }
  }

  /**
   * Handle tab visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Tab became hidden - pause reminders
      console.log('PeriodicReminder: Tab hidden - pausing reminders');
      if (this.reminderInterval) {
        clearInterval(this.reminderInterval);
        this.reminderInterval = null;
      }
    } else {
      // Tab became visible - resume reminders
      console.log('PeriodicReminder: Tab visible - resuming reminders');

      // Check if we need to show a reminder immediately
      const timeSinceLastReminder = Date.now() - this.lastReminderTime;
      if (timeSinceLastReminder >= this.config.REMINDER_INTERVAL) {
        // Show reminder immediately
        this.showReminder();
      }

      // Restart the interval
      this.startReminder();
    }
  }

  /**
   * Update site type (called when navigating between pages)
   * @param {Object} siteType - New site type info
   */
  updateSiteType(siteType) {
    this.currentSiteType = siteType;
  }

  /**
   * Get time until next reminder
   * @returns {number} Time in milliseconds until next reminder
   */
  getTimeUntilNextReminder() {
    const timeSinceLastReminder = Date.now() - this.lastReminderTime;
    return Math.max(0, this.config.REMINDER_INTERVAL - timeSinceLastReminder);
  }

  /**
   * Reset reminder timer (useful when user makes a manual choice)
   */
  resetReminderTimer() {
    this.lastReminderTime = Date.now();
    console.log('PeriodicReminder: Timer reset - next reminder in 5 minutes');
  }

  /**
   * Clean up the periodic reminder
   */
  cleanup() {
    console.log('PeriodicReminder: Cleaning up');

    this.isActive = false;

    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.currentSiteType = null;
    this.coordinator = null;
  }

  /**
   * Check if reminder is active
   * @returns {boolean} True if reminder system is active
   */
  isReminderActive() {
    return this.isActive;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PeriodicReminder;
} else {
  window.PeriodicReminder = PeriodicReminder;
}
