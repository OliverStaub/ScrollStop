/**
 * HeadlessAvatar - A comprehensive avatar component
 *
 * USAGE EXAMPLES:
 *
 * // Basic avatar with image
 * new HeadlessAvatar({ src: '/path/to/image.jpg', alt: 'User Name' }).render('#container');
 *
 * // Avatar with initials fallback
 * new HeadlessAvatar({
 *   src: '/path/to/image.jpg',
 *   initials: 'JD',
 *   alt: 'John Doe'
 * }).render('#user-profile');
 *
 * // Square avatar
 * new HeadlessAvatar({
 *   src: '/path/to/image.jpg',
 *   square: true,
 *   alt: 'Company Logo'
 * }).render('#company-info');
 *
 * // Initials only avatar
 * new HeadlessAvatar({
 *   initials: 'AB',
 *   alt: 'Alice Bob'
 * }).render('#chat-user');
 *
 * // Clickable avatar button
 * new HeadlessAvatarButton({
 *   src: '/avatar.jpg',
 *   initials: 'ME',
 *   alt: 'My Profile',
 *   onClick: () => console.log('Avatar clicked!')
 * }).render('#user-menu');
 *
 * // Avatar button as link
 * new HeadlessAvatarButton({
 *   src: '/avatar.jpg',
 *   href: '/profile',
 *   alt: 'Go to Profile'
 * }).render('#navigation');
 */
class HeadlessAvatar {
  constructor(options = {}) {
    this.options = {
      src: options.src || null,
      square: options.square || false,
      initials: options.initials || '',
      alt: options.alt || '',
      className: options.className || '',
      ...options,
    };

    this.element = this.createElement();
  }

  static styles = {
    base: [
      'inline-grid shrink-0 align-middle *:col-start-1 *:row-start-1',
      'outline -outline-offset-1 outline-black/10 dark:outline-white/10',
    ],
    round: ['rounded-full *:rounded-full'],
    square: ['rounded-[20%] *:rounded-[20%]'],
    svg: ['size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none'],
    img: ['size-full'],
  };

  createElement() {
    // Create main span element
    const span = document.createElement('span');
    span.setAttribute('data-slot', 'avatar');
    span.className = this.getClasses();

    // Add initials if provided
    if (this.options.initials) {
      const svg = this.createInitialsSvg();
      span.appendChild(svg);
    }

    // Add image if provided
    if (this.options.src) {
      const img = this.createImage();
      span.appendChild(img);
    }

    return span;
  }

  getClasses() {
    const classes = [...HeadlessAvatar.styles.base];

    if (this.options.square) {
      classes.push(...HeadlessAvatar.styles.square);
    } else {
      classes.push(...HeadlessAvatar.styles.round);
    }

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  createInitialsSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = HeadlessAvatar.styles.svg.join(' ');
    svg.setAttribute('viewBox', '0 0 100 100');

    if (!this.options.alt) {
      svg.setAttribute('aria-hidden', 'true');
    }

    // Add title if alt text is provided
    if (this.options.alt) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = this.options.alt;
      svg.appendChild(title);
    }

    // Add text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '.125em');
    text.textContent = this.options.initials;

