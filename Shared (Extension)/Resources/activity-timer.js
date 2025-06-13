// UIComponentsJs/activity-timer.js
// 5-minute activity timer with completion celebration

class ActivityTimer {
  constructor(options = {}) {
    this.options = {
      duration: options.duration || 5 * 60 * 1000, // 5 minutes default
      onComplete: options.onComplete || null,
      onTick: options.onTick || null,
      containerClass: options.containerClass || '',
      ...options,
    };

    this.element = null;
    this.isRunning = false;
    this.startTime = null;
    this.remainingTime = this.options.duration;
    this.interval = null;
    this.activity = null;
  }

  render(container) {
    if (!container) {
      throw new Error('Container element is required');
    }

    this.element = document.createElement('div');
    this.element.className = `activity-timer ${this.options.containerClass}`;
    this.element.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    this.createTimerContent();
    container.appendChild(this.element);
    return this.element;
  }

  createTimerContent() {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = `
      <div class="timer-content">
        <div style="font-size: 3rem; margin-bottom: 16px;" id="activity-emoji">
          ⏱️
        </div>
        
        <h3 style="
          font-size: 1.5rem; 
          font-weight: 600; 
          color: #1f2937; 
          margin: 0 0 8px 0;
        " id="activity-title">
          Ready to start?
        </h3>
        
        <p style="
          font-size: 1rem; 
          color: #6b7280; 
          margin: 0 0 24px 0;
        " id="activity-description">
          Choose an activity to begin your 5-minute timer
        </p>

        <div style="
          font-size: 3rem; 
          font-weight: 700; 
          color: #1f2937;
          margin: 24px 0;
          font-variant-numeric: tabular-nums;
        " id="timer-display">
          5:00
        </div>

        <div class="timer-progress" style="
          width: 100%;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          margin: 24px 0;
          overflow: hidden;
        ">
          <div id="progress-bar" style="
            width: 0%;
            height: 100%;
            background: #10b981;
            border-radius: 4px;
            transition: width 0.1s linear;
          "></div>
        </div>

        <div id="timer-controls" class="timer-controls">
          <!-- Controls will be added here -->
        </div>
      </div>
    `;

    this.createControls();
  }

