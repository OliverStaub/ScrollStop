/**
 * HeadlessDropdown - A comprehensive dropdown menu component suite
 *
 * USAGE EXAMPLES:
 *
 * // Basic dropdown
 * const dropdown = new HeadlessDropdown();
 * const button = new HeadlessDropdownButton('Options');
 * button.render(dropdown.element);
 *
 * const menu = new HeadlessDropdownMenu();
 * new HeadlessDropdownItem({
 *   children: 'Edit',
 *   onClick: () => console.log('Edit clicked')
 * }).render(menu.element);
 * new HeadlessDropdownItem({
 *   children: 'Delete',
 *   onClick: () => console.log('Delete clicked')
 * }).render(menu.element);
 * menu.render(dropdown.element);
 * dropdown.render('#container');
 *
 * // Dropdown with sections and headers
 * const dropdown = new HeadlessDropdown();
 * const menu = new HeadlessDropdownMenu();
 *
 * new HeadlessDropdownHeader().setContent('User Actions').render(menu.element);
 *
 * const section1 = new HeadlessDropdownSection();
 * new HeadlessDropdownHeading('Account').render(section1.element);
 * new HeadlessDropdownItem({ children: 'Profile' }).render(section1.element);
 * new HeadlessDropdownItem({ children: 'Settings' }).render(section1.element);
 * section1.render(menu.element);
 *
 * new HeadlessDropdownDivider().render(menu.element);
 *
 * const section2 = new HeadlessDropdownSection();
 * new HeadlessDropdownItem({
 *   href: '/logout',
 *   children: 'Sign out'
 * }).render(section2.element);
 * section2.render(menu.element);
 *
 * menu.render(dropdown.element);
 * dropdown.render('#user-menu');
 *
 * // With icons and descriptions
 * const item = new HeadlessDropdownItem({
 *   children: [
 *     new HeadlessDropdownLabel('Edit User'),
 *     new HeadlessDropdownDescription('Modify user details and permissions')
 *   ]
 * });
 * item.render(menu.element);
 *
 * // With keyboard shortcuts
 * const item = new HeadlessDropdownItem({
 *   children: [
 *     new HeadlessDropdownLabel('Save'),
 *     new HeadlessDropdownShortcut({ keys: 'Cmd+S' })
 *   ]
 * });
 */

class HeadlessDropdown {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.isOpen = false;
    this.element = this.createElement();
    this.button = null;
    this.menu = null;
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'relative inline-block text-left';

    // Add click outside handler
    this.handleClickOutside = (e) => {
      if (!element.contains(e.target) && this.isOpen) {
        this.close();
      }
    };

    return element;
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

  open() {
    this.isOpen = true;
    if (this.menu) {
      this.menu.show();
    }
    document.addEventListener('click', this.handleClickOutside);
    return this;
  }

  close() {
    this.isOpen = false;
    if (this.menu) {
      this.menu.hide();
    }
    document.removeEventListener('click', this.handleClickOutside);
    return this;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
    return this;
  }

  setButton(button) {
    this.button = button;
    button.setDropdown(this);
    return this;
  }

  setMenu(menu) {
    this.menu = menu;
    return this;
  }

  remove() {
    document.removeEventListener('click', this.handleClickOutside);
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDropdownButton {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || '',
      as: options.as || 'button',
      ...options,
    };

    this.dropdown = null;
    this.element = this.createElement();
  }

  // Style configurations (simplified button styles)
  static styles = {
    base: [
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
      // Default solid dark/zinc styling
      'text-white',
      'bg-zinc-900',
      'border-zinc-950/90',
      'hover:bg-zinc-800',
      'active:bg-zinc-900',
      'shadow-sm',
      'hover:shadow-md',
      'active:shadow-sm',
    ],
  };

  createElement() {
    const element = document.createElement(this.options.as === 'button' ? 'button' : 'div');

    if (this.options.as === 'button') {
      element.type = 'button';
    }

    element.textContent = this.text;
    element.className = this.getClasses();

    element.addEventListener('click', () => {
      if (this.dropdown) {
        this.dropdown.toggle();
      }
    });

    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownButton.styles.base];

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

