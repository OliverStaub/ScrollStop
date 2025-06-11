/**
 * HeadlessDescriptionList - A comprehensive description list component suite
 *
 * USAGE EXAMPLES:
 *
 * // Basic description list
 * new HeadlessDescriptionList().render('#container');
 *
 * // With terms and details
 * const dl = new HeadlessDescriptionList();
 * new HeadlessDescriptionTerm('Name').render(dl.element);
 * new HeadlessDescriptionDetails('John Doe').render(dl.element);
 * new HeadlessDescriptionTerm('Email').render(dl.element);
 * new HeadlessDescriptionDetails('john@example.com').render(dl.element);
 * dl.render('#profile');
 *
 * // Using helper method
 * HeadlessDescriptionList.createList([
 *   { term: 'Full Name', detail: 'John Doe' },
 *   { term: 'Email Address', detail: 'john@example.com' },
 *   { term: 'Role', detail: 'Administrator' }
 * ], '#user-details');
 *
 * // Custom styling
 * new HeadlessDescriptionList({
 *   className: 'bg-gray-50 p-4 rounded-lg'
 * }).render('#styled-list');
 */

class HeadlessDescriptionList {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'grid',
      'grid-cols-1',
      'text-base/6',
      'sm:grid-cols-[min(50%,theme(spacing.80))_auto]',
      'sm:text-sm/6'
    ]
  };

  createElement() {
    const element = document.createElement("dl");

    // Apply CSS classes
    element.className = this.getClasses();

    return element;
  }

  getClasses() {
    const classes = [...HeadlessDescriptionList.styles.base];

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  // Method to render the list to a container
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

  // Method to add a term and detail pair
  addItem(term, detail) {
    new HeadlessDescriptionTerm(term).render(this.element);
    new HeadlessDescriptionDetails(detail).render(this.element);
    return this;
  }

  // Method to clear all items
  clear() {
    this.element.innerHTML = '';
    return this;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create a complete description list
  static createList(items, container) {
    const dl = new HeadlessDescriptionList();
    
    items.forEach(item => {
      dl.addItem(item.term, item.detail);
    });

    dl.render(container);
    return dl;
  }
}

class HeadlessDescriptionTerm {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || "",
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'col-start-1',
      'border-t',
      'border-zinc-950/5',
      'pt-3',
      'text-zinc-500',
      'first:border-none',
      'sm:border-t',
      'sm:border-zinc-950/5',
      'sm:py-3',
      'dark:border-white/5',
      'dark:text-zinc-400',
      'sm:dark:border-white/5'
    ]
  };

  createElement() {
    const element = document.createElement("dt");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDescriptionTerm.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

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

  setText(newText) {
    this.text = newText;
    this.element.textContent = newText;
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDescriptionDetails {
  constructor(content, options = {}) {
    this.content = content;
    this.options = {
      className: options.className || "",
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'pt-1',
      'pb-3',
      'text-zinc-950',
      'sm:border-t',
      'sm:border-zinc-950/5',
      'sm:py-3',
      'sm:nth-2:border-none',
      'dark:text-white',
      'dark:sm:border-white/5'
    ]
  };

  createElement() {
    const element = document.createElement("dd");
    
    if (typeof this.content === 'string') {
      element.textContent = this.content;
    } else {
      element.appendChild(this.content);
    }
    
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDescriptionDetails.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

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

  setContent(newContent) {
    this.content = newContent;
    this.element.innerHTML = '';
    
    if (typeof newContent === 'string') {
      this.element.textContent = newContent;
    } else {
      this.element.appendChild(newContent);
    }
    
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HeadlessDescriptionList,
    HeadlessDescriptionTerm,
    HeadlessDescriptionDetails
  };
}