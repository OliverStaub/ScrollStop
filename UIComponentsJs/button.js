/**
 * HeadlessButton - A comprehensive button component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic button
 * new HeadlessButton('Click me').render('#container');
 *
 * // Colored button with click handler
 * new HeadlessButton('Save', {
 *   color: 'blue',
 *   onClick: () => console.log('Saved!')
 * }).render(document.body);
 *
 * // Outline variant
 * new HeadlessButton('Cancel', {
 *   outline: true,
 *   onClick: () => console.log('Cancelled')
 * }).render('#form-actions');
 *
 * // Plain variant (minimal styling)
 * new HeadlessButton('Link Style', {
 *   plain: true
 * }).render('.sidebar');
 *
 * // As a link
 * new HeadlessButton('Go to Page', {
 *   href: '/dashboard',
 *   color: 'green'
 * }).render('#navigation');
 *
 * // Disabled state
 * new HeadlessButton('Disabled', {
 *   disabled: true,
 *   color: 'red'
 * }).render('#controls');
 *
 * // With custom CSS classes
 * new HeadlessButton('Custom', {
 *   className: 'my-custom-class',
 *   color: 'purple'
 * }).render('#special-section');
 *
 * AVAILABLE COLORS:
 * 'dark/zinc', 'light', 'dark/white', 'dark', 'white', 'zinc', 'indigo', 'cyan',
 * 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
 * 'sky', 'blue', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
 */
class HeadlessButton {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      color: options.color || null,
      outline: options.outline || false,
      plain: options.plain || false,
      className: options.className || "",
      onClick: options.onClick || null,
      href: options.href || null,
      disabled: options.disabled || false,
      target: options.target || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations (converted from the original React component)
  static styles = {
    base: [
      // Base
      "relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",
      // Sizing
      "px-[calc(theme(spacing.3.5)-1px)] py-[calc(theme(spacing.2.5)-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing.1.5)-1px)] sm:text-sm/6",
      // Focus
      "focus:outline-2 focus:outline-offset-2 focus:outline-blue-500",
      // Disabled
      "disabled:opacity-50",
      // Transitions
      "transition-colors duration-200",
    ],

    solid: [
      // Optical border, implemented as the button background
      "border-transparent",
      // Button background
      "shadow-sm",
      // Hover states
      "hover:shadow-md active:shadow-sm",
    ],

    outline: [
      // Base
      "border-zinc-950/10 text-zinc-950 hover:bg-zinc-950/2.5 active:bg-zinc-950/2.5",
      // Dark mode
      "dark:border-white/15 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/5",
    ],

    plain: [
      // Base
      "border-transparent text-zinc-950 hover:bg-zinc-950/5 active:bg-zinc-950/5",
      // Dark mode
      "dark:text-white dark:hover:bg-white/10 dark:active:bg-white/10",
    ],

    colors: {
      "dark/zinc":
        "text-white bg-zinc-900 border-zinc-950/90 hover:bg-zinc-800 active:bg-zinc-900",
      light:
        "text-zinc-950 bg-white border-zinc-950/10 hover:bg-zinc-50 active:bg-zinc-100",
      "dark/white":
        "text-white bg-zinc-900 border-zinc-950/90 hover:bg-zinc-800 dark:text-zinc-950 dark:bg-white dark:hover:bg-zinc-100",
      dark: "text-white bg-zinc-900 border-zinc-950/90 hover:bg-zinc-800 active:bg-zinc-900",
      white:
        "text-zinc-950 bg-white border-zinc-950/10 hover:bg-zinc-50 active:bg-zinc-100",
      zinc: "text-white bg-zinc-600 border-zinc-700/90 hover:bg-zinc-500 active:bg-zinc-600",
      indigo:
        "text-white bg-indigo-500 border-indigo-600/90 hover:bg-indigo-400 active:bg-indigo-500",
      cyan: "text-cyan-950 bg-cyan-300 border-cyan-400/80 hover:bg-cyan-200 active:bg-cyan-300",
      red: "text-white bg-red-600 border-red-700/90 hover:bg-red-500 active:bg-red-600",
      orange:
        "text-white bg-orange-500 border-orange-600/90 hover:bg-orange-400 active:bg-orange-500",
      amber:
        "text-amber-950 bg-amber-400 border-amber-500/80 hover:bg-amber-300 active:bg-amber-400",
      yellow:
        "text-yellow-950 bg-yellow-300 border-yellow-400/80 hover:bg-yellow-200 active:bg-yellow-300",
      lime: "text-lime-950 bg-lime-300 border-lime-400/80 hover:bg-lime-200 active:bg-lime-300",
      green:
        "text-white bg-green-600 border-green-700/90 hover:bg-green-500 active:bg-green-600",
      emerald:
        "text-white bg-emerald-600 border-emerald-700/90 hover:bg-emerald-500 active:bg-emerald-600",
      teal: "text-white bg-teal-600 border-teal-700/90 hover:bg-teal-500 active:bg-teal-600",
      sky: "text-white bg-sky-500 border-sky-600/80 hover:bg-sky-400 active:bg-sky-500",
      blue: "text-white bg-blue-600 border-blue-700/90 hover:bg-blue-500 active:bg-blue-600",
      violet:
        "text-white bg-violet-500 border-violet-600/90 hover:bg-violet-400 active:bg-violet-500",
      purple:
        "text-white bg-purple-500 border-purple-600/90 hover:bg-purple-400 active:bg-purple-500",
      fuchsia:
        "text-white bg-fuchsia-500 border-fuchsia-600/90 hover:bg-fuchsia-400 active:bg-fuchsia-500",
      pink: "text-white bg-pink-500 border-pink-600/90 hover:bg-pink-400 active:bg-pink-500",
      rose: "text-white bg-rose-500 border-rose-600/90 hover:bg-rose-400 active:bg-rose-500",
    },
  };