  createControls() {
    const controlsContainer = this.element.querySelector('#timer-controls');
    if (!controlsContainer) {
      return;
    }

    if (!this.isRunning) {
      // Show start button
      const startButton = new HeadlessButton('Start Timer', {
        color: 'zinc',
        size: 'lg',
        onClick: () => this.start(),
      });

      controlsContainer.appendChild(startButton.element);
    } else {
      // Show pause/resume and stop buttons
      const pauseButton = new HeadlessButton('Pause', {
        color: 'zinc',
        outline: true,
        onClick: () => this.pause(),
      });

      const stopButton = new HeadlessButton('Stop', {
        color: 'red',
        outline: true,
        onClick: () => this.stop(),
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: center;
      `;

      buttonContainer.appendChild(pauseButton.element);
      buttonContainer.appendChild(stopButton.element);
      controlsContainer.appendChild(buttonContainer);
    }
  }

  setActivity(activity) {
    this.activity = activity;

    const emoji = this.element.querySelector('#activity-emoji');
    const title = this.element.querySelector('#activity-title');
    const description = this.element.querySelector('#activity-description');

    if (emoji) {
      emoji.textContent = activity.emoji;
    }
    if (title) {
      title.textContent = activity.text;
    }
    if (description) {
      description.textContent = `Take 5 minutes to focus on this activity`;
    }
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();

    // If we're resuming, adjust start time
    if (this.remainingTime < this.options.duration) {
      this.startTime = Date.now() - (this.options.duration - this.remainingTime);
    }

    this.interval = setInterval(() => {
      this.tick();
    }, 100); // Update every 100ms for smooth progress

    this.updateDisplay();
    this.createControls();
  }

  pause() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.remainingTime = Math.max(0, this.options.duration - (Date.now() - this.startTime));

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.updateDisplay();
    this.createControls();
  }

  stop() {
    this.isRunning = false;
    this.remainingTime = this.options.duration;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.updateDisplay();
    this.createControls();
  }

  tick() {
    if (!this.isRunning) {
      return;
    }

    const elapsed = Date.now() - this.startTime;
    this.remainingTime = Math.max(0, this.options.duration - elapsed);

    this.updateDisplay();

    if (this.options.onTick) {
      this.options.onTick(this.remainingTime, elapsed);
    }

    if (this.remainingTime <= 0) {
      this.complete();
    }
  }

  complete() {
    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.showCompletionDialog();

    if (this.options.onComplete) {
      this.options.onComplete();
    }
  }

  updateDisplay() {
    const timerDisplay = this.element.querySelector('#timer-display');
    const progressBar = this.element.querySelector('#progress-bar');

    if (timerDisplay) {
      const minutes = Math.floor(this.remainingTime / 60000);
      const seconds = Math.floor((this.remainingTime % 60000) / 1000);
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (progressBar) {
      const progress = ((this.options.duration - this.remainingTime) / this.options.duration) * 100;
      progressBar.style.width = `${Math.min(100, progress)}%`;
    }
  }

  showCompletionDialog() {
    // Replace timer content with completion dialog
    this.element.innerHTML = `
      <div class="completion-content" style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 24px;">
          🎉
        </div>
        
        <h2 style="
          font-size: 2rem; 
          font-weight: 700; 
          color: #10b981; 
          margin: 0 0 16px 0;
        ">
          Time's Up!
        </h2>
        
        <p style="
          font-size: 1.1rem; 
          color: #6b7280; 
          margin: 0 0 32px 0;
          line-height: 1.5;
        ">
          Did you successfully complete "${this.activity?.text || 'your activity'}"?
        </p>

        <div id="completion-controls" style="
          display: flex;
          gap: 16px;
          justify-content: center;
        ">
          <!-- Completion buttons will be added here -->
        </div>
      </div>
    `;

    this.createCompletionControls();
  }

  createCompletionControls() {
    const controlsContainer = this.element.querySelector('#completion-controls');
    if (!controlsContainer) {
      return;
    }

    const yesButton = new HeadlessButton('Yes! 🎉', {
      color: 'green',
      size: 'lg',
      onClick: () => this.handleCompletion(true),
    });

    const noButton = new HeadlessButton('Not quite', {
      color: 'zinc',
      outline: true,
      size: 'lg',
      onClick: () => this.handleCompletion(false),
    });

    controlsContainer.appendChild(yesButton.element);
    controlsContainer.appendChild(noButton.element);
  }

  handleCompletion(successful) {
    if (successful) {
      this.showCelebration();
    } else {
      this.showEncouragement();
    }
  }

  showCelebration() {
    this.element.innerHTML = `
      <div class="celebration" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 24px; animation: bounce 1s infinite;">
          🏆
        </div>
        
        <h2 style="
          font-size: 2rem; 
          font-weight: 700; 
          color: #10b981; 
          margin: 0 0 16px 0;
        ">
          Awesome! 🎉
        </h2>
        
        <p style="
          font-size: 1.1rem; 
          color: #6b7280; 
          margin: 0 0 32px 0;
          line-height: 1.5;
        ">
          You completed your activity! That's a great step towards breaking the doomscroll habit.
        </p>

        <div style="margin: 24px 0;">
          ${this.createConfetti()}
        </div>
      </div>
    `;

    this.animateCelebration();
  }

  showEncouragement() {
    this.element.innerHTML = `
      <div class="encouragement" style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 24px;">
          💪
        </div>
        
        <h2 style="
          font-size: 2rem; 
          font-weight: 700; 
          color: #6366f1; 
          margin: 0 0 16px 0;
        ">
          That's okay!
        </h2>
        
        <p style="
          font-size: 1.1rem; 
          color: #6b7280; 
          margin: 0 0 32px 0;
          line-height: 1.5;
        ">
          Taking a break from scrolling is already a win. Every small step counts!
        </p>
      </div>
    `;
  }

  createConfetti() {
    const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];
    let confetti = '';

    for (let i = 0; i < 20; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const left = Math.random() * 100;

      confetti += `
        <div style="
          position: absolute;
          left: ${left}%;
          top: -10px;
          width: 8px;
          height: 8px;
          background: ${color};
          border-radius: 50%;
          animation: confetti-fall ${duration}s ease-in ${delay}s infinite;
          pointer-events: none;
        "></div>
      `;
    }

    return `<div style="position: relative; height: 100px; overflow: hidden;">${confetti}</div>`;
  }

  animateCelebration() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100px) rotate(360deg);
          opacity: 0;
        }
      }
    `;

    document.head.appendChild(style);

    // Remove style after animation
    setTimeout(() => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 10000);
  }

  // Public methods
  reset() {
    this.stop();
    this.createTimerContent();
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  isTimerRunning() {
    return this.isRunning;
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ActivityTimer;
} else {
  window.ActivityTimer = ActivityTimer;
}
