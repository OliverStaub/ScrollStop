/**
 * HeadlessSelect - A comprehensive select component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic select
 * new HeadlessSelect([
 *   { value: 'option1', text: 'Option 1' },
 *   { value: 'option2', text: 'Option 2' },
 *   { value: 'option3', text: 'Option 3' }
 * ], {
 *   onChange: (value) => console.log('Selected:', value)
 * }).render('#container');
 *
 * // Select with initial value
 * new HeadlessSelect([
 *   { value: 'small', text: 'Small' },
 *   { value: 'medium', text: 'Medium' },
 *   { value: 'large', text: 'Large' }
 * ], {
 *   value: 'medium',
 *   onChange: (value) => console.log('Size:', value)
 * }).render(document.body);
 *
 * // Multi-select
 * new HeadlessSelect([
 *   { value: 'red', text: 'Red' },
 *   { value: 'green', text: 'Green' },
 *   { value: 'blue', text: 'Blue' }
 * ], {
 *   multiple: true,
 *   size: 4,
 *   onChange: (values) => console.log('Selected colors:', values)
 * }).render('#colors');
 *
 * // Select with option groups
 * new HeadlessSelect([
 *   {
 *     label: 'Fruits',
 *     options: [
 *       { value: 'apple', text: 'Apple' },
 *       { value: 'banana', text: 'Banana' }
 *     ]
 *   },
 *   {
 *     label: 'Vegetables',
 *     options: [
 *       { value: 'carrot', text: 'Carrot' },
 *       { value: 'lettuce', text: 'Lettuce' }
 *     ]
 *   }
 * ], {
 *   onChange: (value) => console.log('Food:', value)
 * }).render('#food-select');
 *
 * // Disabled select
 * new HeadlessSelect([
 *   { value: 'locked', text: 'Locked Option' }
 * ], {
 *   disabled: true,
 *   value: 'locked'
 * }).render('#locked');
 *
 * // Select with custom CSS classes
 * new HeadlessSelect([
 *   { value: 'custom1', text: 'Custom 1' },
 *   { value: 'custom2', text: 'Custom 2' }
 * ], {
 *   className: 'my-custom-class'
 * }).render('#special-section');
 */
class HeadlessSelect {
  constructor(options = [], config = {}) {
    this.options = options;
    this.config = {
      value: config.value || (config.multiple ? [] : ''),
      multiple: config.multiple || false,
      disabled: config.disabled || false,
      invalid: config.invalid || false,
      size: config.size || null,
      className: config.className || '',
      onChange: config.onChange || null,
      onFocus: config.onFocus || null,
      onBlur: config.onBlur || null,
      id: config.id || null,
      name: config.name || null,
      required: config.required || false,
      ...config,
    };

    this.element = this.createElement();
    this.select = this.element.querySelector('select');
  }

  // Style configurations (converted from the original React component)
  static styles = {
    wrapper: [
      // Basic layout
      'group relative block w-full',
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
      // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
      'dark:before:hidden',
      // Focus ring
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-focus:after:ring-2 has-data-focus:after:ring-blue-500',
      // Disabled state
      'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
    ],

    select: [
      // Basic layout
      'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
      // Options (multi-select)
      '[&_optgroup]:font-semibold',
      // Typography
      'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white',
      // Border
      'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
      // Background color
      'bg-transparent dark:bg-white/5 dark:*:bg-zinc-800',
      // Hide default focus styles
      'focus:outline-hidden',
      // Invalid state
      'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600',
      // Disabled state
      'data-disabled:border-zinc-950/20 data-disabled:opacity-100 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15',
    ],

    singleSelect: [
      // Single select specific padding (room for arrow)
      'pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
    ],

    multiSelect: [
      // Multi select specific padding
      'px-[calc(--spacing(3.5)-1px)] sm:px-[calc(--spacing(3)-1px)]',
    ],

    chevronIcon: ['pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'],
  };

