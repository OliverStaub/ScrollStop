/**
 * HeadlessAlert - A comprehensive alert dialog component
 *
 * USAGE EXAMPLES:
 *
 * // Basic alert
 * new HeadlessAlert('Alert Content').render('#container');
 *
 * // Alert with title and description
 * const alert = new HeadlessAlert()
 *   .setTitle('Confirm Action')
 *   .setDescription('Are you sure you want to continue?')
 *   .addAction('Confirm', { color: 'red', onClick: () => console.log('Confirmed') })
 *   .addAction('Cancel', { outline: true, onClick: () => alert.close() })
 *   .render(document.body);
 *
 * // Alert with custom size
 * new HeadlessAlert('Large alert content', { size: 'lg' }).render('#container');
 *
 * // Alert with custom body content
 * const customAlert = new HeadlessAlert()
 *   .setTitle('Custom Alert')
 *   .setBody('<p>Custom HTML content</p>')
 *   .render('#app');
 *
 * AVAILABLE SIZES:
 * 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'
 */
class HeadlessAlert {
  constructor(content = '', options = {}) {
    this.content = content;
    this.options = {
      size: options.size || 'md',
      className: options.className || '',
      onClose: options.onClose || null,
      closeOnBackdrop: options.closeOnBackdrop !== false,
      ...options,
    };

    this.title = null;
    this.description = null;
    this.body = null;
    this.actions = [];
    this.isOpen = false;

    this.element = null;
    this.backdrop = null;
    this.panel = null;
  }

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
    // Create main dialog element
    this.element = document.createElement('div');
    this.element.className = 'fixed inset-0 z-50';
    this.element.style.display = 'none';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');

    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className =
      'fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/15 px-2 py-2 transition duration-100 focus:outline-0 opacity-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50';

    if (this.options.closeOnBackdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
    }

    // Create container
    const container = document.createElement('div');
    container.className = 'fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0';

    const grid = document.createElement('div');
    grid.className =
      'grid min-h-full grid-rows-[1fr_auto_1fr] justify-items-center p-8 sm:grid-rows-[1fr_auto_3fr] sm:p-4';

    // Create panel
    this.panel = document.createElement('div');
    this.panel.className = this.getPanelClasses();

    // Add content to panel
    this.updatePanelContent();

    // Assemble elements
    grid.appendChild(this.panel);
    container.appendChild(grid);
    this.element.appendChild(this.backdrop);
    this.element.appendChild(container);

