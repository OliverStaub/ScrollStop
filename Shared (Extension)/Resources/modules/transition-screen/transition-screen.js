// modules/transition-screen/transition-screen.js
// Module for showing the transition screen between animation and blocking

if (typeof window.TransitionScreen === 'undefined') {
  class TransitionScreen {
    constructor(config = {}) {
      this.config = {
        TRANSITION_DURATION: config.transitionDuration || 3000, // 3 seconds
        ...config,
      };

      this.transitionElement = null;
      this.countdownInterval = null;
      this.remainingSeconds = 3;
    }

    /**
     * Show the transition screen
     */
    async show() {
      try {
        this.createTransitionElement();
        this.startCountdown();

        // Auto-complete after duration
        setTimeout(() => {
          this.complete();
        }, this.config.TRANSITION_DURATION);
      } catch (error) {
        console.error('Error showing transition screen:', error);
        this.cleanup();
      }
    }

    /**
     * Create the transition screen element
     */
    createTransitionElement() {
      if (this.transitionElement) {
        return; // Already created
      }

      // Find and update existing warning element, or create new one
      this.transitionElement = document.getElementById('doomscroll-warning');

      if (!this.transitionElement) {
        this.transitionElement = document.createElement('div');
        this.transitionElement.id = 'transition-screen';
        document.body.appendChild(this.transitionElement);
      }

      this.applyTransitionStyles();
      this.updateTransitionContent();
    }

    /**
     * Apply styles to transition element
     */
    applyTransitionStyles() {
      if (!this.transitionElement) {
        return;
      }

      this.transitionElement.style.cssText = `
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
        background: linear-gradient(135deg, #8ac926 0%, #52b788 100%);
        color: white;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        opacity: 1;
        pointer-events: all;
      `;
    }

    /**
     * Update transition screen content
     */
    updateTransitionContent() {
      if (!this.transitionElement) {
        return;
      }

      this.transitionElement.innerHTML = `
        <div style="max-width: 600px; width: 100%; padding: 2rem;">
          <div style="font-size: 5rem; margin-bottom: 2rem;">🌱</div>
          <div style="font-size: 4rem; margin-bottom: 2rem; font-weight: bold;">
            Touch some grass!
          </div>
          <div style="font-size: 1.8rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; line-height: 1.4;">
            This site is now blocked for 60 minutes.
          </div>
          <div style="font-size: 1.4rem; color: rgba(255, 255, 255, 0.8);" id="countdown-text">
            Redirecting in <span id="countdown-number">${this.remainingSeconds}</span> seconds...
          </div>
        </div>
      `;
    }

    /**
     * Start the countdown timer
     */
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.remainingSeconds--;
        this.updateCountdownDisplay();

        if (this.remainingSeconds <= 0) {
          this.stopCountdown();
        }
      }, 1000);
    }

    /**
     * Update countdown display
     */
    updateCountdownDisplay() {
      const countdownElement = document.getElementById('countdown-number');
      if (countdownElement) {
        countdownElement.textContent = this.remainingSeconds;
      }
    }

    /**
     * Stop the countdown timer
     */
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }

    /**
     * Complete the transition and dispatch event
     */
    complete() {
      this.stopCountdown();

      // Dispatch completion event
      window.dispatchEvent(
        new CustomEvent('transition-screen-complete', {
          detail: {
            hostname: window.location.hostname,
          },
        })
      );
    }

    /**
     * Clean up the transition screen
     */
    cleanup() {
      this.stopCountdown();

      if (this.transitionElement && this.transitionElement.parentNode) {
        this.transitionElement.parentNode.removeChild(this.transitionElement);
        this.transitionElement = null;
      }

      this.remainingSeconds = 3;
    }

    /**
     * Check if transition screen is currently showing
     * @returns {boolean} True if transition is active
     */
    isActive() {
      return this.countdownInterval !== null;
    }

    /**
     * Update transition message
     * @param {string} message - Custom message to display
     */
    updateMessage(message) {
      if (!this.transitionElement) {
        return;
      }

      const messageElement = this.transitionElement.querySelector('div:nth-child(3)');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
  }

  // Export for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionScreen;
  } else {
    window.TransitionScreen = TransitionScreen;
  }
}