  setDropdown(dropdown) {
    this.dropdown = dropdown;
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDropdownMenu {
  constructor(options = {}) {
    this.options = {
      anchor: options.anchor || 'bottom',
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      // Anchor positioning
      '[--anchor-gap:theme(spacing.2)]',
      '[--anchor-padding:theme(spacing.1)]',
      'data-[anchor~=end]:[--anchor-offset:6px]',
      'data-[anchor~=start]:[--anchor-offset:-6px]',
      'sm:data-[anchor~=end]:[--anchor-offset:4px]',
      'sm:data-[anchor~=start]:[--anchor-offset:-4px]',
      // Base styles
      'isolate',
      'w-max',
      'rounded-xl',
      'p-1',
      // Focus handling
      'outline',
      'outline-transparent',
      'focus:outline-hidden',
      // Scrolling
      'overflow-y-auto',
      // Background
      'bg-white/75',
      'backdrop-blur-xl',
      'dark:bg-zinc-800/75',
      // Shadows
      'shadow-lg',
      'ring-1',
      'ring-zinc-950/10',
      'dark:ring-white/10',
      'dark:ring-inset',
      // Grid support
      'supports-[grid-template-columns:subgrid]:grid',
      'supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
      // Position
      'absolute',
      'z-10',
      'mt-2',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    element.style.display = 'none'; // Hidden by default
    element.setAttribute('role', 'menu');
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownMenu.styles.base];

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

  show() {
    this.element.style.display = 'block';
    return this;
  }

  hide() {
    this.element.style.display = 'none';
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDropdownItem {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      children: options.children || '',
      href: options.href || null,
      onClick: options.onClick || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      // Base styles
      'group',
      'cursor-default',
      'rounded-lg',
      'px-3.5',
      'py-2.5',
      'focus:outline-hidden',
      'sm:px-3',
      'sm:py-1.5',
      // Text styles
      'text-left',
      'text-base/6',
      'text-zinc-950',
      'sm:text-sm/6',
      'dark:text-white',
      'forced-colors:text-[CanvasText]',
      // Focus
      'data-focus:bg-blue-500',
      'data-focus:text-white',
      // Disabled state
      'data-disabled:opacity-50',
      // Forced colors mode
      'forced-color-adjust-none',
      'forced-colors:data-focus:bg-[Highlight]',
      'forced-colors:data-focus:text-[HighlightText]',
      'forced-colors:data-focus:*:data-[slot=icon]:text-[HighlightText]',
      // Grid layout
      'col-span-full',
      'grid',
      'grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
      'items-center',
      'supports-[grid-template-columns:subgrid]:grid-cols-subgrid',
      // Icons
      '*:data-[slot=icon]:col-start-1',
      '*:data-[slot=icon]:row-start-1',
      '*:data-[slot=icon]:mr-2.5',
      '*:data-[slot=icon]:-ml-0.5',
      '*:data-[slot=icon]:size-5',
      'sm:*:data-[slot=icon]:mr-2',
      'sm:*:data-[slot=icon]:size-4',
      '*:data-[slot=icon]:text-zinc-500',
      'data-focus:*:data-[slot=icon]:text-white',
      'dark:*:data-[slot=icon]:text-zinc-400',
      'dark:data-focus:*:data-[slot=icon]:text-white',
      // Avatar
      '*:data-[slot=avatar]:mr-2.5',
      '*:data-[slot=avatar]:-ml-1',
      '*:data-[slot=avatar]:size-6',
      'sm:*:data-[slot=avatar]:mr-2',
      'sm:*:data-[slot=avatar]:size-5',
    ],
  };

  createElement() {
    const isLink = this.options.href !== null;
    const element = document.createElement(isLink ? 'a' : 'button');

    if (isLink) {
      element.href = this.options.href;
    } else {
      element.type = 'button';
    }

    element.className = this.getClasses();
    element.setAttribute('role', 'menuitem');

    // Add content
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

    // Add click handler
    if (this.options.onClick) {
      element.addEventListener('click', this.options.onClick);
    }

    // Add hover effects
    element.addEventListener('mouseenter', () => {
      element.setAttribute('data-focus', 'true');
    });
    element.addEventListener('mouseleave', () => {
      element.removeAttribute('data-focus');
    });

    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownItem.styles.base];

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

class HeadlessDropdownHeader {
  constructor(options = {}) {
    this.options = {
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['col-span-5', 'px-3.5', 'pt-2.5', 'pb-1', 'sm:px-3'],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownHeader.styles.base];

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

  setContent(content) {
    this.element.innerHTML = '';
    if (typeof content === 'string') {
      this.element.textContent = content;
    } else {
      this.element.appendChild(content);
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

class HeadlessDropdownSection {
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
      'col-span-full',
      'supports-[grid-template-columns:subgrid]:grid',
      'supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownSection.styles.base];

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

class HeadlessDropdownHeading {
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
      'col-span-full',
      'grid',
      'grid-cols-[1fr_auto]',
      'gap-x-12',
      'px-3.5',
      'pt-2',
      'pb-1',
      'text-sm/5',
      'font-medium',
      'text-zinc-500',
      'sm:px-3',
      'sm:text-xs/5',
      'dark:text-zinc-400',
    ],
  };

  createElement() {
    const element = document.createElement('h3');
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownHeading.styles.base];

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

class HeadlessDropdownDivider {
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
      'col-span-full',
      'mx-3.5',
      'my-1',
      'h-px',
      'border-0',
      'bg-zinc-950/5',
      'sm:mx-3',
      'dark:bg-white/10',
      'forced-colors:bg-[CanvasText]',
    ],
  };

  createElement() {
    const element = document.createElement('hr');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownDivider.styles.base];

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

class HeadlessDropdownLabel {
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
    base: ['col-start-2', 'row-start-1'],
  };

  createElement() {
    const element = document.createElement('div');
    element.textContent = this.text;
    element.setAttribute('data-slot', 'label');
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownLabel.styles.base];

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

class HeadlessDropdownDescription {
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
      'col-span-2',
      'col-start-2',
      'row-start-2',
      'text-sm/5',
      'text-zinc-500',
      'group-data-focus:text-white',
      'sm:text-xs/5',
      'dark:text-zinc-400',
      'forced-colors:group-data-focus:text-[HighlightText]',
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
    const classes = [...HeadlessDropdownDescription.styles.base];

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

class HeadlessDropdownShortcut {
  constructor(options = {}) {
    this.options = {
      keys: options.keys || '',
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: ['col-start-5', 'row-start-1', 'flex', 'justify-self-end'],
    key: [
      'min-w-[2ch]',
      'text-center',
      'font-sans',
      'text-zinc-400',
      'capitalize',
      'group-data-focus:text-white',
      'forced-colors:group-data-focus:text-[HighlightText]',
    ],
  };

  createElement() {
    const element = document.createElement('kbd');
    element.className = this.getClasses();

    // Parse keys (can be string or array)
    const keys = Array.isArray(this.options.keys) ? this.options.keys : this.options.keys.split('');

    keys.forEach((char, index) => {
      const kbd = document.createElement('kbd');
      kbd.textContent = char;
      kbd.className = this.getKeyClasses(index, char);
      element.appendChild(kbd);
    });

    return element;
  }

  getClasses() {
    const classes = [...HeadlessDropdownShortcut.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getKeyClasses(index, char) {
    const classes = [...HeadlessDropdownShortcut.styles.key];

    // Add padding for multi-character keys
    if (index > 0 && char.length > 1) {
      classes.push('pl-1');
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

  setKeys(keys) {
    this.options.keys = keys;
    // Recreate the element with new keys
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

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HeadlessDropdown,
    HeadlessDropdownButton,
    HeadlessDropdownMenu,
    HeadlessDropdownItem,
    HeadlessDropdownHeader,
    HeadlessDropdownSection,
    HeadlessDropdownHeading,
    HeadlessDropdownDivider,
    HeadlessDropdownLabel,
    HeadlessDropdownDescription,
    HeadlessDropdownShortcut,
  };
}
