/**
 * HeadlessSidebar - A comprehensive sidebar component suite with animations
 *
 * USAGE EXAMPLES:
 *
 * // Basic sidebar
 * const sidebar = new HeadlessSidebar();
 *
 * const header = new HeadlessSidebarHeader();
 * header.element.innerHTML = '<h2>My App</h2>';
 * header.render(sidebar.element);
 *
 * const body = new HeadlessSidebarBody();
 *
 * const section = new HeadlessSidebarSection();
 * new HeadlessSidebarHeading('Navigation').render(section.element);
 * new HeadlessSidebarItem({
 *   children: 'Dashboard',
 *   href: '/dashboard',
 *   current: true
 * }).render(section.element);
 * new HeadlessSidebarItem({
 *   children: 'Settings',
 *   href: '/settings'
 * }).render(section.element);
 * section.render(body.element);
 *
 * body.render(sidebar.element);
 * sidebar.render('#container');
 *
 * // With dividers and spacers
 * const sidebar = new HeadlessSidebar();
 * const body = new HeadlessSidebarBody();
 *
 * const section1 = new HeadlessSidebarSection();
 * new HeadlessSidebarItem({
 *   children: 'Home',
 *   href: '/'
 * }).render(section1.element);
 * section1.render(body.element);
 *
 * new HeadlessSidebarDivider().render(body.element);
 *
 * const section2 = new HeadlessSidebarSection();
 * new HeadlessSidebarItem({
 *   children: 'Profile',
 *   href: '/profile'
 * }).render(section2.element);
 * section2.render(body.element);
 *
 * new HeadlessSidebarSpacer().render(body.element);
 *
 * const footer = new HeadlessSidebarFooter();
 * new HeadlessSidebarItem({
 *   children: 'Logout',
 *   onClick: () => logout()
 * }).render(footer.element);
 * footer.render(sidebar.element);
 *
 * body.render(sidebar.element);
 * sidebar.render('#app-sidebar');
 *
 * // With icons and labels
 * const item = new HeadlessSidebarItem({
 *   href: '/dashboard',
 *   children: [
 *     '📊', // Icon
 *     new HeadlessSidebarLabel('Dashboard')
 *   ]
 * });
 */

class HeadlessSidebar {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['flex', 'h-full', 'min-h-0', 'flex-col'],
  };

  createElement() {
    const element = document.createElement('nav');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebar.styles.base];

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

class HeadlessSidebarHeader {
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
      'flex',
      'flex-col',
      'border-b',
      'border-zinc-950/5',
      'p-4',
      'dark:border-white/5',
      '[&>[data-slot=section]+[data-slot=section]]:mt-2.5',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarHeader.styles.base];

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

class HeadlessSidebarBody {
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
      'flex',
      'flex-1',
      'flex-col',
      'overflow-y-auto',
      'p-4',
      '[&>[data-slot=section]+[data-slot=section]]:mt-8',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarBody.styles.base];

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

class HeadlessSidebarFooter {
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
      'flex',
      'flex-col',
      'border-t',
      'border-zinc-950/5',
      'p-4',
      'dark:border-white/5',
      '[&>[data-slot=section]+[data-slot=section]]:mt-2.5',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarFooter.styles.base];

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

class HeadlessSidebarSection {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.layoutId = 'sidebar-section-' + Math.random().toString(36).substr(2, 9);
    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['flex', 'flex-col', 'gap-0.5'],
  };

  createElement() {
    const element = document.createElement('div');
    element.setAttribute('data-slot', 'section');
    element.setAttribute('data-layout-group', this.layoutId);
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarSection.styles.base];

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

class HeadlessSidebarDivider {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['my-4', 'border-t', 'border-zinc-950/5', 'lg:-mx-4', 'dark:border-white/5'],
  };

  createElement() {
    const element = document.createElement('hr');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarDivider.styles.base];

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

class HeadlessSidebarSpacer {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['mt-8', 'flex-1'],
  };

  createElement() {
    const element = document.createElement('div');
    element.setAttribute('aria-hidden', 'true');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarSpacer.styles.base];

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

class HeadlessSidebarHeading {
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
    base: ['mb-1', 'px-2', 'text-xs/6', 'font-medium', 'text-zinc-500', 'dark:text-zinc-400'],
  };

  createElement() {
    const element = document.createElement('h3');
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarHeading.styles.base];

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

