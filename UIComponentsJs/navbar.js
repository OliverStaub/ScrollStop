/**
 * HeadlessNavbar - A comprehensive navbar component suite with animations
 *
 * USAGE EXAMPLES:
 *
 * // Basic navbar
 * const navbar = new HeadlessNavbar();
 * 
 * const section = new HeadlessNavbarSection();
 * new HeadlessNavbarItem({
 *   children: 'Home',
 *   href: '/',
 *   current: true
 * }).render(section.element);
 * new HeadlessNavbarItem({
 *   children: 'About',
 *   href: '/about'
 * }).render(section.element);
 * section.render(navbar.element);
 * 
 * new HeadlessNavbarSpacer().render(navbar.element);
 * 
 * const rightSection = new HeadlessNavbarSection();
 * new HeadlessNavbarItem({
 *   children: 'Login',
 *   href: '/login'
 * }).render(rightSection.element);
 * rightSection.render(navbar.element);
 * 
 * navbar.render('#container');
 *
 * // With dividers
 * const navbar = new HeadlessNavbar();
 * const section = new HeadlessNavbarSection();
 * 
 * new HeadlessNavbarItem({
 *   children: 'Dashboard',
 *   href: '/dashboard'
 * }).render(section.element);
 * 
 * new HeadlessNavbarDivider().render(section.element);
 * 
 * new HeadlessNavbarItem({
 *   children: 'Settings',
 *   href: '/settings'
 * }).render(section.element);
 * 
 * section.render(navbar.element);
 *
 * // Button-style items
 * new HeadlessNavbarItem({
 *   children: 'Toggle Menu',
 *   onClick: () => console.log('Menu toggled'),
 *   current: false
 * }).render(section.element);
 *
 * // With icons and labels
 * const item = new HeadlessNavbarItem({
 *   href: '/profile',
 *   children: [
 *     '👤', // Icon
 *     new HeadlessNavbarLabel('Profile')
 *   ]
 * });
 */

class HeadlessNavbar {
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
      'flex',
      'flex-1',
      'items-center',
      'gap-4',
      'py-2.5'
    ]
  };

  createElement() {
    const element = document.createElement("nav");
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessNavbar.styles.base];

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessNavbarDivider {
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
      'h-6',
      'w-px',
      'bg-zinc-950/10',
      'dark:bg-white/10'
    ]
  };

  createElement() {
    const element = document.createElement("div");
    element.setAttribute('aria-hidden', 'true');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessNavbarDivider.styles.base];

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessNavbarSection {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      ...options,
    };

    this.layoutId = 'navbar-section-' + Math.random().toString(36).substr(2, 9);
    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'flex',
      'items-center',
      'gap-3'
    ]
  };

  createElement() {
    const element = document.createElement("div");
    element.className = this.getClasses();
    element.setAttribute('data-layout-group', this.layoutId);
    return element;
  }

  getClasses() {
    const classes = [...HeadlessNavbarSection.styles.base];

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessNavbarSpacer {
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
      '-ml-4',
      'flex-1'
    ]
  };

  createElement() {
    const element = document.createElement("div");
    element.setAttribute('aria-hidden', 'true');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessNavbarSpacer.styles.base];

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

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessNavbarItem {
  constructor(options = {}) {
    this.options = {
      current: options.current || false,
      className: options.className || "",
      children: options.children || "",
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
      'relative',
      'flex',
      'min-w-0',
      'items-center',
      'gap-3',
      'rounded-lg',
      'p-2',
      'text-left',
      'text-base/6',
      'font-medium',
      'text-zinc-950',
      'sm:text-sm/5',
      // Leading icon/icon-only
      '*:data-[slot=icon]:size-6',
      '*:data-[slot=icon]:shrink-0',
      '*:data-[slot=icon]:fill-zinc-500',
      'sm:*:data-[slot=icon]:size-5',
      // Trailing icon (down chevron or similar)
      '*:not-nth-2:last:data-[slot=icon]:ml-auto',
      '*:not-nth-2:last:data-[slot=icon]:size-5',
      'sm:*:not-nth-2:last:data-[slot=icon]:size-4',
      // Avatar
      '*:data-[slot=avatar]:-m-0.5',
      '*:data-[slot=avatar]:size-7',
      '*:data-[slot=avatar]:[--avatar-radius:var(--radius-md)]',
      'sm:*:data-[slot=avatar]:size-6',
      // Hover
      'data-hover:bg-zinc-950/5',
      'data-hover:*:data-[slot=icon]:fill-zinc-950',
      // Active
      'data-active:bg-zinc-950/5',
      'data-active:*:data-[slot=icon]:fill-zinc-950',
      // Dark mode
      'dark:text-white',
      'dark:*:data-[slot=icon]:fill-zinc-400',
      'dark:data-hover:bg-white/5',
      'dark:data-hover:*:data-[slot=icon]:fill-white',
      'dark:data-active:bg-white/5',
      'dark:data-active:*:data-[slot=icon]:fill-white'
    ],
    wrapper: [
      'relative'
    ],
    indicator: [
      'absolute',
      'inset-x-2',
      '-bottom-2.5',
      'h-0.5',
      'rounded-full',
      'bg-zinc-950',
      'dark:bg-white'
    ],
    touchTarget: [
      'absolute',
      'top-1/2',
      'left-1/2',
      'size-[max(100%,2.75rem)]',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'pointer-fine:hidden'
    ]
  };

  createElement() {
    // Wrapper span
    const wrapper = document.createElement("span");
    wrapper.className = this.getWrapperClasses();

    // Current indicator (animated)
    if (this.options.current) {
      const indicator = document.createElement("span");
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
      this.options.children.forEach(child => {
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
    const touchTarget = document.createElement("span");
    touchTarget.className = this.getTouchTargetClasses();
    touchTarget.setAttribute('aria-hidden', 'true');
    
    // Insert at the beginning
    element.insertBefore(touchTarget, element.firstChild);
  }

  getWrapperClasses() {
    const classes = [...HeadlessNavbarItem.styles.wrapper];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getClasses() {
    return HeadlessNavbarItem.styles.base.join(" ");
  }

  getIndicatorClasses() {
    return HeadlessNavbarItem.styles.indicator.join(" ");
  }

  getTouchTargetClasses() {
    return HeadlessNavbarItem.styles.touchTarget.join(" ");
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

  setCurrent(current) {
    this.options.current = current;
    
    // Update indicator
    const existingIndicator = this.element.querySelector('[data-layout-id="current-indicator"]');
    if (current && !existingIndicator) {
      const indicator = document.createElement("span");
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

class HeadlessNavbarLabel {
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
      'truncate'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessNavbarLabel.styles.base];

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

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HeadlessNavbar,
    HeadlessNavbarDivider,
    HeadlessNavbarSection,
    HeadlessNavbarSpacer,
    HeadlessNavbarItem,
    HeadlessNavbarLabel
  };
}