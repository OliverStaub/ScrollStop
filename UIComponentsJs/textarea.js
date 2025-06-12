/**
 * HeadlessTextarea - A comprehensive textarea component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic textarea
 * new HeadlessTextarea({
 *   placeholder: 'Enter your message',
 *   onInput: (value) => console.log('Input:', value)
 * }).render('#container');
 *
 * // Textarea with initial content
 * new HeadlessTextarea({
 *   value: 'Initial content here',
 *   rows: 6,
 *   onInput: (value) => console.log('Content:', value)
 * }).render(document.body);
 *
 * // Non-resizable textarea
 * new HeadlessTextarea({
 *   placeholder: 'Fixed size textarea',
 *   resizable: false,
 *   rows: 4
 * }).render('#comments');
 *
 * // Textarea with character limit
 * new HeadlessTextarea({
 *   placeholder: 'Max 200 characters',
 *   maxLength: 200,
 *   onInput: (value) => console.log(`${value.length}/200 characters`)
 * }).render('#limited-input');
 *
 * // Required textarea for forms
 * new HeadlessTextarea({
 *   placeholder: 'Required field',
 *   required: true,
 *   minLength: 10
 * }).render('#form');
 *
 * // Disabled textarea
 * new HeadlessTextarea({
 *   value: 'Cannot edit this content',
 *   disabled: true
 * }).render('#read-only');
 *
 * // Textarea with custom CSS classes
 * new HeadlessTextarea({
 *   className: 'my-custom-class',
 *   placeholder: 'Custom styled textarea'
 * }).render('#special-section');
 *
 * // Auto-growing textarea (you can implement with additional JS)
 * new HeadlessTextarea({
 *   placeholder: 'This could auto-grow...',
 *   onInput: function(value) {
 *     // Custom auto-grow logic here
 *     this.autoGrow();
 *   }
 * }).render('#auto-grow');
 */
