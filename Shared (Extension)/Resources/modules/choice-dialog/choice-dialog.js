/**
 * Choice Dialog Module - Shows user choice when accessing blocked sites
 * 
 * Options:
 * a) Continue with ScrollStop (full functionality)
 * b) Timer only mode (no blocking)
 * c) Block immediately
 */

class ChoiceDialog {
  constructor(options = {}) {
    this.options = {
      siteTitle: options.siteTitle || window.location.hostname,
      onChoiceMade: options.onChoiceMade || null,
      ...options
    };

    this.dialog = null;
    this.isShown = false;
    this.choice = null;
  }

  /**
   * Show the choice dialog
   */
  show() {
    console.log('ChoiceDialog: show() called, isShown:', this.isShown);
    
    if (this.isShown) {
      return Promise.resolve(this.choice);
    }

    this.isShown = true;
    
    return new Promise((resolve) => {
      console.log('ChoiceDialog: Creating dialog...');
      this.createDialog(resolve);
    });
  }

  /**
   * Create and display the dialog with UI components
   */
  createDialog(resolve) {
    try {
      console.log('ChoiceDialog: createDialog() called');
      console.log('ChoiceDialog: HeadlessDialog available:', typeof HeadlessDialog !== 'undefined');
      console.log('ChoiceDialog: HeadlessButton available:', typeof HeadlessButton !== 'undefined');
      
      // Create dialog container with glassmorphism styling
      this.dialog = new HeadlessDialog({
        size: 'sm', // Narrower dialog
        isOpen: true,
        className: 'scrollstop-glassmorphism-dialog',
        onClose: () => this.handleChoice('continue', resolve)
      });
      
      console.log('ChoiceDialog: Dialog created successfully');
      
      this.createDialogContent(resolve);
      
    } catch (error) {
      console.error('ChoiceDialog: Error in createDialog:', error);
      this.handleDialogFailure(resolve);
    }
  }

  /**
   * Create dialog content with error handling
   */
  createDialogContent(resolve) {
    try {
      console.log('ChoiceDialog: Creating dialog content...');

      // Create dialog content
      const title = new HeadlessDialogTitle('ScrollStop');

      // Create dialog body (empty, no subtitle)
      const body = new HeadlessDialogBody();

      // Create action buttons using HeadlessButton default styling
      const continueBtn = new HeadlessButton('Continue with ScrollStop', {
        color: 'blue',
        onClick: () => this.handleChoice('continue', resolve)
      });

      const timerOnlyBtn = new HeadlessButton('Timer Only', {
        color: 'zinc',
        outline: true,
        onClick: () => this.handleChoice('timer-only', resolve)
      });

      const blockBtn = new HeadlessButton('Block Now', {
        color: 'red',
        outline: true,
        onClick: () => this.handleChoice('block', resolve)
      });

      console.log('ChoiceDialog: Buttons created, assembling content...');

      // Create simple button container without descriptions  
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'space-y-3';
      
      buttonContainer.appendChild(continueBtn.element);
      buttonContainer.appendChild(timerOnlyBtn.element);
      buttonContainer.appendChild(blockBtn.element);

      console.log('ChoiceDialog: Adding content to dialog panel...');
      
      // Add all content to dialog panel manually to avoid render issues
      const panel = this.dialog.getPanel();
      console.log('ChoiceDialog: Panel object:', panel);
      
      if (!panel) {
        console.error('ChoiceDialog: Panel is null, cannot add content');
        throw new Error('Dialog panel is not available');
      }
      
      panel.appendChild(title.element);
      panel.appendChild(body.element);
      
      // Add actions container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'mt-8';
      actionsContainer.appendChild(buttonContainer);
      panel.appendChild(actionsContainer);

      console.log('ChoiceDialog: Content added, rendering dialog...');
      
      // Render dialog to page - use a more robust approach
      this.renderDialog();
      
    } catch (error) {
      console.error('ChoiceDialog: Error creating dialog content:', error);
      this.handleDialogFailure(resolve);
    }
  }

  /**
   * Handle complete dialog failure - try simple fallback dialog
   */
  handleDialogFailure(resolve) {
    console.log('ChoiceDialog: HeadlessDialog failed, trying simple fallback dialog');
    try {
      this.createSimpleDialog(resolve);
    } catch (error) {
      console.error('ChoiceDialog: Simple dialog also failed, using continue mode:', error);
      this.handleChoice('continue', resolve);
    }
  }

