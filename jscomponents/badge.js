/**
 * HeadlessBadge - A comprehensive badge component
 *
 * USAGE EXAMPLES:
 *
 * // Basic badge
 * new HeadlessBadge('New').render('#container');
 *
 * // Colored badge
 * new HeadlessBadge('Error', { color: 'red' }).render('#status');
 *
 * // Badge button
 * new HeadlessBadgeButton('Clickable', { 
 *   color: 'blue',
 *   onClick: () => console.log('Badge clicked!')
 * }).render('#actions');
 *
 * // Badge link
 * new HeadlessBadgeButton('Go to Page', {
 *   color: 'green',
 *   href: '/page'
 * }).render('#navigation');
 */
class HeadlessBadge {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      color: options.color || 'zinc',
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static colors = {
    red: 'bg-red-500/15 text-red-700 group-data-hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-hover:bg-red-500/20',
    orange: 'bg-orange-500/15 text-orange-700 group-data-hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:group-data-hover:bg-orange-500/20',
    amber: 'bg-amber-400/20 text-amber-700 group-data-hover:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-data-hover:bg-amber-400/15',
    yellow: 'bg-yellow-400/20 text-yellow-700 group-data-hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-hover:bg-yellow-400/15',
    lime: 'bg-lime-400/20 text-lime-700 group-data-hover:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-hover:bg-lime-400/15',
    green: 'bg-green-500/15 text-green-700 group-data-hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-hover:bg-green-500/20',
    emerald: 'bg-emerald-500/15 text-emerald-700 group-data-hover:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-data-hover:bg-emerald-500/20',
    teal: 'bg-teal-500/15 text-teal-700 group-data-hover:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-data-hover:bg-teal-500/20',
    cyan: 'bg-cyan-400/20 text-cyan-700 group-data-hover:bg-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-data-hover:bg-cyan-400/15',
    sky: 'bg-sky-500/15 text-sky-700 group-data-hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-hover:bg-sky-500/20',
    blue: 'bg-blue-500/15 text-blue-700 group-data-hover:bg-blue-500/25 dark:text-blue-400 dark:group-data-hover:bg-blue-500/25',
    indigo: 'bg-indigo-500/15 text-indigo-700 group-data-hover:bg-indigo-500/25 dark:text-indigo-400 dark:group-data-hover:bg-indigo-500/20',
    violet: 'bg-violet-500/15 text-violet-700 group-data-hover:bg-violet-500/25 dark:text-violet-400 dark:group-data-hover:bg-violet-500/20',
    purple: 'bg-purple-500/15 text-purple-700 group-data-hover:bg-purple-500/25 dark:text-purple-400 dark:group-data-hover:bg-purple-500/20',
    fuchsia: 'bg-fuchsia-400/15 text-fuchsia-700 group-data-hover:bg-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:group-data-hover:bg-fuchsia-400/20',
    pink: 'bg-pink-400/15 text-pink-700 group-data-hover:bg-pink-400/25 dark:bg-pink-400/10 dark:text-pink-400 dark:group-data-hover:bg-pink-400/20',
    rose: 'bg-rose-400/15 text-rose-700 group-data-hover:bg-rose-400/25 dark:bg-rose-400/10 dark:text-rose-400 dark:group-data-hover:bg-rose-400/20',
    zinc: 'bg-zinc-600/10 text-zinc-700 group-data-hover:bg-zinc-600/20 dark:bg-white/5 dark:text-gray-300 dark:group-data-hover:bg-white/10',
  };

  static styles = {
    base: [
      'inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5'
    ]
  };

  createElement() {
    const span = document.createElement('span');
    span.className = this.getClasses();
    span.textContent = this.text;
    return span;
  }

  getClasses() {
    const classes = [...HeadlessBadge.styles.base];
    
    const colorClass = HeadlessBadge.colors[this.options.color];
    if (colorClass) {
      classes.push(colorClass);
    }

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

  setColor(color) {
    this.options.color = color;
    this.element.className = this.getClasses();
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

class HeadlessBadgeButton {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      color: options.color || 'zinc',
      className: options.className || '',
      onClick: options.onClick || null,
      href: options.href || null,
      target: options.target || null,
      ...options,
    };

    this.badge = new HeadlessBadge(text, { color: this.options.color });
    this.element = this.createElement();
  }

  static styles = {
    base: [
      'group relative inline-flex rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-blue-500'
    ],
    touchTarget: [
      'absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden'
    ]
  };

  createElement() {
    const element = this.options.href 
      ? document.createElement('a') 
      : document.createElement('button');

    element.className = this.getClasses();

    if (this.options.href) {
      element.href = this.options.href;
      if (this.options.target) {
        element.target = this.options.target;
      }
    } else {
      element.type = 'button';
    }

    if (this.options.onClick) {
      element.addEventListener('click', this.options.onClick);
    }

    // Add touch target
    const touchTarget = document.createElement('span');
    touchTarget.className = HeadlessBadgeButton.styles.touchTarget.join(' ');
    touchTarget.setAttribute('aria-hidden', 'true');
    element.appendChild(touchTarget);

    // Add badge
    element.appendChild(this.badge.getElement());

    return element;
  }

  getClasses() {
    const classes = [...HeadlessBadgeButton.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  setText(text) {
    this.text = text;
    this.badge.setText(text);
    return this;
  }

  setColor(color) {
    this.options.color = color;
    this.badge.setColor(color);
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

  getBadge() {
    return this.badge;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeadlessBadge, HeadlessBadgeButton };
}