class HeadlessSidebarItem {
  constructor(options = {}) {
    this.options = {
      current: options.current || false,
      className: options.className || '',
      children: options.children || '',
      href: options.href || null,
      onClick: options.onClick || null,
      target: options.target || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      // Base
      'flex',
      'w-full',
      'items-center',
      'gap-3',
      'rounded-lg',
      'px-2',
      'py-2.5',
      'text-left',
      'text-base/6',
      'font-medium',
      'text-zinc-950',
      'sm:py-2',
      'sm:text-sm/5',
      // Leading icon/icon-only
      '*:data-[slot=icon]:size-6',
      '*:data-[slot=icon]:shrink-0',
      '*:data-[slot=icon]:fill-zinc-500',
      'sm:*:data-[slot=icon]:size-5',
      // Trailing icon (down chevron or similar)
      '*:last:data-[slot=icon]:ml-auto',
      '*:last:data-[slot=icon]:size-5',
      'sm:*:last:data-[slot=icon]:size-4',
      // Avatar
      '*:data-[slot=avatar]:-m-0.5',
      '*:data-[slot=avatar]:size-7',
      'sm:*:data-[slot=avatar]:size-6',
      // Hover
      'data-hover:bg-zinc-950/5',
      'data-hover:*:data-[slot=icon]:fill-zinc-950',
      // Active
      'data-active:bg-zinc-950/5',
      'data-active:*:data-[slot=icon]:fill-zinc-950',
      // Current
      'data-current:*:data-[slot=icon]:fill-zinc-950',
      // Dark mode
      'dark:text-white',
      'dark:*:data-[slot=icon]:fill-zinc-400',
      'dark:data-hover:bg-white/5',
      'dark:data-hover:*:data-[slot=icon]:fill-white',
      'dark:data-active:bg-white/5',
      'dark:data-active:*:data-[slot=icon]:fill-white',
      'dark:data-current:*:data-[slot=icon]:fill-white',
    ],
    wrapper: ['relative'],
    indicator: [
      'absolute',
      'inset-y-2',
      '-left-4',
      'w-0.5',
      'rounded-full',
      'bg-zinc-950',
      'dark:bg-white',
    ],
    touchTarget: [
      'absolute',
      'top-1/2',
      'left-1/2',
      'size-[max(100%,2.75rem)]',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'pointer-fine:hidden',
    ],
  };

  createElement() {
    // Wrapper span
    const wrapper = document.createElement('span');
    wrapper.className = this.getWrapperClasses();

    // Current indicator (animated)
    if (this.options.current) {
      const indicator = document.createElement('span');
      indicator.className = this.getIndicatorClasses();
      indicator.setAttribute('data-layout-id', 'current-indicator');
      wrapper.appendChild(indicator);
    }

    // Main element (link or button)
    const isLink = this.options.href !== null;
    const element = document.createElement(isLink ? 'a' : 'button');

    if (isLink) {
      element.href = this.options.href;
      if (this.options.target) {
        element.target = this.options.target;
      }
    } else {
      element.type = 'button';
      element.className += ' cursor-default';
    }

    element.className = this.getClasses();
    element.setAttribute('data-current', this.options.current ? 'true' : undefined);

    // Add content
    this.addContent(element);

    // Add touch target
    this.addTouchTarget(element);

    // Add event listeners
    if (this.options.onClick) {
      element.addEventListener('click', this.options.onClick);
    }

    // Add hover effects
    element.addEventListener('mouseenter', () => {
      element.setAttribute('data-hover', 'true');
    });
    element.addEventListener('mouseleave', () => {
      element.removeAttribute('data-hover');
    });

    element.addEventListener('mousedown', () => {
      element.setAttribute('data-active', 'true');
    });
    element.addEventListener('mouseup', () => {
      element.removeAttribute('data-active');
    });

    wrapper.appendChild(element);
    return wrapper;
  }

  addContent(element) {
    if (typeof this.options.children === 'string') {
      element.textContent = this.options.children;
    } else if (Array.isArray(this.options.children)) {
      this.options.children.forEach((child) => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child.element || child);
        }
      });
    } else if (this.options.children) {
      element.appendChild(this.options.children.element || this.options.children);
    }
  }

  addTouchTarget(element) {
    const touchTarget = document.createElement('span');
    touchTarget.className = this.getTouchTargetClasses();
    touchTarget.setAttribute('aria-hidden', 'true');

    // Insert at the beginning
    element.insertBefore(touchTarget, element.firstChild);
  }

  getWrapperClasses() {
    const classes = [...HeadlessSidebarItem.styles.wrapper];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getClasses() {
    return HeadlessSidebarItem.styles.base.join(' ');
  }

  getIndicatorClasses() {
    return HeadlessSidebarItem.styles.indicator.join(' ');
  }

  getTouchTargetClasses() {
    return HeadlessSidebarItem.styles.touchTarget.join(' ');
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

  setCurrent(current) {
    this.options.current = current;

    // Update indicator
    const existingIndicator = this.element.querySelector('[data-layout-id="current-indicator"]');
    if (current && !existingIndicator) {
      const indicator = document.createElement('span');
      indicator.className = this.getIndicatorClasses();
      indicator.setAttribute('data-layout-id', 'current-indicator');
      this.element.insertBefore(indicator, this.element.firstChild);
    } else if (!current && existingIndicator) {
      existingIndicator.remove();
    }

    // Update data attribute
    const linkOrButton = this.element.querySelector('a, button');
    if (linkOrButton) {
      linkOrButton.setAttribute('data-current', current ? 'true' : undefined);
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

class HeadlessSidebarLabel {
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
    base: ['truncate'],
  };

  createElement() {
    const element = document.createElement('span');
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessSidebarLabel.styles.base];

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
    HeadlessSidebar,
    HeadlessSidebarHeader,
    HeadlessSidebarBody,
    HeadlessSidebarFooter,
    HeadlessSidebarSection,
    HeadlessSidebarDivider,
    HeadlessSidebarSpacer,
    HeadlessSidebarHeading,
    HeadlessSidebarItem,
    HeadlessSidebarLabel,
  };
}
