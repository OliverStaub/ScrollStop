/**
 * HeadlessSwitch - A comprehensive toggle switch component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic switch
 * new HeadlessSwitch({
 *   onChange: (checked) => console.log('Switch:', checked)
 * }).render('#container');
 *
 * // Switch with initial checked state
 * new HeadlessSwitch({
 *   checked: true,
 *   onChange: (checked) => console.log('Enabled:', checked)
 * }).render(document.body);
 *
 * // Colored switch
 * new HeadlessSwitch({
 *   color: 'blue',
 *   onChange: (checked) => console.log('Blue switch:', checked)
 * }).render('#settings');
 *
 * // Switch with label
 * new HeadlessSwitch({
 *   label: 'Enable notifications',
 *   color: 'green',
 *   onChange: (checked) => console.log('Notifications:', checked)
 * }).render('#notifications');
 *
 * // Disabled switch
 * new HeadlessSwitch({
 *   label: 'Disabled feature',
 *   disabled: true,
 *   checked: true
 * }).render('#form');
 *
 * // Switch with custom CSS classes
 * new HeadlessSwitch({
 *   className: 'my-custom-class',
 *   color: 'purple'
 * }).render('#special-section');
 *
 * // Switch group example
 * HeadlessSwitch.createGroup('#switch-group', [
 *   { label: 'Feature A', options: { color: 'blue', checked: true } },
 *   { label: 'Feature B', options: { color: 'green' } },
 *   { label: 'Feature C', options: { color: 'red', disabled: true } }
 * ]);
 *
 * AVAILABLE COLORS:
 * 'dark/zinc', 'dark/white', 'dark', 'zinc', 'white', 'red', 'orange', 'amber',
 * 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
 * 'violet', 'purple', 'fuchsia', 'pink', 'rose'
 */
class HeadlessSwitch {
  constructor(options = {}) {
    this.options = {
      color: options.color || 'dark/zinc',
      checked: options.checked || false,
      disabled: options.disabled || false,
      label: options.label || null,
      className: options.className || '',
      onChange: options.onChange || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      id: options.id || null,
      name: options.name || null,
      value: options.value || null,
      ...options,
    };

    this.element = this.createElement();
    this.switch = this.element.querySelector('button, input');
  }