class HeadlessTextarea {
  constructor(options = {}) {
    this.options = {
      placeholder: options.placeholder || '',
      value: options.value || '',
      rows: options.rows || 4,
      disabled: options.disabled || false,
      required: options.required || false,
      invalid: options.invalid || false,
      resizable: options.resizable !== false, // Default to true
      className: options.className || '',
      onInput: options.onInput || null,
      onChange: options.onChange || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      id: options.id || null,
      name: options.name || null,
      minLength: options.minLength || null,
      maxLength: options.maxLength || null,
      cols: options.cols || null,
      ...options,
    };

    this.element = this.createElement();
    this.textarea = this.element.querySelector('textarea');
  }

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
    ],

    textarea: [
      // Basic layout
      'relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
      // Typography
      'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
      // Border
      'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
      // Background color
      'bg-transparent dark:bg-white/5',
      // Hide default focus styles
      'focus:outline-hidden',
      // Invalid state
      'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600',
      // Disabled state
      'disabled:border-zinc-950/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15',
    ],
  };

  createElement() {
    // Create wrapper span
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-slot', 'control');
    wrapper.className = this.getWrapperClasses();

    // Create the actual textarea element
    const textarea = document.createElement('textarea');
    textarea.className = this.getTextareaClasses();

    // Set basic properties
    if (this.options.placeholder) textarea.placeholder = this.options.placeholder;
    if (this.options.value) textarea.value = this.options.value;
    if (this.options.rows) textarea.rows = this.options.rows;
    if (this.options.disabled) textarea.disabled = true;
    if (this.options.required) textarea.required = true;
    if (this.options.id) textarea.id = this.options.id;
    if (this.options.name) textarea.name = this.options.name;
    if (this.options.minLength !== null) textarea.minLength = this.options.minLength;
    if (this.options.maxLength !== null) textarea.maxLength = this.options.maxLength;
    if (this.options.cols !== null) textarea.cols = this.options.cols;

    // Set initial data attributes
    this.updateDataAttributes(textarea);

    // Add event listeners
    textarea.addEventListener('input', (e) => {
      if (this.options.onInput) {
        this.options.onInput(e.target.value, e);
      }
    });

    textarea.addEventListener('change', (e) => {
      if (this.options.onChange) {
        this.options.onChange(e.target.value, e);
      }
    });

    textarea.addEventListener('focus', (e) => {
      textarea.setAttribute('data-focus', '');
      if (this.options.onFocus) {
        this.options.onFocus(e);
      }
    });

    textarea.addEventListener('blur', (e) => {
      textarea.removeAttribute('data-focus');
      if (this.options.onBlur) {
        this.options.onBlur(e);
      }
    });

    // Add hover effects
    textarea.addEventListener('mouseenter', () => {
      if (!this.options.disabled) {
        textarea.setAttribute('data-hover', '');
      }
    });

    textarea.addEventListener('mouseleave', () => {
      textarea.removeAttribute('data-hover');
    });

    wrapper.appendChild(textarea);
    return wrapper;
  }

  getWrapperClasses() {
    const classes = [...HeadlessTextarea.styles.wrapper];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  getTextareaClasses() {
    const classes = [...HeadlessTextarea.styles.textarea];

    // Add resize behavior
    if (this.options.resizable) {
      classes.push('resize-y');
    } else {
      classes.push('resize-none');
    }

    return classes.join(' ');
  }

  updateDataAttributes(element = this.textarea) {
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

  // Method to render the textarea to a container
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

  // Method to update textarea value
  setValue(newValue) {
    this.options.value = newValue;
    this.textarea.value = newValue;
    return this;
  }

  // Method to get current value
  getValue() {
    return this.textarea.value;
  }

  // Method to update placeholder
  setPlaceholder(placeholder) {
    this.options.placeholder = placeholder;
    this.textarea.placeholder = placeholder;
    return this;
  }

  // Method to enable/disable textarea
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.textarea.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to set invalid state
  setInvalid(invalid) {
    this.options.invalid = invalid;
    this.updateDataAttributes();
    return this;
  }

  // Method to set resizable state
  setResizable(resizable) {
    this.options.resizable = resizable;
    this.textarea.className = this.getTextareaClasses();
    return this;
  }

  // Method to focus the textarea
  focus() {
    this.textarea.focus();
    return this;
  }

  // Method to blur the textarea
  blur() {
    this.textarea.blur();
    return this;
  }

  // Method to select all text
  select() {
    this.textarea.select();
    return this;
  }

  // Method to clear the textarea
  clear() {
    this.textarea.value = '';
    this.options.value = '';
    return this;
  }

  // Method to get cursor position
  getCursorPosition() {
    return this.textarea.selectionStart;
  }

  // Method to set cursor position
  setCursorPosition(position) {
    this.textarea.setSelectionRange(position, position);
    return this;
  }

  // Method to insert text at cursor position
  insertText(text) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const value = this.textarea.value;

    this.textarea.value = value.substring(0, start) + text + value.substring(end);
    this.textarea.setSelectionRange(start + text.length, start + text.length);

    // Trigger input event
    this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return this;
  }

  // Method to auto-grow textarea based on content
  autoGrow() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = this.textarea.scrollHeight + 'px';
    return this;
  }

  // Method to validate the textarea
  isValid() {
    return this.textarea.validity.valid;
  }

  // Method to get validation message
  getValidationMessage() {
    return this.textarea.validationMessage;
  }

  // Method to get character count
  getCharacterCount() {
    return this.textarea.value.length;
  }

  // Method to get word count
  getWordCount() {
    return this.textarea.value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create textarea group
  static createGroup(container, textareas) {
    const group = document.createElement('div');
    group.className = 'space-y-4';

    textareas.forEach((config) => {
      const textareaWrapper = document.createElement('div');

      if (config.label) {
        const label = document.createElement('label');
        label.textContent = config.label;
        label.className = 'block text-sm font-medium text-zinc-900 dark:text-white mb-2';
        if (config.options?.id) {
          label.setAttribute('for', config.options.id);
        }
        textareaWrapper.appendChild(label);
      }

      new HeadlessTextarea(config.options).render(textareaWrapper);

      // Add character counter if maxLength is specified
      if (config.options?.maxLength) {
        const counter = document.createElement('div');
        counter.className = 'text-xs text-zinc-500 dark:text-zinc-400 mt-1';
        const textareaInstance = new HeadlessTextarea(config.options);

        const updateCounter = () => {
          const count = textareaInstance.getCharacterCount();
          counter.textContent = `${count}/${config.options.maxLength}`;
        };

        textareaInstance.options.onInput = (value) => {
          updateCounter();
          if (config.options?.onInput) {
            config.options.onInput(value);
          }
        };

        textareaWrapper.appendChild(counter);
        updateCounter();
      }

      group.appendChild(textareaWrapper);
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
  module.exports = HeadlessTextarea;
}
