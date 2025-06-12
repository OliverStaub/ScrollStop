/**
 * HeadlessRadio - A comprehensive radio button component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic radio button
 * new HeadlessRadio('Option 1', 'choice', {
 *   value: 'option1',
 *   onChange: (value) => console.log('Selected:', value)
 * }).render('#container');
 *
 * // Radio group example
 * HeadlessRadio.createGroup('#size-options', 'size', [
 *   { text: 'Small', value: 'sm', options: { color: 'blue' } },
 *   { text: 'Medium', value: 'md', options: { checked: true } },
 *   { text: 'Large', value: 'lg', options: { color: 'green' } }
 * ], {
 *   onChange: (value) => console.log('Size selected:', value)
 * });
 *
 * // Colored radio buttons
 * new HeadlessRadio('Blue Option', 'color', {
 *   value: 'blue',
 *   color: 'blue',
 *   onChange: (value) => console.log('Color:', value)
 * }).render('#colors');
 *
 * // Pre-selected radio button
 * new HeadlessRadio('Default choice', 'default', {
 *   value: 'default',
 *   checked: true,
 *   color: 'green'
 * }).render('#defaults');
 *
 * // Disabled radio button
 * new HeadlessRadio('Disabled option', 'disabled-group', {
 *   value: 'disabled',
 *   disabled: true,
 *   checked: true
 * }).render('#form');
 *
 * // Radio with custom CSS classes
 * new HeadlessRadio('Custom styled', 'custom', {
 *   value: 'custom',
 *   className: 'my-custom-class',
 *   color: 'purple'
 * }).render('#special-section');
 *
 * AVAILABLE COLORS:
 * 'dark/zinc', 'dark/white', 'white', 'dark', 'zinc', 'red', 'orange', 'amber',
 * 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
 * 'violet', 'purple', 'fuchsia', 'pink', 'rose'
 */
class HeadlessRadio {
  constructor(text, name, options = {}) {
    this.text = text;
    this.name = name;
    this.options = {
      color: options.color || 'dark/zinc',
      checked: options.checked || false,
      disabled: options.disabled || false,
      className: options.className || '',
      onChange: options.onChange || null,
      id: options.id || null,
      value: options.value || null,
      ...options,
    };

    this.element = this.createElement();
    this.radio = this.element.querySelector('input[type="radio"]');
  }

