/**
 * HeadlessListbox - A comprehensive listbox component with selection support
 *
 * USAGE EXAMPLES:
 *
 * // Basic listbox
 * const options = [
 *   { id: 1, name: 'Apple' },
 *   { id: 2, name: 'Banana' },
 *   { id: 3, name: 'Cherry' }
 * ];
 * 
 * const listbox = new HeadlessListbox({
 *   placeholder: 'Select a fruit...',
 *   onChange: (value) => console.log('Selected:', value)
 * });
 * 
 * options.forEach(option => {
 *   const optionComponent = new HeadlessListboxOption({
 *     value: option,
 *     children: option.name
 *   });
 *   optionComponent.render(listbox.getOptionsContainer());
 * });
 * 
 * listbox.render('#container');
 *
 * // With custom option rendering
 * const listbox = new HeadlessListbox({
 *   placeholder: 'Choose an option...'
 * });
 * 
 * const option = new HeadlessListboxOption({
 *   value: { id: 1, name: 'Apple', color: 'red' },
 *   children: [
 *     new HeadlessListboxLabel('Apple'),
 *     new HeadlessListboxDescription('A sweet red fruit')
 *   ]
 * });
 * option.render(listbox.getOptionsContainer());
 *
 * // Auto-focus listbox
 * const listbox = new HeadlessListbox({
 *   autoFocus: true,
 *   ariaLabel: 'Choose a category'
 * });
 *
 * // Invalid state
 * const listbox = new HeadlessListbox({
 *   placeholder: 'Select...',
 *   invalid: true
 * });
 */

