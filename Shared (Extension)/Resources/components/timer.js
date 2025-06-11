/**
 * GlassmorphismTimer - A customizable timer component with Face ID styling
 *
 * USAGE EXAMPLES:
 *
 * // Basic 30-second timer with default size
 * new GlassmorphismTimer(30).render('#container');
 *
 * // Custom size and click handler
 * new GlassmorphismTimer(120, {
 *   width: '80px',
 *   height: '36px',
 *   fontSize: '16px',
 *   onClick: (timer) => console.log('Timer clicked!', timer.getTime())
 * }).render(document.body);
 *
 * // Small timer with callbacks
 * new GlassmorphismTimer(60, {
 *   width: '48px',
 *   height: '24px',
 *   fontSize: '10px',
 *   onStart: () => console.log('Timer started'),
 *   onStop: () => console.log('Timer stopped'),
 *   onComplete: () => console.log('Timer finished!'),
 *   onTick: (timeLeft) => console.log(`${timeLeft}s remaining`)
 * }).render('.timer-container');
 *
 * // Manual control with large size
 * const timer = new GlassmorphismTimer(300, {
 *   width: '120px',
 *   height: '48px',
 *   fontSize: '20px',
 *   padding: '12px 24px'
 * });
 * timer.render('#app');
 * timer.start();
 *
 * SIZE OPTIONS:
 * width: CSS width value (default: '56px')
 * height: CSS height value (default: '27px')
 * fontSize: CSS font-size (default: '12px')
 * padding: CSS padding (default: '5px 10px')
 * borderRadius: CSS border-radius (default: '35px')
 *
 * METHODS:
 * start() - Start the timer
 * stop() - Stop/pause the timer
 * reset() - Reset to initial time
 * setTime(seconds) - Set new time
 * getTime() - Get current time remaining
 * isRunning() - Check if timer is active
 * destroy() - Clean up and remove from DOM
 */
class GlassmorphismTimer {
  constructor(initialSeconds, options = {}) {
    this.initialTime = initialSeconds;
    this.currentTime = initialSeconds;
    this.isActive = false;
    this.intervalId = null;

    this.options = {
      width: options.width || "56px",
      height: options.height || "27px",
      fontSize: options.fontSize || "12px",
      padding: options.padding || "5px 10px",
      borderRadius: options.borderRadius || "35px",
      onClick: options.onClick || null,
      onStart: options.onStart || null,
      onStop: options.onStop || null,
      onComplete: options.onComplete || null,
      onTick: options.onTick || null,
      className: options.className || "",
      clickToToggle: options.clickToToggle !== false, // default true
      ...options,
    };

    this.element = null;
    this.timeDisplay = null;
    this.createElement();
  }

  // Base styles
  static styles = {
    container: [
      "position: relative",
      "display: inline-flex",
      "align-items: center",
      "justify-content: center",
      "cursor: pointer",
      "user-select: none",
      "transition: all 0.2s ease",
      "outline: none",
    ],

    background: [
      "background: rgba(0, 0, 0, 0.25)",
      "backdrop-filter: blur(12px) saturate(150%)",
      "-webkit-backdrop-filter: blur(12px) saturate(150%)",
      "border: 1.5px solid rgba(255, 255, 255, 0.22)",
      "box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.27)",
      "position: absolute",
      "top: 0",
      "left: 0",
      "width: 100%",
      "height: 100%",
    ],

    timeDisplay: [
      "color: #34c759",
      "text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8)",
      'font-family: "SF Mono", "Monaco", "Consolas", monospace',
      "font-weight: 500",
      "text-align: center",
      "line-height: 1.2",
      "position: absolute",
      "top: 50%",
      "left: 50%",
      "transform: translate(-48%, -43%)",
      "z-index: 1",
      "white-space: nowrap",
      "width: 100%",
      "display: flex",
      "align-items: center",
      "justify-content: center",
    ],

    hover: [
      "transform: scale(1.02)",
      "box-shadow: 0px 6px 40px rgba(0, 0, 0, 0.2)",
    ],

    active: ["transform: scale(0.98)"],

    running: [
      "box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), 0px 0px 20px rgba(52, 199, 89, 0.6), inset 0px 1px 0px rgba(255, 255, 255, 0.27)",
    ],
  };

