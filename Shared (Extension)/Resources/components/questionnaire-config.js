// components/questionnaire-config.js
// Browser-based questionnaire configuration interface

class QuestionnaireConfig {
  constructor(options = {}) {
    this.options = {
      onComplete: options.onComplete || null,
      onCancel: options.onCancel || null,
      ...options,
    };

    this.element = null;
    this.currentStep = 0;
    this.data = {
      householdTasks: [],
      hobbies: [],
      currentTasks: [],
      friends: [],
      goals: [],
      books: [],
    };

    this.steps = [
      {
        key: 'householdTasks',
        title: 'Household Tasks',
        placeholder: 'e.g., Do laundry, Clean kitchen',
        emoji: '🏠',
        defaults: ['Do laundry', 'Clean kitchen', 'Take out trash', 'Vacuum'],
      },
      {
        key: 'hobbies',
        title: 'Hobbies & Interests',
        placeholder: 'e.g., Reading, Guitar, Cycling',
        emoji: '🎯',
        defaults: ['Reading', 'Exercise', 'Music', 'Cooking'],
      },
      {
        key: 'currentTasks',
        title: 'Current Tasks',
        placeholder: 'e.g., Study for exam, Buy groceries',
        emoji: '✅',
        defaults: ['Buy groceries', 'Pay bills', 'Call doctor'],
      },
      {
        key: 'friends',
        title: 'Friends & Family',
        placeholder: 'e.g., Mom, Sarah, Alex',
        emoji: '👥',
        defaults: ['Mom', 'Dad', 'Best friend'],
      },
      {
        key: 'goals',
        title: 'Personal Goals',
        placeholder: 'e.g., Exercise daily, Learn Spanish',
        emoji: '🎯',
        defaults: ['Exercise daily', 'Read more', 'Learn new skill'],
      },
      {
        key: 'books',
        title: 'Books to Read',
        placeholder: 'e.g., Atomic Habits, 1984',
        emoji: '📚',
        defaults: ['Atomic Habits', 'The Lean Startup', '1984'],
      },
    ];

    // Load existing data
    this.loadExistingData();
  }

