/**
 * HeadlessAuthLayout - A layout component for authentication pages
 *
 * USAGE EXAMPLES:
 *
 * // Basic auth layout
 * new HeadlessAuthLayout().render('#app');
 *
 * // Auth layout with content
 * const authLayout = new HeadlessAuthLayout()
 *   .setContent('<div>Login Form</div>')
 *   .render('#container');
 *
 * // Auth layout with DOM element content
 * const loginForm = document.createElement('form');
 * // ... setup form
 * new HeadlessAuthLayout()
 *   .setContent(loginForm)
 *   .render(document.body);
 *
 * // Auth layout with custom class
 * new HeadlessAuthLayout('Custom content', { className: 'my-custom-class' })
 *   .render('#auth-container');
 */
class HeadlessAuthLayout {
  constructor(content = '', options = {}) {
    this.content = content;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    main: ['flex min-h-dvh flex-col p-2'],
    container: [
      'flex grow items-center justify-center p-6',
      'lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5',
      'dark:lg:bg-zinc-900 dark:lg:ring-white/10',
    ],
  };

  createElement() {
    // Create main element
    const main = document.createElement('main');
    main.className = HeadlessAuthLayout.styles.main.join(' ');

    // Create container div
    const container = document.createElement('div');
    container.className = HeadlessAuthLayout.styles.container.join(' ');

    // Add custom classes if provided
    if (this.options.className) {
      container.classList.add(this.options.className);
    }

    // Add content
    this.updateContent(container);

    // Assemble elements
    main.appendChild(container);

    return main;
  }

  updateContent(container) {
    container.innerHTML = '';

    if (this.content) {
      if (typeof this.content === 'string') {
        container.innerHTML = this.content;
      } else if (this.content instanceof HTMLElement) {
        container.appendChild(this.content);
      } else if (Array.isArray(this.content)) {
        this.content.forEach((item) => {
          if (typeof item === 'string') {
            const div = document.createElement('div');
            div.innerHTML = item;
            container.appendChild(div);
          } else if (item instanceof HTMLElement) {
            container.appendChild(item);
          }
        });
      }
    }
  }

  setContent(content) {
    this.content = content;
    const container = this.element.querySelector('div');
    if (container) {
      this.updateContent(container);
    }
    return this;
  }

  addContent(content) {
    if (!Array.isArray(this.content)) {
      this.content = this.content ? [this.content] : [];
    }

    if (Array.isArray(content)) {
      this.content.push(...content);
    } else {
      this.content.push(content);
    }

    const container = this.element.querySelector('div');
    if (container) {
      this.updateContent(container);
    }
    return this;
  }

  clearContent() {
    this.content = '';
    const container = this.element.querySelector('div');
    if (container) {
      container.innerHTML = '';
    }
    return this;
  }

  addClass(className) {
    this.options.className = this.options.className
      ? `${this.options.className} ${className}`
      : className;

    const container = this.element.querySelector('div');
    if (container) {
      container.classList.add(className);
    }
    return this;
  }

  removeClass(className) {
    if (this.options.className) {
      this.options.className = this.options.className
        .split(' ')
        .filter((cls) => cls !== className)
        .join(' ');
    }

    const container = this.element.querySelector('div');
    if (container) {
      container.classList.remove(className);
    }
    return this;
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
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Get the container element for direct manipulation
  getContainer() {
    return this.element.querySelector('div');
  }

  // Get the main element
  getElement() {
    return this.element;
  }

  // Static method to create a layout with form
  static withForm(formElement, options = {}) {
    const layout = new HeadlessAuthLayout('', options);
    layout.setContent(formElement);
    return layout;
  }

  // Static method to create a layout with multiple elements
  static withElements(elements, options = {}) {
    const layout = new HeadlessAuthLayout('', options);
    layout.setContent(elements);
    return layout;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessAuthLayout;
}
