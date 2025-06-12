/**
 * HeadlessSidebarLayout - A comprehensive sidebar layout with mobile support
 *
 * USAGE EXAMPLES:
 *
 * // Basic sidebar layout
 * const navbar = document.createElement('div');
 * navbar.innerHTML = '<h1>My App</h1>';
 *
 * const sidebar = document.createElement('nav');
 * sidebar.innerHTML = `
 *   <ul>
 *     <li><a href="/">Home</a></li>
 *     <li><a href="/about">About</a></li>
 *   </ul>
 * `;
 *
 * const content = document.createElement('div');
 * content.innerHTML = '<h2>Main Content</h2><p>Welcome to the app!</p>';
 *
 * const layout = new HeadlessSidebarLayout({
 *   navbar: navbar,
 *   sidebar: sidebar,
 *   children: content
 * });
 * layout.render('#app');
 *
 * // With component instances
 * const navbarComponent = new HeadlessNavbar();
 * // ... add navbar items
 *
 * const sidebarComponent = new HeadlessSidebar();
 * // ... add sidebar items
 *
 * const layout = new HeadlessSidebarLayout({
 *   navbar: navbarComponent.element,
 *   sidebar: sidebarComponent.element,
 *   children: content
 * });
 *
 * // Programmatic sidebar control
 * layout.openSidebar();
 * layout.closeSidebar();
 * layout.toggleSidebar();
 */

class HeadlessSidebarLayout {
  constructor(options = {}) {
    this.options = {
      navbar: options.navbar || null,
      sidebar: options.sidebar || null,
      children: options.children || null,
      className: options.className || '',
      ...options,
    };

    this.showSidebar = false;
    this.element = this.createElement();
    this.mobileSidebar = null;
    this.mobileToggleButton = null;
  }

  createElement() {
    // Main container
    const container = document.createElement('div');
    container.className = this.getClasses();

    // Desktop sidebar
    const desktopSidebar = document.createElement('div');
    desktopSidebar.className = 'fixed inset-y-0 left-0 w-64 max-lg:hidden';
    if (this.options.sidebar) {
      desktopSidebar.appendChild(this.cloneNode(this.options.sidebar));
    }
    container.appendChild(desktopSidebar);

    // Mobile sidebar (dialog)
    this.mobileSidebar = this.createMobileSidebar();
    container.appendChild(this.mobileSidebar);

    // Mobile header
    const mobileHeader = this.createMobileHeader();
    container.appendChild(mobileHeader);

    // Main content
    const mainContent = this.createMainContent();
    container.appendChild(mainContent);

    return container;
  }

  createMobileSidebar() {
    // Mobile sidebar dialog container
    const dialogContainer = document.createElement('div');
    dialogContainer.className = 'lg:hidden fixed inset-0 z-50';
    dialogContainer.style.display = 'none';

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black/30';
    backdrop.addEventListener('click', () => this.closeSidebar());

    // Panel
    const panel = document.createElement('div');
    panel.className =
      'fixed inset-y-0 w-full max-w-80 p-2 transform transition-transform duration-300 ease-in-out';

    // Content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className =
      'flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10';

    // Close button container
    const closeContainer = document.createElement('div');
    closeContainer.className = '-mb-3 px-4 pt-3';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = this.getNavbarItemClasses();
    closeButton.setAttribute('aria-label', 'Close navigation');
    closeButton.addEventListener('click', () => this.closeSidebar());

    const closeIcon = this.createCloseMenuIcon();
    closeButton.appendChild(closeIcon);
    closeContainer.appendChild(closeButton);
    contentWrapper.appendChild(closeContainer);

    // Sidebar content
    if (this.options.sidebar) {
      contentWrapper.appendChild(this.cloneNode(this.options.sidebar));
    }

    panel.appendChild(contentWrapper);
    dialogContainer.appendChild(backdrop);
    dialogContainer.appendChild(panel);

    return dialogContainer;
  }

  createMobileHeader() {
    const header = document.createElement('header');
    header.className = 'flex items-center px-4 lg:hidden';

    // Toggle button container
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'py-2.5';

    // Toggle button
    this.mobileToggleButton = document.createElement('button');
    this.mobileToggleButton.type = 'button';
    this.mobileToggleButton.className = this.getNavbarItemClasses();
    this.mobileToggleButton.setAttribute('aria-label', 'Open navigation');
    this.mobileToggleButton.addEventListener('click', () => this.openSidebar());

    const menuIcon = this.createOpenMenuIcon();
    this.mobileToggleButton.appendChild(menuIcon);
    toggleContainer.appendChild(this.mobileToggleButton);
    header.appendChild(toggleContainer);

    // Navbar content
    const navbarContainer = document.createElement('div');
    navbarContainer.className = 'min-w-0 flex-1';
    if (this.options.navbar) {
      navbarContainer.appendChild(this.cloneNode(this.options.navbar));
    }
    header.appendChild(navbarContainer);

    return header;
  }

