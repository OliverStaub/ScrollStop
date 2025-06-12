/**
 * HeadlessTable - A comprehensive table component suite with advanced features
 *
 * USAGE EXAMPLES:
 *
 * // Basic table
 * const table = new HeadlessTable({
 *   striped: true,
 *   dense: false
 * });
 * 
 * const thead = new HeadlessTableHead();
 * const headerRow = new HeadlessTableRow();
 * new HeadlessTableHeader('Name').render(headerRow.element);
 * new HeadlessTableHeader('Email').render(headerRow.element);
 * new HeadlessTableHeader('Role').render(headerRow.element);
 * headerRow.render(thead.element);
 * thead.render(table.getTable());
 * 
 * const tbody = new HeadlessTableBody();
 * const row1 = new HeadlessTableRow();
 * new HeadlessTableCell('John Doe').render(row1.element);
 * new HeadlessTableCell('john@example.com').render(row1.element);
 * new HeadlessTableCell('Admin').render(row1.element);
 * row1.render(tbody.element);
 * tbody.render(table.getTable());
 * 
 * table.render('#container');
 *
 * // Clickable rows
 * const clickableRow = new HeadlessTableRow({
 *   href: '/user/123',
 *   title: 'View user details'
 * });
 * new HeadlessTableCell('Jane Smith').render(clickableRow.element);
 * new HeadlessTableCell('jane@example.com').render(clickableRow.element);
 * clickableRow.render(tbody.element);
 *
 * // Grid table with borders
 * const gridTable = new HeadlessTable({
 *   grid: true,
 *   bleed: false,
 *   striped: false
 * });
 *
 * // Dense table for compact display
 * const denseTable = new HeadlessTable({
 *   dense: true,
 *   striped: true
 * });
 *
 * // Using helper method
 * const data = [
 *   { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
 *   { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
 * ];
 * 
 * HeadlessTable.createTable(data, ['name', 'email', 'role'], '#table-container', {
 *   striped: true,
 *   headers: ['Name', 'Email Address', 'Role']
 * });
 */

class HeadlessTable {
  constructor(options = {}) {
    this.options = {
      bleed: options.bleed || false,
      dense: options.dense || false,
      grid: options.grid || false,
      striped: options.striped || false,
      className: options.className || "",
      ...options,
    };

    this.context = {
      bleed: this.options.bleed,
      dense: this.options.dense,
      grid: this.options.grid,
      striped: this.options.striped
    };

    this.element = this.createElement();
    this.table = null; // Will be set during creation
  }

  createElement() {
    // Main container
    const container = document.createElement("div");
    container.className = "flow-root";

    // Overflow container
    const overflowContainer = document.createElement("div");
    overflowContainer.className = this.getOverflowClasses();

    // Alignment container
    const alignContainer = document.createElement("div");
    alignContainer.className = this.getAlignClasses();

    // Actual table
    this.table = document.createElement("table");
    this.table.className = this.getTableClasses();

    // Assemble structure
    alignContainer.appendChild(this.table);
    overflowContainer.appendChild(alignContainer);
    container.appendChild(overflowContainer);

    return container;
  }

  getOverflowClasses() {
    const classes = [
      '-mx-(--gutter)',
      'overflow-x-auto',
      'whitespace-nowrap'
    ];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(" ");
  }

  getAlignClasses() {
    const classes = [
      'inline-block',
      'min-w-full',
      'align-middle'
    ];

    if (!this.options.bleed) {
      classes.push('sm:px-(--gutter)');
    }

    return classes.join(" ");
  }

  getTableClasses() {
    return [
      'min-w-full',
      'text-left',
      'text-sm/6',
      'text-zinc-950',
      'dark:text-white'
    ].join(" ");
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

  getTable() {
    return this.table;
  }

  getContext() {
    return this.context;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static helper method to create a complete table from data
  static createTable(data, columns, container, options = {}) {
    const table = new HeadlessTable(options);
    
    // Create header if headers are provided
    if (options.headers) {
      const thead = new HeadlessTableHead();
      const headerRow = new HeadlessTableRow();
      
      options.headers.forEach(header => {
        new HeadlessTableHeader(header).render(headerRow.element);
      });
      
      headerRow.render(thead.element);
      thead.render(table.getTable());
    }

    // Create body with data
    const tbody = new HeadlessTableBody();
    
    data.forEach(item => {
      const row = new HeadlessTableRow();
      
      columns.forEach(column => {
        const cellData = item[column] || '';
        new HeadlessTableCell(cellData).render(row.element);
      });
      
      row.render(tbody.element);
    });
    
    tbody.render(table.getTable());
    table.render(container);
    
    return table;
  }
}

class HeadlessTableHead {
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
      'text-zinc-500',
      'dark:text-zinc-400'
    ]
  };

  createElement() {
    const element = document.createElement("thead");
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessTableHead.styles.base];

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
}

class HeadlessTableBody {
  constructor(options = {}) {
    this.options = {
      className: options.className || "",
      ...options,
    };

    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("tbody");
    return element;
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
}

class HeadlessTableRow {
  constructor(options = {}) {
    this.options = {
      href: options.href || null,
      target: options.target || null,
      title: options.title || null,
      className: options.className || "",
      onClick: options.onClick || null,
      tableContext: options.tableContext || { striped: false }, // Will be passed by parent table
      ...options,
    };

    this.rowContext = {
      href: this.options.href,
      target: this.options.target,
      title: this.options.title
    };

    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("tr");
    element.className = this.getClasses();

    // Add click handler for clickable rows
    if (this.options.onClick) {
      element.addEventListener('click', this.options.onClick);
    }

    return element;
  }

