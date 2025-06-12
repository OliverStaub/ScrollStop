// Integration tests for extension flow
const path = require('path');

// Mock all modules for integration testing
const mockBrowser = {
  storage: { local: { get: jest.fn(), set: jest.fn() } },
  runtime: { getURL: jest.fn(), onMessage: { addListener: jest.fn() } },
};

global.browser = mockBrowser;
global.chrome = mockBrowser;

describe('Extension Integration Flow', () => {
  let ScrollStopCoordinator;
  let coordinator;

  beforeEach(async () => {
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Reset global state
    delete global.window.ScrollStopCoordinator;
    delete global.window.TimeManager;
    delete global.window.StorageHelper;

    // Mock window location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'facebook.com',
        href: 'https://facebook.com/feed',
        reload: jest.fn(),
      },
      writable: true,
    });

    // Load required modules
    const timeManagerCode = require('fs').readFileSync(
      path.join(__dirname, '../../Shared (Extension)/Resources/modules/utils/time-manager.js'),
      'utf8'
    );
    const storageHelperCode = require('fs').readFileSync(
      path.join(__dirname, '../../Shared (Extension)/Resources/modules/utils/storage-helper.js'),
      'utf8'
    );
    const contentCode = require('fs').readFileSync(
      path.join(__dirname, '../../Shared (Extension)/Resources/content.js'),
      'utf8'
    );

    // Mock required dependencies
    global.ChoiceDialog = jest.fn().mockImplementation(() => ({
      show: jest.fn().mockResolvedValue('continue'),
      cleanup: jest.fn(),
      clearSessionChoice: jest.fn(),
    }));

    global.DoomscrollDetector = jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
      destroy: jest.fn(),
      isActive: jest.fn().mockReturnValue(false),
    }));

    global.TimerTracker = jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
      cleanup: jest.fn(),
      setTimerOnlyMode: jest.fn(),
    }));

    global.BlockingScreen = jest.fn().mockImplementation(() => ({
      show: jest.fn(),
      cleanup: jest.fn(),
    }));

    // Evaluate modules
    eval(timeManagerCode);
    eval(storageHelperCode);
    eval(contentCode);

    ScrollStopCoordinator = global.window.ScrollStopCoordinator || global.ScrollStopCoordinator;
    coordinator = new ScrollStopCoordinator();
  });

  afterEach(() => {
    if (coordinator) {
      coordinator.cleanup();
    }
    jest.clearAllMocks();
  });

  describe('Social Media Site Flow', () => {
    beforeEach(() => {
      // Mock social media site detection
      mockBrowser.storage.local.get.mockImplementation((keys) => {
        if (keys.includes('blockedSites')) {
          return Promise.resolve({ blockedSites: ['facebook.com', 'twitter.com'] });
        }
        if (keys.includes('newsSites')) {
          return Promise.resolve({ newsSites: ['cnn.com', 'bbc.com'] });
        }
        if (keys.includes('timeBlocks')) {
          return Promise.resolve({ timeBlocks: {} });
        }
        return Promise.resolve({});
      });
    });

    test('should initialize and show choice dialog on social media site', async () => {
      await coordinator.initialize();

      expect(coordinator.isInitialized).toBe(true);
      expect(ChoiceDialog).toHaveBeenCalled();
    });

    test('should start doomscroll detection after continue choice', async () => {
      global.ChoiceDialog.mockImplementation(() => ({
        show: jest.fn().mockResolvedValue('continue'),
        cleanup: jest.fn(),
        clearSessionChoice: jest.fn(),
      }));

      await coordinator.initialize();
      await coordinator.proceedWithChoice('continue');

      expect(TimerTracker).toHaveBeenCalled();
      expect(DoomscrollDetector).toHaveBeenCalled();
    });

    test('should only initialize timer for timer-only choice', async () => {
      await coordinator.initialize();
      await coordinator.proceedWithChoice('timer-only');

      expect(TimerTracker).toHaveBeenCalled();
      expect(DoomscrollDetector).not.toHaveBeenCalled();
    });

    test('should show blocking screen for block choice', async () => {
      await coordinator.initialize();
      await coordinator.proceedWithChoice('block');

      expect(TimerTracker).toHaveBeenCalled();
      expect(BlockingScreen).toHaveBeenCalled();
    });

    test('should handle doomscroll detection event', async () => {
      await coordinator.initialize();

      // Mock TimeManager methods
      global.TimeManager.createTimeBlock = jest.fn();

      // Mock DoomscrollAnimation
      global.DoomscrollAnimation = jest.fn().mockImplementation(() => ({
        startAnimation: jest.fn(),
      }));

      const event = new CustomEvent('doomscroll-detected');
      await coordinator.handleDoomscrollDetected(event);

      expect(TimeManager.createTimeBlock).toHaveBeenCalledWith('facebook.com');
      expect(DoomscrollAnimation).toHaveBeenCalled();
    });
  });

  describe('News Site Flow', () => {
    beforeEach(() => {
      // Mock news site
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'cnn.com',
          href: 'https://cnn.com/politics',
          reload: jest.fn(),
        },
        writable: true,
      });

      coordinator.currentHostname = 'cnn.com';

      // Mock news site detection
      mockBrowser.storage.local.get.mockImplementation((keys) => {
        if (keys.includes('blockedSites')) {
          return Promise.resolve({ blockedSites: ['facebook.com', 'twitter.com'] });
        }
        if (keys.includes('newsSites')) {
          return Promise.resolve({ newsSites: ['cnn.com', 'bbc.com'] });
        }
        if (keys.includes('timeBlocks')) {
          return Promise.resolve({ timeBlocks: {} });
        }
        if (keys.includes('newsTimeData')) {
          return Promise.resolve({
            newsTimeData: {
              dailyStart: Date.now(),
              totalTime: 0,
              blocked: false,
              blockedUntil: 0,
            },
          });
        }
        return Promise.resolve({});
      });
    });

    test('should initialize on news site without doomscroll detection', async () => {
      await coordinator.initialize();
      await coordinator.proceedWithChoice('continue');

      expect(TimerTracker).toHaveBeenCalledWith();
      expect(coordinator.timerTracker.initialize).toHaveBeenCalledWith(true); // News mode
      expect(DoomscrollDetector).not.toHaveBeenCalled();
    });

    test('should create news time block for block choice', async () => {
      global.TimeManager.createNewsTimeBlock = jest.fn();

      await coordinator.initialize();
      await coordinator.proceedWithChoice('block');

      expect(TimeManager.createNewsTimeBlock).toHaveBeenCalled();
      expect(BlockingScreen).toHaveBeenCalled();
    });

    test('should handle news time limit exceeded', async () => {
      await coordinator.initialize();

      const event = new CustomEvent('news-time-limit-exceeded', {
        detail: { sessionTime: 1200000 }, // 20 minutes
      });

      await coordinator.handleNewsTimeLimitExceeded(event);

      expect(BlockingScreen).toHaveBeenCalled();
    });

    test('should show blocking screen when news sites are time-blocked', async () => {
      // Mock news sites already blocked
      mockBrowser.storage.local.get.mockImplementation((keys) => {
        if (keys.includes('newsTimeData')) {
          return Promise.resolve({
            newsTimeData: {
              dailyStart: Date.now(),
              totalTime: 20 * 60 * 1000, // 20 minutes
              blocked: true,
              blockedUntil: Date.now() + 60 * 60 * 1000, // 1 hour from now
            },
          });
        }
        return Promise.resolve({
          blockedSites: ['facebook.com'],
          newsSites: ['cnn.com'],
          timeBlocks: {},
        });
      });

      global.TimeManager.isNewsTimeBlocked = jest.fn().mockResolvedValue(true);

      await coordinator.initialize();

      expect(BlockingScreen).toHaveBeenCalled();
    });
  });

  describe('Site Type Detection Integration', () => {
    test('should cleanup when visiting untracked site', async () => {
      // Mock untracked site
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'google.com',
          href: 'https://google.com/search',
          reload: jest.fn(),
        },
        writable: true,
      });

      coordinator.currentHostname = 'google.com';

      mockBrowser.storage.local.get.mockResolvedValue({
        blockedSites: ['facebook.com'],
        newsSites: ['cnn.com'],
      });

      const cleanupSpy = jest.spyOn(coordinator, 'cleanup');

      await coordinator.initialize();

      expect(cleanupSpy).toHaveBeenCalled();
    });

    test('should handle mixed site type scenarios', async () => {
      // Test various site combinations
      const testCases = [
        {
          hostname: 'facebook.com',
          expectedBlocked: true,
          expectedNews: false,
        },
        {
          hostname: 'cnn.com',
          expectedBlocked: false,
          expectedNews: true,
        },
        {
          hostname: 'google.com',
          expectedBlocked: false,
          expectedNews: false,
        },
      ];

      mockBrowser.storage.local.get.mockImplementation((_keys) => {
        return Promise.resolve({
          blockedSites: ['facebook.com', 'twitter.com'],
          newsSites: ['cnn.com', 'bbc.com'],
        });
      });

      for (const testCase of testCases) {
        const siteType = await global.StorageHelper.getCurrentSiteType(
          `https://${testCase.hostname}`,
          testCase.hostname
        );

        expect(siteType.isBlocked).toBe(testCase.expectedBlocked);
        expect(siteType.isNews).toBe(testCase.expectedNews);
      }
    });
  });

  describe('Event Handling Integration', () => {
    test('should properly set up and remove event listeners', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      coordinator.setupEventListeners();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'doomscroll-detected',
        coordinator.handleDoomscrollDetected
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'news-time-limit-exceeded',
        coordinator.handleNewsTimeLimitExceeded
      );

      coordinator.cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'doomscroll-detected',
        coordinator.handleDoomscrollDetected
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'news-time-limit-exceeded',
        coordinator.handleNewsTimeLimitExceeded
      );
    });

    test('should handle time block removal events', async () => {
      const reloadSpy = jest.spyOn(window.location, 'reload');

      const event = new CustomEvent('time-block-removed', {
        detail: { hostname: 'facebook.com' },
      });

      coordinator.handleTimeBlockRemoved(event);

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle initialization errors gracefully', async () => {
      // Mock storage error
      mockBrowser.storage.local.get.mockRejectedValue(new Error('Storage error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await coordinator.initialize();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error initializing ScrollStop coordinator:',
        expect.any(Error)
      );
      expect(coordinator.isInitialized).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    test('should handle choice dialog failures', async () => {
      global.ChoiceDialog.mockImplementation(() => {
        throw new Error('Dialog creation failed');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      coordinator.showChoiceDialog();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
