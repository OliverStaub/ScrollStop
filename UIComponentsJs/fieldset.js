/**
 * HeadlessFieldset - A comprehensive fieldset component suite for forms
 *
 * USAGE EXAMPLES:
 *
 * // Basic fieldset
 * new HeadlessFieldset().render('#container');
 *
 * // Complete form structure
 * const fieldset = new HeadlessFieldset();
 * new HeadlessLegend('User Information').render(fieldset.element);
 *
 * const fieldGroup = new HeadlessFieldGroup();
 * const nameField = new HeadlessField();
 * new HeadlessLabel('Full Name').render(nameField.element);
 * // Add your input here
 * new HeadlessDescription('Enter your full legal name').render(nameField.element);
 * nameField.render(fieldGroup.element);
 *
 * fieldGroup.render(fieldset.element);
 * fieldset.render('#user-form');
 *
 * // With error message
 * const emailField = new HeadlessField();
 * new HeadlessLabel('Email').render(emailField.element);
 * // Add your input here
 * new HeadlessErrorMessage('Please enter a valid email address').render(emailField.element);
 * emailField.render('#form-container');
 *
 * // Disabled fieldset
 * new HeadlessFieldset({
 *   disabled: true
 * }).render('#disabled-form');
 */

class HeadlessFieldset {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      disabled: options.disabled || false,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['*:data-[slot=text]:mt-1', '[&>*+[data-slot=control]]:mt-6'],
  };

  createElement() {
    const element = document.createElement('fieldset');

    // Set disabled state
    if (this.options.disabled) {
      element.disabled = true;
    }

    // Apply CSS classes
    element.className = this.getClasses();

    return element;
  }

  getClasses() {
    const classes = [...HeadlessFieldset.styles.base];

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  // Method to render the fieldset to a container
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

  // Method to enable/disable fieldset
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
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

class HeadlessLegend {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'text-base/6',
      'font-semibold',
      'text-zinc-950',
      'data-disabled:opacity-50',
      'sm:text-sm/6',
      'dark:text-white',
    ],
  };

  createElement() {
    const element = document.createElement('legend');
    element.textContent = this.text;
    element.setAttribute('data-slot', 'legend');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessLegend.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

class HeadlessFieldGroup {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['space-y-8'],
  };

  createElement() {
    const element = document.createElement('div');
    element.setAttribute('data-slot', 'control');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessFieldGroup.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessField {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      '[&>[data-slot=label]+[data-slot=control]]:mt-3',
      '[&>[data-slot=label]+[data-slot=description]]:mt-1',
      '[&>[data-slot=description]+[data-slot=control]]:mt-3',
      '[&>[data-slot=control]+[data-slot=description]]:mt-3',
      '[&>[data-slot=control]+[data-slot=error]]:mt-3',
      '*:data-[slot=label]:font-medium',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessField.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessLabel {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      htmlFor: options.htmlFor || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'text-base/6',
      'text-zinc-950',
      'select-none',
      'data-disabled:opacity-50',
      'sm:text-sm/6',
      'dark:text-white',
    ],
  };

  createElement() {
    const element = document.createElement('label');
    element.textContent = this.text;
    element.setAttribute('data-slot', 'label');

    if (this.options.htmlFor) {
      element.setAttribute('for', this.options.htmlFor);
    }

    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessLabel.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

  setText(newText) {
    this.text = newText;
    this.element.textContent = newText;
    return this;
  }

  setFor(elementId) {
    this.options.htmlFor = elementId;
    this.element.setAttribute('for', elementId);
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDescription {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'text-base/6',
      'text-zinc-500',
      'data-disabled:opacity-50',
      'sm:text-sm/6',
      'dark:text-zinc-400',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.textContent = this.text;
    element.setAttribute('data-slot', 'description');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDescription.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

class HeadlessErrorMessage {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'text-base/6',
      'text-red-600',
      'data-disabled:opacity-50',
      'sm:text-sm/6',
      'dark:text-red-500',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.textContent = this.text;
    element.setAttribute('data-slot', 'error');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessErrorMessage.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

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

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HeadlessFieldset,
    HeadlessLegend,
    HeadlessFieldGroup,
    HeadlessField,
    HeadlessLabel,
    HeadlessDescription,
    HeadlessErrorMessage,
  };
}
