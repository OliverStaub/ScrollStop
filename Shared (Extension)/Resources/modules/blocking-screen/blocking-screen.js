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
        await this.createBlockingElement();

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
    async createBlockingElement() {
      this.blockingElement = document.createElement("div");
      this.blockingElement.id = "time-block-screen";
      this.blockingElement.className = "blocking-screen";

      this.applyBlockingStyles();
      await this.updateBlockingContent();

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
    async updateBlockingContent() {
      if (!this.blockingElement) return;

      const suggestionsHTML = await this.getSuggestionsHTML();

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
          
          ${suggestionsHTML}
        </div>
      `;
    }

    /**
     * Get HTML for activity suggestions
     * @returns {string} HTML for suggestions section
     */
    async getSuggestionsHTML() {
      try {
        const personalData = await this.getPersonalData();
        const suggestions = this.generatePersonalizedSuggestions(personalData);
        
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
              ${personalData.hasData ? "Here are some personalized suggestions for you:" : "Here are some better things you could be doing:"}
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
              ${suggestionsGrid}
            </div>
          </div>
        `;
      } catch (error) {
        console.error("Error generating suggestions:", error);
        return this.getDefaultSuggestionsHTML();
      }
    }

    /**
     * Get personal data from storage
     * @returns {Object} Personal data from questionnaire
     */
    async getPersonalData() {
      try {
        const data = {
          householdTasks: [],
          hobbies: [],
          currentTasks: [],
          friends: [],
          goals: [],
          books: [],
          hasData: false
        };

        // Try to get data from browser storage (shared with iOS app)
        if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
          const result = await browser.storage.local.get([
            'scrollstop_householdTasks',
            'scrollstop_hobbies', 
            'scrollstop_currentTasks',
            'scrollstop_friends',
            'scrollstop_goals',
            'scrollstop_books'
          ]);
          
          data.householdTasks = result.scrollstop_householdTasks || [];
          data.hobbies = result.scrollstop_hobbies || [];
          data.currentTasks = result.scrollstop_currentTasks || [];
          data.friends = result.scrollstop_friends || [];
          data.goals = result.scrollstop_goals || [];
          data.books = result.scrollstop_books || [];
        } else {
          // Fallback to localStorage
          data.householdTasks = JSON.parse(localStorage.getItem('scrollstop_householdTasks') || '[]');
          data.hobbies = JSON.parse(localStorage.getItem('scrollstop_hobbies') || '[]');
          data.currentTasks = JSON.parse(localStorage.getItem('scrollstop_currentTasks') || '[]');
          data.friends = JSON.parse(localStorage.getItem('scrollstop_friends') || '[]');
          data.goals = JSON.parse(localStorage.getItem('scrollstop_goals') || '[]');
          data.books = JSON.parse(localStorage.getItem('scrollstop_books') || '[]');
        }

        // Check if we have any personal data
        data.hasData = data.householdTasks.length > 0 || data.hobbies.length > 0 || 
                       data.currentTasks.length > 0 || data.friends.length > 0 || 
                       data.goals.length > 0 || data.books.length > 0;

        return data;
      } catch (error) {
        console.error("Error loading personal data:", error);
        return { hasData: false };
      }
    }

    /**
     * Generate personalized suggestions based on user data
     * @param {Object} personalData - User's personal data
     * @returns {Array} Array of suggestion objects
     */
    generatePersonalizedSuggestions(personalData) {
      const suggestions = [];
      
      if (!personalData.hasData) {
        return this.getDefaultSuggestions();
      }

      // Add current tasks (highest priority)
      if (personalData.currentTasks && personalData.currentTasks.length > 0) {
        const randomTask = this.getRandomItem(personalData.currentTasks);
        suggestions.push({ emoji: "✅", text: randomTask });
      }

      // Add household tasks
      if (personalData.householdTasks && personalData.householdTasks.length > 0) {
        const randomTask = this.getRandomItem(personalData.householdTasks);
        suggestions.push({ emoji: "🏠", text: randomTask });
      }

      // Add friends to contact
      if (personalData.friends && personalData.friends.length > 0) {
        const randomFriend = this.getRandomItem(personalData.friends);
        suggestions.push({ emoji: "📞", text: `Call ${randomFriend}` });
      }

      // Add hobbies
      if (personalData.hobbies && personalData.hobbies.length > 0) {
        const randomHobby = this.getRandomItem(personalData.hobbies);
        suggestions.push({ emoji: "🎯", text: randomHobby });
      }

      // Add books
      if (personalData.books && personalData.books.length > 0) {
        const randomBook = this.getRandomItem(personalData.books);
        suggestions.push({ emoji: "📚", text: `Read "${randomBook}"` });
      }

      // Add goals (if space allows)
      if (personalData.goals && personalData.goals.length > 0 && suggestions.length < 6) {
        const randomGoal = this.getRandomItem(personalData.goals);
        suggestions.push({ emoji: "🎯", text: `Work on: ${randomGoal}` });
      }

      // Fill with default suggestions if we don't have enough
      const defaultSuggestions = this.getDefaultSuggestions();
      while (suggestions.length < 4) {
        const randomDefault = this.getRandomItem(defaultSuggestions);
        if (!suggestions.some(s => s.text === randomDefault.text)) {
          suggestions.push(randomDefault);
        }
      }

      // Return maximum 6 suggestions
      return suggestions.slice(0, 6);
    }

    /**
     * Get default suggestions when no personal data is available
     * @returns {Array} Array of default suggestion objects
     */
    getDefaultSuggestions() {
      return [
        { emoji: "🚶‍♂️", text: "Take a walk outside" },
        { emoji: "📚", text: "Read a book" },
        { emoji: "🧘‍♀️", text: "Meditate" },
        { emoji: "💪", text: "Exercise" },
        { emoji: "👥", text: "Call a friend" },
        { emoji: "🎨", text: "Be creative" },
        { emoji: "🧹", text: "Tidy up your space" },
        { emoji: "💧", text: "Drink some water" },
        { emoji: "🌱", text: "Do some stretching" },
        { emoji: "📝", text: "Write in a journal" }
      ];
    }

    /**
     * Get default suggestions HTML (fallback)
     * @returns {string} HTML for default suggestions
     */
    getDefaultSuggestionsHTML() {
      const suggestions = this.getDefaultSuggestions().slice(0, 6);
      
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
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random item from array
     */
    getRandomItem(array) {
      return array[Math.floor(Math.random() * array.length)];
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