  createElement() {
    // Create wrapper span
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-slot', 'control');
    wrapper.className = this.getWrapperClasses();

    // Create the actual select element
    const select = document.createElement('select');
    select.className = this.getSelectClasses();
    select.multiple = this.config.multiple;

    // Set basic properties
    if (this.config.disabled) select.disabled = true;
    if (this.config.required) select.required = true;
    if (this.config.id) select.id = this.config.id;
    if (this.config.name) select.name = this.config.name;
    if (this.config.size) select.size = this.config.size;

    // Build options
    this.buildOptions(select);

    // Set initial value(s)
    if (this.config.multiple && Array.isArray(this.config.value)) {
      this.config.value.forEach((val) => {
        const option = select.querySelector(`option[value="${val}"]`);
        if (option) option.selected = true;
      });
    } else if (!this.config.multiple && this.config.value) {
      select.value = this.config.value;
    }

    // Set initial data attributes
    this.updateDataAttributes(select);

    // Add event listeners
    select.addEventListener('change', (e) => {
      if (this.config.multiple) {
        const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
        this.config.value = selectedValues;
        if (this.config.onChange) {
          this.config.onChange(selectedValues, e);
        }
      } else {
        this.config.value = e.target.value;
        if (this.config.onChange) {
          this.config.onChange(e.target.value, e);
        }
      }
    });

    select.addEventListener('focus', (e) => {
      select.setAttribute('data-focus', '');
      if (this.config.onFocus) {
        this.config.onFocus(e);
      }
    });

    select.addEventListener('blur', (e) => {
      select.removeAttribute('data-focus');
      if (this.config.onBlur) {
        this.config.onBlur(e);
      }
    });

    // Add hover effects
    select.addEventListener('mouseenter', () => {
      if (!this.config.disabled) {
        select.setAttribute('data-hover', '');
      }
    });

    select.addEventListener('mouseleave', () => {
      select.removeAttribute('data-hover');
    });

    wrapper.appendChild(select);

    // Add chevron icon for single select
    if (!this.config.multiple) {
      const chevronWrapper = document.createElement('span');
      chevronWrapper.className = HeadlessSelect.styles.chevronIcon.join(' ');

      const chevronSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevronSvg.setAttribute(
        'class',
        'size-5 stroke-zinc-500 group-has-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]'
      );
      chevronSvg.setAttribute('viewBox', '0 0 16 16');
      chevronSvg.setAttribute('aria-hidden', 'true');
      chevronSvg.setAttribute('fill', 'none');

      // Down arrow path
      const downPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      downPath.setAttribute('d', 'M5.75 10.75L8 13L10.25 10.75');
      downPath.setAttribute('stroke-width', '1.5');
      downPath.setAttribute('stroke-linecap', 'round');
      downPath.setAttribute('stroke-linejoin', 'round');

      // Up arrow path
      const upPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      upPath.setAttribute('d', 'M10.25 5.25L8 3L5.75 5.25');
      upPath.setAttribute('stroke-width', '1.5');
      upPath.setAttribute('stroke-linecap', 'round');
      upPath.setAttribute('stroke-linejoin', 'round');

      chevronSvg.appendChild(downPath);
      chevronSvg.appendChild(upPath);
      chevronWrapper.appendChild(chevronSvg);
      wrapper.appendChild(chevronWrapper);
    }

    return wrapper;
  }

  buildOptions(select) {
    this.options.forEach((option) => {
      if (option.label && option.options) {
        // This is an optgroup
        const optgroup = document.createElement('optgroup');
        optgroup.label = option.label;

        option.options.forEach((subOption) => {
          const opt = document.createElement('option');
          opt.value = subOption.value;
          opt.textContent = subOption.text;
          if (subOption.disabled) opt.disabled = true;
          optgroup.appendChild(opt);
        });

        select.appendChild(optgroup);
      } else {
        // This is a regular option
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        if (option.disabled) opt.disabled = true;
        select.appendChild(opt);
      }
    });
  }

  getWrapperClasses() {
    const classes = [...HeadlessSelect.styles.wrapper];

    if (this.config.className) {
      classes.push(this.config.className);
    }

    return classes.join(' ');
  }

