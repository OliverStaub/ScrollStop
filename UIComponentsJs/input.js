/**
 * HeadlessInput - A comprehensive input component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic text input
 * new HeadlessInput('text', {
 *   placeholder: 'Enter your name',
 *   onInput: (value) => console.log('Input:', value)
 * }).render('#container');
 *
 * // Email input with validation
 * new HeadlessInput('email', {
 *   placeholder: 'your@email.com',
 *   required: true,
 *   onInput: (value) => console.log('Email:', value)
 * }).render(document.body);
 *
 * // Password input
 * new HeadlessInput('password', {
 *   placeholder: 'Enter password',
 *   minLength: 8
 * }).render('#login-form');
 *
 * // Number input with validation
 * new HeadlessInput('number', {
 *   placeholder: '0',
 *   min: 0,
 *   max: 100,
 *   onInput: (value) => console.log('Number:', value)
 * }).render('#settings');
 *
 * // Date input
 * new HeadlessInput('date', {
 *   value: '2024-01-01'
 * }).render('#date-picker');
 *
 * // Disabled input
 * new HeadlessInput('text', {
 *   value: 'Cannot edit',
 *   disabled: true
 * }).render('#form');
 *
 * // Input with custom CSS classes
 * new HeadlessInput('text', {
 *   className: 'my-custom-class',
 *   placeholder: 'Custom styled input'
 * }).render('#special-section');
 *
 * // Input group with icon (you would need to add icons separately)
 * new HeadlessInput('search', {
 *   placeholder: 'Search...',
 *   withIcon: true
 * }).render('#search-container');
 *
 * SUPPORTED INPUT TYPES:
 * 'text', 'email', 'password', 'number', 'search', 'tel', 'url',
 * 'date', 'datetime-local', 'month', 'time', 'week'
 */
class HeadlessInput {
  constructor(type = 'text', options = {}) {
    this.type = type;
    this.options = {
      placeholder: options.placeholder || '',
      value: options.value || '',
      disabled: options.disabled || false,
      required: options.required || false,
      invalid: options.invalid || false,
      className: options.className || '',
      onInput: options.onInput || null,
      onChange: options.onChange || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      id: options.id || null,
      name: options.name || null,
      min: options.min || null,
      max: options.max || null,
      minLength: options.minLength || null,
      maxLength: options.maxLength || null,
      pattern: options.pattern || null,
      withIcon: options.withIcon || false,
      ...options,
    };

    this.element = this.createElement();
    this.input = this.element.querySelector('input');
  }

  // Date input types that need special styling
  static dateTypes = ['date', 'datetime-local', 'month', 'time', 'week'];

  // Style configurations (converted from the original React component)
  static styles = {
    wrapper: [
      // Basic layout
      'relative block w-full',
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
      // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
      'dark:before:hidden',
      // Focus ring
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
      // Disabled state
      'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
      // Invalid state
      'has-data-invalid:before:shadow-red-500/10',
    ],

    input: [
      // Basic layout
      'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
      // Typography
      'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
      // Border
      'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
      // Background color
      'bg-transparent dark:bg-white/5',
      // Hide default focus styles
      'focus:outline-hidden',
      // Invalid state
      'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-500 dark:data-invalid:data-hover:border-red-500',
      // Disabled state
      'data-disabled:border-zinc-950/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15',
      // System icons
      'dark:scheme-dark',
    ],

    dateInput: [
      // Date input specific styles
      '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
      '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
      '[&::-webkit-datetime-edit]:inline-flex',
      '[&::-webkit-datetime-edit]:p-0',
      '[&::-webkit-datetime-edit-year-field]:p-0',
      '[&::-webkit-datetime-edit-month-field]:p-0',
      '[&::-webkit-datetime-edit-day-field]:p-0',
      '[&::-webkit-datetime-edit-hour-field]:p-0',
      '[&::-webkit-datetime-edit-minute-field]:p-0',
      '[&::-webkit-datetime-edit-second-field]:p-0',
      '[&::-webkit-datetime-edit-millisecond-field]:p-0',
      '[&::-webkit-datetime-edit-meridiem-field]:p-0',
    ],

    iconGroup: [
      'relative isolate block',
      'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10 sm:has-[[data-slot=icon]:first-child]:[&_input]:pl-8 sm:has-[[data-slot=icon]:last-child]:[&_input]:pr-8',
      '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-3 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:top-2.5 sm:*:data-[slot=icon]:size-4',
      '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
      '*:data-[slot=icon]:text-zinc-500 dark:*:data-[slot=icon]:text-zinc-400'
    ]
  };

