// timer-tracker.js - Manages persistent timer for tracking time spent on social media sites

// Cross-browser storage API compatibility
const StorageWrapper = {
  async get(keys) {
    try {
      if (typeof browser !== 'undefined' && browser.storage) {
        return await browser.storage.local.get(keys);
      } else if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.get(keys);
      } else {
        console.warn('No storage API available, using localStorage fallback');
        const result = {};
        for (const key of keys) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            try {
              result[key] = JSON.parse(value);
            } catch {
              result[key] = value;
            }
          }
        }
        return result;
      }
    } catch (error) {
      console.error('Storage get error:', error);
      return {};
    }
  },
  
  async set(data) {
    try {
      if (typeof browser !== 'undefined' && browser.storage) {
        return await browser.storage.local.set(data);
      } else if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.set(data);
      } else {
        console.warn('No storage API available, using localStorage fallback');
        for (const [key, value] of Object.entries(data)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
};

class TimerTracker {
  constructor() {
    this.timer = null;
    this.startTime = null;
    this.accumulatedTime = 0;
    this.isActive = false;
    this.isVisible = true;
    this.isDragging = false;
    this.hasDragged = false;
    this.mouseDownTime = 0;
    this.isTimerOnlyMode = false;
    
    // Storage keys
    this.STORAGE_KEYS = {
      ACCUMULATED_TIME: 'scrollstop_accumulated_time',
      LAST_RESET_DATE: 'scrollstop_last_reset_date',
      TIMER_POSITION: 'scrollstop_timer_position',
      TIMER_VISIBLE: 'scrollstop_timer_visible'
    };

    // Drag state
    this.dragOffset = { x: 0, y: 0 };
    this.initialMousePos = { x: 0, y: 0 };
    
    // Bind methods
    this.handleTimerClick = this.handleTimerClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Initialize the timer tracker
   * @param {boolean} isNewsMode - Whether this is tracking news site time
   */
  async initialize(isNewsMode = false) {
    try {
      this.isNewsMode = isNewsMode;
      
      // Check and handle daily reset
      await this.checkDailyReset();
      
      // Load accumulated time from storage
      await this.loadAccumulatedTime();
      
      // Always show timer on page reload
      this.isVisible = true;
      await StorageWrapper.set({
        [this.STORAGE_KEYS.TIMER_VISIBLE]: true
      });
      
      // Create and show timer
      await this.createTimer();
      
      // Start tracking
      this.startTracking();
      
      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing TimerTracker:', error);
    }
  }

  /**
   * Check if we need to reset the timer for a new day (12 AM reset)
   */
  async checkDailyReset() {
    try {
      const today = new Date().toDateString();
      const result = await StorageWrapper.get([this.STORAGE_KEYS.LAST_RESET_DATE]);
      const lastResetDate = result[this.STORAGE_KEYS.LAST_RESET_DATE];

      if (lastResetDate !== today) {
        // New day - reset accumulated time
        this.accumulatedTime = 0;
        await StorageWrapper.set({
          [this.STORAGE_KEYS.ACCUMULATED_TIME]: 0,
          [this.STORAGE_KEYS.LAST_RESET_DATE]: today
        });
      }
    } catch (error) {
      console.error('Error checking daily reset:', error);
    }
  }

  /**
   * Load accumulated time from storage
   */
  async loadAccumulatedTime() {
    try {
      const result = await StorageWrapper.get([this.STORAGE_KEYS.ACCUMULATED_TIME]);
      this.accumulatedTime = result[this.STORAGE_KEYS.ACCUMULATED_TIME] || 0;
    } catch (error) {
      console.error('Error loading accumulated time:', error);
      this.accumulatedTime = 0;
    }
  }

  /**
   * Create the timer UI component
   */
  async createTimer() {
    // Check if timer already exists in DOM
    const existingContainer = document.getElementById('scrollstop-timer-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    if (this.timer) {
      return; // Already exists
    }

    // Create timer with accumulated time displayed
    this.timer = new GlassmorphismTimer(this.accumulatedTime, {
      width: '80px',
      height: '36px',
      fontSize: '14px',
      padding: '8px 12px',
      clickToToggle: false, // Disable default click-to-toggle
      onClick: this.handleTimerClick
    });

    // Create container for positioning
    const container = document.createElement('div');
    container.id = 'scrollstop-timer-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      pointer-events: auto;
      cursor: grab;
    `;

    // Render timer to container
    this.timer.render(container);
    
    // Add drag functionality
    this.addDragFunctionality(container);

    // Add to page
    document.body.appendChild(container);
  }

  /**
   * Add drag functionality to timer
   */
  addDragFunctionality(container) {
    // Mouse events for desktop
    container.addEventListener('mousedown', this.handleMouseDown);
    
    // Touch events for mobile
    container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    
    // Prevent text selection during drag
    container.addEventListener('selectstart', (e) => e.preventDefault());
    container.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /**
   * Handle mouse down for drag start
   */
  handleMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button
    
    this.mouseDownTime = Date.now();
    this.hasDragged = false;
    this.isDragging = false;
    
    const container = document.getElementById('scrollstop-timer-container');
    const rect = container.getBoundingClientRect();
    
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
    this.initialMousePos.x = e.clientX;
    this.initialMousePos.y = e.clientY;
    
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    
    e.preventDefault();
  }

  /**
   * Handle mouse move for dragging
   */
  handleMouseMove(e) {
    const deltaX = Math.abs(e.clientX - this.initialMousePos.x);
    const deltaY = Math.abs(e.clientY - this.initialMousePos.y);
    
    // Start dragging if mouse moved more than 5 pixels
    if (!this.isDragging && (deltaX > 5 || deltaY > 5)) {
      this.isDragging = true;
      this.hasDragged = true;
      
      const container = document.getElementById('scrollstop-timer-container');
      if (container) {
        container.style.cursor = 'grabbing';
      }
    }
    
    if (!this.isDragging) return;
    
    const container = document.getElementById('scrollstop-timer-container');
    if (!container) return;
    
    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;
    
    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));
    
    container.style.left = clampedX + 'px';
    container.style.top = clampedY + 'px';
    container.style.transform = 'none';
    
    e.preventDefault();
  }

  /**
   * Handle mouse up for drag end
   */
  handleMouseUp(e) {
    const wasActuallyDragging = this.isDragging;
    this.isDragging = false;
    
    const container = document.getElementById('scrollstop-timer-container');
    
    if (container) {
      container.style.cursor = 'grab';
      
      // Save position if we actually dragged
      if (wasActuallyDragging) {
        this.saveTimerPosition();
      }
    }
    
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    e.preventDefault();
  }

  /**
   * Handle touch start for mobile drag
   */
  handleTouchStart(e) {
    this.mouseDownTime = Date.now();
    this.hasDragged = false;
    this.isDragging = false;
    
    const container = document.getElementById('scrollstop-timer-container');
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    
    this.dragOffset.x = touch.clientX - rect.left;
    this.dragOffset.y = touch.clientY - rect.top;
    this.initialMousePos.x = touch.clientX;
    this.initialMousePos.y = touch.clientY;
    
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    
    e.preventDefault();
  }

  /**
   * Handle touch move for mobile dragging
   */
  handleTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.initialMousePos.x);
    const deltaY = Math.abs(touch.clientY - this.initialMousePos.y);
    
    // Start dragging if touch moved more than 5 pixels
    if (!this.isDragging && (deltaX > 5 || deltaY > 5)) {
      this.isDragging = true;
      this.hasDragged = true;
      
      const container = document.getElementById('scrollstop-timer-container');
      if (container) {
        container.style.cursor = 'grabbing';
      }
    }
    
    if (!this.isDragging) return;
    
    const container = document.getElementById('scrollstop-timer-container');
    if (!container) return;
    
    const x = touch.clientX - this.dragOffset.x;
    const y = touch.clientY - this.dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;
    
    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));
    
    container.style.left = clampedX + 'px';
    container.style.top = clampedY + 'px';
    container.style.transform = 'none';
    
    e.preventDefault();
  }

  /**
   * Handle touch end for mobile drag end
   */
  handleTouchEnd(e) {
    const wasActuallyDragging = this.isDragging;
    this.isDragging = false;
    
    const container = document.getElementById('scrollstop-timer-container');
    
    if (container) {
      container.style.cursor = 'grab';
      
      // Save position if we actually dragged
      if (wasActuallyDragging) {
        this.saveTimerPosition();
      } else {
        // If we didn't drag, treat this as a tap to hide
        const tapDuration = Date.now() - this.mouseDownTime;
        if (tapDuration < 300 && !this.hasDragged) {
          this.handleTimerClick();
        }
      }
    }
    
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    
    e.preventDefault();
  }

  /**
   * Save timer position to storage
   */
  async saveTimerPosition() {
    try {
      const container = document.getElementById('scrollstop-timer-container');
      if (!container) return;
      
      const position = {
        left: container.style.left,
        top: container.style.top,
        transform: container.style.transform
      };
      
      await StorageWrapper.set({
        [this.STORAGE_KEYS.TIMER_POSITION]: position
      });
    } catch (error) {
      console.error('Error saving timer position:', error);
    }
  }

  /**
   * Load and apply saved timer position
   */
  async loadTimerPosition() {
    try {
      const result = await StorageWrapper.get([this.STORAGE_KEYS.TIMER_POSITION]);
      const position = result[this.STORAGE_KEYS.TIMER_POSITION];
      
      if (position) {
        const container = document.getElementById('scrollstop-timer-container');
        if (container) {
          if (position.left) container.style.left = position.left;
          if (position.top) container.style.top = position.top;
          if (position.transform) container.style.transform = position.transform;
        }
      }
    } catch (error) {
      console.error('Error loading timer position:', error);
    }
  }

  /**
   * Handle timer click - hide timer
   */
  async handleTimerClick(e) {
    // Don't hide if we just finished dragging
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    
    // Only hide on actual click (not after drag)
    const clickDuration = Date.now() - this.mouseDownTime;
    if (clickDuration < 300) { // Quick tap/click
      await this.hideTimer();
    }
    
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Hide the timer
   */
  async hideTimer() {
    try {
      const container = document.getElementById('scrollstop-timer-container');
      if (container) {
        container.remove();
      }
      
      this.isVisible = false;
      await StorageWrapper.set({
        [this.STORAGE_KEYS.TIMER_VISIBLE]: false
      });
    } catch (error) {
      console.error('Error hiding timer:', error);
    }
  }

  /**
   * Start time tracking
   */
  startTracking() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startTime = Date.now();
    
    // Update timer display every second
    this.updateInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);
  }

  /**
   * Stop time tracking and save accumulated time
   */
  async stopTracking() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Add session time to accumulated time
    if (this.startTime) {
      const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.accumulatedTime += sessionTime;
      await this.saveAccumulatedTime();
      
      // If this is news mode, also track in TimeManager
      if (this.isNewsMode) {
        const sessionTimeMs = sessionTime * 1000;
        const limitExceeded = await TimeManager.addNewsTime(sessionTimeMs);
        
        if (limitExceeded) {
          // News time limit exceeded, show blocking screen
          console.log('News time limit exceeded, triggering block');
          window.dispatchEvent(
            new CustomEvent("news-time-limit-exceeded", {
              detail: { sessionTime: sessionTimeMs },
            })
          );
        }
      }
    }
  }

  /**
   * Update timer display with current accumulated + session time
   */
  updateTimerDisplay() {
    if (!this.timer || !this.isActive) return;
    
    const currentSessionTime = this.startTime ? 
      Math.floor((Date.now() - this.startTime) / 1000) : 0;
    const totalTime = this.accumulatedTime + currentSessionTime;
    
    this.timer.setTime(totalTime);
  }

  /**
   * Save accumulated time to storage
   */
  async saveAccumulatedTime() {
    try {
      await StorageWrapper.set({
        [this.STORAGE_KEYS.ACCUMULATED_TIME]: this.accumulatedTime
      });
    } catch (error) {
      console.error('Error saving accumulated time:', error);
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Save time when page unloads
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    
    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Handle page focus/blur
    window.addEventListener('focus', () => {
      if (!this.isActive) this.startTracking();
    });
    
    window.addEventListener('blur', () => {
      this.handleBeforeUnload();
    });
  }

  /**
   * Handle page unload - save current session
   */
  async handleBeforeUnload() {
    if (this.isActive && this.startTime) {
      const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.accumulatedTime += sessionTime;
      
      // Use synchronous storage for unload events
      try {
        StorageWrapper.set({
          [this.STORAGE_KEYS.ACCUMULATED_TIME]: this.accumulatedTime
        });
        
        // If this is news mode, also track in TimeManager
        if (this.isNewsMode) {
          const sessionTimeMs = sessionTime * 1000;
          await TimeManager.addNewsTime(sessionTimeMs);
        }
      } catch (error) {
        console.error('Error saving time on unload:', error);
      }
    }
  }

  /**
   * Handle visibility change (tab switching)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Tab became hidden - pause tracking
      this.handleBeforeUnload();
      this.isActive = false;
    } else {
      // Tab became visible - resume tracking
      if (!this.isActive) {
        this.startTracking();
      }
    }
  }

  /**
   * Clean up timer tracker
   */
  cleanup() {
    // Stop tracking and save
    this.stopTracking();
    
    // Remove timer from DOM
    const container = document.getElementById('scrollstop-timer-container');
    if (container) {
      container.remove();
    }
    
    // Remove event listeners
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    
    // Clear intervals
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.timer = null;
  }

  /**
   * Get current total time (accumulated + current session)
   */
  getCurrentTotalTime() {
    const currentSessionTime = this.startTime && this.isActive ? 
      Math.floor((Date.now() - this.startTime) / 1000) : 0;
    return this.accumulatedTime + currentSessionTime;
  }

  /**
   * Set timer-only mode (prevents hiding on click)
   */
  setTimerOnlyMode(enabled) {
    this.isTimerOnlyMode = enabled;
    
    // Update timer appearance to indicate mode
    const container = document.getElementById('scrollstop-timer-container');
    if (container && enabled) {
      // Add visual indicator for timer-only mode
      container.style.opacity = '0.9';
      container.title = 'Timer Only Mode - Tracking time without blocking';
    } else if (container) {
      container.style.opacity = '1';
      container.title = 'Click to hide timer';
    }
  }

  /**
   * Reset timer (for testing purposes)
   */
  async resetTimer() {
    try {
      this.accumulatedTime = 0;
      this.startTime = Date.now();
      
      await StorageWrapper.set({
        [this.STORAGE_KEYS.ACCUMULATED_TIME]: 0
      });
      
      if (this.timer) {
        this.timer.setTime(0);
      }
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  }
}

// Make TimerTracker available globally
window.TimerTracker = TimerTracker;