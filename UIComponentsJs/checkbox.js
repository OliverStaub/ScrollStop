/**
 * HeadlessCheckbox - A comprehensive checkbox component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic checkbox
 * new HeadlessCheckbox('Accept terms').render('#container');
 *
 * // Checkbox with initial checked state
 * new HeadlessCheckbox('Subscribe', {
 *   checked: true,
 *   onChange: (checked) => console.log('Checked:', checked)
 * }).render(document.body);
 *
 * // Colored checkbox
 * new HeadlessCheckbox('Enable notifications', {
 *   color: 'blue',
 *   onChange: (checked) => console.log('Notifications:', checked)
 * }).render('#settings');
 *
 * // Indeterminate checkbox
 * new HeadlessCheckbox('Select all', {
 *   indeterminate: true,
 *   color: 'green'
 * }).render('#bulk-actions');
 *
 * // Disabled checkbox
 * new HeadlessCheckbox('Disabled option', {
 *   disabled: true,
 *   checked: true
 * }).render('#form');
 *
 * // Checkbox with custom CSS classes
 * new HeadlessCheckbox('Custom', {
 *   className: 'my-custom-class',
 *   color: 'purple'
 * }).render('#special-section');
 *
 * // Checkbox group example
 * HeadlessCheckbox.createGroup('#options', [
 *   { text: 'Option 1', options: { color: 'blue' } },
 *   { text: 'Option 2', options: { color: 'green' } },
 *   { text: 'Option 3', options: { disabled: true } }
 * ]);
 *
 * AVAILABLE COLORS:
 * 'dark/zinc', 'dark/white', 'white', 'dark', 'zinc', 'red', 'orange', 'amber',
 * 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
 * 'violet', 'purple', 'fuchsia', 'pink', 'rose'
 */