  // Style configurations (converted from the original React component)
  static styles = {
    switch: [
      // Base styles
      'group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8',
      // Transitions
      'transition duration-0 ease-in-out data-changing:duration-200',
      // Outline and background color in forced-colors mode so switch is still visible
      'forced-colors:outline forced-colors:[--switch-bg:Highlight] dark:forced-colors:[--switch-bg:Highlight]',
      // Unchecked
      'bg-zinc-200 ring-1 ring-black/5 ring-inset dark:bg-white/5 dark:ring-white/15',
      // Checked
      'data-checked:bg-(--switch-bg) data-checked:ring-(--switch-bg-ring) dark:data-checked:bg-(--switch-bg) dark:data-checked:ring-(--switch-bg-ring)',
      // Focus
      'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
      // Hover
      'data-hover:ring-black/15 data-hover:data-checked:ring-(--switch-bg-ring)',
      'dark:data-hover:ring-white/25 dark:data-hover:data-checked:ring-(--switch-bg-ring)',
      // Disabled
      'data-disabled:bg-zinc-200 data-disabled:opacity-50 data-disabled:data-checked:bg-zinc-200 data-disabled:data-checked:ring-black/5',
      'dark:data-disabled:bg-white/15 dark:data-disabled:data-checked:bg-white/15 dark:data-disabled:data-checked:ring-white/15',
    ],

    thumb: [
      // Basic layout
      'pointer-events-none relative inline-block size-4.5 rounded-full sm:size-3.5',
      // Transition
      'translate-x-0 transition duration-200 ease-in-out',
      // Invisible border so the switch is still visible in forced-colors mode
      'border border-transparent',
      // Unchecked
      'bg-white shadow-sm ring-1 ring-black/5',
      // Checked
      'group-data-checked:bg-(--switch) group-data-checked:shadow-(--switch-shadow) group-data-checked:ring-(--switch-ring)',
      'group-data-checked:translate-x-4 sm:group-data-checked:translate-x-3',
      // Disabled
      'group-data-checked:group-data-disabled:bg-white group-data-checked:group-data-disabled:shadow-sm group-data-checked:group-data-disabled:ring-black/5'
    ],

    colors: {
      'dark/zinc': [
        '[--switch-bg-ring:var(--color-zinc-950)]/90 [--switch-bg:var(--color-zinc-900)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-white)]/25',
        '[--switch-ring:var(--color-zinc-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white] dark:[--switch-ring:var(--color-zinc-700)]/90',
      ],
      'dark/white': [
        '[--switch-bg-ring:var(--color-zinc-950)]/90 [--switch-bg:var(--color-zinc-900)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-white)]',
        '[--switch-ring:var(--color-zinc-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white] dark:[--switch-ring:transparent] dark:[--switch:var(--color-zinc-900)]',
      ],
      dark: [
        '[--switch-bg-ring:var(--color-zinc-950)]/90 [--switch-bg:var(--color-zinc-900)] dark:[--switch-bg-ring:var(--color-white)]/15',
        '[--switch-ring:var(--color-zinc-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white]',
      ],
      zinc: [
        '[--switch-bg-ring:var(--color-zinc-700)]/90 [--switch-bg:var(--color-zinc-600)] dark:[--switch-bg-ring:transparent]',
        '[--switch-shadow:var(--color-black)]/10 [--switch:white] [--switch-ring:var(--color-zinc-700)]/90',
      ],
      white: [
        '[--switch-bg-ring:var(--color-black)]/15 [--switch-bg:white] dark:[--switch-bg-ring:transparent]',
        '[--switch-shadow:var(--color-black)]/10 [--switch-ring:transparent] [--switch:var(--color-zinc-950)]',
      ],
      red: [
        '[--switch-bg-ring:var(--color-red-700)]/90 [--switch-bg:var(--color-red-600)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-red-700)]/90 [--switch-shadow:var(--color-red-900)]/20',
      ],
      orange: [
        '[--switch-bg-ring:var(--color-orange-600)]/90 [--switch-bg:var(--color-orange-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-orange-600)]/90 [--switch-shadow:var(--color-orange-900)]/20',
      ],
      amber: [
        '[--switch-bg-ring:var(--color-amber-500)]/80 [--switch-bg:var(--color-amber-400)] dark:[--switch-bg-ring:transparent]',
        '[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-amber-950)]',
      ],
      yellow: [
        '[--switch-bg-ring:var(--color-yellow-400)]/80 [--switch-bg:var(--color-yellow-300)] dark:[--switch-bg-ring:transparent]',
        '[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-yellow-950)]',
      ],
      lime: [
        '[--switch-bg-ring:var(--color-lime-400)]/80 [--switch-bg:var(--color-lime-300)] dark:[--switch-bg-ring:transparent]',
        '[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-lime-950)]',
      ],
      green: [
        '[--switch-bg-ring:var(--color-green-700)]/90 [--switch-bg:var(--color-green-600)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-green-700)]/90 [--switch-shadow:var(--color-green-900)]/20',
      ],
      emerald: [
        '[--switch-bg-ring:var(--color-emerald-600)]/90 [--switch-bg:var(--color-emerald-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-emerald-600)]/90 [--switch-shadow:var(--color-emerald-900)]/20',
      ],
      teal: [
        '[--switch-bg-ring:var(--color-teal-700)]/90 [--switch-bg:var(--color-teal-600)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-teal-700)]/90 [--switch-shadow:var(--color-teal-900)]/20',
      ],
      cyan: [
        '[--switch-bg-ring:var(--color-cyan-400)]/80 [--switch-bg:var(--color-cyan-300)] dark:[--switch-bg-ring:transparent]',
        '[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-cyan-950)]',
      ],
      sky: [
        '[--switch-bg-ring:var(--color-sky-600)]/80 [--switch-bg:var(--color-sky-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-sky-600)]/80 [--switch-shadow:var(--color-sky-900)]/20',
      ],
      blue: [
        '[--switch-bg-ring:var(--color-blue-700)]/90 [--switch-bg:var(--color-blue-600)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-blue-700)]/90 [--switch-shadow:var(--color-blue-900)]/20',
      ],
      indigo: [
        '[--switch-bg-ring:var(--color-indigo-600)]/90 [--switch-bg:var(--color-indigo-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-indigo-600)]/90 [--switch-shadow:var(--color-indigo-900)]/20',
      ],
      violet: [
        '[--switch-bg-ring:var(--color-violet-600)]/90 [--switch-bg:var(--color-violet-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-violet-600)]/90 [--switch-shadow:var(--color-violet-900)]/20',
      ],
      purple: [
        '[--switch-bg-ring:var(--color-purple-600)]/90 [--switch-bg:var(--color-purple-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-purple-600)]/90 [--switch-shadow:var(--color-purple-900)]/20',
      ],
      fuchsia: [
        '[--switch-bg-ring:var(--color-fuchsia-600)]/90 [--switch-bg:var(--color-fuchsia-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-fuchsia-600)]/90 [--switch-shadow:var(--color-fuchsia-900)]/20',
      ],
      pink: [
        '[--switch-bg-ring:var(--color-pink-600)]/90 [--switch-bg:var(--color-pink-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-pink-600)]/90 [--switch-shadow:var(--color-pink-900)]/20',
      ],
      rose: [
        '[--switch-bg-ring:var(--color-rose-600)]/90 [--switch-bg:var(--color-rose-500)] dark:[--switch-bg-ring:transparent]',
        '[--switch:white] [--switch-ring:var(--color-rose-600)]/90 [--switch-shadow:var(--color-rose-900)]/20',
      ],
    },
  };