  getSelectClasses() {
    const classes = [...HeadlessSelect.styles.select];

    if (this.config.multiple) {
      classes.push(...HeadlessSelect.styles.multiSelect);
    } else {
      classes.push(...HeadlessSelect.styles.singleSelect);
    }

    return classes.join(' ');
  }

  updateDataAttributes(element = this.select) {
    if (this.config.disabled) {
      element.setAttribute('data-disabled', '');
    } else {
      element.removeAttribute('data-disabled');
    }

    if (this.config.invalid) {
      element.setAttribute('data-invalid', '');
    } else {
      element.removeAttribute('data-invalid');
    }
  }

  // Method to render the select to a container
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

  // Method to update selected value(s)
  setValue(newValue) {
    this.config.value = newValue;

    if (this.config.multiple && Array.isArray(newValue)) {
      // Clear all selections first
      Array.from(this.select.options).forEach((option) => {
        option.selected = false;
      });

      // Set new selections
      newValue.forEach((val) => {
        const option = this.select.querySelector(`option[value="${val}"]`);
        if (option) option.selected = true;
      });
    } else if (!this.config.multiple) {
      this.select.value = newValue;
    }

    return this;
  }

  // Method to get current value(s)
  getValue() {
    if (this.config.multiple) {
      return Array.from(this.select.selectedOptions).map((option) => option.value);
    } else {
      return this.select.value;
    }
  }

  // Method to add a new option
  addOption(option, groupLabel = null) {
    if (groupLabel) {
      let optgroup = this.select.querySelector(`optgroup[label="${groupLabel}"]`);
      if (!optgroup) {
        optgroup = document.createElement('optgroup');
        optgroup.label = groupLabel;
        this.select.appendChild(optgroup);
      }

      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.text;
      if (option.disabled) opt.disabled = true;
      optgroup.appendChild(opt);
    } else {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.text;
      if (option.disabled) opt.disabled = true;
      this.select.appendChild(opt);
    }

    return this;
  }

  // Method to remove an option
  removeOption(value) {
    const option = this.select.querySelector(`option[value="${value}"]`);
    if (option) {
      option.remove();
    }
    return this;
  }

  // Method to enable/disable select
  setDisabled(disabled) {
    this.config.disabled = disabled;
    this.select.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to set invalid state
  setInvalid(invalid) {
    this.config.invalid = invalid;
    this.updateDataAttributes();
    return this;
  }

  // Method to focus the select
  focus() {
    this.select.focus();
    return this;
  }

  // Method to blur the select
  blur() {
    this.select.blur();
    return this;
  }

  // Method to clear selection
  clear() {
    if (this.config.multiple) {
      Array.from(this.select.options).forEach((option) => {
        option.selected = false;
      });
      this.config.value = [];
    } else {
      this.select.selectedIndex = -1;
      this.config.value = '';
    }
    return this;
  }

  // Method to validate the select
  isValid() {
    return this.select.validity.valid;
  }

  // Method to get validation message
  getValidationMessage() {
    return this.select.validationMessage;
  }

  // Method to get selected option text(s)
  getSelectedText() {
    if (this.config.multiple) {
      return Array.from(this.select.selectedOptions).map((option) => option.textContent);
    } else {
      return this.select.selectedOptions[0]?.textContent || '';
    }
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create select group
  static createGroup(container, selects) {
    const group = document.createElement('div');
    group.className = 'space-y-4';

    selects.forEach((config) => {
      const selectWrapper = document.createElement('div');

      if (config.label) {
        const label = document.createElement('label');
        label.textContent = config.label;
        label.className = 'block text-sm font-medium text-zinc-900 dark:text-white mb-2';
        if (config.config?.id) {
          label.setAttribute('for', config.config.id);
        }
        selectWrapper.appendChild(label);
      }

      new HeadlessSelect(config.options, config.config).render(selectWrapper);
      group.appendChild(selectWrapper);
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
  module.exports = HeadlessSelect;
}
