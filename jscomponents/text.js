/**
 * HeadlessText - Text components for various content types
 *
 * USAGE EXAMPLES:
 *
 * // Basic text
 * new HeadlessText('This is some text').render('#container');
 *
 * // Text with custom class
 * new HeadlessText('Custom text', { className: 'my-custom-class' }).render('#content');
 *
 * // Text link
 * new HeadlessTextLink('Click here', { href: '/page' }).render('#links');
 *
 * // Strong text
 * new HeadlessStrong('Important text').render('#emphasis');
 *
 * // Code text
 * new HeadlessCode('console.log("hello")').render('#code-examples');
 */
class HeadlessText {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'text-base/6 text-gray-700 sm:text-sm/6 dark:text-gray-300'
    ]
  };

  createElement() {
    const p = document.createElement('p');
    p.setAttribute('data-slot', 'text');
    p.className = this.getClasses();
    p.textContent = this.text;
    return p;
  }

  getClasses() {
    const classes = [...HeadlessText.styles.base];

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

class HeadlessTextLink {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      href: options.href || '#',
      target: options.target || null,
      className: options.className || '',
      onClick: options.onClick || null,
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white'
    ]
  };

  createElement() {
    const a = document.createElement('a');
    a.href = this.options.href;
    a.textContent = this.text;
    a.className = this.getClasses();

    if (this.options.target) {
      a.target = this.options.target;
    }

    if (this.options.onClick) {
      a.addEventListener('click', this.options.onClick);
    }

    return a;
  }

  getClasses() {
    const classes = [...HeadlessTextLink.styles.base];

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

  setHref(href) {
    this.options.href = href;
    this.element.href = href;
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

class HeadlessStrong {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'font-medium text-zinc-950 dark:text-white'
    ]
  };

  createElement() {
    const strong = document.createElement('strong');
    strong.className = this.getClasses();
    strong.textContent = this.text;
    return strong;
  }

  getClasses() {
    const classes = [...HeadlessStrong.styles.base];

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

class HeadlessCode {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'rounded-sm border border-zinc-950/10 bg-zinc-950/2.5 px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white'
    ]
  };

  createElement() {
    const code = document.createElement('code');
    code.className = this.getClasses();
    code.textContent = this.text;
    return code;
  }

  getClasses() {
    const classes = [...HeadlessCode.styles.base];

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
  module.exports = { HeadlessText, HeadlessTextLink, HeadlessStrong, HeadlessCode };
}