  createElement() {
    // Create either a button or anchor element
    const element = this.options.href
      ? document.createElement("a")
      : document.createElement("button");

    // Set basic properties
    if (this.options.href) {
      element.href = this.options.href;
      if (this.options.target) {
        element.target = this.options.target;
      }
    } else {
      element.type = "button";
      if (this.options.disabled) {
        element.disabled = true;
      }
    }

    // Set text content
    element.textContent = this.text;

    // Apply CSS classes
    element.className = this.getClasses();

    // Add click handler
    if (this.options.onClick) {
      element.addEventListener("click", this.options.onClick);
    }

    // Add touch target for mobile (simplified version)
    this.addTouchTarget(element);

    return element;
  }

  getClasses() {
    const classes = [...HeadlessButton.styles.base];

    if (this.options.outline) {
      classes.push(...HeadlessButton.styles.outline);
    } else if (this.options.plain) {
      classes.push(...HeadlessButton.styles.plain);
    } else {
      classes.push(...HeadlessButton.styles.solid);
      const colorKey = this.options.color || "dark/zinc";
      if (HeadlessButton.styles.colors[colorKey]) {
        classes.push(HeadlessButton.styles.colors[colorKey]);
      }
    }

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  addTouchTarget(element) {
    // Add touch target for better mobile UX
    const touchTarget = document.createElement("span");
    touchTarget.className =
      "absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden";
    touchTarget.setAttribute("aria-hidden", "true");

    // Insert at beginning of element
    element.style.position = "relative";
    element.insertBefore(touchTarget, element.firstChild);
  }

  // Method to render the button to a container
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

  // Method to update button text
  setText(newText) {
    this.text = newText;
    // Preserve the touch target (first child)
    const touchTarget = this.element.firstChild;
    this.element.textContent = newText;
    if (touchTarget && touchTarget.getAttribute("aria-hidden") === "true") {
      this.element.insertBefore(touchTarget, this.element.firstChild);
    }
    return this;
  }

  // Method to update classes (useful for state changes)
  updateClasses() {
    this.element.className = this.getClasses();
    return this;
  }

  // Method to enable/disable button
  setDisabled(disabled) {
    this.options.disabled = disabled;
    if (this.element.tagName === "BUTTON") {
      this.element.disabled = disabled;
    }
    this.updateClasses();
    return this;
  }

  // Method to update color
  setColor(color) {
    this.options.color = color;
    this.updateClasses();
    return this;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create multiple buttons easily
  static createGroup(container, buttons) {
    const group = document.createElement("div");
    group.className = "flex gap-2";

    buttons.forEach((config) => {
      new HeadlessButton(config.text, config.options).render(group);
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
  module.exports = HeadlessButton;
}
