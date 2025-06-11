/**
 * HeadlessPagination - A comprehensive pagination component suite
 *
 * USAGE EXAMPLES:
 *
 * // Basic pagination
 * new HeadlessPagination().render('#container');
 *
 * // Complete pagination with navigation
 * const pagination = new HeadlessPagination();
 * new HeadlessPaginationPrevious({
 *   href: '/page/1',
 *   children: 'Previous'
 * }).render(pagination.element);
 * 
 * const list = new HeadlessPaginationList();
 * new HeadlessPaginationPage({
 *   href: '/page/1',
 *   children: '1',
 *   current: true
 * }).render(list.element);
 * new HeadlessPaginationPage({
 *   href: '/page/2',
 *   children: '2'
 * }).render(list.element);
 * new HeadlessPaginationGap().render(list.element);
 * new HeadlessPaginationPage({
 *   href: '/page/10',
 *   children: '10'
 * }).render(list.element);
 * list.render(pagination.element);
 * 
 * new HeadlessPaginationNext({
 *   href: '/page/3'
 * }).render(pagination.element);
 * pagination.render('#pagination-container');
 *
 * // Disabled navigation
 * new HeadlessPaginationPrevious({
 *   href: null, // null disables the button
 *   children: 'Previous'
 * }).render('#nav-disabled');
 *
 * // Custom aria-label
 * new HeadlessPagination({
 *   ariaLabel: 'Product navigation'
 * }).render('#products');
 */

class HeadlessPagination {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      ariaLabel: options.ariaLabel || "Page navigation",
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'flex',
      'gap-x-2'
    ]
  };

  createElement() {
    const element = document.createElement("nav");
    element.setAttribute('aria-label', this.options.ariaLabel);
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessPagination.styles.base];

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