  /**
   * Create a simple dialog using plain DOM elements
   */
  createSimpleDialog(resolve) {
    console.log('ChoiceDialog: Creating simple dialog...');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Create dialog box with glassmorphism styling
    const dialogBox = document.createElement('div');
    dialogBox.style.cssText = `
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.27);
      border-radius: 20px;
      padding: 24px;
      max-width: 320px;
      width: 90%;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Create simplified content
    dialogBox.innerHTML = `
      <h2 style="
        margin: 0 0 24px 0; 
        font-size: 18px; 
        font-weight: 500;
        color: #34c759;
        text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8);
        text-align: center;
      ">
        ScrollStop
      </h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button id="ss-continue" style="
          background: rgba(52, 199, 89, 0.9);
          color: white;
          border: 1px solid rgba(52, 199, 89, 1);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        ">Continue with ScrollStop</button>
        <button id="ss-timer" style="
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        ">Timer Only</button>
        <button id="ss-block" style="
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        ">Block Now</button>
      </div>
    `;
    
    // Add event listeners and hover effects
    const continueBtn = dialogBox.querySelector('#ss-continue');
    const timerBtn = dialogBox.querySelector('#ss-timer');
    const blockBtn = dialogBox.querySelector('#ss-block');
    
    // Click handlers
    continueBtn.addEventListener('click', () => {
      this.cleanupSimpleDialog(overlay);
      this.handleChoice('continue', resolve);
    });
    
    timerBtn.addEventListener('click', () => {
      this.cleanupSimpleDialog(overlay);
      this.handleChoice('timer-only', resolve);
    });
    
    blockBtn.addEventListener('click', () => {
      this.cleanupSimpleDialog(overlay);
      this.handleChoice('block', resolve);
    });
    
    // Hover effects for all buttons
    [continueBtn, timerBtn, blockBtn].forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.02)';
        button.style.boxShadow = '0px 6px 20px rgba(0, 0, 0, 0.3)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1.0)';
        button.style.boxShadow = 'none';
      });
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.cleanupSimpleDialog(overlay);
        this.handleChoice('continue', resolve);
      }
    });
    
    // Assemble and show
    overlay.appendChild(dialogBox);
    document.body.appendChild(overlay);
    
    // Store reference for cleanup
    this.simpleDialog = overlay;
    
    console.log('ChoiceDialog: Simple dialog created and shown');
  }

  /**
   * Clean up simple dialog
   */
  cleanupSimpleDialog(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    this.simpleDialog = null;
  }

  /**
   * Apply glassmorphism styling to match timer design
   */
  applyGlassmorphismStyling() {
    try {
      console.log('ChoiceDialog: Applying glassmorphism styling...');
      
      // Find the dialog panel element
      const panel = this.dialog.element.querySelector('[role="dialog"]');
      if (!panel) {
        console.error('ChoiceDialog: Could not find dialog panel for styling');
        return;
      }

      // Apply glassmorphism styling to match timer design
      panel.style.cssText += `
        background: rgba(0, 0, 0, 0.25) !important;
        backdrop-filter: blur(12px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(12px) saturate(150%) !important;
        border: 1.5px solid rgba(255, 255, 255, 0.22) !important;
        box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.27) !important;
        border-radius: 20px !important;
        max-width: 320px !important;
        color: white !important;
      `;

      // Style the title to use green accent color
      const title = panel.querySelector('h2');
      if (title) {
        title.style.cssText += `
          color: #34c759 !important;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8) !important;
          font-weight: 500 !important;
        `;
      }

      // Style the description 
      const description = panel.querySelector('p');
      if (description) {
        description.style.cssText += `
          color: rgba(255, 255, 255, 0.8) !important;
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6) !important;
        `;
      }

      // Let HeadlessButton use its default styling - no overrides

      console.log('ChoiceDialog: Glassmorphism styling applied successfully');
      
    } catch (error) {
      console.error('ChoiceDialog: Error applying glassmorphism styling:', error);
    }
  }

  /**
   * Robust dialog rendering method
   */
  renderDialog() {
    const attemptRender = () => {
      console.log('ChoiceDialog: Attempting to render dialog');
      console.log('ChoiceDialog: document.body exists:', !!document.body);
      console.log('ChoiceDialog: document.readyState:', document.readyState);
      
      // Try multiple container options
      let container = document.body;
      
      if (!container) {
        container = document.documentElement;
        console.log('ChoiceDialog: Using documentElement as container');
      }
      
      if (!container) {
        console.error('ChoiceDialog: No suitable container found');
        return false;
      }
      
      try {
        // Bypass the HeadlessDialog render method and append directly
        container.appendChild(this.dialog.element);
        console.log('ChoiceDialog: Dialog appended directly to container');
        
        // Apply glassmorphism styling
        this.applyGlassmorphismStyling();
        
        // Manually trigger dialog open state
        this.dialog.open();
        
        return true;
      } catch (error) {
        console.error('ChoiceDialog: Error appending dialog:', error);
        return false;
      }
    };
    
    // Try to render immediately
    if (attemptRender()) {
      return;
    }
    
    // If failed, wait for DOM ready
    if (document.readyState === 'loading') {
      console.log('ChoiceDialog: DOM still loading, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(attemptRender, 100);
      });
    } else {
      // Try again with a delay
      console.log('ChoiceDialog: Retrying render with delay');
      setTimeout(() => {
        if (!attemptRender()) {
          console.error('ChoiceDialog: Failed to render after all attempts, using default choice');
          // Trigger default choice if rendering completely fails
          if (this.options.onChoiceMade) {
            this.options.onChoiceMade('continue');
          }
        }
      }, 500);
    }
  }

  /**
   * Handle user choice
   */
  handleChoice(choice, resolve) {
    this.choice = choice;
    this.cleanup();

    // No session storage - dialog will appear on every reload
    console.log('ChoiceDialog: Choice made but not storing (shows on every reload):', choice);

    // Fire event for coordinator
    const event = new CustomEvent('choice-dialog-complete', {
      detail: { choice: choice }
    });
    window.dispatchEvent(event);

    // Call callback if provided
    if (this.options.onChoiceMade) {
      this.options.onChoiceMade(choice);
    }

    resolve(choice);
  }

  /**
   * Store choice in session storage
   */
  async storeSessionChoice(choice) {
    try {
      const data = {
        choice: choice,
        timestamp: Date.now(),
        hostname: window.location.hostname
      };
      
      // Store in extension storage
      if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        await browser.storage.local.set({
          [`scrollstop_choice_${window.location.hostname}`]: data
        });
      } else {
        // Fallback to sessionStorage
        sessionStorage.setItem(
          `scrollstop_choice_${window.location.hostname}`,
          JSON.stringify(data)
        );
      }
    } catch (error) {
      console.error('Error storing session choice:', error);
    }
  }

  /**
   * Clear session choice for testing (call from console)
   */
  static async clearSessionChoice(hostname) {
    try {
      const key = `scrollstop_choice_${hostname}`;
      
      if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        await browser.storage.local.remove(key);
      } else {
        sessionStorage.removeItem(key);
      }
      console.log('ScrollStop: Cleared session choice for', hostname);
    } catch (error) {
      console.error('Error clearing session choice:', error);
    }
  }

  /**
   * Check if there's already a session choice
   */
  static async getSessionChoice(hostname) {
    try {
      const key = `scrollstop_choice_${hostname}`;
      
      // Try browser.storage.local first (session storage not always available)
      if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        const result = await browser.storage.local.get(key);
        const data = result[key];
        
        if (data && data.timestamp) {
          // Check if choice is still valid (within last hour)
          const hourAgo = Date.now() - (60 * 60 * 1000);
          if (data.timestamp > hourAgo) {
            return data.choice;
          }
          // Clean up expired choice
          await browser.storage.local.remove(key);
        }
      } else {
        // Fallback to sessionStorage
        const stored = sessionStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const hourAgo = Date.now() - (60 * 60 * 1000);
          if (data.timestamp > hourAgo) {
            return data.choice;
          }
          sessionStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error getting session choice:', error);
    }
    
    return null;
  }

  /**
   * Clean up dialog
   */
  cleanup() {
    if (this.dialog) {
      this.dialog.remove();
      this.dialog = null;
    }
    if (this.simpleDialog) {
      this.cleanupSimpleDialog(this.simpleDialog);
    }
    this.isShown = false;
  }

  /**
   * Remove from DOM
   */
  remove() {
    this.cleanup();
  }
}