  async loadExistingData() {
    try {
      if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        const result = await browser.storage.local.get([
          'scrollstop_householdTasks',
          'scrollstop_hobbies',
          'scrollstop_currentTasks',
          'scrollstop_friends',
          'scrollstop_goals',
          'scrollstop_books',
        ]);

        this.data.householdTasks = result.scrollstop_householdTasks || [];
        this.data.hobbies = result.scrollstop_hobbies || [];
        this.data.currentTasks = result.scrollstop_currentTasks || [];
        this.data.friends = result.scrollstop_friends || [];
        this.data.goals = result.scrollstop_goals || [];
        this.data.books = result.scrollstop_books || [];
      } else {
        // Fallback to localStorage
        this.data.householdTasks = JSON.parse(
          localStorage.getItem('scrollstop_householdTasks') || '[]'
        );
        this.data.hobbies = JSON.parse(localStorage.getItem('scrollstop_hobbies') || '[]');
        this.data.currentTasks = JSON.parse(
          localStorage.getItem('scrollstop_currentTasks') || '[]'
        );
        this.data.friends = JSON.parse(localStorage.getItem('scrollstop_friends') || '[]');
        this.data.goals = JSON.parse(localStorage.getItem('scrollstop_goals') || '[]');
        this.data.books = JSON.parse(localStorage.getItem('scrollstop_books') || '[]');
      }
    } catch (error) {
      console.error('Error loading questionnaire data:', error);
    }
  }

  render(container) {
    if (!container) {
      // Create full-screen overlay
      container = document.createElement('div');
      container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.9) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      `;
      document.body.appendChild(container);
      this.overlay = container;
    }

    this.element = document.createElement('div');
    this.element.style.cssText = `
      background: white !important;
      border-radius: 16px !important;
      padding: 32px !important;
      max-width: 500px !important;
      width: 90% !important;
      max-height: 80vh !important;
      overflow-y: auto !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
      color: #1f2937 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;

    this.renderCurrentStep();
    container.appendChild(this.element);
    return this.element;
  }

  renderCurrentStep() {
    if (this.currentStep >= this.steps.length) {
      this.renderComplete();
      return;
    }

    const step = this.steps[this.currentStep];
    const currentItems = this.data[step.key];

    this.element.innerHTML = `
      <div style="text-align: center !important; margin-bottom: 24px !important;">
        <div style="font-size: 3rem !important; margin-bottom: 16px !important;">${step.emoji}</div>
        <h2 style="font-size: 1.5rem !important; font-weight: 600 !important; margin: 0 0 8px 0 !important; color: #1f2937 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
          ${step.title}
        </h2>
        <p style="color: #6b7280 !important; margin: 0 0 16px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
          Step ${this.currentStep + 1} of ${this.steps.length}
        </p>
        <div style="background: #e5e7eb !important; height: 4px !important; border-radius: 2px !important; margin: 0 auto !important; width: 200px !important;">
          <div style="background: #059669 !important; height: 100% !important; border-radius: 2px !important; width: ${((this.currentStep + 1) / this.steps.length) * 100}% !important; transition: width 0.3s ease !important;"></div>
        </div>
      </div>

      <div style="margin-bottom: 24px !important;">
        <div id="items-list" style="margin-bottom: 16px !important; display: flex !important; flex-wrap: wrap !important; gap: 8px !important;">
        </div>

        <div style="display: flex !important; gap: 8px !important;">
          <input type="text" id="new-item-input" placeholder="${step.placeholder}" style="
            flex: 1 !important; 
            padding: 12px !important; 
            border: 2px solid #d1d5db !important; 
            border-radius: 8px !important; 
            font-size: 16px !important; 
            color: #1f2937 !important;
            background: white !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            min-height: 44px !important;
            box-sizing: border-box !important;
          " />
          <div id="add-btn-container"></div>
        </div>
      </div>

      <div id="button-container" style="display: flex !important; gap: 12px !important; justify-content: space-between !important;">
      </div>
    `;

    // Create HeadlessButton components with fallback
    const addBtnContainer = this.element.querySelector('#add-btn-container');
    const buttonContainer = this.element.querySelector('#button-container');

    // Add button
    if (window.HeadlessButton && addBtnContainer) {
      try {
        const addBtn = new window.HeadlessButton('Add', {
          color: 'blue',
          onClick: () => this.addItem(),
        });
        addBtnContainer.appendChild(addBtn.element);
      } catch (error) {
        console.error('HeadlessButton failed, using fallback:', error);
        this.createFallbackButton(addBtnContainer, 'Add', () => this.addItem(), 'blue');
      }
    } else {
      // Fallback if HeadlessButton not available
      this.createFallbackButton(addBtnContainer, 'Add', () => this.addItem(), 'blue');
    }

    // Navigation buttons
    if (window.HeadlessButton && buttonContainer) {
      try {
        // Previous button
        if (this.currentStep > 0) {
          const prevBtn = new window.HeadlessButton('Previous', {
            color: 'zinc',
            outline: true,
            onClick: () => this.previousStep(),
          });
          buttonContainer.appendChild(prevBtn.element);
        } else {
          // Empty div for spacing
          const spacer = document.createElement('div');
          buttonContainer.appendChild(spacer);
        }

        // Cancel button
        const cancelBtn = new window.HeadlessButton('Cancel', {
          color: 'red',
          outline: true,
          onClick: () => this.cancel(),
        });
        buttonContainer.appendChild(cancelBtn.element);

        // Next/Finish button
        const nextBtn = new window.HeadlessButton(
          this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next',
          {
            color: 'blue',
            onClick: () => this.nextStep(),
          }
        );
        buttonContainer.appendChild(nextBtn.element);
      } catch (error) {
        console.error('HeadlessButton failed, using fallback:', error);
        this.createFallbackButtons(buttonContainer);
      }
    } else {
      // Fallback if HeadlessButton not available
      this.createFallbackButtons(buttonContainer);
    }

    // Set up input handlers
    const input = this.element.querySelector('#new-item-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addItem();
        }
      });
      input.focus();
    }

    // Create badge buttons for items
    const itemsList = this.element.querySelector('#items-list');
    if (itemsList && window.HeadlessBadgeButton) {
      currentItems.forEach((item, index) => {
        const badgeButton = new window.HeadlessBadgeButton(`${item} ×`, {
          color: 'zinc',
          onClick: () => this.removeItem(index),
        });
        itemsList.appendChild(badgeButton.element);
      });
    }

    // Add default items button if list is empty
    if (currentItems.length === 0 && itemsList && step.defaults) {
      const addDefaultsBtn = new window.HeadlessButton('Add suggested items', {
        color: 'zinc',
        outline: true,
        onClick: () => this.addDefaultItems(),
      });
      itemsList.appendChild(addDefaultsBtn.element);
    }

    // Store reference for global access
    window.questionnaireConfig = this;
  }

  // Fallback button creation methods - still try to use HeadlessButton
  createFallbackButton(container, text, onClick, color) {
    if (!container) return;

    // Try to use HeadlessButton again with a delay
    setTimeout(() => {
      if (window.HeadlessButton) {
        container.innerHTML = ''; // Clear any existing content
        const button = new window.HeadlessButton(text, {
          color: color,
          outline: color !== 'blue',
          onClick: onClick,
        });
        container.appendChild(button.element);
      }
    }, 100);

    // Immediate basic button as emergency fallback
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    container.appendChild(button);
  }

  createFallbackButtons(container) {
    if (!container) return;

    // Previous button
    if (this.currentStep > 0) {
      this.createFallbackButton(container, 'Previous', () => this.previousStep(), 'zinc');
    } else {
      const spacer = document.createElement('div');
      container.appendChild(spacer);
    }

    // Cancel button
    this.createFallbackButton(container, 'Cancel', () => this.cancel(), 'red');

    // Next/Finish button
    const nextText = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';
    this.createFallbackButton(container, nextText, () => this.nextStep(), 'blue');
  }

  addItem() {
    const input = this.element.querySelector('#new-item-input');
    const value = input.value.trim();

    if (value) {
      const step = this.steps[this.currentStep];
      this.data[step.key].push(value);
      input.value = '';
      this.renderCurrentStep();
    }
  }

  addDefaultItems() {
    const step = this.steps[this.currentStep];
    if (step.defaults) {
      this.data[step.key] = [...step.defaults];
      this.renderCurrentStep();
    }
  }

  removeItem(index) {
    const step = this.steps[this.currentStep];
    this.data[step.key].splice(index, 1);
    this.renderCurrentStep();
  }

  nextStep() {
    this.currentStep++;
    this.renderCurrentStep();
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderCurrentStep();
    }
  }

  cancel() {
    if (this.options.onCancel) {
      this.options.onCancel();
    }
    this.remove();
  }

  renderComplete() {
    this.element.innerHTML = `
      <div style="text-align: center !important;">
        <div style="font-size: 4rem !important; margin-bottom: 24px !important;">🎉</div>
        <h2 style="font-size: 1.8rem !important; font-weight: 600 !important; margin: 0 0 16px 0 !important; color: #059669 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
          Configuration Complete!
        </h2>
        <p style="color: #6b7280 !important; margin: 0 0 32px 0 !important; line-height: 1.5 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
          Your personalized activities have been saved. You'll now see customized suggestions when ScrollStop blocks a site.
        </p>
        <div id="done-btn-container" style="display: flex !important; justify-content: center !important;"></div>
      </div>
    `;

    // Create HeadlessButton for done button that just closes the window
    const doneBtnContainer = this.element.querySelector('#done-btn-container');
    if (window.HeadlessButton && doneBtnContainer) {
      const doneBtn = new window.HeadlessButton('Finish', {
        color: 'green',
        onClick: () => {
          // Save data and close window without callback
          this.saveData().then(() => {
            this.remove();
          });
        },
      });
      doneBtnContainer.appendChild(doneBtn.element);
    }
  }

  async complete() {
    await this.saveData();
    if (this.options.onComplete) {
      this.options.onComplete();
    }
    this.remove();
  }

  async saveData() {
    try {
      const storageData = {
        scrollstop_householdTasks: this.data.householdTasks,
        scrollstop_hobbies: this.data.hobbies,
        scrollstop_currentTasks: this.data.currentTasks,
        scrollstop_friends: this.data.friends,
        scrollstop_goals: this.data.goals,
        scrollstop_books: this.data.books,
      };

      if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        await browser.storage.local.set(storageData);
      } else {
        // Fallback to localStorage
        for (const [key, value] of Object.entries(storageData)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }

      console.log('Questionnaire data saved successfully');
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
    }
  }

  remove() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    } else if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    delete window.questionnaireConfig;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionnaireConfig;
} else {
  window.QuestionnaireConfig = QuestionnaireConfig;
}
