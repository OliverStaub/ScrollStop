// UIComponentsJs/swipe-cards.js
// Tinder-like swipeable card component for activity suggestions

class SwipeCards {
  constructor(cards, options = {}) {
    this.cards = cards || [];
    this.currentIndex = 0;
    this.options = {
      containerClass: options.containerClass || '',
      onSwipeRight: options.onSwipeRight || null,
      onSwipeLeft: options.onSwipeLeft || null,
      onComplete: options.onComplete || null,
      ...options,
    };

    this.element = null;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.offset = 0;

    // Bind methods
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  render(container) {
    if (!container) {
      throw new Error('Container element is required');
    }

    this.element = document.createElement('div');
    this.element.className = `swipe-cards-container ${this.options.containerClass}`;
    this.element.style.cssText = `
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      touch-action: none;
      user-select: none;
    `;

    this.createCards();
    this.setupEventListeners();

    container.appendChild(this.element);
    return this.element;
  }

  createCards() {
    if (!this.element) return;

    this.element.innerHTML = '';

    if (this.cards.length === 0) {
      this.showEmptyState();
      return;
    }

    // Create cards stack (show up to 3 cards)
    const visibleCards = this.cards.slice(this.currentIndex, this.currentIndex + 3);

    visibleCards.forEach((card, index) => {
      const cardElement = this.createCard(card, index);
      this.element.appendChild(cardElement);
    });

    // Add instructions
    this.addInstructions();
  }

  createCard(card, stackIndex) {
    const cardElement = document.createElement('div');
    cardElement.className = 'swipe-card';
    cardElement.dataset.stackIndex = stackIndex;

    const zIndex = 10 - stackIndex;
    const scale = 1 - stackIndex * 0.05;
    const yOffset = stackIndex * 10;

    cardElement.style.cssText = `
      position: absolute;
      top: ${yOffset}px;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 32px;
      cursor: grab;
      transform: scale(${scale});
      transform-origin: center;
      z-index: ${zIndex};
      transition: transform 0.3s ease, opacity 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    cardElement.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 24px; opacity: 0.8;">
        ${card.emoji}
      </div>
      <h3 style="
        font-size: 1.5rem; 
        font-weight: 600; 
        color: #1f2937; 
        margin: 0 0 16px 0;
        line-height: 1.3;
      ">
        ${card.text}
      </h3>
      ${
        card.description
          ? `
        <p style="
          font-size: 1rem; 
          color: #6b7280; 
          margin: 0;
          line-height: 1.5;
        ">
          ${card.description}
        </p>
      `
          : ''
      }
    `;

    // Only make the top card interactive
    if (stackIndex === 0) {
      this.makeCardInteractive(cardElement);
    }

    return cardElement;
  }

  makeCardInteractive(cardElement) {
    // Touch events
    cardElement.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    cardElement.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    cardElement.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    // Mouse events for desktop
    cardElement.addEventListener('mousedown', this.handleMouseDown);
    cardElement.addEventListener('mousemove', this.handleMouseMove);
    cardElement.addEventListener('mouseup', this.handleMouseUp);
    cardElement.addEventListener('mouseleave', this.handleMouseUp);

    // Prevent default drag behavior
    cardElement.addEventListener('dragstart', (e) => e.preventDefault());
  }

  addInstructions() {
    const instructions = document.createElement('div');
    instructions.className = 'swipe-instructions';
    instructions.style.cssText = `
      position: absolute;
      bottom: -60px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.9rem;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    `;

    instructions.innerHTML = `
      <span style="display: flex; align-items: center; gap: 8px;">
        ← <span style="color: #ef4444;">Pass</span>
      </span>
      <span style="font-weight: 500; color: #374151;">
        Swipe to choose
      </span>
      <span style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #10b981;">Do it!</span> →
      </span>
    `;

    this.element.appendChild(instructions);
  }

  showEmptyState() {
    this.element.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #6b7280;
        text-align: center;
      ">
        <div style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;">🎯</div>
        <p style="font-size: 1.1rem; margin: 0;">No more activities</p>
      </div>
    `;
  }

  setupEventListeners() {
    // Global mouse events for when dragging outside card
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleTouchStart(e) {
    this.isDragging = true;
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;

    e.target.style.cursor = 'grabbing';
    e.preventDefault();
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;

    this.updateCardPosition(e.target);
    e.preventDefault();
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.finishSwipe(e.target);
    e.target.style.cursor = 'grab';
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;

    e.target.style.cursor = 'grabbing';
    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    this.currentX = e.clientX;
    this.currentY = e.clientY;

    const topCard = this.element.querySelector('[data-stack-index="0"]');
    if (topCard) {
      this.updateCardPosition(topCard);
    }
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    const topCard = this.element.querySelector('[data-stack-index="0"]');
    if (topCard) {
      this.finishSwipe(topCard);
      topCard.style.cursor = 'grab';
    }
  }

  updateCardPosition(cardElement) {
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    // Limit vertical movement
    const limitedDeltaY = Math.max(-50, Math.min(50, deltaY));

    this.offset = deltaX;

    const rotation = deltaX * 0.1; // Subtle rotation
    const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 200);

    cardElement.style.transform = `translateX(${deltaX}px) translateY(${limitedDeltaY}px) rotate(${rotation}deg)`;
    cardElement.style.opacity = opacity;

    // Update visual feedback
    this.updateSwipeFeedback(deltaX);
  }

  updateSwipeFeedback(deltaX) {
    const threshold = 100;

    // Remove any existing feedback
    this.clearSwipeFeedback();

    if (Math.abs(deltaX) > threshold) {
      const feedback = document.createElement('div');
      feedback.className = 'swipe-feedback';
      feedback.style.cssText = `
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 2rem;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        transition: opacity 0.1s ease;
      `;

      if (deltaX > threshold) {
        // Swiping right (accept)
        feedback.style.right = '20px';
        feedback.style.color = '#10b981';
        feedback.textContent = 'DO IT! ✓';
      } else {
        // Swiping left (reject)
        feedback.style.left = '20px';
        feedback.style.color = '#ef4444';
        feedback.textContent = 'PASS ✗';
      }

      this.element.appendChild(feedback);
    }
  }

  clearSwipeFeedback() {
    const feedback = this.element.querySelector('.swipe-feedback');
    if (feedback) {
      feedback.remove();
    }
  }

  finishSwipe(cardElement) {
    const threshold = 100;
    const shouldSwipe = Math.abs(this.offset) > threshold;

    this.clearSwipeFeedback();

    if (shouldSwipe) {
      this.completeSwipe(cardElement, this.offset > 0 ? 'right' : 'left');
    } else {
      this.resetCard(cardElement);
    }

    this.offset = 0;
  }

  completeSwipe(cardElement, direction) {
    const finalX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const rotation = direction === 'right' ? 30 : -30;

    cardElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    cardElement.style.transform = `translateX(${finalX}px) rotate(${rotation}deg)`;
    cardElement.style.opacity = '0';

    // Get current card data
    const currentCard = this.cards[this.currentIndex];

    // Trigger callbacks
    if (direction === 'right' && this.options.onSwipeRight) {
      this.options.onSwipeRight(currentCard, this.currentIndex);
    } else if (direction === 'left' && this.options.onSwipeLeft) {
      this.options.onSwipeLeft(currentCard, this.currentIndex);
    }

    // Move to next card after animation
    setTimeout(() => {
      this.nextCard();
    }, 300);
  }

  resetCard(cardElement) {
    cardElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    cardElement.style.transform = 'translateX(0px) translateY(0px) rotate(0deg)';
    cardElement.style.opacity = '1';

    setTimeout(() => {
      cardElement.style.transition = '';
    }, 300);
  }

  nextCard() {
    this.currentIndex++;

    if (this.currentIndex >= this.cards.length) {
      // All cards swiped
      if (this.options.onComplete) {
        this.options.onComplete();
      }
      return;
    }

    // Recreate cards with new stack
    this.createCards();
  }

  // Public methods
  addCard(card) {
    this.cards.push(card);
    if (this.element && this.currentIndex >= this.cards.length - 1) {
      this.createCards();
    }
  }

  reset() {
    this.currentIndex = 0;
    if (this.element) {
      this.createCards();
    }
  }

  getCurrentCard() {
    return this.cards[this.currentIndex];
  }

  getRemainingCards() {
    return this.cards.slice(this.currentIndex);
  }

  destroy() {
    if (this.element) {
      // Remove global event listeners
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);

      // Remove element
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SwipeCards;
} else {
  window.SwipeCards = SwipeCards;
}
