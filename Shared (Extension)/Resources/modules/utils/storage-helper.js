if (typeof window.StorageHelper === "undefined") {
  class StorageHelper {
    /**
     * Get blocked sites from storage
     * @returns {Promise<string[]>} Array of blocked site domains
     */
    static async getBlockedSites() {
      return new Promise((resolve) => {
        browser.storage.local.get(["blockedSites"], (result) => {
          resolve(result.blockedSites || []);
        });
      });
    }

    /**
     * Set blocked sites in storage
     * @param {string[]} sites - Array of site domains to block
     * @returns {Promise<void>}
     */
    static async setBlockedSites(sites) {
      return new Promise((resolve) => {
        browser.storage.local.set({ blockedSites: sites }, () => {
          resolve();
        });
      });
    }

    /**
     * Get time blocks from storage
     * @returns {Promise<Object>} Object with hostname keys and block info values
     */
    static async getTimeBlocks() {
      return new Promise((resolve) => {
        browser.storage.local.get(["timeBlocks"], (result) => {
          resolve(result.timeBlocks || {});
        });
      });
    }

    /**
     * Set time blocks in storage
     * @param {Object} timeBlocks - Object with hostname keys and block info values
     * @returns {Promise<void>}
     */
    static async setTimeBlocks(timeBlocks) {
      return new Promise((resolve) => {
        browser.storage.local.set({ timeBlocks }, () => {
          resolve();
        });
      });
    }

    /**
     * Get news sites from storage
     * @returns {Promise<string[]>} Array of news site domains
     */
    static async getNewsSites() {
      return new Promise((resolve) => {
        browser.storage.local.get(["newsSites"], (result) => {
          resolve(result.newsSites || []);
        });
      });
    }

    /**
     * Set news sites in storage
     * @param {string[]} sites - Array of news site domains
     * @returns {Promise<void>}
     */
    static async setNewsSites(sites) {
      return new Promise((resolve) => {
        browser.storage.local.set({ newsSites: sites }, () => {
          resolve();
        });
      });
    }

    /**
     * Check if current site is in blocked sites list
     * @param {string} url - Current page URL
     * @param {string} hostname - Current page hostname
     * @returns {Promise<boolean>} True if site should be blocked
     */
    static async isCurrentSiteBlocked(url, hostname) {
      const blockedSites = await this.getBlockedSites();

      return blockedSites.some((site) => {
        const cleanSite = site.replace(/^https?:\/\//, "");
        return url.includes(cleanSite) || hostname.includes(cleanSite);
      });
    }

    /**
     * Check if current site is a news site
     * @param {string} url - Current page URL
     * @param {string} hostname - Current page hostname
     * @returns {Promise<boolean>} True if site is a news site
     */
    static async isCurrentSiteNews(url, hostname) {
      const newsSites = await this.getNewsSites();

      return newsSites.some((site) => {
        const cleanSite = site.replace(/^https?:\/\//, "");
        return url.includes(cleanSite) || hostname.includes(cleanSite);
      });
    }

    /**
     * Check if current site is either blocked or news site
     * @param {string} url - Current page URL
     * @param {string} hostname - Current page hostname
     * @returns {Promise<{isBlocked: boolean, isNews: boolean}>} Site type info
     */
    static async getCurrentSiteType(url, hostname) {
      const [isBlocked, isNews] = await Promise.all([
        this.isCurrentSiteBlocked(url, hostname),
        this.isCurrentSiteNews(url, hostname)
      ]);

      return { isBlocked, isNews };
    }
  }
  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = StorageHelper;
  } else {
    window.StorageHelper = StorageHelper;
  }
}