class HeadlessCheckbox {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      color: options.color || 'dark/zinc',
      checked: options.checked || false,
      indeterminate: options.indeterminate || false,
      disabled: options.disabled || false,
      className: options.className || '',
      onChange: options.onChange || null,
      id: options.id || null,
      name: options.name || null,
      value: options.value || null,
      ...options,
    };

    this.element = this.createElement();
    this.checkbox = this.element.querySelector('input[type="checkbox"]');
    this.updateIndeterminate();
  }

  // Style configurations (converted from the original React component)
  static styles = {
    base: [
      // Basic layout
      'relative isolate flex size-4.5 items-center justify-center rounded-[0.3125rem] sm:size-4',
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow-sm',
      // Background color when checked
      'group-data-checked:before:bg-(--checkbox-checked-bg)',
      // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
      'dark:before:hidden',
      // Background color applied to control in dark mode
      'dark:bg-white/5 dark:group-data-checked:bg-(--checkbox-checked-bg)',
      // Border
      'border border-zinc-950/15 group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-zinc-950/30 group-data-checked:bg-(--checkbox-checked-border)',
      'dark:border-white/15 dark:group-data-checked:border-white/5 dark:group-data-hover:group-data-checked:border-white/5 dark:group-data-hover:border-white/30',
      // Inner highlight shadow
      'after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
      'dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-checked:after:block',
      // Focus ring
      'group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
      // Disabled state
      'group-data-disabled:opacity-50',
      'group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5 group-data-disabled:[--checkbox-check:var(--color-zinc-950)]/50 group-data-disabled:before:bg-transparent',
      'dark:group-data-disabled:border-white/20 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:[--checkbox-check:var(--color-white)]/50 dark:group-data-checked:group-data-disabled:after:hidden',
      // Forced colors mode
      'forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
      'dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
    ],

    colors: {
      'dark/zinc': [
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
        'dark:[--checkbox-checked-bg:var(--color-zinc-600)]',
      ],
      'dark/white': [
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
        'dark:[--checkbox-check:var(--color-zinc-900)] dark:[--checkbox-checked-bg:var(--color-white)] dark:[--checkbox-checked-border:var(--color-zinc-950)]/15',
      ],
      white:
        '[--checkbox-check:var(--color-zinc-900)] [--checkbox-checked-bg:var(--color-white)] [--checkbox-checked-border:var(--color-zinc-950)]/15',
      dark: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
      zinc: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-600)] [--checkbox-checked-border:var(--color-zinc-700)]/90',
      red: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-red-600)] [--checkbox-checked-border:var(--color-red-700)]/90',
      orange:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-orange-500)] [--checkbox-checked-border:var(--color-orange-600)]/90',
      amber:
        '[--checkbox-check:var(--color-amber-950)] [--checkbox-checked-bg:var(--color-amber-400)] [--checkbox-checked-border:var(--color-amber-500)]/80',
      yellow:
        '[--checkbox-check:var(--color-yellow-950)] [--checkbox-checked-bg:var(--color-yellow-300)] [--checkbox-checked-border:var(--color-yellow-400)]/80',
      lime: '[--checkbox-check:var(--color-lime-950)] [--checkbox-checked-bg:var(--color-lime-300)] [--checkbox-checked-border:var(--color-lime-400)]/80',
      green:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-green-600)] [--checkbox-checked-border:var(--color-green-700)]/90',
      emerald:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-emerald-600)] [--checkbox-checked-border:var(--color-emerald-700)]/90',
      teal: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-teal-600)] [--checkbox-checked-border:var(--color-teal-700)]/90',
      cyan: '[--checkbox-check:var(--color-cyan-950)] [--checkbox-checked-bg:var(--color-cyan-300)] [--checkbox-checked-border:var(--color-cyan-400)]/80',
      sky: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-sky-500)] [--checkbox-checked-border:var(--color-sky-600)]/80',
      blue: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-blue-600)] [--checkbox-checked-border:var(--color-blue-700)]/90',
      indigo:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-indigo-500)] [--checkbox-checked-border:var(--color-indigo-600)]/90',
      violet:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-violet-500)] [--checkbox-checked-border:var(--color-violet-600)]/90',
      purple:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-purple-500)] [--checkbox-checked-border:var(--color-purple-600)]/90',
      fuchsia:
        '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-fuchsia-500)] [--checkbox-checked-border:var(--color-fuchsia-600)]/90',
      pink: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-pink-500)] [--checkbox-checked-border:var(--color-pink-600)]/90',
      rose: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-rose-500)] [--checkbox-checked-border:var(--color-rose-600)]/90',
    },
  };

  createElement() {
    // Create the wrapper label element
    const label = document.createElement('label');
    label.className = 'group inline-flex focus:outline-hidden cursor-pointer';
    label.setAttribute('data-slot', 'control');

    if (this.options.className) {
      label.className += ' ' + this.options.className;
    }

    // Create the visual checkbox span
    const checkboxSpan = document.createElement('span');
    checkboxSpan.className = this.getClasses();

    // Create the actual checkbox input (hidden)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'sr-only';
    checkbox.checked = this.options.checked;
    checkbox.disabled = this.options.disabled;

    if (this.options.id) checkbox.id = this.options.id;
    if (this.options.name) checkbox.name = this.options.name;
    if (this.options.value) checkbox.value = this.options.value;

    // Create the SVG for checkmark and indeterminate states
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'class',
      'size-4 stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100 sm:h-3.5 sm:w-3.5'
    );
    svg.setAttribute('viewBox', '0 0 14 14');
    svg.setAttribute('fill', 'none');

    // Checkmark path
    const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkPath.setAttribute('class', 'opacity-100 group-data-indeterminate:opacity-0');
    checkPath.setAttribute('d', 'M3 8L6 11L11 3.5');
    checkPath.setAttribute('stroke-width', '2');
    checkPath.setAttribute('stroke-linecap', 'round');
    checkPath.setAttribute('stroke-linejoin', 'round');

    // Indeterminate path
    const indeterminatePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    indeterminatePath.setAttribute('class', 'opacity-0 group-data-indeterminate:opacity-100');
    indeterminatePath.setAttribute('d', 'M3 7H11');
    indeterminatePath.setAttribute('stroke-width', '2');
    indeterminatePath.setAttribute('stroke-linecap', 'round');
    indeterminatePath.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(checkPath);
    svg.appendChild(indeterminatePath);
    checkboxSpan.appendChild(svg);

    // Create text span
    const textSpan = document.createElement('span');
    textSpan.textContent = this.text;
    textSpan.className = 'ml-3 text-sm text-zinc-900 dark:text-white';

    // Assemble the structure
    label.appendChild(checkbox);
    label.appendChild(checkboxSpan);
    if (this.text) {
      label.appendChild(textSpan);
    }

    // Add event listeners
    checkbox.addEventListener('change', (e) => {
      this.options.checked = e.target.checked;
      this.options.indeterminate = false; // Clear indeterminate when user interacts
      this.updateDataAttributes();
      this.updateIndeterminate();
      if (this.options.onChange) {
        this.options.onChange(e.target.checked);
      }
    });

    // Add keyboard and mouse event handling for proper state management
    label.addEventListener('mouseenter', () => {
      if (!this.options.disabled) {
        label.setAttribute('data-hover', '');
      }
    });

    label.addEventListener('mouseleave', () => {
      label.removeAttribute('data-hover');
    });

    checkbox.addEventListener('focus', () => {
      label.setAttribute('data-focus', '');
    });

    checkbox.addEventListener('blur', () => {
      label.removeAttribute('data-focus');
    });

    // Set initial data attributes
    this.updateDataAttributes(label);

    return label;
  }

  getClasses() {
    const classes = [...HeadlessCheckbox.styles.base];
    const colorClasses = HeadlessCheckbox.styles.colors[this.options.color];

    if (Array.isArray(colorClasses)) {
      classes.push(...colorClasses);
    } else {
      classes.push(colorClasses);
    }

    return classes.join(' ');
  }

  updateDataAttributes(element = this.element) {
    if (this.options.checked) {
      element.setAttribute('data-checked', '');
    } else {
      element.removeAttribute('data-checked');
    }

    if (this.options.indeterminate) {
      element.setAttribute('data-indeterminate', '');
    } else {
      element.removeAttribute('data-indeterminate');
    }

    if (this.options.disabled) {
      element.setAttribute('data-disabled', '');
    } else {
      element.removeAttribute('data-disabled');
    }
  }

  updateIndeterminate() {
    if (this.checkbox) {
      this.checkbox.indeterminate = this.options.indeterminate;
    }
  }

  // Method to render the checkbox to a container
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

  // Method to update checkbox text
  setText(newText) {
    this.text = newText;
    const textSpan = this.element.querySelector('span:last-child');
    if (textSpan && newText) {
      textSpan.textContent = newText;
    } else if (newText && !textSpan) {
      const newTextSpan = document.createElement('span');
      newTextSpan.textContent = newText;
      newTextSpan.className = 'ml-3 text-sm text-zinc-900 dark:text-white';
      this.element.appendChild(newTextSpan);
    }
    return this;
  }

  // Method to update checked state
  setChecked(checked) {
    this.options.checked = checked;
    this.checkbox.checked = checked;
    this.updateDataAttributes();
    return this;
  }

  // Method to update indeterminate state
  setIndeterminate(indeterminate) {
    this.options.indeterminate = indeterminate;
    this.updateDataAttributes();
    this.updateIndeterminate();
    return this;
  }

  // Method to enable/disable checkbox
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.checkbox.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to update color
  setColor(color) {
    this.options.color = color;
    const checkboxSpan = this.element.querySelector('span:first-of-type');
    if (checkboxSpan) {
      checkboxSpan.className = this.getClasses();
    }
    return this;
  }

  // Method to get current checked state
  isChecked() {
    return this.checkbox.checked;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create multiple checkboxes easily
  static createGroup(container, checkboxes) {
    const group = document.createElement('div');
    group.className = 'space-y-3';
    group.setAttribute('data-slot', 'control');

    checkboxes.forEach((config) => {
      new HeadlessCheckbox(config.text, config.options).render(group);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    return group;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessCheckbox;
}
