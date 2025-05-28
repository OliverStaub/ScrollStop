// modules/blocking-screen/blocking-screen.js
// Module for showing the full blocking screen with countdown

if (typeof window.BlockingScreen === "undefined") {
  class BlockingScreen {
    constructor(config = {}) {
      this.config = {
        UPDATE_INTERVAL: config.updateInterval || 1000, // Update countdown every second
        ...config,
      };

      this.blockingElement = null;
      this.countdownInterval = null;
      this.hostname = window.location.hostname;
    }

    /**
     * Show the blocking screen
     */
    async show() {
      try {
        // Clear existing content
        this.clearPageContent();

        // Create blocking screen
        this.createBlockingElement();

        // Start countdown updates
        this.startCountdownUpdates();
      } catch (error) {
        console.error("Error showing blocking screen:", error);
        this.cleanup();
      }
    }

    /**
     * Clear all existing page content
     */
    clearPageContent() {
      document.body.innerHTML = "";
    }

    /**
     * Create the blocking screen element
     */
    createBlockingElement() {
      this.blockingElement = document.createElement("div");
      this.blockingElement.id = "time-block-screen";
      this.blockingElement.className = "blocking-screen";

      this.applyBlockingStyles();
      this.updateBlockingContent();

      document.body.appendChild(this.blockingElement);
    }

    /**
     * Apply styles to blocking screen element
     */
    applyBlockingStyles() {
      if (!this.blockingElement) return;

      this.blockingElement.style.cssText = `
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        text-align: center;
        padding: 2rem;
        box-sizing: border-box;
      `;
    }

    /**
     * Update blocking screen content
     */
    updateBlockingContent() {
      if (!this.blockingElement) return;

      this.blockingElement.innerHTML = `
        <div style="max-width: 600px; width: 100%;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🌱</div>
          <h1 style="font-size: 3rem; margin: 0 0 1rem 0; font-weight: 700;">
            Time to Touch Grass!
          </h1>
          <p style="font-size: 1.5rem; margin: 0 0 2rem 0; opacity: 0.9; line-height: 1.4;">
            You've been scrolling too much. This site is blocked for 60 minutes.
          </p>
          
          <div id="countdown-display" style="
            background: rgba(255, 255, 255, 0.2);
            padding: 1.5rem;
            border-radius: 15px;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          ">
            <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;" id="time-remaining">
              Loading...
            </div>
            <div style="font-size: 1.2rem; opacity: 0.8;">
              until you can access this site again
            </div>
          </div>
          
          ${this.getSuggestionsHTML()}
        </div>
      `;
    }

    /**
     * Get HTML for activity suggestions
     * @returns {string} HTML for suggestions section
     */
    getSuggestionsHTML() {
      const suggestions = [
        { emoji: "🚶‍♂️", text: "Take a walk outside" },
        { emoji: "📚", text: "Read a book" },
        { emoji: "🧘‍♀️", text: "Meditate" },
        { emoji: "💪", text: "Exercise" },
        { emoji: "👥", text: "Call a friend" },
        { emoji: "🎨", text: "Be creative" },
      ];

      const suggestionsGrid = suggestions
        .map(
          (suggestion) => `
        <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">${suggestion.emoji}</div>
          <div>${suggestion.text}</div>
        </div>
      `
        )
        .join("");

      return `
        <div style="margin-top: 2rem;">
          <p style="font-size: 1.1rem; margin: 1rem 0; opacity: 0.8;">
            Here are some better things you could be doing:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            ${suggestionsGrid}
          </div>
        </div>
      `;
    }

    /**
     * Start countdown updates
     */
    startCountdownUpdates() {
      // Update immediately
      this.updateCountdown();

      // Then update every second
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, this.config.UPDATE_INTERVAL);
    }

    /**
     * Update the countdown display
     */
    async updateCountdown() {
      try {
        const remainingTime = await TimeManager.getRemainingTime(this.hostname);

        if (remainingTime <= 0) {
          // Time's up! Remove block and reload
          await TimeManager.removeTimeBlock(this.hostname);
          window.location.reload();
          return;
        }

        // Update display
        const timeDisplay = TimeManager.formatTime(remainingTime);
        const countdownElement = document.getElementById("time-remaining");

        if (countdownElement) {
          countdownElement.textContent = timeDisplay;
        }
      } catch (error) {
        console.error("Error updating countdown:", error);
      }
    }

    /**
     * Stop countdown updates
     */
    stopCountdownUpdates() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }

    /**
     * Clean up the blocking screen
     */
    cleanup() {
      this.stopCountdownUpdates();

      if (this.blockingElement && this.blockingElement.parentNode) {
        this.blockingElement.parentNode.removeChild(this.blockingElement);
        this.blockingElement = null;
      }
    }

    /**
     * Check if blocking screen is currently showing
     * @returns {boolean} True if blocking screen is active
     */
    isActive() {
      return this.countdownInterval !== null;
    }

    /**
     * Update the blocked site name in display
     * @param {string} siteName - Name of the blocked site
     */
    updateSiteName(siteName) {
      if (!this.blockingElement) return;

      const titleElement = this.blockingElement.querySelector("p");
      if (titleElement) {
        titleElement.textContent = `You've been scrolling too much on ${siteName}. This site is blocked for 60 minutes.`;
      }
    }

    /**
     * Force refresh the countdown (useful for testing)
     */
    refreshCountdown() {
      this.updateCountdown();
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = BlockingScreen;
  } else {
    window.BlockingScreen = BlockingScreen;
  }
}
