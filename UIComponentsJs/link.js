/**
 * HeadlessLink - A comprehensive link component inspired by Headless UI
 *
 * USAGE EXAMPLES:
 *
 * // Basic link
 * new HeadlessLink('Visit our website', {
 *   href: 'https://example.com'
 * }).render('#container');
 *
 * // Link with target blank
 * new HeadlessLink('External Link', {
 *   href: 'https://external.com',
 *   target: '_blank',
 *   rel: 'noopener noreferrer'
 * }).render(document.body);
 *
 * // Internal navigation link
 * new HeadlessLink('Go to Dashboard', {
 *   href: '/dashboard',
 *   onClick: (e, href) => {
 *     e.preventDefault();
 *     // Custom navigation logic here
 *     console.log('Navigating to:', href);
 *   }
 * }).render('#navigation');
 *
 * // Link with custom styling
 * new HeadlessLink('Styled Link', {
 *   href: '/page',
 *   className: 'text-blue-600 hover:text-blue-800 underline'
 * }).render('#content');
 *
 * // Download link
 * new HeadlessLink('Download File', {
 *   href: '/files/document.pdf',
 *   download: 'document.pdf'
 * }).render('#downloads');
 *
 * // Email link
 * new HeadlessLink('Send Email', {
 *   href: 'mailto:contact@example.com',
 *   subject: 'Hello',
 *   body: 'This is a test message'
 * }).render('#contact');
 *
 * // Phone link
 * new HeadlessLink('Call Us', {
 *   href: 'tel:+1234567890'
 * }).render('#phone');
 *
 * // Link group (navigation menu)
 * HeadlessLink.createGroup('#nav-menu', [
 *   { text: 'Home', href: '/' },
 *   { text: 'About', href: '/about' },
 *   { text: 'Contact', href: '/contact' },
 *   { text: 'Blog', href: '/blog', target: '_blank' }
 * ]);
 *
 * // Breadcrumb navigation
 * HeadlessLink.createBreadcrumb('#breadcrumb', [
 *   { text: 'Home', href: '/' },
 *   { text: 'Category', href: '/category' },
 *   { text: 'Current Page', href: '/category/current', active: true }
 * ]);
 */
