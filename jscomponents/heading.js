/**
 * HeadlessHeading - Heading components for various levels
 *
 * USAGE EXAMPLES:
 *
 * // Basic heading (defaults to h1)
 * new HeadlessHeading('Main Title').render('#container');
 *
 * // Specific heading level
 * new HeadlessHeading('Section Title', { level: 2 }).render('#section');
 *
 * // Heading with custom class
 * new HeadlessHeading('Custom Title', { level: 3, className: 'my-custom-class' }).render('#content');
 *
 * // Subheading (defaults to h2)
 * new HeadlessSubheading('Subtitle').render('#subtitle');
 *
 * // Subheading with specific level
 * new HeadlessSubheading('Small Subtitle', { level: 4 }).render('#small-section');
 */
class HeadlessHeading {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      level: options.level || 1,
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white'
    ]
  };

  createElement() {
    const heading = document.createElement(`h${this.options.level}`);
    heading.className = this.getClasses();
    heading.textContent = this.text;
    return heading;
  }

  getClasses() {
    const classes = [...HeadlessHeading.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  setText(text) {
    this.text = text;
    this.element.textContent = text;
    return this;
  }

  setLevel(level) {
    if (level >= 1 && level <= 6) {
      this.options.level = level;
      const newElement = this.createElement();
      if (this.element.parentNode) {
        this.element.parentNode.replaceChild(newElement, this.element);
      }
      this.element = newElement;
    }
    return this;
  }

  setHtml(html) {
    this.element.innerHTML = html;
    return this;
  }

  addClass(className) {
    this.options.className = this.options.className 
      ? `${this.options.className} ${className}` 
      : className;
    this.element.classList.add(className);
    return this;
  }

  removeClass(className) {
    if (this.options.className) {
      this.options.className = this.options.className
        .split(' ')
        .filter(cls => cls !== className)
        .join(' ');
    }
    this.element.classList.remove(className);
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

  getElement() {
    return this.element;
  }
}

class HeadlessSubheading {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      level: options.level || 2,
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white'
    ]
  };

  createElement() {
    const heading = document.createElement(`h${this.options.level}`);
    heading.className = this.getClasses();
    heading.textContent = this.text;
    return heading;
  }

  getClasses() {
    const classes = [...HeadlessSubheading.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  setText(text) {
    this.text = text;
    this.element.textContent = text;
    return this;
  }

  setLevel(level) {
    if (level >= 1 && level <= 6) {
      this.options.level = level;
      const newElement = this.createElement();
      if (this.element.parentNode) {
        this.element.parentNode.replaceChild(newElement, this.element);
      }
      this.element = newElement;
    }
    return this;
  }

  setHtml(html) {
    this.element.innerHTML = html;
    return this;
  }

  addClass(className) {
    this.options.className = this.options.className 
      ? `${this.options.className} ${className}` 
      : className;
    this.element.classList.add(className);
    return this;
  }

  removeClass(className) {
    if (this.options.className) {
      this.options.className = this.options.className
        .split(' ')
        .filter(cls => cls !== className)
        .join(' ');
    }
    this.element.classList.remove(className);
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

  getElement() {
    return this.element;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeadlessHeading, HeadlessSubheading };
}