  createElement() {
    // Create wrapper span
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-slot', 'control');
    wrapper.className = this.getWrapperClasses();

    // Create the actual input element
    const input = document.createElement('input');
    input.type = this.type;
    input.className = this.getInputClasses();
    
    // Set basic properties
    if (this.options.placeholder) input.placeholder = this.options.placeholder;
    if (this.options.value) input.value = this.options.value;
    if (this.options.disabled) input.disabled = true;
    if (this.options.required) input.required = true;
    if (this.options.id) input.id = this.options.id;
    if (this.options.name) input.name = this.options.name;
    if (this.options.min !== null) input.min = this.options.min;
    if (this.options.max !== null) input.max = this.options.max;
    if (this.options.minLength !== null) input.minLength = this.options.minLength;
    if (this.options.maxLength !== null) input.maxLength = this.options.maxLength;
    if (this.options.pattern) input.pattern = this.options.pattern;

    // Set initial data attributes
    this.updateDataAttributes(input);

    // Add event listeners
    input.addEventListener('input', (e) => {
      if (this.options.onInput) {
        this.options.onInput(e.target.value, e);
      }
    });

    input.addEventListener('change', (e) => {
      if (this.options.onChange) {
        this.options.onChange(e.target.value, e);
      }
    });

    input.addEventListener('focus', (e) => {
      input.setAttribute('data-focus', '');
      if (this.options.onFocus) {
        this.options.onFocus(e);
      }
    });

    input.addEventListener('blur', (e) => {
      input.removeAttribute('data-focus');
      if (this.options.onBlur) {
        this.options.onBlur(e);
      }
    });

    // Add hover effects
    input.addEventListener('mouseenter', () => {
      if (!this.options.disabled) {
        input.setAttribute('data-hover', '');
      }
    });

    input.addEventListener('mouseleave', () => {
      input.removeAttribute('data-hover');
    });

    wrapper.appendChild(input);
    return wrapper;
  }

  getWrapperClasses() {
    const classes = [...HeadlessInput.styles.wrapper];

    if (this.options.withIcon) {
      classes.push(...HeadlessInput.styles.iconGroup);
    }

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getInputClasses() {
    const classes = [...HeadlessInput.styles.input];

    // Add date-specific styles if needed
    if (HeadlessInput.dateTypes.includes(this.type)) {
      classes.push(...HeadlessInput.styles.dateInput);
    }

    return classes.join(' ');
  }

  updateDataAttributes(element = this.input) {
    if (this.options.disabled) {
      element.setAttribute('data-disabled', '');
    } else {
      element.removeAttribute('data-disabled');
    }

    if (this.options.invalid) {
      element.setAttribute('data-invalid', '');
    } else {
      element.removeAttribute('data-invalid');
    }
  }

  // Method to render the input to a container
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

  // Method to update input value
  setValue(newValue) {
    this.options.value = newValue;
    this.input.value = newValue;
    return this;
  }

  // Method to get current value
  getValue() {
    return this.input.value;
  }

  // Method to update placeholder
  setPlaceholder(placeholder) {
    this.options.placeholder = placeholder;
    this.input.placeholder = placeholder;
    return this;
  }

  // Method to enable/disable input
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.input.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to set invalid state
  setInvalid(invalid) {
    this.options.invalid = invalid;
    this.updateDataAttributes();
    return this;
  }

  // Method to focus the input
  focus() {
    this.input.focus();
    return this;
  }

  // Method to blur the input
  blur() {
    this.input.blur();
    return this;
  }

  // Method to select all text
  select() {
    this.input.select();
    return this;
  }

  // Method to clear the input
  clear() {
    this.input.value = '';
    this.options.value = '';
    return this;
  }

  // Method to validate the input
  isValid() {
    return this.input.validity.valid;
  }

  // Method to get validation message
  getValidationMessage() {
    return this.input.validationMessage;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create input group
  static createGroup(container, inputs) {
    const group = document.createElement('div');
    group.className = 'space-y-4';

    inputs.forEach((config) => {
      const inputWrapper = document.createElement('div');
      
      if (config.label) {
        const label = document.createElement('label');
        label.textContent = config.label;
        label.className = 'block text-sm font-medium text-zinc-900 dark:text-white mb-2';
        if (config.options?.id) {
          label.setAttribute('for', config.options.id);
        }
        inputWrapper.appendChild(label);
      }

      new HeadlessInput(config.type, config.options).render(inputWrapper);
      group.appendChild(inputWrapper);
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
  module.exports = HeadlessInput;
}