    // Handle escape key
    this.handleKeydown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };

    return this.element;
  }

  getPanelClasses() {
    const baseClasses = [
      'row-start-2 w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-zinc-950/10 sm:rounded-2xl sm:p-6 dark:bg-zinc-900 dark:ring-white/10',
      'transition duration-100 will-change-transform opacity-0 scale-95',
    ];

    if (this.options.className) {
      baseClasses.push(this.options.className);
    }

    const sizeClass = HeadlessAlert.sizes[this.options.size];
    if (sizeClass) {
      baseClasses.push(sizeClass);
    }

    return baseClasses.join(' ');
  }

  updatePanelContent() {
    this.panel.innerHTML = '';

    // Add title if set
    if (this.title) {
      const titleEl = document.createElement('h2');
      titleEl.className =
        'text-center text-base/6 font-semibold text-balance text-zinc-950 sm:text-left sm:text-sm/6 sm:text-wrap dark:text-white';
      titleEl.textContent = this.title;
      this.panel.appendChild(titleEl);
    }

    // Add description if set
    if (this.description) {
      const descEl = document.createElement('p');
      descEl.className =
        'mt-2 text-center text-pretty sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400';
      descEl.textContent = this.description;
      this.panel.appendChild(descEl);
    }

    // Add body content
    if (this.body) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'mt-4';
      if (typeof this.body === 'string') {
        bodyEl.innerHTML = this.body;
      } else {
        bodyEl.appendChild(this.body);
      }
      this.panel.appendChild(bodyEl);
    } else if (this.content) {
      const contentEl = document.createElement('div');
      contentEl.className = this.title || this.description ? 'mt-4' : '';
      contentEl.textContent = this.content;
      this.panel.appendChild(contentEl);
    }

    // Add actions if any
    if (this.actions.length > 0) {
      const actionsEl = document.createElement('div');
      actionsEl.className =
        'mt-6 flex flex-col-reverse items-center justify-end gap-3 sm:mt-4 sm:flex-row';

      this.actions.forEach((action) => {
        const button = document.createElement('button');
        button.className = action.className || this.getActionButtonClasses(action);
        button.textContent = action.text;
        button.style.width = '100%';

        // Set width for sm and up
        button.classList.add('sm:w-auto');

        if (action.onClick) {
          button.addEventListener('click', action.onClick);
        }

        actionsEl.appendChild(button);
      });

      this.panel.appendChild(actionsEl);
    }
  }

  getActionButtonClasses(action) {
    const baseClasses = [
      'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
      'px-[calc(theme(spacing.3.5)-1px)] py-[calc(theme(spacing.2.5)-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing.1.5)-1px)] sm:text-sm/6',
      'focus:outline-2 focus:outline-offset-2 focus:outline-blue-500',
      'disabled:opacity-50',
      'transition-colors duration-200',
    ];

    if (action.outline) {
      baseClasses.push(
        'border-zinc-950/10 text-zinc-950 hover:bg-zinc-950/2.5 active:bg-zinc-950/2.5 dark:border-white/15 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/5'
      );
    } else {
      baseClasses.push('border-transparent shadow-sm hover:shadow-md active:shadow-sm');
      const color = action.color || 'dark/zinc';
      const colorClasses = {
        'dark/zinc':
          'text-white bg-zinc-900 border-zinc-950/90 hover:bg-zinc-800 active:bg-zinc-900',
        red: 'text-white bg-red-600 border-red-700/90 hover:bg-red-500 active:bg-red-600',
        blue: 'text-white bg-blue-600 border-blue-700/90 hover:bg-blue-500 active:bg-blue-600',
      };
      if (colorClasses[color]) {
        baseClasses.push(colorClasses[color]);
      }
    }

    return baseClasses.join(' ');
  }

  setTitle(title) {
    this.title = title;
    if (this.panel) {
      this.updatePanelContent();
    }
    return this;
  }

  setDescription(description) {
    this.description = description;
    if (this.panel) {
      this.updatePanelContent();
    }
    return this;
  }

  setBody(body) {
    this.body = body;
    if (this.panel) {
      this.updatePanelContent();
    }
    return this;
  }

  addAction(text, options = {}) {
    this.actions.push({
      text,
      ...options,
    });
    if (this.panel) {
      this.updatePanelContent();
    }
    return this;
  }

  clearActions() {
    this.actions = [];
    if (this.panel) {
      this.updatePanelContent();
    }
    return this;
  }

  open() {
    if (!this.element) {
      this.createElement();
    }

    this.isOpen = true;
    this.element.style.display = 'block';

    // Add to body if not already added
    if (!this.element.parentNode) {
      document.body.appendChild(this.element);
    }

    // Add event listener for escape key
    document.addEventListener('keydown', this.handleKeydown);

    // Trigger animations
    requestAnimationFrame(() => {
      this.backdrop.style.opacity = '1';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'scale(1)';
    });

    return this;
  }

  close() {
    if (!this.isOpen) return this;

    this.isOpen = false;

    // Remove event listener
    document.removeEventListener('keydown', this.handleKeydown);

    // Animate out
    this.backdrop.style.opacity = '0';
    this.panel.style.opacity = '0';
    this.panel.style.transform = 'scale(0.95)';

    // Hide after animation
    setTimeout(() => {
      if (this.element) {
        this.element.style.display = 'none';
      }
      if (this.options.onClose) {
        this.options.onClose();
      }
    }, 100);

    return this;
  }

  render(container) {
    if (!this.element) {
      this.createElement();
    }

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
    this.close();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create a simple alert
  static show(content, options = {}) {
    const alert = new HeadlessAlert(content, options);
    alert.render(document.body);
    alert.open();
    return alert;
  }

  // Static method to create a confirmation dialog
  static confirm(title, description, options = {}) {
    return new Promise((resolve) => {
      const alert = new HeadlessAlert()
        .setTitle(title)
        .setDescription(description)
        .addAction('Cancel', {
          outline: true,
          onClick: () => {
            alert.close();
            resolve(false);
          },
        })
        .addAction('Confirm', {
          color: options.confirmColor || 'red',
          onClick: () => {
            alert.close();
            resolve(true);
          },
        })
        .render(document.body);

      alert.open();
    });
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessAlert;
}