    svg.appendChild(text);
    return svg;
  }

  createImage() {
    const img = document.createElement('img');
    img.className = HeadlessAvatar.styles.img.join(' ');
    img.src = this.options.src;
    img.alt = this.options.alt;

    // Handle image load error - show initials fallback
    img.addEventListener('error', () => {
      if (this.options.initials && !this.element.querySelector('svg')) {
        const svg = this.createInitialsSvg();
        this.element.insertBefore(svg, img);
      }
    });

    return img;
  }

  setSrc(src) {
    this.options.src = src;
    const existingImg = this.element.querySelector('img');

    if (src) {
      if (existingImg) {
        existingImg.src = src;
      } else {
        const img = this.createImage();
        this.element.appendChild(img);
      }
    } else if (existingImg) {
      existingImg.remove();
    }

    return this;
  }

  setInitials(initials) {
    this.options.initials = initials;
    const existingSvg = this.element.querySelector('svg');

    if (initials) {
      if (existingSvg) {
        const text = existingSvg.querySelector('text');
        if (text) {
          text.textContent = initials;
        }
      } else {
        const svg = this.createInitialsSvg();
        // Insert before image if it exists
        const img = this.element.querySelector('img');
        if (img) {
          this.element.insertBefore(svg, img);
        } else {
          this.element.appendChild(svg);
        }
      }
    } else if (existingSvg) {
      existingSvg.remove();
    }

    return this;
  }

  setAlt(alt) {
    this.options.alt = alt;

    const img = this.element.querySelector('img');
    if (img) {
      img.alt = alt;
    }

    const svg = this.element.querySelector('svg');
    if (svg) {
      if (alt) {
        svg.removeAttribute('aria-hidden');
        let title = svg.querySelector('title');
        if (!title) {
          title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          svg.insertBefore(title, svg.firstChild);
        }
        title.textContent = alt;
      } else {
        svg.setAttribute('aria-hidden', 'true');
        const title = svg.querySelector('title');
        if (title) {
          title.remove();
        }
      }
    }

    return this;
  }

  setSquare(square) {
    this.options.square = square;
    this.element.className = this.getClasses();
    return this;
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

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  getElement() {
    return this.element;
  }
}

class HeadlessAvatarButton {
  constructor(options = {}) {
    this.options = {
      src: options.src || null,
      square: options.square || false,
      initials: options.initials || '',
      alt: options.alt || '',
      className: options.className || '',
      onClick: options.onClick || null,
      href: options.href || null,
      target: options.target || null,
      ...options,
    };

    this.avatar = new HeadlessAvatar({
      src: this.options.src,
      square: this.options.square,
      initials: this.options.initials,
      alt: this.options.alt,
    });

    this.element = this.createElement();
  }

  static styles = {
    base: ['relative inline-grid focus:outline-2 focus:outline-offset-2 focus:outline-blue-500'],
    round: ['rounded-full'],
    square: ['rounded-[20%]'],
    touchTarget: [
      'absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden',
    ],
  };

  createElement() {
    // Create button or anchor element
    const element = this.options.href
      ? document.createElement('a')
      : document.createElement('button');

    element.className = this.getClasses();

    // Set attributes based on element type
    if (this.options.href) {
      element.href = this.options.href;
      if (this.options.target) {
        element.target = this.options.target;
      }
    } else {
      element.type = 'button';
    }

    // Add click handler
    if (this.options.onClick) {
      element.addEventListener('click', this.options.onClick);
    }

    // Add touch target
    const touchTarget = document.createElement('span');
    touchTarget.className = HeadlessAvatarButton.styles.touchTarget.join(' ');
    touchTarget.setAttribute('aria-hidden', 'true');
    element.appendChild(touchTarget);

    // Add avatar
    element.appendChild(this.avatar.getElement());

    return element;
  }

  getClasses() {
    const classes = [...HeadlessAvatarButton.styles.base];

    if (this.options.square) {
      classes.push(...HeadlessAvatarButton.styles.square);
    } else {
      classes.push(...HeadlessAvatarButton.styles.round);
    }

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  setSrc(src) {
    this.options.src = src;
    this.avatar.setSrc(src);
    return this;
  }

  setInitials(initials) {
    this.options.initials = initials;
    this.avatar.setInitials(initials);
    return this;
  }

  setAlt(alt) {
    this.options.alt = alt;
    this.avatar.setAlt(alt);
    return this;
  }

  setSquare(square) {
    this.options.square = square;
    this.avatar.setSquare(square);
    this.element.className = this.getClasses();
    return this;
  }

  setHref(href) {
    if (this.element.tagName === 'A') {
      this.element.href = href;
    }
    this.options.href = href;
    return this;
  }

  setOnClick(onClick) {
    // Remove old listener if exists
    if (this.options.onClick) {
      this.element.removeEventListener('click', this.options.onClick);
    }

    this.options.onClick = onClick;

    if (onClick) {
      this.element.addEventListener('click', onClick);
    }

    return this;
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

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }

  getElement() {
    return this.element;
  }

  getAvatar() {
    return this.avatar;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeadlessAvatar, HeadlessAvatarButton };
}
