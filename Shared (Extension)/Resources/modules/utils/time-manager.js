if (typeof window.TimeManager === "undefined") {
  class TimeManager {
    static BLOCK_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds
    static NEWS_TIME_LIMIT = 20 * 60 * 1000; // 20 minutes in milliseconds
    static NEWS_BLOCK_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds

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
     * Get or initialize news time tracking data
     * @returns {Promise<{dailyStart: number, totalTime: number, blocked: boolean, blockedUntil: number}>}
     */
    static async getNewsTimeData() {
      return new Promise((resolve) => {
        browser.storage.local.get(["newsTimeData"], (result) => {
          const today = new Date().toDateString();
          const data = result.newsTimeData || {};
          
          // Reset daily tracking if it's a new day
          if (!data.dailyStart || new Date(data.dailyStart).toDateString() !== today) {
            data.dailyStart = Date.now();
            data.totalTime = 0;
          }
          
          // Default values
          data.blocked = data.blocked || false;
          data.blockedUntil = data.blockedUntil || 0;
          
          resolve(data);
        });
      });
    }

    /**
     * Save news time tracking data
     * @param {Object} data - News time data to save
     * @returns {Promise<void>}
     */
    static async setNewsTimeData(data) {
      return new Promise((resolve) => {
        browser.storage.local.set({ newsTimeData: data }, () => {
          resolve();
        });
      });
    }

    /**
     * Check if news sites are currently blocked
     * @returns {Promise<boolean>} True if news sites are blocked
     */
    static async isNewsTimeBlocked() {
      const data = await this.getNewsTimeData();
      
      if (!data.blocked) {
        return false;
      }
      
      const now = Date.now();
      if (now >= data.blockedUntil) {
        // Block expired, remove it
        await this.removeNewsTimeBlock();
        return false;
      }
      
      return true;
    }

    /**
     * Create a news time block (block all news sites for 1 hour)
     * @returns {Promise<void>}
     */
    static async createNewsTimeBlock() {
      const data = await this.getNewsTimeData();
      const now = Date.now();
      
      data.blocked = true;
      data.blockedUntil = now + this.NEWS_BLOCK_DURATION;
      
      await this.setNewsTimeData(data);
      
      // Dispatch event for other modules to listen to
      window.dispatchEvent(
        new CustomEvent("news-time-block-created", {
          detail: { blockedUntil: data.blockedUntil },
        })
      );
    }

    /**
     * Remove news time block
     * @returns {Promise<void>}
     */
    static async removeNewsTimeBlock() {
      const data = await this.getNewsTimeData();
      
      if (data.blocked) {
        data.blocked = false;
        data.blockedUntil = 0;
        
        await this.setNewsTimeData(data);
        
        // Dispatch event for other modules to listen to
        window.dispatchEvent(
          new CustomEvent("news-time-block-removed", {
            detail: {},
          })
        );
      }
    }

    /**
     * Add time to news tracking and check if limit is exceeded
     * @param {number} timeSpent - Time in milliseconds to add
     * @returns {Promise<boolean>} True if time limit was exceeded and block was created
     */
    static async addNewsTime(timeSpent) {
      const data = await this.getNewsTimeData();
      
      data.totalTime += timeSpent;
      
      // Check if limit exceeded
      if (data.totalTime >= this.NEWS_TIME_LIMIT && !data.blocked) {
        // Create time block
        await this.createNewsTimeBlock();
        return true;
      }
      
      await this.setNewsTimeData(data);
      return false;
    }

    /**
     * Get remaining news time before block
     * @returns {Promise<number>} Remaining time in milliseconds
     */
    static async getRemainingNewsTime() {
      const data = await this.getNewsTimeData();
      return Math.max(0, this.NEWS_TIME_LIMIT - data.totalTime);
    }

    /**
     * Get remaining news block time
     * @returns {Promise<number>} Remaining block time in milliseconds, or 0 if not blocked
     */
    static async getRemainingNewsBlockTime() {
      const data = await this.getNewsTimeData();
      
      if (!data.blocked) {
        return 0;
      }
      
      const now = Date.now();
      return Math.max(0, data.blockedUntil - now);
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
      
      // Also cleanup expired news blocks
      await this.cleanupExpiredNewsBlocks();
    }

    /**
     * Clean up expired news blocks
     * @returns {Promise<void>}
     */
    static async cleanupExpiredNewsBlocks() {
      const data = await this.getNewsTimeData();
      
      if (data.blocked) {
        const now = Date.now();
        if (now >= data.blockedUntil) {
          await this.removeNewsTimeBlock();
        }
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
