if (typeof window.TimeManager === "undefined") {
  class TimeManager {
    static BLOCK_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds

    /**
     * Check if a site is currently time-blocked
     * @param {string} hostname - The hostname to check
     * @returns {Promise<boolean>} True if site is currently blocked
     */
    static async isTimeBlocked(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const blockInfo = timeBlocks[hostname];

      if (!blockInfo) {
        return false;
      }

      const now = Date.now();
      const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

      if (timeRemaining > 0) {
        return true;
      } else {
        // Block expired, remove it
        await this.removeTimeBlock(hostname);
        return false;
      }
    }

    /**
     * Create a new time block for a site
     * @param {string} hostname - The hostname to block
     * @returns {Promise<void>}
     */
    static async createTimeBlock(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();

      timeBlocks[hostname] = {
        timestamp: Date.now(),
        siteName: hostname,
      };

      await StorageHelper.setTimeBlocks(timeBlocks);

      // Dispatch event for other modules to listen to
      window.dispatchEvent(
        new CustomEvent("time-block-created", {
          detail: { hostname, timestamp: timeBlocks[hostname].timestamp },
        })
      );
    }

    /**
     * Remove a time block (when expired or manually cleared)
     * @param {string} hostname - The hostname to unblock
     * @returns {Promise<void>}
     */
    static async removeTimeBlock(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();

      if (timeBlocks[hostname]) {
        delete timeBlocks[hostname];
        await StorageHelper.setTimeBlocks(timeBlocks);

        // Dispatch event for other modules to listen to
        window.dispatchEvent(
          new CustomEvent("time-block-removed", {
            detail: { hostname },
          })
        );
      }
    }

    /**
     * Get remaining time for a blocked site
     * @param {string} hostname - The hostname to check
     * @returns {Promise<number>} Remaining time in milliseconds, or 0 if not blocked
     */
    static async getRemainingTime(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const blockInfo = timeBlocks[hostname];

      if (!blockInfo) {
        return 0;
      }

      const now = Date.now();
      const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

      return Math.max(0, timeRemaining);
    }

    /**
     * Format remaining time as MM:SS string
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    static formatTime(milliseconds) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    /**
     * Clean up all expired time blocks
     * @returns {Promise<void>}
     */
    static async cleanupExpiredBlocks() {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const now = Date.now();
      let hasChanges = false;

      for (const [hostname, blockInfo] of Object.entries(timeBlocks)) {
        const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

        if (timeRemaining <= 0) {
          delete timeBlocks[hostname];
          hasChanges = true;

          // Dispatch event for each removed block
          window.dispatchEvent(
            new CustomEvent("time-block-removed", {
              detail: { hostname },
            })
          );
        }
      }

      if (hasChanges) {
        await StorageHelper.setTimeBlocks(timeBlocks);
      }
    }
  }
  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TimeManager;
  } else {
    window.TimeManager = TimeManager;
  }
}
