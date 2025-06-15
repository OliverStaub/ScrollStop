// modules/blocking-screen/blocking-screen.js
// Modern blocking screen with activity suggestions and timer

if (typeof window.BlockingScreen === 'undefined') {
  class BlockingScreen {
    constructor(config = {}) {
      this.config = {
        UPDATE_INTERVAL: config.updateInterval || 1000, // Update countdown every second
        ...config,
      };

      this.blockingElement = null;
      this.countdownInterval = null;
      this.hostname = window.location.hostname;
      this.swipeCards = null;
      this.activityTimer = null;
      this.currentMode = 'blocked'; // 'blocked', 'activities', 'timer'
      this.selectedActivity = null;
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
        console.error('Error showing blocking screen:', error);
        this.cleanup();
      }
    }

    /**
     * Clear all existing page content
     */
    clearPageContent() {
      document.body.innerHTML = '';
    }

    /**
     * Create the blocking screen element
     */
    async createBlockingElement() {
      this.blockingElement = document.createElement('div');
      this.blockingElement.id = 'time-block-screen';
      this.blockingElement.className = 'blocking-screen';

      this.applyModernStyles();
      await this.createModernContent();

      document.body.appendChild(this.blockingElement);
    }

    /**
     * Apply modern B&W styles to blocking screen element with dark mode support
     */
    applyModernStyles() {
      if (!this.blockingElement) {
        return;
      }

      // Detect dark mode
      const isDarkMode =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.blockingElement.style.cssText = `
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999999;
        background: ${isDarkMode ? '#1f2937' : '#f8fafc'};
        color: ${isDarkMode ? '#f9fafb' : '#1f2937'};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow-y: auto;
        box-sizing: border-box;
      `;
    }

    /**
     * Create modern blocking screen content
     */
    async createModernContent() {
      if (!this.blockingElement) {
        return;
      }

      // Check if this is a news site
      const isNews = await StorageHelper.isCurrentSiteNews(window.location.href, this.hostname);
      const siteName = this.hostname.replace('www.', '').split('.')[0];

      // Detect dark mode for styling
      const isDarkMode =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.blockingElement.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        ">
          <div style="
            max-width: 480px;
            width: 100%;
            text-align: center;
          ">
            <!-- Header Section -->
            <div style="margin-bottom: 32px;">
              <!-- ScrollStop Title -->
              <div style="
                font-size: 1.8rem;
                font-weight: 700;
                color: ${isDarkMode ? '#34d399' : '#059669'};
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                opacity: 0.9;
              ">
                ScrollStop
              </div>
              
              <h1 style="
                font-size: 2.5rem; 
                font-weight: 700; 
                color: ${isDarkMode ? '#f9fafb' : '#1f2937'}; 
                margin: 0 0 16px 0;
                line-height: 1.2;
              ">
                ${siteName} is blocked
              </h1>
              
              <p style="
                font-size: 1.2rem; 
                color: ${isDarkMode ? '#d1d5db' : '#6b7280'}; 
                margin: 0 0 20px 0;
                line-height: 1.5;
              ">
                ${
                  isNews
                    ? "You've reached your 20-minute daily news limit"
                    : 'Take a break from scrolling and try something productive'
                }
              </p>

              <!-- Countdown Timer (replaces the big icon) -->
              <div id="countdown-container" style="
                background: ${isDarkMode ? '#374151' : 'white'};
                border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'};
                border-radius: 16px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
              ">
                <div style="
                  font-size: 3.5rem; 
                  font-weight: 700; 
                  color: ${isDarkMode ? '#34d399' : '#059669'};
                  margin-bottom: 8px;
                  font-variant-numeric: tabular-nums;
                " id="time-remaining">
                  Loading...
                </div>
                <div style="
                  font-size: 0.9rem; 
                  color: ${isDarkMode ? '#d1d5db' : '#9ca3af'};
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                ">
                  Time remaining
                </div>
              </div>
            </div>

            <!-- Activities Section -->
            <div id="activities-section" style="margin-top: 20px;">
              <h2 style="
                font-size: 1.3rem; 
                font-weight: 600; 
                color: ${isDarkMode ? '#f9fafb' : '#374151'}; 
                margin: 0 0 16px 0;
              ">
                Better things to do right now
              </h2>
              
              <div id="activities-container" style="
                background: ${isDarkMode ? '#374151' : 'white'};
                border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'};
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 16px;
              ">
                <!-- Swipe cards will be inserted here -->
              </div>
            </div>

            <!-- Timer Section (initially hidden) -->
            <div id="timer-section" style="display: none; margin-top: 32px;">
              <div id="timer-container">
                <!-- Activity timer will be inserted here -->
              </div>
            </div>

            <!-- Action Buttons -->
            <div id="action-buttons" style="
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-top: 32px;
            ">
              <!-- Buttons will be added here -->
            </div>
          </div>
        </div>
      `;

      // Initialize activity cards for all platforms
      await this.initializeActivityCards();

      this.createActionButtons();
    }

    /**
     * Initialize swipeable activity cards
     */
    async initializeActivityCards() {
      const container = document.getElementById('activities-container');
      if (!container) {
        return;
      }

      try {
        const personalData = await this.getPersonalData();
        const activities = this.generateActivityCards(personalData);

        if (activities.length === 0) {
          container.innerHTML = `
            <div style="
              text-align: center;
              color: #9ca3af;
              padding: 48px 24px;
            ">
              <div style="font-size: 2rem; margin-bottom: 16px; opacity: 0.6;">🎯</div>
              <p style="margin: 0;">No activities available</p>
            </div>
          `;
          return;
        }

        // Create swipe cards component
        if (!window.SwipeCards) {
          console.error('SwipeCards not available on window');
          container.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 24px;">
              SwipeCards component not loaded
            </div>
          `;
          return;
        }

        this.swipeCards = new window.SwipeCards(activities, {
          onSwipeRight: (activity) => this.handleActivityAccepted(activity),
          onSwipeLeft: (activity) => this.handleActivityRejected(activity),
          onComplete: () => this.handleAllActivitiesCompleted(),
        });

        this.swipeCards.render(container);
      } catch (error) {
        console.error('Error initializing activity cards:', error);
        container.innerHTML = `
          <div style="text-align: center; color: #ef4444; padding: 24px;">
            Error loading activities
          </div>
        `;
      }
    }

    /**
     * Generate activity cards from personal data
     */
    generateActivityCards(personalData) {
      const activities = [];

      if (!personalData.hasData) {
        return this.getDefaultActivityCards();
      }

      // Add current tasks (highest priority)
      if (personalData.currentTasks && personalData.currentTasks.length > 0) {
        personalData.currentTasks.forEach((task) => {
          activities.push({
            emoji: '✅',
            text: task,
            description: 'Current task to complete',
            category: 'current',
          });
        });
      }

      // Add household tasks
      if (personalData.householdTasks && personalData.householdTasks.length > 0) {
        personalData.householdTasks.forEach((task) => {
          activities.push({
            emoji: '🏠',
            text: task,
            description: 'Household task',
            category: 'household',
          });
        });
      }

      // Add friends to contact
      if (personalData.friends && personalData.friends.length > 0) {
        personalData.friends.forEach((friend) => {
          activities.push({
            emoji: '📞',
            text: `Call ${friend}`,
            description: 'Connect with someone you care about',
            category: 'social',
          });
        });
      }

      // Add hobbies
      if (personalData.hobbies && personalData.hobbies.length > 0) {
        personalData.hobbies.forEach((hobby) => {
          activities.push({
            emoji: '🎯',
            text: hobby,
            description: 'Pursue your interests',
            category: 'hobby',
          });
        });
      }

      // Add books
      if (personalData.books && personalData.books.length > 0) {
        personalData.books.forEach((book) => {
          activities.push({
            emoji: '📚',
            text: `Read "${book}"`,
            description: 'Expand your mind',
            category: 'reading',
          });
        });
      }

      // Add goals
      if (personalData.goals && personalData.goals.length > 0) {
        personalData.goals.forEach((goal) => {
          activities.push({
            emoji: '🎯',
            text: `Work on: ${goal}`,
            description: 'Make progress on your goals',
            category: 'goal',
          });
        });
      }

      // Shuffle activities for variety
      return this.shuffleArray(activities).slice(0, 10); // Max 10 activities
    }

    /**
     * Get default activity cards when no personal data is available
     */
    getDefaultActivityCards() {
      return [
        {
          emoji: '🚶‍♂️',
          text: 'Take a walk outside',
          description: 'Get some fresh air and movement',
        },
        {
          emoji: '📚',
          text: 'Read a book',
          description: 'Engage your mind with something meaningful',
        },
        {
          emoji: '🧘‍♀️',
          text: 'Meditate for 5 minutes',
          description: 'Practice mindfulness and calm your thoughts',
        },
        {
          emoji: '💪',
          text: 'Do some exercise',
          description: 'Get your body moving and energy flowing',
        },
        {
          emoji: '👥',
          text: 'Call a friend or family member',
          description: 'Connect with someone you care about',
        },
        {
          emoji: '🎨',
          text: 'Be creative',
          description: 'Draw, write, or make something with your hands',
        },
        {
          emoji: '🧹',
          text: 'Tidy up your space',
          description: 'Organize your environment for mental clarity',
        },
        {
          emoji: '💧',
          text: 'Drink some water',
          description: 'Hydrate and take care of your body',
        },
        {
          emoji: '🌱',
          text: 'Do some stretching',
          description: 'Release tension and improve flexibility',
        },
        {
          emoji: '📝',
          text: 'Write in a journal',
          description: 'Reflect on your thoughts and feelings',
        },
      ];
    }

    /**
     * Shuffle array for randomness
     */
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    /**
     * Handle when user swipes right (accepts) an activity
     */
    handleActivityAccepted(activity) {
      console.log('Activity accepted:', activity);
      this.selectedActivity = activity;
      this.showActivityTimer();
    }

    /**
     * Handle when user swipes left (rejects) an activity
     */
    handleActivityRejected(activity) {
      console.log('Activity rejected:', activity);
      // Just continue to next card
    }

    /**
     * Handle when all activities are completed
     */
    handleAllActivitiesCompleted() {
      const container = document.getElementById('activities-container');
      if (container) {
        container.innerHTML = `
          <div style="
            text-align: center;
            color: #6b7280;
            padding: 48px 24px;
          ">
            <div style="font-size: 3rem; margin-bottom: 16px;">🎉</div>
            <p style="margin: 0; font-size: 1.1rem;">
              You've seen all available activities!
            </p>
          </div>
        `;
      }
    }

    /**
     * Show the activity timer section
     */
    showActivityTimer() {
      this.currentMode = 'timer';

      // Hide activities section
      const activitiesSection = document.getElementById('activities-section');
      if (activitiesSection) {
        activitiesSection.style.display = 'none';
      }

      // Show timer section
      const timerSection = document.getElementById('timer-section');
      if (timerSection) {
        timerSection.style.display = 'block';
      }

      // Create activity timer
      const timerContainer = document.getElementById('timer-container');
      if (timerContainer && this.selectedActivity) {
        this.activityTimer = new window.ActivityTimer({
          duration: 5 * 60 * 1000, // 5 minutes
          onComplete: () => this.handleTimerComplete(),
          onTick: (remaining) => this.handleTimerTick(remaining),
        });

        this.activityTimer.render(timerContainer);
        this.activityTimer.setActivity(this.selectedActivity);
      }

      // Update action buttons
      this.createActionButtons();
    }

    /**
     * Handle timer completion
     */
    handleTimerComplete() {
      console.log('Activity timer completed');
      // Timer component handles the completion dialog internally
    }

    /**
     * Handle timer tick
     */
    handleTimerTick(_remaining) {
      // Optional: Update any global state or UI
    }

    /**
     * Create action buttons based on current mode (only on iOS)
     */
    createActionButtons() {
      const container = document.getElementById('action-buttons');
      if (!container) {
        return;
      }

      container.innerHTML = '';

      // Action buttons available on all platforms now

      if (this.currentMode === 'blocked') {
        // Show "Skip Activities" button with subtle green accent
        const skipButton = new window.HeadlessButton('Skip activities', {
          color: 'zinc',
          outline: true,
          onClick: () => this.skipActivities(),
        });

        container.appendChild(skipButton.element);
      } else if (this.currentMode === 'timer') {
        // Show "Back to Activities" button
        const backButton = new window.HeadlessButton('← Back to activities', {
          color: 'zinc',
          outline: true,
          onClick: () => this.backToActivities(),
        });

        container.appendChild(backButton.element);
      }
    }

    /**
     * Skip activities and just show countdown
     */
    skipActivities() {
      const activitiesSection = document.getElementById('activities-section');
      const actionButtons = document.getElementById('action-buttons');

      if (activitiesSection) {
        activitiesSection.style.display = 'none';
      }
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }
    }

    /**
     * Go back to activities from timer
     */
    backToActivities() {
      this.currentMode = 'blocked';

      // Clean up timer
      if (this.activityTimer) {
        this.activityTimer.destroy();
        this.activityTimer = null;
      }

      // Hide timer section
      const timerSection = document.getElementById('timer-section');
      if (timerSection) {
        timerSection.style.display = 'none';
      }

      // Show activities section
      const activitiesSection = document.getElementById('activities-section');
      if (activitiesSection) {
        activitiesSection.style.display = 'block';
      }

      // Update action buttons
      this.createActionButtons();
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
          .join('');

        return `
          <div style="margin-top: 2rem;">
            <p style="font-size: 1.1rem; margin: 1rem 0; opacity: 0.8;">
              ${personalData.hasData ? 'Here are some personalized suggestions for you:' : 'Here are some better things you could be doing:'}
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
              ${suggestionsGrid}
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error generating suggestions:', error);
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
          hasData: false,
        };

        // Try to get data from browser storage (shared with iOS app)
        if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
          const result = await browser.storage.local.get([
            'scrollstop_householdTasks',
            'scrollstop_hobbies',
            'scrollstop_currentTasks',
            'scrollstop_friends',
            'scrollstop_goals',
            'scrollstop_books',
          ]);

          data.householdTasks = result.scrollstop_householdTasks || [];
          data.hobbies = result.scrollstop_hobbies || [];
          data.currentTasks = result.scrollstop_currentTasks || [];
          data.friends = result.scrollstop_friends || [];
          data.goals = result.scrollstop_goals || [];
          data.books = result.scrollstop_books || [];
        } else {
          // Fallback to localStorage
          data.householdTasks = JSON.parse(
            localStorage.getItem('scrollstop_householdTasks') || '[]'
          );
          data.hobbies = JSON.parse(localStorage.getItem('scrollstop_hobbies') || '[]');
          data.currentTasks = JSON.parse(localStorage.getItem('scrollstop_currentTasks') || '[]');
          data.friends = JSON.parse(localStorage.getItem('scrollstop_friends') || '[]');
          data.goals = JSON.parse(localStorage.getItem('scrollstop_goals') || '[]');
          data.books = JSON.parse(localStorage.getItem('scrollstop_books') || '[]');
        }

        // Check if we have any personal data
        data.hasData =
          data.householdTasks.length > 0 ||
          data.hobbies.length > 0 ||
          data.currentTasks.length > 0 ||
          data.friends.length > 0 ||
          data.goals.length > 0 ||
          data.books.length > 0;

        return data;
      } catch (error) {
        console.error('Error loading personal data:', error);
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
        suggestions.push({ emoji: '✅', text: randomTask });
      }

      // Add household tasks
      if (personalData.householdTasks && personalData.householdTasks.length > 0) {
        const randomTask = this.getRandomItem(personalData.householdTasks);
        suggestions.push({ emoji: '🏠', text: randomTask });
      }

      // Add friends to contact
      if (personalData.friends && personalData.friends.length > 0) {
        const randomFriend = this.getRandomItem(personalData.friends);
        suggestions.push({ emoji: '📞', text: `Call ${randomFriend}` });
      }

      // Add hobbies
      if (personalData.hobbies && personalData.hobbies.length > 0) {
        const randomHobby = this.getRandomItem(personalData.hobbies);
        suggestions.push({ emoji: '🎯', text: randomHobby });
      }

      // Add books
      if (personalData.books && personalData.books.length > 0) {
        const randomBook = this.getRandomItem(personalData.books);
        suggestions.push({ emoji: '📚', text: `Read "${randomBook}"` });
      }

      // Add goals (if space allows)
      if (personalData.goals && personalData.goals.length > 0 && suggestions.length < 6) {
        const randomGoal = this.getRandomItem(personalData.goals);
        suggestions.push({ emoji: '🎯', text: `Work on: ${randomGoal}` });
      }

      // Fill with default suggestions if we don't have enough
      const defaultSuggestions = this.getDefaultSuggestions();
      while (suggestions.length < 4) {
        const randomDefault = this.getRandomItem(defaultSuggestions);
        if (!suggestions.some((s) => s.text === randomDefault.text)) {
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
        { emoji: '🚶‍♂️', text: 'Take a walk outside' },
        { emoji: '📚', text: 'Read a book' },
        { emoji: '🧘‍♀️', text: 'Meditate' },
        { emoji: '💪', text: 'Exercise' },
        { emoji: '👥', text: 'Call a friend' },
        { emoji: '🎨', text: 'Be creative' },
        { emoji: '🧹', text: 'Tidy up your space' },
        { emoji: '💧', text: 'Drink some water' },
        { emoji: '🌱', text: 'Do some stretching' },
        { emoji: '📝', text: 'Write in a journal' },
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
        .join('');

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
        // Check if this is a news site
        const isNews = await StorageHelper.isCurrentSiteNews(window.location.href, this.hostname);

        let remainingTime;
        if (isNews) {
          remainingTime = await TimeManager.getRemainingNewsBlockTime();
        } else {
          remainingTime = await TimeManager.getRemainingTime(this.hostname);
        }

        if (remainingTime <= 0) {
          // Time's up! Remove block and reload
          if (isNews) {
            await TimeManager.removeNewsTimeBlock();
          } else {
            await TimeManager.removeTimeBlock(this.hostname);
          }
          window.location.reload();
          return;
        }

        // Update display
        const timeDisplay = TimeManager.formatTime(remainingTime);
        const countdownElement = document.getElementById('time-remaining');

        if (countdownElement) {
          countdownElement.textContent = timeDisplay;
        }
      } catch (error) {
        console.error('Error updating countdown:', error);
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

      // Clean up swipe cards
      if (this.swipeCards) {
        this.swipeCards.destroy();
        this.swipeCards = null;
      }

      // Clean up activity timer
      if (this.activityTimer) {
        this.activityTimer.destroy();
        this.activityTimer = null;
      }

      if (this.blockingElement && this.blockingElement.parentNode) {
        this.blockingElement.parentNode.removeChild(this.blockingElement);
        this.blockingElement = null;
      }

      // Reset state
      this.currentMode = 'blocked';
      this.selectedActivity = null;
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
      if (!this.blockingElement) {
        return;
      }

      const titleElement = this.blockingElement.querySelector('p');
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
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlockingScreen;
  } else {
    window.BlockingScreen = BlockingScreen;
  }
}