class HeadlessLink {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      href: options.href || '#',
      target: options.target || null,
      rel: options.rel || null,
      download: options.download || null,
      className: options.className || '',
      onClick: options.onClick || null,
      onMouseEnter: options.onMouseEnter || null,
      onMouseLeave: options.onMouseLeave || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      id: options.id || null,
      title: options.title || null,
      'aria-label': options['aria-label'] || null,
      tabIndex: options.tabIndex || null,
      subject: options.subject || null, // For mailto links
      body: options.body || null, // For mailto links
      ...options,
    };

    this.element = this.createElement();
  }

  // Default styles that can be customized
  static styles = {
    base: [
      // Basic interactive styles
      'inline-flex items-center',
      'transition-colors duration-200',
      'focus:outline-2 focus:outline-offset-2 focus:outline-blue-500',
      'hover:underline'
    ],
    
    // Common link styles you might want to use
    primary: [
      'text-blue-600 dark:text-blue-400',
      'hover:text-blue-800 dark:hover:text-blue-300'
    ],
    
    secondary: [
      'text-zinc-600 dark:text-zinc-400',
      'hover:text-zinc-800 dark:hover:text-zinc-200'
    ],
    
    danger: [
      'text-red-600 dark:text-red-400',
      'hover:text-red-800 dark:hover:text-red-300'
    ],
    
    muted: [
      'text-zinc-500 dark:text-zinc-500',
      'hover:text-zinc-700 dark:hover:text-zinc-300'
    ]
  };

  createElement() {
    // Create the link element
    const link = document.createElement('a');
    
    // Set href and handle special link types
    link.href = this.buildHref();
    
    // Set text content
    link.textContent = this.text;
    
    // Apply CSS classes
    link.className = this.getClasses();
    
    // Set basic attributes
    if (this.options.target) link.target = this.options.target;
    if (this.options.rel) link.rel = this.options.rel;
    if (this.options.download) link.download = this.options.download;
    if (this.options.id) link.id = this.options.id;
    if (this.options.title) link.title = this.options.title;
    if (this.options['aria-label']) link.setAttribute('aria-label', this.options['aria-label']);
    if (this.options.tabIndex !== null) link.tabIndex = this.options.tabIndex;

    // Add data-interactive attribute for Headless UI compatibility
    link.setAttribute('data-interactive', '');

    // Add event listeners
    link.addEventListener('click', (e) => {
      if (this.options.onClick) {
        this.options.onClick(e, this.options.href);
      }
    });

    if (this.options.onMouseEnter) {
      link.addEventListener('mouseenter', this.options.onMouseEnter);
    }

    if (this.options.onMouseLeave) {
      link.addEventListener('mouseleave', this.options.onMouseLeave);
    }

    if (this.options.onFocus) {
      link.addEventListener('focus', this.options.onFocus);
    }

    if (this.options.onBlur) {
      link.addEventListener('blur', this.options.onBlur);
    }

    return link;
  }

  buildHref() {
    let href = this.options.href;
    
    // Handle mailto links with subject and body
    if (href.startsWith('mailto:')) {
      const params = new URLSearchParams();
      if (this.options.subject) params.append('subject', this.options.subject);
      if (this.options.body) params.append('body', this.options.body);
      
      const queryString = params.toString();
      if (queryString) {
        href += (href.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return href;
  }

  getClasses() {
    const classes = [...HeadlessLink.styles.base];

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  // Method to render the link to a container
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

  // Method to update link text
  setText(newText) {
    this.text = newText;
    this.element.textContent = newText;
    return this;
  }

  // Method to update href
  setHref(newHref) {
    this.options.href = newHref;
    this.element.href = this.buildHref();
    return this;
  }

  // Method to update target
  setTarget(target) {
    this.options.target = target;
    if (target) {
      this.element.target = target;
    } else {
      this.element.removeAttribute('target');
    }
    return this;
  }

  // Method to add classes
  addClass(className) {
    if (!this.options.className.includes(className)) {
      this.options.className = this.options.className ? 
        `${this.options.className} ${className}` : className;
      this.element.className = this.getClasses();
    }
    return this;
  }

  // Method to remove classes
  removeClass(className) {
    this.options.className = this.options.className
      .split(' ')
      .filter(cls => cls !== className)
      .join(' ');
    this.element.className = this.getClasses();
    return this;
  }

  // Method to apply predefined styles
  applyStyle(styleName) {
    if (HeadlessLink.styles[styleName]) {
      const styleClasses = HeadlessLink.styles[styleName].join(' ');
      this.addClass(styleClasses);
    }
    return this;
  }

  // Method to programmatically click the link
  click() {
    this.element.click();
    return this;
  }

  // Method to focus the link
  focus() {
    this.element.focus();
    return this;
  }

  // Method to blur the link
  blur() {
    this.element.blur();
    return this;
  }

  // Method to check if link is external
  isExternal() {
    try {
      const url = new URL(this.options.href, window.location.origin);
      return url.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  // Method to remove from DOM
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  // Static method to create a group of links (navigation menu)
  static createGroup(container, links, groupOptions = {}) {
    const group = document.createElement('nav');
    group.className = groupOptions.className || 'flex space-x-4';
    
    if (groupOptions.ariaLabel) {
      group.setAttribute('aria-label', groupOptions.ariaLabel);
    }

    const linkInstances = [];

    links.forEach((config) => {
      const linkInstance = new HeadlessLink(config.text, config);
      linkInstance.render(group);
      linkInstances.push(linkInstance);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(group);

    return {
      element: group,
      links: linkInstances
    };
  }

  // Static method to create breadcrumb navigation
  static createBreadcrumb(container, items, options = {}) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', options.ariaLabel || 'Breadcrumb');
    nav.className = options.className || 'flex items-center space-x-2 text-sm';

    const ol = document.createElement('ol');
    ol.className = 'flex items-center space-x-2';

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center';

      // Add separator (except for first item)
      if (index > 0) {
        const separator = document.createElement('span');
        separator.textContent = options.separator || '/';
        separator.className = 'mx-2 text-zinc-400';
        separator.setAttribute('aria-hidden', 'true');
        li.appendChild(separator);
      }

      // Create link or span for current page
      if (item.active || index === items.length - 1) {
        const span = document.createElement('span');
        span.textContent = item.text;
        span.className = 'font-medium text-zinc-900 dark:text-white';
        span.setAttribute('aria-current', 'page');
        li.appendChild(span);
      } else {
        const link = new HeadlessLink(item.text, {
          ...item,
          className: 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
        });
        link.render(li);
      }

      ol.appendChild(li);
    });

    nav.appendChild(ol);

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(nav);

    return nav;
  }

  // Static method to create a pagination component
  static createPagination(container, currentPage, totalPages, options = {}) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', options.ariaLabel || 'Pagination');
    nav.className = options.className || 'flex justify-center space-x-1';

    const pages = [];
    
    // Previous button
    if (currentPage > 1) {
      pages.push({
        text: options.prevText || 'Previous',
        href: options.getHref ? options.getHref(currentPage - 1) : `#page-${currentPage - 1}`,
        className: 'px-3 py-2 rounded-md bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
        onClick: options.onPageChange ? (e) => {
          e.preventDefault();
          options.onPageChange(currentPage - 1);
        } : null
      });
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        text: i.toString(),
        href: options.getHref ? options.getHref(i) : `#page-${i}`,
        className: i === currentPage ? 
          'px-3 py-2 rounded-md bg-blue-600 text-white' : 
          'px-3 py-2 rounded-md bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
        'aria-current': i === currentPage ? 'page' : null,
        onClick: options.onPageChange ? (e) => {
          e.preventDefault();
          options.onPageChange(i);
        } : null
      });
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push({
        text: options.nextText || 'Next',
        href: options.getHref ? options.getHref(currentPage + 1) : `#page-${currentPage + 1}`,
        className: 'px-3 py-2 rounded-md bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
        onClick: options.onPageChange ? (e) => {
          e.preventDefault();
          options.onPageChange(currentPage + 1);
        } : null
      });
    }

    // Create links
    pages.forEach((pageConfig) => {
      new HeadlessLink(pageConfig.text, pageConfig).render(nav);
    });

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(nav);

    return nav;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeadlessLink;
}