  createElement() {
    // Create wrapper (label if there's a label, div otherwise)
    const wrapper = this.options.label ? document.createElement('label') : document.createElement('div');
    wrapper.className = this.options.label ? 'flex items-center cursor-pointer' : '';
    wrapper.setAttribute('data-slot', 'control');

    if (this.options.className) {
      wrapper.className += ' ' + this.options.className;
    }

    // Create the switch button
    const switchButton = document.createElement('button');
    switchButton.type = 'button';
    switchButton.className = this.getSwitchClasses();
    switchButton.setAttribute('data-slot', 'control');
    switchButton.setAttribute('role', 'switch');
    switchButton.setAttribute('aria-checked', this.options.checked.toString());

    if (this.options.disabled) {
      switchButton.disabled = true;
    }

    if (this.options.id) switchButton.id = this.options.id;

    // Create the thumb element
    const thumb = document.createElement('span');
    thumb.setAttribute('aria-hidden', 'true');
    thumb.className = HeadlessSwitch.styles.thumb.join(' ');

    switchButton.appendChild(thumb);

    // Set initial data attributes
    this.updateDataAttributes(switchButton);

    // Add event listeners
    switchButton.addEventListener('click', (e) => {
      if (!this.options.disabled) {
        this.options.checked = !this.options.checked;
        switchButton.setAttribute('aria-checked', this.options.checked.toString());
        this.updateDataAttributes();
        
        if (this.options.onChange) {
          this.options.onChange(this.options.checked, e);
        }
      }
    });

    switchButton.addEventListener('focus', (e) => {
      switchButton.setAttribute('data-focus', '');
      if (this.options.onFocus) {
        this.options.onFocus(e);
      }
    });

    switchButton.addEventListener('blur', (e) => {
      switchButton.removeAttribute('data-focus');
      if (this.options.onBlur) {
        this.options.onBlur(e);
      }
    });

    // Add hover effects
    switchButton.addEventListener('mouseenter', () => {
      if (!this.options.disabled) {
        switchButton.setAttribute('data-hover', '');
      }
    });

    switchButton.addEventListener('mouseleave', () => {
      switchButton.removeAttribute('data-hover');
    });

    // Handle keyboard events
    switchButton.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        switchButton.click();
      }
    });

    // Add label if provided
    if (this.options.label) {
      const labelText = document.createElement('span');
      labelText.textContent = this.options.label;
      labelText.className = 'ml-3 text-sm text-zinc-900 dark:text-white';
      
      wrapper.appendChild(switchButton);
      wrapper.appendChild(labelText);
    } else {
      wrapper.appendChild(switchButton);
    }

    return wrapper;
  }

  getSwitchClasses() {
    const classes = [...HeadlessSwitch.styles.switch];
    const colorClasses = HeadlessSwitch.styles.colors[this.options.color];
    
    if (Array.isArray(colorClasses)) {
      classes.push(...colorClasses);
    } else {
      classes.push(colorClasses);
    }

    return classes.join(' ');
  }

  updateDataAttributes(element = this.switch) {
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

  // Method to render the switch to a container
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

  // Method to update checked state
  setChecked(checked) {
    this.options.checked = checked;
    this.switch.setAttribute('aria-checked', checked.toString());
    this.updateDataAttributes();
    return this;
  }

  // Method to toggle the switch
  toggle() {
    return this.setChecked(!this.options.checked);
  }

  // Method to enable/disable switch
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.switch.disabled = disabled;
    this.updateDataAttributes();
    return this;
  }

  // Method to update color
  setColor(color) {
    this.options.color = color;
    this.switch.className = this.getSwitchClasses();
    return this;
  }

  // Method to update label
  setLabel(label) {
    this.options.label = label;
    const labelSpan = this.element.querySelector('span:last-child');
    if (labelSpan && labelSpan.textContent !== label) {
      labelSpan.textContent = label;
    }
    return this;
  }

  // Method to get current checked state
  isChecked() {
    return this.options.checked;
  }

  // Method to focus the switch
  focus() {
    this.switch.focus();
    return this;
  }

  // Method to blur the switch
  blur() {
    this.switch.blur();
    return this;
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create switch group
  static createGroup(container, switches, groupOptions = {}) {
    const group = document.createElement('div');
    group.className = 'space-y-3 **:data-[slot=label]:font-normal';
    group.setAttribute('data-slot', 'control');

    const switchInstances = [];

    switches.forEach((config) => {
      const switchOptions = {
        ...config.options,
        onChange: (checked, event) => {
          // Call the individual switch's onChange if it exists
          if (config.options?.onChange) {
            config.options.onChange(checked, event);
          }
          
          // Call the group's onChange if it exists
          if (groupOptions.onChange) {
            groupOptions.onChange(config.label || `switch-${switchInstances.length}`, checked, event);
          }
        }
      };

      const switchInstance = new HeadlessSwitch({
        ...switchOptions,
        label: config.label
      });
      
      switchInstance.render(group);
      switchInstances.push(switchInstance);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    // Return an object with the group element and methods to interact with the group
    return {
      element: group,
      switches: switchInstances,
      getStates: () => {
        return switchInstances.map((switchInstance, index) => ({
          index,
          label: switches[index].label,
          checked: switchInstance.isChecked()
        }));
      },
      setAll: (checked) => {
        switchInstances.forEach(switchInstance => {
          switchInstance.setChecked(checked);
        });
      },
      disableAll: () => {
        switchInstances.forEach(switchInstance => {
          switchInstance.setDisabled(true);
        });
      },
      enableAll: () => {
        switchInstances.forEach(switchInstance => {
          switchInstance.setDisabled(false);
        });
      }
    };
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessSwitch;
}