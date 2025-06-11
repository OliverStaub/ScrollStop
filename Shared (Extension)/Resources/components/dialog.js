/**
 * HeadlessDialog - A comprehensive dialog component suite with modal support
 *
 * USAGE EXAMPLES:
 *
 * // Basic dialog
 * const dialog = new HeadlessDialog({
 *   isOpen: true,
 *   onClose: () => dialog.close()
 * });
 * dialog.render('#container');
 *
 * // Complete dialog with all components
 * const dialog = new HeadlessDialog({
 *   size: 'lg',
 *   isOpen: false,
 *   onClose: () => dialog.close()
 * });
 * 
 * new HeadlessDialogTitle('Confirm Action').render(dialog.getPanel());
 * new HeadlessDialogDescription('Are you sure you want to proceed?').render(dialog.getPanel());
 * 
 * const body = new HeadlessDialogBody();
 * body.element.innerHTML = '<p>This action cannot be undone.</p>';
 * body.render(dialog.getPanel());
 * 
 * const actions = new HeadlessDialogActions();
 * // Add your buttons here
 * actions.render(dialog.getPanel());
 * 
 * dialog.render('#app');
 *
 * // Different sizes
 * new HeadlessDialog({ size: 'sm' }).render('#small-dialog');
 * new HeadlessDialog({ size: 'xl' }).render('#large-dialog');
 *
 * // Programmatic control
 * const dialog = new HeadlessDialog();
 * dialog.open(); // Opens the dialog
 * dialog.close(); // Closes the dialog
 * dialog.toggle(); // Toggles the dialog state
 */

class HeadlessDialog {
  constructor(options = {}) {
    this.options = {
      size: options.size || 'lg',
      className: options.className || "",
      isOpen: options.isOpen || false,
      onClose: options.onClose || null,
      ...options,
    };

    this.isOpen = this.options.isOpen;
    this.element = this.createElement();
    this.panel = null; // Will be set during creation
  }

  // Size configurations
  static sizes = {
    xs: 'sm:max-w-xs',
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
  };

  createElement() {
    // Main dialog container
    const dialogContainer = document.createElement("div");
    dialogContainer.className = "fixed inset-0 z-50";
    dialogContainer.style.display = this.isOpen ? "block" : "none";

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50";
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop && this.options.onClose) {
        this.options.onClose();
      }
    });

    // Content container
    const contentContainer = document.createElement("div");
    contentContainer.className = "fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0";

    // Grid layout
    const gridContainer = document.createElement("div");
    gridContainer.className = "grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4";

    // Dialog panel
    this.panel = document.createElement("div");
    this.panel.className = this.getPanelClasses();
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');

    // Assemble the structure
    gridContainer.appendChild(this.panel);
    contentContainer.appendChild(gridContainer);
    dialogContainer.appendChild(backdrop);
    dialogContainer.appendChild(contentContainer);

    // Add escape key handler
    this.handleEscapeKey = (e) => {
      if (e.key === 'Escape' && this.isOpen && this.options.onClose) {
        this.options.onClose();
      }
    };

    return dialogContainer;
  }

  getPanelClasses() {
    const classes = [
      'row-start-2',
      'w-full',
      'min-w-0',
      'rounded-t-3xl',
      'bg-white',
      'p-8', // --gutter spacing
      'shadow-lg',
      'ring-1',
      'ring-zinc-950/10',
      'sm:mb-auto',
      'sm:rounded-2xl',
      'dark:bg-zinc-900',
      'dark:ring-white/10',
      'forced-colors:outline'
    ];

    // Add size class
    const sizeClass = HeadlessDialog.sizes[this.options.size];
    if (sizeClass) {
      classes.push(sizeClass);
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
    
    // Update event listeners
    this.updateEventListeners();
    
    return this;
  }

  updateEventListeners() {
    if (this.isOpen) {
      document.addEventListener('keydown', this.handleEscapeKey);
      // Focus management
      this.panel.focus();
    } else {
      document.removeEventListener('keydown', this.handleEscapeKey);
    }
  }

  open() {
    this.isOpen = true;
    this.element.style.display = "block";
    this.updateEventListeners();
    return this;
  }

  close() {
    this.isOpen = false;
    this.element.style.display = "none";
    this.updateEventListeners();
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

  setSize(size) {
    this.options.size = size;
    this.panel.className = this.getPanelClasses();
    return this;
  }

  getPanel() {
    return this.panel;
  }

  remove() {
    document.removeEventListener('keydown', this.handleEscapeKey);
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessDialogTitle {
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
      'text-lg/6',
      'font-semibold',
      'text-balance',
      'text-zinc-950',
      'sm:text-base/6',
      'dark:text-white'
    ]
  };

  createElement() {
    const element = document.createElement("h2");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDialogTitle.styles.base];

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

class HeadlessDialogDescription {
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
      'mt-2',
      'text-pretty',
      'text-base/6',
      'text-zinc-500',
      'sm:text-sm/6',
      'dark:text-zinc-400'
    ]
  };

  createElement() {
    const element = document.createElement("p");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDialogDescription.styles.base];

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

class HeadlessDialogBody {
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
      'mt-6'
    ]
  };

  createElement() {
    const element = document.createElement("div");
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDialogBody.styles.base];

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

  setContent(content) {
    this.element.innerHTML = '';
    if (typeof content === 'string') {
      this.element.innerHTML = content;
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

class HeadlessDialogActions {
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
      'mt-8',
      'flex',
      'flex-col-reverse',
      'items-center',
      'justify-end',
      'gap-3',
      '*:w-full',
      'sm:flex-row',
      'sm:*:w-auto'
    ]
  };

  createElement() {
    const element = document.createElement("div");
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessDialogActions.styles.base];

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

  // Helper method to add buttons
  addButton(button) {
    if (typeof button === 'string') {
      // If it's a string, create a simple button element
      const buttonElement = document.createElement('button');
      buttonElement.textContent = button;
      buttonElement.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700';
      this.element.appendChild(buttonElement);
    } else {
      // If it's an element or component, append it
      this.element.appendChild(button.element || button);
    }
    return this;
  }
}

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HeadlessDialog,
    HeadlessDialogTitle,
    HeadlessDialogDescription,
    HeadlessDialogBody,
    HeadlessDialogActions
  };
}