  createElement() {
    // Create main container
    this.element = document.createElement("div");
    this.element.className = "glassmorphism-timer";
    this.element.style.cssText = this.getContainerStyles();

    // Create background element
    const background = document.createElement("div");
    background.className = "timer-background";
    background.style.cssText = this.getBackgroundStyles();

    // Create time display
    this.timeDisplay = document.createElement("div");
    this.timeDisplay.className = "timer-display";
    this.timeDisplay.style.cssText = this.getTimeDisplayStyles();
    this.timeDisplay.textContent = this.formatTime(this.currentTime);

    // Assemble elements
    this.element.appendChild(background);
    this.element.appendChild(this.timeDisplay);

    // Add event listeners
    this.addEventListeners();

    // Add custom classes
    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }
  }

  getContainerStyles() {
    const size = this.getSizeConfig();
    const baseStyles = GlassmorphismTimer.styles.container.join("; ");

    return `${baseStyles}; width: ${size.width}; height: ${size.height}; border-radius: ${size.borderRadius};`;
  }

  getBackgroundStyles() {
    const size = this.getSizeConfig();
    const baseStyles = GlassmorphismTimer.styles.background.join("; ");

    return `${baseStyles}; border-radius: ${size.borderRadius};`;
  }

  getTimeDisplayStyles() {
    const size = this.getSizeConfig();
    const baseStyles = GlassmorphismTimer.styles.timeDisplay.join("; ");

    return `${baseStyles}; font-size: ${size.fontSize}; padding: ${size.padding};`;
  }

  getSizeConfig() {
    return {
      width: this.options.width,
      height: this.options.height,
      fontSize: this.options.fontSize,
      padding: this.options.padding,
      borderRadius: this.options.borderRadius,
    };
  }

  addEventListeners() {
    // Click handler
    this.element.addEventListener("click", (e) => {
      e.preventDefault();

      if (this.options.clickToToggle) {
        this.toggle();
      }

      if (this.options.onClick) {
        this.options.onClick(this);
      }
    });

    // Hover effects
    this.element.addEventListener("mouseenter", () => {
      this.element.style.transform = "scale(1.02)";
      const bg = this.element.querySelector(".timer-background");
      bg.style.boxShadow = "0px 6px 40px rgba(0, 0, 0, 0.2)";
    });

    this.element.addEventListener("mouseleave", () => {
      this.element.style.transform = "scale(1)";
      this.updateBackgroundShadow();
    });

    // Active state
    this.element.addEventListener("mousedown", () => {
      this.element.style.transform = "scale(0.98)";
    });

    this.element.addEventListener("mouseup", () => {
      this.element.style.transform = "scale(1.02)";
    });

    // Keyboard support
    this.element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.element.click();
      }
    });

    // Make focusable
    this.element.tabIndex = 0;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  updateDisplay() {
    if (this.timeDisplay) {
      this.timeDisplay.textContent = this.formatTime(this.currentTime);
    }
  }

  updateBackgroundShadow() {
    const bg = this.element?.querySelector(".timer-background");
    if (bg) {
      if (this.isActive) {
        bg.style.boxShadow =
          "0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), 0px 0px 20px rgba(52, 199, 89, 0.6), inset 0px 1px 0px rgba(255, 255, 255, 0.27)";
      } else {
        bg.style.boxShadow = "0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.27)";
      }
    }
  }

  // Timer control methods
  start() {
    if (this.isActive || this.currentTime <= 0) return this;

    this.isActive = true;
    this.updateBackgroundShadow();

    if (this.options.onStart) {
      this.options.onStart(this);
    }

    this.intervalId = setInterval(() => {
      this.currentTime--;
      this.updateDisplay();

      if (this.options.onTick) {
        this.options.onTick(this.currentTime, this);
      }

      if (this.currentTime <= 0) {
        this.complete();
      }
    }, 1000);

    return this;
  }

  stop() {
    if (!this.isActive) return this;

    this.isActive = false;
    this.updateBackgroundShadow();

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.options.onStop) {
      this.options.onStop(this);
    }

    return this;
  }

  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
    return this;
  }

  reset() {
    this.stop();
    this.currentTime = this.initialTime;
    this.updateDisplay();
    return this;
  }

  complete() {
    this.stop();

    if (this.options.onComplete) {
      this.options.onComplete(this);
    }

    return this;
  }

  // Getter/setter methods
  setTime(seconds) {
    const wasRunning = this.isActive;
    this.stop();
    this.currentTime = Math.max(0, Math.floor(seconds));
    this.updateDisplay();

    if (wasRunning && this.currentTime > 0) {
      this.start();
    }

    return this;
  }

  getTime() {
    return this.currentTime;
  }

  isRunning() {
    return this.isActive;
  }

  // Utility methods
  updateSize(sizeOptions) {
    // Update size options
    if (sizeOptions.width) this.options.width = sizeOptions.width;
    if (sizeOptions.height) this.options.height = sizeOptions.height;
    if (sizeOptions.fontSize) this.options.fontSize = sizeOptions.fontSize;
    if (sizeOptions.padding) this.options.padding = sizeOptions.padding;
    if (sizeOptions.borderRadius)
      this.options.borderRadius = sizeOptions.borderRadius;

    // Reapply styles
    this.element.style.cssText = this.getContainerStyles();

    const bg = this.element.querySelector(".timer-background");
    bg.style.cssText = this.getBackgroundStyles();

    this.timeDisplay.style.cssText = this.getTimeDisplayStyles();

    return this;
  }

  // Render method
  render(container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (!container) {
      throw new Error("Container not found");
    }

    container.appendChild(this.element);
    return this;
  }

  // Cleanup method
  destroy() {
    this.stop();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
    this.timeDisplay = null;

    return this;
  }

  // Static helper methods
  static createGroup(container, timers) {
    const group = document.createElement("div");
    group.className = "timer-group";
    group.style.cssText = "display: flex; gap: 8px; align-items: center;";

    timers.forEach((config) => {
      new GlassmorphismTimer(config.time, config.options).render(group);
    });

    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    return group;
  }
}

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GlassmorphismTimer;
}
