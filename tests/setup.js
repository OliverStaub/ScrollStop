// Test setup file for Jest
// Mock browser APIs for testing

// Mock browser.storage API
global.browser = {
  storage: {
    local: {
      get: jest.fn().mockImplementation((keys) => {
        const mockData = {
          blockedSites: ['facebook.com', 'twitter.com', 'instagram.com'],
          newsSites: ['cnn.com', 'bbc.com', 'spiegel.de'],
          timeBlocks: {},
          newsTimeData: {
            dailyStart: Date.now(),
            totalTime: 0,
            blocked: false,
            blockedUntil: 0,
          },
          scrollstop_accumulated_time: 0,
          scrollstop_last_reset_date: new Date().toDateString(),
        };
        
        if (Array.isArray(keys)) {
          const result = {};
          keys.forEach(key => {
            if (mockData[key] !== undefined) {
              result[key] = mockData[key];
            }
          });
          return Promise.resolve(result);
        }
        return Promise.resolve(mockData);
      }),
      set: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  },
  runtime: {
    getURL: jest.fn().mockImplementation((path) => `chrome-extension://test/${path}`),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
};

// Mock chrome API as fallback
global.chrome = global.browser;

// Mock DOM APIs
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'facebook.com',
    href: 'https://facebook.com/feed',
    reload: jest.fn(),
  },
  writable: true,
});

// Mock document methods
global.document.createElement = jest.fn().mockImplementation((tagName) => {
  const element = {
    tagName: tagName.toUpperCase(),
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    },
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getAttribute: jest.fn(),
    setAttribute: jest.fn(),
    id: '',
    innerHTML: '',
    textContent: '',
    parentNode: null,
    children: [],
  };
  
  // Mock getBoundingClientRect for drag tests
  element.getBoundingClientRect = jest.fn().mockReturnValue({
    left: 0,
    top: 0,
    right: 100,
    bottom: 50,
    width: 100,
    height: 50,
  });
  
  return element;
});

global.document.getElementById = jest.fn();

// Create a proper HTMLElement for document.body
const mockBodyElement = {
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  innerHTML: '',
  style: {},
  tagName: 'BODY',
  nodeType: 1,
};

// Mock document.body properly for JSDOM
Object.defineProperty(document, 'body', {
  value: mockBodyElement,
  writable: true,
});

// Mock window methods
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
global.window.dispatchEvent = jest.fn();
global.window.CustomEvent = jest.fn().mockImplementation((type, options) => ({
  type,
  detail: options?.detail,
}));

// Mock performance.now for consistent timing in tests
global.performance = {
  now: jest.fn().mockReturnValue(Date.now()),
};

// Mock timers
global.setInterval = jest.fn().mockImplementation((_fn, _delay) => {
  const id = Math.random();
  // Don't actually call the function in tests unless explicitly needed
  return id;
});

global.clearInterval = jest.fn();

// Mock localStorage for fallback storage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Console spy setup for testing log outputs
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});