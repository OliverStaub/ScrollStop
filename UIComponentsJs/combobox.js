/**
 * HeadlessCombobox - A comprehensive combobox component with filtering and selection
 *
 * USAGE EXAMPLES:
 *
 * // Basic combobox
 * const options = [
 *   { id: 1, name: 'Apple' },
 *   { id: 2, name: 'Banana' },
 *   { id: 3, name: 'Cherry' }
 * ];
 *
 * const combobox = new HeadlessCombobox({
 *   options: options,
 *   displayValue: (option) => option ? option.name : '',
 *   placeholder: 'Select a fruit...',
 *   onChange: (value) => console.log('Selected:', value)
 * });
 * combobox.render('#container');
 *
 * // With custom filter
 * const combobox = new HeadlessCombobox({
 *   options: options,
 *   displayValue: (option) => option ? option.name : '',
 *   filter: (option, query) => {
 *     return option.name.toLowerCase().includes(query.toLowerCase());
 *   },
 *   placeholder: 'Search fruits...'
 * });
 *
 * // Anchor positioning
 * const combobox = new HeadlessCombobox({
 *   options: options,
 *   displayValue: (option) => option ? option.name : '',
 *   anchor: 'top' // or 'bottom'
 * });
 *
 * // With option descriptions
 * const combobox = new HeadlessCombobox({
 *   options: [
 *     { id: 1, name: 'Apple', description: 'A sweet red fruit' },
 *     { id: 2, name: 'Banana', description: 'A yellow tropical fruit' }
 *   ],
 *   displayValue: (option) => option ? option.name : '',
 *   renderOption: (option) => {
 *     const container = document.createElement('div');
 *     const label = new HeadlessComboboxLabel(option.name);
 *     const desc = new HeadlessComboboxDescription(option.description);
 *     label.render(container);
 *     desc.render(container);
 *     return container;
 *   }
 * });
 */

class HeadlessCombobox {
  constructor(options = {}) {
    this.options = {
      options: options.options || [],
      displayValue: options.displayValue || ((value) => (value ? String(value) : '')),
      filter: options.filter || null,
      anchor: options.anchor || 'bottom',
      className: options.className || '',
      placeholder: options.placeholder || '',
      autoFocus: options.autoFocus || false,
      ariaLabel: options.ariaLabel || '',
      onChange: options.onChange || null,
      renderOption: options.renderOption || null,
      ...options,
    };

    this.value = null;
    this.query = '';
    this.isOpen = false;
    this.filteredOptions = [...this.options.options];
    this.element = this.createElement();
    this.input = null;
    this.optionsContainer = null;
    this.selectedIndex = -1;
  }

  createElement() {
    // Main container
    const container = document.createElement('div');
    container.className = 'relative';

    // Control span
    const controlSpan = document.createElement('span');
    controlSpan.setAttribute('data-slot', 'control');
    controlSpan.className = this.getControlClasses();

    // Input element
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.setAttribute('data-slot', 'control');
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-autocomplete', 'list');

    if (this.options.ariaLabel) {
      this.input.setAttribute('aria-label', this.options.ariaLabel);
    }

    if (this.options.placeholder) {
      this.input.placeholder = this.options.placeholder;
    }

    if (this.options.autoFocus) {
      this.input.autofocus = true;
    }

    this.input.className = this.getInputClasses();
    this.input.addEventListener('input', (e) => this.handleInputChange(e));
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.input.addEventListener('focus', () => this.handleFocus());
    this.input.addEventListener('blur', (e) => this.handleBlur(e));

    // Button (chevron)
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'group absolute inset-y-0 right-0 flex items-center px-2';
    button.addEventListener('click', () => this.toggle());

    const chevronSvg = this.createChevronIcon();
    button.appendChild(chevronSvg);

    // Options container
    this.optionsContainer = document.createElement('div');
    this.optionsContainer.className = this.getOptionsClasses();
    this.optionsContainer.style.display = 'none';
    this.optionsContainer.setAttribute('role', 'listbox');

    // Assemble structure
    controlSpan.appendChild(this.input);
    controlSpan.appendChild(button);
    container.appendChild(controlSpan);
    container.appendChild(this.optionsContainer);

    // Click outside handler
    this.handleClickOutside = (e) => {
      if (!container.contains(e.target) && this.isOpen) {
        this.close();
      }
    };

    this.updateFilteredOptions();
    this.renderOptions();

    return container;
  }

  createChevronIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'class',
      'size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 group-data-hover:stroke-zinc-700 sm:size-4 dark:stroke-zinc-400 dark:group-data-hover:stroke-zinc-300 forced-colors:stroke-[CanvasText]'
    );
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M5.75 10.75L8 13L10.25 10.75');
    path1.setAttribute('stroke-width', '1.5');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('stroke-linejoin', 'round');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M10.25 5.25L8 3L5.75 5.25');
    path2.setAttribute('stroke-width', '1.5');
    path2.setAttribute('stroke-linecap', 'round');
    path2.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path1);
    svg.appendChild(path2);
    return svg;
  }

  getControlClasses() {
    const classes = [
      // Basic layout
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
      // Focus ring
      'after:pointer-events-none',
      'after:absolute',
      'after:inset-0',
      'after:rounded-lg',
      'after:ring-transparent',
      'after:ring-inset',
      'sm:focus-within:after:ring-2',
      'sm:focus-within:after:ring-blue-500',
      // Disabled state
      'has-data-disabled:opacity-50',
      'has-data-disabled:before:bg-zinc-950/5',
      'has-data-disabled:before:shadow-none',
      // Invalid state
      'has-data-invalid:before:shadow-red-500/10',
    ];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getInputClasses() {
    return [
      // Basic layout
      'relative',
      'block',
      'w-full',
      'appearance-none',
      'rounded-lg',
      'py-[calc(theme(spacing.2.5)-1px)]',
      'sm:py-[calc(theme(spacing.1.5)-1px)]',
      // Horizontal padding
      'pr-[calc(theme(spacing.10)-1px)]',
      'pl-[calc(theme(spacing.3.5)-1px)]',
      'sm:pr-[calc(theme(spacing.9)-1px)]',
      'sm:pl-[calc(theme(spacing.3)-1px)]',
      // Typography
      'text-base/6',
      'text-zinc-950',
      'placeholder:text-zinc-500',
      'sm:text-sm/6',
      'dark:text-white',
      // Border
      'border',
      'border-zinc-950/10',
      'data-hover:border-zinc-950/20',
      'dark:border-white/10',
      'dark:data-hover:border-white/20',
      // Background color
      'bg-transparent',
      'dark:bg-white/5',
      // Hide default focus styles
      'focus:outline-hidden',
      // Invalid state
      'data-invalid:border-red-500',
      'data-invalid:data-hover:border-red-500',
      'dark:data-invalid:border-red-500',
      'dark:data-invalid:data-hover:border-red-500',
      // Disabled state
      'data-disabled:border-zinc-950/20',
      'dark:data-disabled:border-white/15',
      'dark:data-disabled:bg-white/2.5',
      'dark:data-hover:data-disabled:border-white/15',
      // System icons
      'dark:scheme-dark',
    ].join(' ');
  }

  getOptionsClasses() {
    return [
      // Anchor positioning
      '[--anchor-gap:theme(spacing.2)]',
      '[--anchor-padding:theme(spacing.4)]',
      'sm:data-[anchor~=start]:[--anchor-offset:-4px]',
      // Base styles
      'isolate',
      'min-w-[calc(var(--input-width)+8px)]',
      'scroll-py-1',
      'rounded-xl',
      'p-1',
      'select-none',
      'empty:invisible',
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
      'mt-1',
    ].join(' ');
  }

  handleInputChange(e) {
    this.query = e.target.value;
    this.updateFilteredOptions();
    this.renderOptions();

    if (!this.isOpen) {
      this.open();
    }

    this.selectedIndex = -1;
  }

  handleKeyDown(e) {
    if (!this.isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.open();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredOptions.length - 1);
        this.updateOptionHighlight();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateOptionHighlight();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.filteredOptions[this.selectedIndex]) {
          this.selectOption(this.filteredOptions[this.selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  handleFocus() {
    this.open();
  }

  handleBlur(e) {
    // Delay to allow option clicks to register
    setTimeout(() => {
      if (!this.element.contains(document.activeElement)) {
        this.close();
      }
    }, 100);
  }

  updateFilteredOptions() {
    if (this.query === '') {
      this.filteredOptions = [...this.options.options];
    } else {
      this.filteredOptions = this.options.options.filter((option) => {
        if (this.options.filter) {
          return this.options.filter(option, this.query);
        } else {
          const displayValue = this.options.displayValue(option);
          return displayValue && displayValue.toLowerCase().includes(this.query.toLowerCase());
        }
      });
    }
  }

  renderOptions() {
    this.optionsContainer.innerHTML = '';

    this.filteredOptions.forEach((option, index) => {
      const optionElement = new HeadlessComboboxOption({
        option: option,
        index: index,
        onSelect: () => this.selectOption(option),
        renderContent: this.options.renderOption,
      });

      optionElement.render(this.optionsContainer);
    });
  }

  updateOptionHighlight() {
    const options = this.optionsContainer.querySelectorAll('[role="option"]');
    options.forEach((option, index) => {
      if (index === this.selectedIndex) {
        option.setAttribute('data-focus', 'true');
        option.scrollIntoView({ block: 'nearest' });
      } else {
        option.removeAttribute('data-focus');
      }
    });
  }

  selectOption(option) {
    this.value = option;
    this.input.value = this.options.displayValue(option) || '';
    this.query = '';
    this.close();

    if (this.options.onChange) {
      this.options.onChange(option);
    }
  }

  open() {
    this.isOpen = true;
    this.optionsContainer.style.display = 'block';
    this.input.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this.handleClickOutside);
  }

  close() {
    this.isOpen = false;
    this.optionsContainer.style.display = 'none';
    this.input.setAttribute('aria-expanded', 'false');
    this.selectedIndex = -1;
    this.query = '';
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
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (!container) {
      throw new Error('Container not found');
    }

    container.appendChild(this.element);
    return this;
  }

  setValue(value) {
    this.value = value;
    this.input.value = this.options.displayValue(value) || '';
    return this;
  }

  getValue() {
    return this.value;
  }

  setOptions(options) {
    this.options.options = options;
    this.updateFilteredOptions();
    this.renderOptions();
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

class HeadlessComboboxOption {
  constructor(options = {}) {
    this.options = {
      option: options.option,
      index: options.index || 0,
      className: options.className || '',
      onSelect: options.onSelect || null,
      renderContent: options.renderContent || null,
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      // Basic layout
      'group/option',
      'grid',
      'w-full',
      'cursor-default',
      'grid-cols-[1fr_theme(spacing.5)]',
      'items-baseline',
      'gap-x-2',
      'rounded-lg',
      'py-2.5',
      'pr-2',
      'pl-3.5',
      'sm:grid-cols-[1fr_theme(spacing.4)]',
      'sm:py-1.5',
      'sm:pr-2',
      'sm:pl-3',
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
      'data-disabled:opacity-50',
    ],
    content: [
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
      'sm:*:data-[slot=avatar]:size-5',
    ],
  };

  createElement() {
    const element = document.createElement('div');
    element.className = this.getClasses();
    element.setAttribute('role', 'option');
    element.setAttribute('tabindex', '-1');

    // Add content
    const contentWrapper = document.createElement('span');
    contentWrapper.className = this.getContentClasses();

    if (this.options.renderContent) {
      const customContent = this.options.renderContent(this.options.option);
      contentWrapper.appendChild(customContent);
    } else {
      contentWrapper.textContent = String(this.options.option);
    }

    element.appendChild(contentWrapper);

    // Add checkmark icon
    const checkIcon = this.createCheckIcon();
    element.appendChild(checkIcon);

    // Add event listeners
    element.addEventListener('click', () => {
      if (this.options.onSelect) {
        this.options.onSelect();
      }
    });

    element.addEventListener('mouseenter', () => {
      element.setAttribute('data-focus', 'true');
    });

    element.addEventListener('mouseleave', () => {
      element.removeAttribute('data-focus');
    });

    return element;
  }

  createCheckIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'class',
      'relative col-start-2 hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4'
    );
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4 8.5l3 3L12 4');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
  }

  getClasses() {
    const classes = [...HeadlessComboboxOption.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getContentClasses() {
    return HeadlessComboboxOption.styles.content.join(' ');
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

class HeadlessComboboxLabel {
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
    base: ['ml-2.5', 'truncate', 'first:ml-0', 'sm:ml-2', 'sm:first:ml-0'],
  };

  createElement() {
    const element = document.createElement('span');
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessComboboxLabel.styles.base];

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

class HeadlessComboboxDescription {
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
      'flex',
      'flex-1',
      'overflow-hidden',
      'text-zinc-500',
      'group-data-focus/option:text-white',
      'before:w-2',
      'before:min-w-0',
      'before:shrink',
      'dark:text-zinc-400',
    ],
    inner: ['flex-1', 'truncate'],
  };

  createElement() {
    const element = document.createElement('span');
    element.className = this.getClasses();

    const inner = document.createElement('span');
    inner.className = this.getInnerClasses();
    inner.textContent = this.text;

    element.appendChild(inner);
    return element;
  }

  getClasses() {
    const classes = [...HeadlessComboboxDescription.styles.base];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getInnerClasses() {
    return HeadlessComboboxDescription.styles.inner.join(' ');
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
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HeadlessCombobox,
    HeadlessComboboxOption,
    HeadlessComboboxLabel,
    HeadlessComboboxDescription,
  };
}
