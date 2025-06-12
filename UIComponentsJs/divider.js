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
 *
 * // Divider with custom CSS classes
 * new HeadlessDivider({
 *   className: 'my-custom-divider my-spacing'
 * }).render('#special-section');
 *
 * // Vertical divider (using custom CSS)
 * new HeadlessDivider({
 *   className: 'h-8 w-px border-l border-t-0'
 * }).render('#sidebar');
 *
 * // Divider with custom attributes
 * new HeadlessDivider({
 *   id: 'section-divider',
 *   'data-section': 'footer'
 * }).render('#page');
 *
 * // Multiple dividers with different styles
 * HeadlessDivider.createGroup('#sections', [
 *   { soft: true },
 *   { soft: false },
 *   { className: 'border-red-200 dark:border-red-800' }
 * ]);
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

  // Method to update the soft state
  setSoft(soft) {
    this.options.soft = soft;
    this.element.className = this.getClasses();
    return this;
  }

  // Method to toggle between soft and hard
  toggle() {
    return this.setSoft(!this.options.soft);
  }

  // Method to add custom classes
  addClass(className) {
    if (!this.options.className.includes(className)) {
      this.options.className = this.options.className
        ? `${this.options.className} ${className}`
        : className;
      this.element.className = this.getClasses();
    }
    return this;
  }

  // Method to remove custom classes
  removeClass(className) {
    this.options.className = this.options.className
      .split(' ')
      .filter((cls) => cls !== className)
      .join(' ');
    this.element.className = this.getClasses();
    return this;
  }

  // Method to update custom classes completely
  setClassName(className) {
    this.options.className = className;
    this.element.className = this.getClasses();
    return this;
  }

  // Method to get current state
  isSoft() {
    return this.options.soft;
  }

  // Method to set attributes
  setAttribute(name, value) {
    this.options[name] = value;
    this.element.setAttribute(name, value);
    return this;
  }

  // Method to remove attributes
  removeAttribute(name) {
    delete this.options[name];
    this.element.removeAttribute(name);
    return this;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create multiple dividers
  static createGroup(container, dividers) {
    const group = document.createElement('div');
    const dividerInstances = [];

    dividers.forEach((config, index) => {
      // Add some spacing between dividers if not specified
      if (index > 0) {
        const spacer = document.createElement('div');
        spacer.className = 'h-4'; // Default spacing
        group.appendChild(spacer);
      }

      const dividerInstance = new HeadlessDivider(config);
      dividerInstance.render(group);
      dividerInstances.push(dividerInstance);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    // Return an object with the group element and methods to interact with the group
    return {
      element: group,
      dividers: dividerInstances,
      setAllSoft: (soft) => {
        dividerInstances.forEach((divider) => divider.setSoft(soft));
      },
      toggleAll: () => {
        dividerInstances.forEach((divider) => divider.toggle());
      },
    };
  }

  // Static method to create a section with content and dividers
  static createSection(container, sections) {
    const wrapper = document.createElement('div');

    sections.forEach((section, index) => {
      // Add content
      if (section.content) {
        const contentDiv = document.createElement('div');
        if (typeof section.content === 'string') {
          contentDiv.innerHTML = section.content;
        } else if (section.content instanceof HTMLElement) {
          contentDiv.appendChild(section.content);
        }
        wrapper.appendChild(contentDiv);
      }

      // Add divider (except after the last section)
      if (index < sections.length - 1) {
        const dividerOptions = section.divider || {};
        new HeadlessDivider(dividerOptions).render(wrapper);
      }
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(wrapper);

    return wrapper;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessDivider;
}
