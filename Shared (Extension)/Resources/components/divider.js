/**
 * HeadlessDivider - A simple divider component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic divider
 * new HeadlessDivider().render('#container');
 *
 * // Soft divider (lighter color)
 * new HeadlessDivider({
 *   soft: true
 * }).render(document.body);
 *
 * // Hard divider (default, darker color)
 * new HeadlessDivider({
 *   soft: false
 * }).render('#content');
 */
class HeadlessDivider {
  constructor(options = {}) {
    this.options = {
      soft: options.soft !== undefined ? options.soft : false,
      className: options.className || '',
      id: options.id || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations (converted from the original React component)
  static styles = {
    base: ['w-full border-t'],

    soft: ['border-zinc-950/5 dark:border-white/5'],

    hard: ['border-zinc-950/10 dark:border-white/10'],
  };

  createElement() {
    // Create the divider element (hr)
    const divider = document.createElement('hr');
    divider.setAttribute('role', 'presentation');

    // Apply CSS classes
    divider.className = this.getClasses();

    // Set id if provided
    if (this.options.id) {
      divider.id = this.options.id;
    }

    // Set any additional attributes (excluding the ones we handle specially)
    Object.keys(this.options).forEach((key) => {
      if (!['soft', 'className', 'id'].includes(key)) {
        divider.setAttribute(key, this.options[key]);
      }
    });

    return divider;
  }

  getClasses() {
    const classes = [...HeadlessDivider.styles.base];

    // Add soft or hard styles
    if (this.options.soft) {
      classes.push(...HeadlessDivider.styles.soft);
    } else {
      classes.push(...HeadlessDivider.styles.hard);
    }

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  // Method to render the divider to a container
  render(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (!container) {
      throw new Error('Container not found');
    }

    container.appendChild(this.element);
    return this;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessDivider;
} else {
  window.HeadlessDivider = HeadlessDivider;
}