  getClasses() {
    const classes = [];
    const { striped } = this.options.tableContext;

    // Clickable row styles
    if (this.options.href) {
      classes.push(
        'has-[[data-row-link][data-focus]]:outline-2',
        'has-[[data-row-link][data-focus]]:-outline-offset-2',
        'has-[[data-row-link][data-focus]]:outline-blue-500',
        'dark:focus-within:bg-white/2.5'
      );
    }

    // Striped styles
    if (striped) {
      classes.push('even:bg-zinc-950/2.5', 'dark:even:bg-white/2.5');
    }

    // Hover styles
    if (this.options.href && striped) {
      classes.push('hover:bg-zinc-950/5', 'dark:hover:bg-white/5');
    } else if (this.options.href && !striped) {
      classes.push('hover:bg-zinc-950/2.5', 'dark:hover:bg-white/2.5');
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
    return this;
  }

  getRowContext() {
    return this.rowContext;
  }

  setTableContext(context) {
    this.options.tableContext = context;
    this.element.className = this.getClasses();
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessTableHeader {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      className: options.className || "",
      tableContext: options.tableContext || { bleed: false, grid: false }, // Will be passed by parent table
      ...options,
    };

    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'border-b',
      'border-b-zinc-950/10',
      'px-4',
      'py-2',
      'font-medium',
      'first:pl-(--gutter,theme(spacing.2))',
      'last:pr-(--gutter,theme(spacing.2))',
      'dark:border-b-white/10'
    ]
  };

  createElement() {
    const element = document.createElement("th");
    element.textContent = this.text;
    element.className = this.getClasses();
    return element;
  }

  getClasses() {
    const classes = [...HeadlessTableHeader.styles.base];
    const { bleed, grid } = this.options.tableContext;

    // Grid styles
    if (grid) {
      classes.push(
        'border-l',
        'border-l-zinc-950/5',
        'first:border-l-0',
        'dark:border-l-white/5'
      );
    }

    // Bleed styles
    if (!bleed) {
      classes.push('sm:first:pl-1', 'sm:last:pr-1');
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
    return this;
  }

  setText(newText) {
    this.text = newText;
    this.element.textContent = newText;
    return this;
  }

  setTableContext(context) {
    this.options.tableContext = context;
    this.element.className = this.getClasses();
    return this;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

class HeadlessTableCell {
  constructor(content, options = {}) {
    this.content = content;
    this.options = {
      className: options.className || "",
      tableContext: options.tableContext || { bleed: false, dense: false, grid: false, striped: false },
      rowContext: options.rowContext || { href: null, target: null, title: null },
      ...options,
    };

    this.cellRef = null;
    this.element = this.createElement();
  }

  // Style configurations
  static styles = {
    base: [
      'relative',
      'px-4',
      'first:pl-(--gutter,theme(spacing.2))',
      'last:pr-(--gutter,theme(spacing.2))'
    ]
  };

  createElement() {
    const element = document.createElement("td");
    element.className = this.getClasses();

    // Set content
    if (typeof this.content === 'string') {
      element.textContent = this.content;
    } else if (this.content) {
      element.appendChild(this.content.element || this.content);
    }

    // Add row link if href is provided
    if (this.options.rowContext.href) {
      this.cellRef = element;
      this.addRowLink(element);
    }

    return element;
  }

  addRowLink(element) {
    const link = document.createElement("a");
    link.setAttribute('data-row-link', '');
    link.href = this.options.rowContext.href;
    
    if (this.options.rowContext.target) {
      link.target = this.options.rowContext.target;
    }
    
    if (this.options.rowContext.title) {
      link.setAttribute('aria-label', this.options.rowContext.title);
    }
    
    // Check if this is the first cell in the row for tabindex
    const isFirstCell = !element.previousElementSibling;
    link.tabIndex = isFirstCell ? 0 : -1;
    
    link.className = "absolute inset-0 focus:outline-hidden";
    
    element.appendChild(link);
  }

  getClasses() {
    const classes = [...HeadlessTableCell.styles.base];
    const { bleed, dense, grid, striped } = this.options.tableContext;

    // Border styles (non-striped only)
    if (!striped) {
      classes.push('border-b', 'border-zinc-950/5', 'dark:border-white/5');
    }

    // Grid styles
    if (grid) {
      classes.push(
        'border-l',
        'border-l-zinc-950/5',
        'first:border-l-0',
        'dark:border-l-white/5'
      );
    }

    // Padding styles
    if (dense) {
      classes.push('py-2.5');
    } else {
      classes.push('py-4');
    }

    // Bleed styles
    if (!bleed) {
      classes.push('sm:first:pl-1', 'sm:last:pr-1');
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
    return this;
  }

  setContent(newContent) {
    this.content = newContent;
    
    // Clear existing content but preserve row link if it exists
    const rowLink = this.element.querySelector('[data-row-link]');
    this.element.innerHTML = '';
    
    // Add new content
    if (typeof newContent === 'string') {
      this.element.textContent = newContent;
    } else if (newContent) {
      this.element.appendChild(newContent.element || newContent);
    }
    
    // Restore row link if it existed
    if (rowLink) {
      this.element.appendChild(rowLink);
    }
    
    return this;
  }

  setTableContext(tableContext) {
    this.options.tableContext = tableContext;
    this.element.className = this.getClasses();
    return this;
  }

  setRowContext(rowContext) {
    this.options.rowContext = rowContext;
    
    // Remove existing row link
    const existingLink = this.element.querySelector('[data-row-link]');
    if (existingLink) {
      existingLink.remove();
    }
    
    // Add new row link if href is provided
    if (rowContext.href) {
      this.addRowLink(this.element);
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
    HeadlessTable,
    HeadlessTableHead,
    HeadlessTableBody,
    HeadlessTableRow,
    HeadlessTableHeader,
    HeadlessTableCell
  };
}