class HeadlessListbox {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      placeholder: options.placeholder || null,
      autoFocus: options.autoFocus || false,
      ariaLabel: options.ariaLabel || "",
      onChange: options.onChange || null,
      invalid: options.invalid || false,
      disabled: options.disabled || false,
      ...options,
    };

    this.value = null;
    this.isOpen = false;
    this.selectedIndex = -1;
    this.optionElements = [];
    this.element = this.createElement();
    this.button = null;
    this.optionsContainer = null;
  }

  createElement() {
    // Main container
    const container = document.createElement("div");
    container.className = "relative";

    // Button element
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.setAttribute('data-slot', 'control');
    this.button.setAttribute('role', 'listbox');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-haspopup', 'listbox');
    
    if (this.options.ariaLabel) {
      this.button.setAttribute('aria-label', this.options.ariaLabel);
    }
    
    if (this.options.autoFocus) {
      this.button.autofocus = true;
    }
    
    if (this.options.disabled) {
      this.button.disabled = true;
    }

    this.button.className = this.getButtonClasses();
    this.button.addEventListener('click', () => this.toggle());
    this.button.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Selected option display
    this.selectedDisplay = document.createElement("span");
    this.selectedDisplay.className = this.getSelectedDisplayClasses();
    this.updateSelectedDisplay();

    // Chevron icon
    const chevronContainer = document.createElement("span");
    chevronContainer.className = "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2";
    
    const chevronSvg = this.createChevronIcon();
    chevronContainer.appendChild(chevronSvg);

    // Options container
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.className = this.getOptionsClasses();
    this.optionsContainer.style.display = 'none';
    this.optionsContainer.setAttribute('role', 'listbox');

    // Assemble structure
    this.button.appendChild(this.selectedDisplay);
    this.button.appendChild(chevronContainer);
    container.appendChild(this.button);
    container.appendChild(this.optionsContainer);

    // Click outside handler
    this.handleClickOutside = (e) => {
      if (!container.contains(e.target) && this.isOpen) {
        this.close();
      }
    };

    return container;
  }

  createChevronIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute('d', 'M5.75 10.75L8 13L10.25 10.75');
    path1.setAttribute('stroke-width', '1.5');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('stroke-linejoin', 'round');

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute('d', 'M10.25 5.25L8 3L5.75 5.25');
    path2.setAttribute('stroke-width', '1.5');
    path2.setAttribute('stroke-linecap', 'round');
    path2.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path1);
    svg.appendChild(path2);
    return svg;
  }

  getButtonClasses() {
    const classes = [
      // Basic layout
      'group',
      'relative',
      'block',
      'w-full',
      // Background color + shadow
      'before:absolute',
      'before:inset-px',
      'before:rounded-[calc(var(--radius-lg)-1px)]',
      'before:bg-white',
      'before:shadow-sm',
      // Dark mode
      'dark:before:hidden',
      // Hide default focus styles
      'focus:outline-hidden',
      // Focus ring
      'after:pointer-events-none',
      'after:absolute',
      'after:inset-0',
      'after:rounded-lg',
      'after:ring-transparent',
      'after:ring-inset',
      'data-focus:after:ring-2',
      'data-focus:after:ring-blue-500',
      // Disabled state
      'data-disabled:opacity-50',
      'data-disabled:before:bg-zinc-950/5',
      'data-disabled:before:shadow-none'
    ];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getSelectedDisplayClasses() {
    const classes = [
      // Basic layout
      'relative',
      'block',
      'w-full',
      'appearance-none',
      'rounded-lg',
      'py-[calc(theme(spacing.2.5)-1px)]',
      'sm:py-[calc(theme(spacing.1.5)-1px)]',
      // Set minimum height for when no value is selected
      'min-h-11',
      'sm:min-h-9',
      // Horizontal padding
      'pr-[calc(theme(spacing.7)-1px)]',
      'pl-[calc(theme(spacing.3.5)-1px)]',
      'sm:pl-[calc(theme(spacing.3)-1px)]',
      // Typography
      'text-left',
      'text-base/6',
      'text-zinc-950',
      'placeholder:text-zinc-500',
      'sm:text-sm/6',
      'dark:text-white',
      'forced-colors:text-[CanvasText]',
      // Border
      'border',
      'border-zinc-950/10',
      'group-data-active:border-zinc-950/20',
      'group-data-hover:border-zinc-950/20',
      'dark:border-white/10',
      'dark:group-data-active:border-white/20',
      'dark:group-data-hover:border-white/20',
      // Background color
      'bg-transparent',
      'dark:bg-white/5'
    ];

    // Invalid state
    if (this.options.invalid) {
      classes.push(
        'group-data-invalid:border-red-500',
        'group-data-hover:group-data-invalid:border-red-500',
        'dark:group-data-invalid:border-red-600',
        'dark:data-hover:group-data-invalid:border-red-600'
      );
    }

    // Disabled state
    if (this.options.disabled) {
      classes.push(
        'group-data-disabled:border-zinc-950/20',
        'group-data-disabled:opacity-100',
        'dark:group-data-disabled:border-white/15',
        'dark:group-data-disabled:bg-white/2.5',
        'dark:group-data-disabled:data-hover:border-white/15'
      );
    }

    return classes.join(" ");
  }

  getOptionsClasses() {
    return [
      // Anchor positioning
      '[--anchor-offset:-1.625rem]',
      '[--anchor-padding:theme(spacing.4)]',
      'sm:[--anchor-offset:-1.375rem]',
      // Base styles
      'isolate',
      'w-max',
      'min-w-[calc(var(--button-width)+1.75rem)]',
      'scroll-py-1',
      'rounded-xl',
      'p-1',
      'select-none',
      // Focus handling
      'outline',
      'outline-transparent',
      'focus:outline-hidden',
      // Scrolling
      'overflow-y-scroll',
      'overscroll-contain',
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
      // Position
      'absolute',
      'z-10',
      'w-full',
      'mt-1'
    ].join(" ");
  }

  updateSelectedDisplay() {
    if (this.value) {
      // Clear existing content
      this.selectedDisplay.innerHTML = '';
      
      // Find the selected option and clone its content
      const selectedOption = this.optionElements.find(opt => opt.getValue() === this.value);
      if (selectedOption) {
        const selectedContent = selectedOption.getSelectedContent();
        this.selectedDisplay.appendChild(selectedContent);
      } else {
        this.selectedDisplay.textContent = String(this.value);
      }
    } else if (this.options.placeholder) {
      this.selectedDisplay.innerHTML = '';
      const placeholder = document.createElement('span');
      placeholder.className = 'block truncate text-zinc-500';
      placeholder.textContent = this.options.placeholder;
      this.selectedDisplay.appendChild(placeholder);
    } else {
      this.selectedDisplay.textContent = '';
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.open();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.optionElements.length - 1);
        this.updateOptionHighlight();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateOptionHighlight();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.optionElements[this.selectedIndex]) {
          this.selectOption(this.optionElements[this.selectedIndex].getValue());
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  updateOptionHighlight() {
    this.optionElements.forEach((option, index) => {
      if (index === this.selectedIndex) {
        option.setFocus(true);
        option.element.scrollIntoView({ block: 'nearest' });
      } else {
        option.setFocus(false);
      }
    });
  }

  selectOption(value) {
    this.value = value;
    this.updateSelectedDisplay();
    this.close();
    
    // Update selected state on options
    this.optionElements.forEach(option => {
      option.setSelected(option.getValue() === value);
    });
    
    if (this.options.onChange) {
      this.options.onChange(value);
    }
  }

  open() {
    if (this.options.disabled) return;
    
    this.isOpen = true;
    this.optionsContainer.style.display = 'block';
    this.button.setAttribute('aria-expanded', 'true');
    this.selectedIndex = this.optionElements.findIndex(opt => opt.getValue() === this.value);
    if (this.selectedIndex === -1 && this.optionElements.length > 0) {
      this.selectedIndex = 0;
    }
    this.updateOptionHighlight();
    document.addEventListener('click', this.handleClickOutside);
  }

  close() {
    this.isOpen = false;
    this.optionsContainer.style.display = 'none';
    this.button.setAttribute('aria-expanded', 'false');
    this.selectedIndex = -1;
    
    // Remove focus from all options
    this.optionElements.forEach(option => option.setFocus(false));
    
    document.removeEventListener('click', this.handleClickOutside);
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
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

  getOptionsContainer() {
    return this.optionsContainer;
  }

  addOption(option) {
    this.optionElements.push(option);
    option.setListbox(this);
    return this;
  }

  setValue(value) {
    this.value = value;
    this.updateSelectedDisplay();
    
    // Update selected state on options
    this.optionElements.forEach(option => {
      option.setSelected(option.getValue() === value);
    });
    
    return this;
  }

  getValue() {
    return this.value;
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.button.disabled = disabled;
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

class HeadlessListboxOption {
  constructor(options = {}) {
    this.options = {
      value: options.value,
      children: options.children || "",
      className: options.className || "",
      ...options,
    };

    this.listbox = null;
    this.isSelected = false;
    this.isFocused = false;
    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      // Base
      'flex',
      'min-w-0',
      'items-center',
      // Icons
      '*:data-[slot=icon]:size-5',
      '*:data-[slot=icon]:shrink-0',
      'sm:*:data-[slot=icon]:size-4',
      '*:data-[slot=icon]:text-zinc-500',
      'group-data-focus/option:*:data-[slot=icon]:text-white',
      'dark:*:data-[slot=icon]:text-zinc-400',
      'forced-colors:*:data-[slot=icon]:text-[CanvasText]',
      'forced-colors:group-data-focus/option:*:data-[slot=icon]:text-[Canvas]',
      // Avatars
      '*:data-[slot=avatar]:-mx-0.5',
      '*:data-[slot=avatar]:size-6',
      'sm:*:data-[slot=avatar]:size-5'
    ],
    container: [
      // Basic layout
      'group/option',
      'grid',
      'cursor-default',
      'grid-cols-[theme(spacing.5)_1fr]',
      'items-baseline',
      'gap-x-2',
      'rounded-lg',
      'py-2.5',
      'pr-3.5',
      'pl-2',
      'sm:grid-cols-[theme(spacing.4)_1fr]',
      'sm:py-1.5',
      'sm:pr-3',
      'sm:pl-1.5',
      // Typography
      'text-base/6',
      'text-zinc-950',
      'sm:text-sm/6',
      'dark:text-white',
      'forced-colors:text-[CanvasText]',
      // Focus
      'outline-hidden',
      'data-focus:bg-blue-500',
      'data-focus:text-white',
      // Forced colors mode
      'forced-color-adjust-none',
      'forced-colors:data-focus:bg-[Highlight]',
      'forced-colors:data-focus:text-[HighlightText]',
      // Disabled
      'data-disabled:opacity-50'
    ]
  };

  createElement() {
    // For selected option display, just return the content
    if (this.options.selectedOption) {
      const container = document.createElement("div");
      container.className = this.getClasses();
      this.addContent(container);
      return container;
    }

    // For dropdown option
    const container = document.createElement("div");
    container.className = this.getContainerClasses();
    container.setAttribute('role', 'option');
    container.setAttribute('tabindex', '-1');

    // Checkmark icon
    const checkIcon = this.createCheckIcon();
    container.appendChild(checkIcon);

    // Content wrapper
    const contentWrapper = document.createElement("span");
    contentWrapper.className = this.getClasses() + " col-start-2";
    this.addContent(contentWrapper);
    container.appendChild(contentWrapper);

    // Event listeners
    container.addEventListener('click', () => {
      if (this.listbox) {
        this.listbox.selectOption(this.options.value);
      }
    });

    container.addEventListener('mouseenter', () => {
      this.setFocus(true);
    });

    container.addEventListener('mouseleave', () => {
      this.setFocus(false);
    });

    return container;
  }

  addContent(container) {
    if (typeof this.options.children === 'string') {
      container.textContent = this.options.children;
    } else if (Array.isArray(this.options.children)) {
      this.options.children.forEach(child => {
        if (typeof child === 'string') {
          container.appendChild(document.createTextNode(child));
        } else {
          container.appendChild(child.element || child);
        }
      });
    } else if (this.options.children) {
      container.appendChild(this.options.children.element || this.options.children);
    }
  }

  createCheckIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M4 8.5l3 3L12 4');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
  }

  getClasses() {
    const classes = [...HeadlessListboxOption.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getContainerClasses() {
    return HeadlessListboxOption.styles.container.join(" ");
  }

  getSelectedContent() {
    const container = document.createElement("div");
    container.className = this.getClasses();
    this.addContent(container);
    return container;
  }

  render(container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (!container) {
      throw new Error("Container not found");
    }

    container.appendChild(this.element);
    
    // Register with parent listbox if it exists
    if (container.closest('.relative')) {
      const listboxElement = container.closest('.relative');
      // This is a bit hacky, but we need to find the listbox instance
      // In a real implementation, you might want to use a different approach
    }
    
    return this;
  }

  setListbox(listbox) {
    this.listbox = listbox;
    return this;
  }

  setSelected(selected) {
    this.isSelected = selected;
    if (selected) {
      this.element.setAttribute('data-selected', 'true');
      this.element.classList.add('group-data-selected/option');
    } else {
      this.element.removeAttribute('data-selected');
      this.element.classList.remove('group-data-selected/option');
    }
    return this;
  }

  setFocus(focused) {
    this.isFocused = focused;
    if (focused) {
      this.element.setAttribute('data-focus', 'true');
    } else {
      this.element.removeAttribute('data-focus');
    }
    return this;
  }

  getValue() {
    return this.options.value;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessListboxLabel {
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
      'ml-2.5',
      'truncate',
      'first:ml-0',
      'sm:ml-2',
      'sm:first:ml-0'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessListboxLabel.styles.base];

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

class HeadlessListboxDescription {
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
      'flex',
      'flex-1',
      'overflow-hidden',
      'text-zinc-500',
      'group-data-focus/option:text-white',
      'before:w-2',
      'before:min-w-0',
      'before:shrink',
      'dark:text-zinc-400'
    ],
    inner: [
      'flex-1',
      'truncate'
    ]
  };

  createElement() {
    const element = document.createElement("span");
    element.className = this.getClasses();

    const inner = document.createElement("span");
    inner.className = this.getInnerClasses();
    inner.textContent = this.text;

    element.appendChild(inner);
    return element;
  }

  getClasses() {
    const classes = [...HeadlessListboxDescription.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getInnerClasses() {
    return HeadlessListboxDescription.styles.inner.join(" ");
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
    const inner = this.element.querySelector('.flex-1');
    if (inner) {
      inner.textContent = newText;
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
    HeadlessListbox,
    HeadlessListboxOption,
    HeadlessListboxLabel,
    HeadlessListboxDescription
  };
}