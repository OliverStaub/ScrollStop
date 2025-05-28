// modules/doomscroll-detector/doomscroll-animation.js
// Module for handling the doomscroll warning animation

if (typeof window.DoomscrollAnimation === "undefined") {
  class DoomscrollAnimation {
    constructor(config = {}) {
      this.config = {
        FLASH_INTERVAL: config.flashInterval || 400, // Warning flash interval in ms
        SCREEN_DECAY_TIME: config.screenDecayTime || 7, // Time in seconds for content to fade out
        ...config,
      };

      this.warningElement = null;
      this.flashIntervalId = null;
      this.isWarningVisible = false;
      this.originalContent = [];
    }

    /**
     * Start the doomscroll warning animation
     */
    async startAnimation() {
      try {
        // Create and show warning element
        this.createWarningElement();

        // Store reference to original content
        this.storeOriginalContent();

        // Set up fade-out transition for existing content
        this.setupContentTransition();

        // Start flashing warning
        this.startFlashing();

        // Begin fade-out process
        setTimeout(() => {
          this.fadeOutContent();
        }, 100);

        // Complete animation after decay time
        setTimeout(() => {
          this.completeAnimation();
        }, this.config.SCREEN_DECAY_TIME * 1000);
      } catch (error) {
        console.error("Error in doomscroll animation:", error);
        this.cleanup();
      }
    }

    /**
     * Create the warning overlay element
     */
    createWarningElement() {
      if (this.warningElement) {
        return; // Already created
      }

      this.warningElement = document.createElement("div");
      this.warningElement.id = "doomscroll-warning";
      this.warningElement.className = "doomscroll-warning";
      this.warningElement.textContent = "DOOMSCROLL!";

      // Apply styles
      this.applyWarningStyles();

      document.body.appendChild(this.warningElement);
    }

    /**
     * Apply styles to warning element
     */
    applyWarningStyles() {
      if (!this.warningElement) return;

      this.warningElement.style.cssText = `
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.1);
        color: #f94144;
        font-weight: bolder;
        text-align: center;
        font-size: 7vw;
        font-family: Arial, sans-serif;
        transition: opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      `;
    }

    /**
     * Store references to original page content
     */
    storeOriginalContent() {
      this.originalContent = Array.from(document.body.children).filter(
        (child) => child.id !== "doomscroll-warning"
      );
    }

    /**
     * Set up CSS transitions for content fade-out
     */
    setupContentTransition() {
      this.originalContent.forEach((child) => {
        child.style.transition = `opacity ${this.config.SCREEN_DECAY_TIME}s ease`;
      });
    }

    /**
     * Start the flashing warning animation
     */
    startFlashing() {
      this.flashIntervalId = setInterval(() => {
        this.toggleWarningVisibility();
      }, this.config.FLASH_INTERVAL);
    }

    /**
     * Toggle warning element visibility for flashing effect
     */
    toggleWarningVisibility() {
      if (!this.warningElement) return;

      if (!this.isWarningVisible) {
        this.warningElement.style.opacity = "1";
      } else {
        this.warningElement.style.opacity = "0";
      }
      this.isWarningVisible = !this.isWarningVisible;
    }

    /**
     * Fade out the original page content
     */
    fadeOutContent() {
      this.originalContent.forEach((child) => {
        child.style.opacity = "0";
      });
    }

    /**
     * Complete the animation and dispatch event
     */
    completeAnimation() {
      // Stop flashing
      this.stopFlashing();

      // Remove original content
      this.removeOriginalContent();

      // Dispatch completion event
      window.dispatchEvent(
        new CustomEvent("doomscroll-animation-complete", {
          detail: {
            hostname: window.location.hostname,
          },
        })
      );
    }

    /**
     * Stop the flashing animation
     */
    stopFlashing() {
      if (this.flashIntervalId) {
        clearInterval(this.flashIntervalId);
        this.flashIntervalId = null;
      }
    }

    /**
     * Remove original page content
     */
    removeOriginalContent() {
      this.originalContent.forEach((child) => {
        if (child.parentNode) {
          child.parentNode.removeChild(child);
        }
      });
      this.originalContent = [];
    }

    /**
     * Clean up the animation and remove warning element
     */
    cleanup() {
      this.stopFlashing();

      if (this.warningElement && this.warningElement.parentNode) {
        this.warningElement.parentNode.removeChild(this.warningElement);
        this.warningElement = null;
      }

      this.isWarningVisible = false;
      this.originalContent = [];
    }

    /**
     * Check if animation is currently running
     * @returns {boolean} True if animation is active
     */
    isActive() {
      return this.flashIntervalId !== null;
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DoomscrollAnimation;
  } else {
    window.DoomscrollAnimation = DoomscrollAnimation;
  }
}