  // Style configurations (converted from the original React component)
  static styles = {
    base: [
      // Basic layout
      'relative isolate flex size-4.75 shrink-0 rounded-full sm:size-4.25',
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      'before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-white before:shadow-sm',
      // Background color when checked
      'group-data-checked:before:bg-(--radio-checked-bg)',
      // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
      'dark:before:hidden',
      // Background color applied to control in dark mode
      'dark:bg-white/5 dark:group-data-checked:bg-(--radio-checked-bg)',
      // Border
      'border border-zinc-950/15 group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-zinc-950/30 group-data-checked:bg-(--radio-checked-border)',
      'dark:border-white/15 dark:group-data-checked:border-white/5 dark:group-data-hover:group-data-checked:border-white/5 dark:group-data-hover:border-white/30',
      // Inner highlight shadow
      'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
      'dark:after:-inset-px dark:after:hidden dark:after:rounded-full dark:group-data-checked:after:block',
      // Indicator color (light mode)
      '[--radio-indicator:transparent] group-data-checked:[--radio-indicator:var(--radio-checked-indicator)] group-data-hover:group-data-checked:[--radio-indicator:var(--radio-checked-indicator)] group-data-hover:[--radio-indicator:var(--color-zinc-900)]/10',
      // Indicator color (dark mode)
      'dark:group-data-hover:group-data-checked:[--radio-indicator:var(--radio-checked-indicator)] dark:group-data-hover:[--radio-indicator:var(--color-zinc-700)]',
      // Focus ring
      'group-data-focus:outline group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
      // Disabled state
      'group-data-disabled:opacity-50',
      'group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5 group-data-disabled:[--radio-checked-indicator:var(--color-zinc-950)]/50 group-data-disabled:before:bg-transparent',
      'dark:group-data-disabled:border-white/20 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:[--radio-checked-indicator:var(--color-white)]/50 dark:group-data-checked:group-data-disabled:after:hidden',
    ],

    colors: {
      'dark/zinc': [
        '[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]',
        'dark:[--radio-checked-bg:var(--color-zinc-600)]',
      ],
      'dark/white': [
        '[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]',
        'dark:[--radio-checked-bg:var(--color-white)] dark:[--radio-checked-border:var(--color-zinc-950)]/15 dark:[--radio-checked-indicator:var(--color-zinc-900)]',
      ],
      white:
        '[--radio-checked-bg:var(--color-white)] [--radio-checked-border:var(--color-zinc-950)]/15 [--radio-checked-indicator:var(--color-zinc-900)]',
      dark: '[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]',
      zinc: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-zinc-600)] [--radio-checked-border:var(--color-zinc-700)]/90',
      red: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-red-600)] [--radio-checked-border:var(--color-red-700)]/90',
      orange:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-orange-500)] [--radio-checked-border:var(--color-orange-600)]/90',
      amber:
        '[--radio-checked-bg:var(--color-amber-400)] [--radio-checked-border:var(--color-amber-500)]/80 [--radio-checked-indicator:var(--color-amber-950)]',
      yellow:
        '[--radio-checked-bg:var(--color-yellow-300)] [--radio-checked-border:var(--color-yellow-400)]/80 [--radio-checked-indicator:var(--color-yellow-950)]',
      lime: '[--radio-checked-bg:var(--color-lime-300)] [--radio-checked-border:var(--color-lime-400)]/80 [--radio-checked-indicator:var(--color-lime-950)]',
      green:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-green-600)] [--radio-checked-border:var(--color-green-700)]/90',
      emerald:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-emerald-600)] [--radio-checked-border:var(--color-emerald-700)]/90',
      teal: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-teal-600)] [--radio-checked-border:var(--color-teal-700)]/90',
      cyan: '[--radio-checked-bg:var(--color-cyan-300)] [--radio-checked-border:var(--color-cyan-400)]/80 [--radio-checked-indicator:var(--color-cyan-950)]',
      sky: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-sky-500)] [--radio-checked-border:var(--color-sky-600)]/80',
      blue: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-blue-600)] [--radio-checked-border:var(--color-blue-700)]/90',
      indigo:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-indigo-500)] [--radio-checked-border:var(--color-indigo-600)]/90',
      violet:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-violet-500)] [--radio-checked-border:var(--color-violet-600)]/90',
      purple:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-purple-500)] [--radio-checked-border:var(--color-purple-600)]/90',
      fuchsia:
        '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-fuchsia-500)] [--radio-checked-border:var(--color-fuchsia-600)]/90',
      pink: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-pink-500)] [--radio-checked-border:var(--color-pink-600)]/90',
      rose: '[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-rose-500)] [--radio-checked-border:var(--color-rose-600)]/90',
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

    // Create the visual radio span
    const radioSpan = document.createElement('span');
    radioSpan.className = this.getClasses();

    // Create the indicator span (the dot inside the radio)
    const indicatorSpan = document.createElement('span');
    indicatorSpan.className = this.getIndicatorClasses();

    radioSpan.appendChild(indicatorSpan);

    // Create the actual radio input (hidden)
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'sr-only';
    radio.name = this.name;
    radio.checked = this.options.checked;
    radio.disabled = this.options.disabled;

    if (this.options.id) radio.id = this.options.id;
    if (this.options.value) radio.value = this.options.value;

    // Create text span
    const textSpan = document.createElement('span');
    textSpan.textContent = this.text;
    textSpan.className = 'ml-3 text-sm text-zinc-900 dark:text-white';

    // Assemble the structure
    label.appendChild(radio);
    label.appendChild(radioSpan);
    if (this.text) {
      label.appendChild(textSpan);
    }

    // Add event listeners
    radio.addEventListener('change', (e) => {
      this.options.checked = e.target.checked;
      this.updateDataAttributes();
      
      // Update other radios in the same group
      if (e.target.checked) {
        this.updateRadioGroup();
      }
      
      if (this.options.onChange) {
        this.options.onChange(e.target.value, e);
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

    radio.addEventListener('focus', () => {
      label.setAttribute('data-focus', '');
    });

    radio.addEventListener('blur', () => {
      label.removeAttribute('data-focus');
    });

    // Set initial data attributes
    this.updateDataAttributes(label);

    return label;
  }

  getClasses() {
    const classes = [...HeadlessRadio.styles.base];
    const colorClasses = HeadlessRadio.styles.colors[this.options.color];
    
    if (Array.isArray(colorClasses)) {
      classes.push(...colorClasses);
    } else {
      classes.push(colorClasses);
    }

    return classes.join(' ');
  }

  getIndicatorClasses() {
    return [
      'size-full rounded-full border-[4.5px] border-transparent bg-(--radio-indicator) bg-clip-padding',
      // Forced colors mode
      'forced-colors:border-[Canvas] forced-colors:group-data-checked:border-[Highlight]'
    ].join(' ');
  }

  updateDataAttributes(element = this.element) {
    if (this.options.checked) {
      element.setAttribute('data-checked', '');
    } else {
      element.removeAttribute('data-checked');
    }

    if (this.options.disabled) {
      element.setAttribute('data-disabled', '');
    } else {
      element.removeAttribute('data-disabled');
    }
  }

  updateRadioGroup() {
    // Find all radio buttons with the same name and update their state
    const radios = document.querySelectorAll(`input[type="radio"][name="${this.name}"]`);
    radios.forEach(radio => {
      const label = radio.closest('label');
      if (label) {
        if (radio.checked) {
          label.setAttribute('data-checked', '');
        } else {
          label.removeAttribute('data-checked');
        }
      }
    });
  }

  // Method to render the radio to a container
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

  // Method to update radio text
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
    this.radio.checked = checked;
    this.updateDataAttributes();
    if (checked) {
      this.updateRadioGroup();
    }
    return this;
  }

  // Method to enable/disable radio
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.radio.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to update color
  setColor(color) {
    this.options.color = color;
    const radioSpan = this.element.querySelector('span:first-of-type');
    if (radioSpan) {
      radioSpan.className = this.getClasses();
    }
    return this;
  }

  // Method to get current checked state
  isChecked() {
    return this.radio.checked;
  }

  // Method to get current value
  getValue() {
    return this.radio.value;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create a radio group
  static createGroup(container, name, radios, groupOptions = {}) {
    const group = document.createElement('div');
    group.className = 'space-y-3 **:data-[slot=label]:font-normal';
    group.setAttribute('data-slot', 'control');

    const radioInstances = [];

    radios.forEach((config, index) => {
      const radioOptions = {
        ...config.options,
        onChange: (value, event) => {
          // Call the individual radio's onChange if it exists
          if (config.options?.onChange) {
            config.options.onChange(value, event);
          }
          
          // Call the group's onChange if it exists
          if (groupOptions.onChange) {
            groupOptions.onChange(value, event);
          }
        }
      };

      const radioInstance = new HeadlessRadio(config.text, name, radioOptions);
      radioInstance.render(group);
      radioInstances.push(radioInstance);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    // Return an object with the group element and methods to interact with the group
    return {
      element: group,
      radios: radioInstances,
      getSelected: () => {
        const selectedRadio = radioInstances.find(radio => radio.isChecked());
        return selectedRadio ? selectedRadio.getValue() : null;
      },
      setSelected: (value) => {
        radioInstances.forEach(radio => {
          radio.setChecked(radio.getValue() === value);
        });
      },
      disable: () => {
        radioInstances.forEach(radio => radio.setDisabled(true));
      },
      enable: () => {
        radioInstances.forEach(radio => radio.setDisabled(false));
      }
    };
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessRadio;
}