class HeadlessPaginationPrevious {
  constructor(options = {}) {
    this.options = {
      href: options.href || null,
      className: options.className || "",
      children: options.children || 'Previous',
      onClick: options.onClick || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'grow',
      'basis-0'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.className = this.getClasses();

    // Create the button/link
    const button = this.createButton();
    element.appendChild(button);

    return element;
  }

  createButton() {
    const isDisabled = this.options.href === null;
    const button = document.createElement(isDisabled ? "button" : "a");

    // Set attributes
    button.setAttribute('aria-label', 'Previous page');
    
    if (isDisabled) {
      button.disabled = true;
      button.type = "button";
    } else {
      button.href = this.options.href;
    }

    // Apply button styles (simplified version of HeadlessButton)
    button.className = this.getButtonClasses(isDisabled);

    // Add click handler
    if (this.options.onClick) {
      button.addEventListener("click", this.options.onClick);
    }

    // Add icon
    const icon = this.createIcon();
    button.appendChild(icon);

    // Add text
    const text = document.createTextNode(this.options.children);
    button.appendChild(text);

    return button;
  }

  createIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'stroke-current');
    svg.setAttribute('data-slot', 'icon');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
  }

  getClasses() {
    const classes = [...HeadlessPaginationPrevious.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getButtonClasses(disabled) {
    // Simplified plain button styles
    const classes = [
      'relative',
      'isolate',
      'inline-flex',
      'items-baseline',
      'justify-center',
      'gap-x-2',
      'rounded-lg',
      'border',
      'text-base/6',
      'font-semibold',
      'px-[calc(theme(spacing.3.5)-1px)]',
      'py-[calc(theme(spacing.2.5)-1px)]',
      'sm:px-[calc(theme(spacing.3)-1px)]',
      'sm:py-[calc(theme(spacing.1.5)-1px)]',
      'sm:text-sm/6',
      'focus:outline-2',
      'focus:outline-offset-2',
      'focus:outline-blue-500',
      'transition-colors',
      'duration-200',
      // Plain variant styles
      'border-transparent',
      'text-zinc-950',
      'hover:bg-zinc-950/5',
      'active:bg-zinc-950/5',
      'dark:text-white',
      'dark:hover:bg-white/10',
      'dark:active:bg-white/10'
    ];

    if (disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
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

  setHref(href) {
    this.options.href = href;
    // Recreate the element to update the button type
    const parent = this.element.parentNode;
    this.element.remove();
    this.element = this.createElement();
    if (parent) {
      parent.appendChild(this.element);
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

class HeadlessPaginationNext {
  constructor(options = {}) {
    this.options = {
      href: options.href || null,
      className: options.className || "",
      children: options.children || 'Next',
      onClick: options.onClick || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'flex',
      'grow',
      'basis-0',
      'justify-end'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.className = this.getClasses();

    // Create the button/link
    const button = this.createButton();
    element.appendChild(button);

    return element;
  }

  createButton() {
    const isDisabled = this.options.href === null;
    const button = document.createElement(isDisabled ? "button" : "a");

    // Set attributes
    button.setAttribute('aria-label', 'Next page');
    
    if (isDisabled) {
      button.disabled = true;
      button.type = "button";
    } else {
      button.href = this.options.href;
    }

    // Apply button styles (simplified version of HeadlessButton)
    button.className = this.getButtonClasses(isDisabled);

    // Add click handler
    if (this.options.onClick) {
      button.addEventListener("click", this.options.onClick);
    }

    // Add text
    const text = document.createTextNode(this.options.children);
    button.appendChild(text);

    // Add icon
    const icon = this.createIcon();
    button.appendChild(icon);

    return button;
  }

  createIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'stroke-current');
    svg.setAttribute('data-slot', 'icon');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
  }

  getClasses() {
    const classes = [...HeadlessPaginationNext.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getButtonClasses(disabled) {
    // Simplified plain button styles
    const classes = [
      'relative',
      'isolate',
      'inline-flex',
      'items-baseline',
      'justify-center',
      'gap-x-2',
      'rounded-lg',
      'border',
      'text-base/6',
      'font-semibold',
      'px-[calc(theme(spacing.3.5)-1px)]',
      'py-[calc(theme(spacing.2.5)-1px)]',
      'sm:px-[calc(theme(spacing.3)-1px)]',
      'sm:py-[calc(theme(spacing.1.5)-1px)]',
      'sm:text-sm/6',
      'focus:outline-2',
      'focus:outline-offset-2',
      'focus:outline-blue-500',
      'transition-colors',
      'duration-200',
      // Plain variant styles
      'border-transparent',
      'text-zinc-950',
      'hover:bg-zinc-950/5',
      'active:bg-zinc-950/5',
      'dark:text-white',
      'dark:hover:bg-white/10',
      'dark:active:bg-white/10'
    ];

    if (disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
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

  setHref(href) {
    this.options.href = href;
    // Recreate the element to update the button type
    const parent = this.element.parentNode;
    this.element.remove();
    this.element = this.createElement();
    if (parent) {
      parent.appendChild(this.element);
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

class HeadlessPaginationList {
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
      'hidden',
      'items-baseline',
      'gap-x-2',
      'sm:flex'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessPaginationList.styles.base];

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

class HeadlessPaginationPage {
  constructor(options = {}) {
    this.options = {
      href: options.href || "",
      className: options.className || "",
      current: options.current || false,
      children: options.children || "",
      onClick: options.onClick || null,
      ...options,
    };

    this.element = this.createElement();
  }

  createElement() {
    const button = document.createElement("a");
    button.href = this.options.href;
    button.setAttribute('aria-label', `Page ${this.options.children}`);
    
    if (this.options.current) {
      button.setAttribute('aria-current', 'page');
    }

    // Apply button styles
    button.className = this.getClasses();

    // Add click handler
    if (this.options.onClick) {
      button.addEventListener("click", this.options.onClick);
    }

    // Create inner span
    const span = document.createElement("span");
    span.className = "-mx-0.5";
    span.textContent = this.options.children;
    button.appendChild(span);

    return button;
  }

  getClasses() {
    const classes = [
      'relative',
      'isolate',
      'inline-flex',
      'items-baseline',
      'justify-center',
      'gap-x-2',
      'rounded-lg',
      'border',
      'text-base/6',
      'font-semibold',
      'min-w-9',
      'px-[calc(theme(spacing.3.5)-1px)]',
      'py-[calc(theme(spacing.2.5)-1px)]',
      'sm:px-[calc(theme(spacing.3)-1px)]',
      'sm:py-[calc(theme(spacing.1.5)-1px)]',
      'sm:text-sm/6',
      'focus:outline-2',
      'focus:outline-offset-2',
      'focus:outline-blue-500',
      'transition-colors',
      'duration-200',
      'before:absolute',
      'before:-inset-px',
      'before:rounded-lg',
      // Plain variant styles
      'border-transparent',
      'text-zinc-950',
      'hover:bg-zinc-950/5',
      'active:bg-zinc-950/5',
      'dark:text-white',
      'dark:hover:bg-white/10',
      'dark:active:bg-white/10'
    ];

    if (this.options.current) {
      classes.push('before:bg-zinc-950/5', 'dark:before:bg-white/10');
    }

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

  setCurrent(current) {
    this.options.current = current;
    if (current) {
      this.element.setAttribute('aria-current', 'page');
    } else {
      this.element.removeAttribute('aria-current');
    }
    this.element.className = this.getClasses();
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessPaginationGap {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      children: options.children || '…', // hellip character
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'w-9',
      'text-center',
      'text-sm/6',
      'font-semibold',
      'text-zinc-950',
      'select-none',
      'dark:text-white'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.setAttribute('aria-hidden', 'true');
    element.textContent = this.options.children;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessPaginationGap.styles.base];

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

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HeadlessPagination,
    HeadlessPaginationPrevious,
    HeadlessPaginationNext,
    HeadlessPaginationList,
    HeadlessPaginationPage,
    HeadlessPaginationGap
  };
}