  createMainContent() {
    const main = document.createElement('main');
    main.className = 'flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64';

    const contentWrapper = document.createElement('div');
    contentWrapper.className =
      'grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10';

    const innerContent = document.createElement('div');
    innerContent.className = 'mx-auto max-w-6xl';

    if (this.options.children) {
      innerContent.appendChild(this.cloneNode(this.options.children));
    }

    contentWrapper.appendChild(innerContent);
    main.appendChild(contentWrapper);

    return main;
  }

  createOpenMenuIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('data-slot', 'icon');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z'
    );

    svg.appendChild(path);
    return svg;
  }

  createCloseMenuIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('data-slot', 'icon');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z'
    );

    svg.appendChild(path);
    return svg;
  }

  getNavbarItemClasses() {
    return [
      // Base
      'relative',
      'flex',
      'min-w-0',
      'items-center',
      'gap-3',
      'rounded-lg',
      'p-2',
      'text-left',
      'text-base/6',
      'font-medium',
      'text-zinc-950',
      'sm:text-sm/5',
      // Icons
      '*:data-[slot=icon]:size-6',
      '*:data-[slot=icon]:shrink-0',
      '*:data-[slot=icon]:fill-zinc-500',
      'sm:*:data-[slot=icon]:size-5',
      // Hover
      'hover:bg-zinc-950/5',
      'hover:*:data-[slot=icon]:fill-zinc-950',
      // Active
      'active:bg-zinc-950/5',
      'active:*:data-[slot=icon]:fill-zinc-950',
      // Dark mode
      'dark:text-white',
      'dark:*:data-[slot=icon]:fill-zinc-400',
      'dark:hover:bg-white/5',
      'dark:hover:*:data-[slot=icon]:fill-white',
      'dark:active:bg-white/5',
      'dark:active:*:data-[slot=icon]:fill-white',
    ].join(' ');
  }

  getClasses() {
    const classes = [
      'relative',
      'isolate',
      'flex',
      'min-h-svh',
      'w-full',
      'bg-white',
      'max-lg:flex-col',
      'lg:bg-zinc-100',
      'dark:bg-zinc-900',
      'dark:lg:bg-zinc-950',
    ];

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  // Helper method to clone nodes (supports both DOM nodes and component instances)
  cloneNode(node) {
    if (node.element) {
      // It's a component instance
      return node.element.cloneNode(true);
    } else if (node.cloneNode) {
      // It's a DOM node
      return node.cloneNode(true);
    } else {
      // It's something else, try to convert to string
      const div = document.createElement('div');
      div.innerHTML = String(node);
      return div.firstChild || div;
    }
  }

  openSidebar() {
    this.showSidebar = true;
    this.mobileSidebar.style.display = 'block';

    // Trigger animation
    requestAnimationFrame(() => {
      const panel = this.mobileSidebar.querySelector('.fixed.inset-y-0');
      if (panel) {
        panel.style.transform = 'translateX(0)';
      }
    });

    // Add body scroll lock
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.showSidebar = false;
    const panel = this.mobileSidebar.querySelector('.fixed.inset-y-0');

    if (panel) {
      panel.style.transform = 'translateX(-100%)';

      // Hide after animation
      setTimeout(() => {
        this.mobileSidebar.style.display = 'none';
      }, 300);
    } else {
      this.mobileSidebar.style.display = 'none';
    }

    // Remove body scroll lock
    document.body.style.overflow = '';
  }

  toggleSidebar() {
    if (this.showSidebar) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

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

  // Update content methods
  setNavbar(navbar) {
    this.options.navbar = navbar;

    // Update mobile header navbar
    const navbarContainer = this.element.querySelector('header .min-w-0.flex-1');
    if (navbarContainer) {
      navbarContainer.innerHTML = '';
      if (navbar) {
        navbarContainer.appendChild(this.cloneNode(navbar));
      }
    }

    return this;
  }

  setSidebar(sidebar) {
    this.options.sidebar = sidebar;

    // Update desktop sidebar
    const desktopSidebar = this.element.querySelector('.fixed.inset-y-0.left-0');
    if (desktopSidebar) {
      desktopSidebar.innerHTML = '';
      if (sidebar) {
        desktopSidebar.appendChild(this.cloneNode(sidebar));
      }
    }

    // Update mobile sidebar
    const mobileSidebarContent = this.mobileSidebar.querySelector('.flex.h-full.flex-col');
    if (mobileSidebarContent) {
      // Remove existing sidebar content (keep close button)
      const children = Array.from(mobileSidebarContent.children);
      children.slice(1).forEach((child) => child.remove());

      if (sidebar) {
        mobileSidebarContent.appendChild(this.cloneNode(sidebar));
      }
    }

    return this;
  }

  setChildren(children) {
    this.options.children = children;

    // Update main content
    const contentContainer = this.element.querySelector('main .mx-auto.max-w-6xl');
    if (contentContainer) {
      contentContainer.innerHTML = '';
      if (children) {
        contentContainer.appendChild(this.cloneNode(children));
      }
    }

    return this;
  }

  remove() {
    // Remove body scroll lock if active
    if (this.showSidebar) {
      document.body.style.overflow = '';
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HeadlessSidebarLayout,
  };
}
