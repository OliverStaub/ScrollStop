// Unit tests for TimerTracker module
const path = require('path');

const TimerTrackerPath = path.join(__dirname, '../../Shared (Extension)/Resources/modules/timer-tracker/timer-tracker.js');
let TimerTracker;

// Mock GlassmorphismTimer
global.GlassmorphismTimer = jest.fn().mockImplementation(() => ({
  render: jest.fn(),
  setTime: jest.fn(),
  element: document.createElement('div'),
}));

describe('TimerTracker', () => {
  let timerTracker;

  beforeEach(async () => {
    // Reset global state
    delete global.window.TimerTracker;
    
    // Load the module
    const moduleCode = require('fs').readFileSync(TimerTrackerPath, 'utf8');
    eval(moduleCode);
    TimerTracker = global.window.TimerTracker;
    
    // Create fresh instance for each test
    timerTracker = new TimerTracker();
    
    // Mock current date
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000);
    jest.spyOn(Date.prototype, 'toDateString').mockReturnValue('2022-01-01');
  });

  afterEach(() => {
    if (timerTracker) {
      timerTracker.cleanup();
    }
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize timer tracker in social media mode', async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2022-01-01',
        scrollstop_accumulated_time: 0,
      });

      await timerTracker.initialize(false);

      expect(timerTracker.isNewsMode).toBe(false);
      expect(timerTracker.isActive).toBe(true);
      expect(GlassmorphismTimer).toHaveBeenCalled();
    });

    test('should initialize timer tracker in news mode', async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2022-01-01',
        scrollstop_accumulated_time: 0,
      });

      await timerTracker.initialize(true);

      expect(timerTracker.isNewsMode).toBe(true);
      expect(timerTracker.isActive).toBe(true);
    });

    test('should reset accumulated time for new day', async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2021-12-31', // Previous day
        scrollstop_accumulated_time: 3600, // 1 hour
      });

      await timerTracker.checkDailyReset();

      expect(browser.storage.local.set).toHaveBeenCalledWith({
        scrollstop_accumulated_time: 0,
        scrollstop_last_reset_date: '2022-01-01',
      });
      expect(timerTracker.accumulatedTime).toBe(0);
    });
  });

  describe('Time Tracking', () => {
    beforeEach(async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2022-01-01',
        scrollstop_accumulated_time: 1800, // 30 minutes
      });
      await timerTracker.initialize(false);
    });

    test('should start tracking time', () => {
      expect(timerTracker.isActive).toBe(true);
      expect(timerTracker.startTime).toBe(1640995200000);
      expect(setInterval).toHaveBeenCalled();
    });

    test('should update timer display', () => {
      // Simulate 60 seconds passing
      const mockTimer = timerTracker.timer;
      jest.spyOn(Date, 'now').mockReturnValue(1640995260000); // +60 seconds

      timerTracker.updateTimerDisplay();

      expect(mockTimer.setTime).toHaveBeenCalledWith(1860); // 30 minutes + 60 seconds
    });

    test('should stop tracking and save time', async () => {
      // Simulate 120 seconds of tracking
      jest.spyOn(Date, 'now').mockReturnValue(1640995320000); // +120 seconds

      await timerTracker.stopTracking();

      expect(timerTracker.isActive).toBe(false);
      expect(timerTracker.accumulatedTime).toBe(1920); // 30 minutes + 120 seconds
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        scrollstop_accumulated_time: 1920,
      });
    });

    test('should add news time when in news mode', async () => {
      // Setup news mode
      timerTracker.isNewsMode = true;
      
      // Mock TimeManager
      global.TimeManager = {
        addNewsTime: jest.fn().mockResolvedValue(false),
      };

      // Simulate 120 seconds of tracking
      jest.spyOn(Date, 'now').mockReturnValue(1640995320000); // +120 seconds

      await timerTracker.stopTracking();

      expect(TimeManager.addNewsTime).toHaveBeenCalledWith(120000); // 120 seconds in ms
    });

    test('should trigger news limit exceeded event', async () => {
      timerTracker.isNewsMode = true;
      
      global.TimeManager = {
        addNewsTime: jest.fn().mockResolvedValue(true), // Limit exceeded
      };

      jest.spyOn(Date, 'now').mockReturnValue(1640995320000);

      await timerTracker.stopTracking();

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'news-time-limit-exceeded',
        })
      );
    });
  });

  describe('Timer Visibility & Interaction', () => {
    beforeEach(async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2022-01-01',
        scrollstop_accumulated_time: 0,
      });
      await timerTracker.initialize(false);
    });

    test('should hide timer on click', async () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'scrollstop-timer-container';
      document.getElementById.mockReturnValue(mockContainer);

      await timerTracker.handleTimerClick();

      expect(timerTracker.isVisible).toBe(false);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        scrollstop_timer_visible: false,
      });
    });

    test('should not hide timer immediately after dragging', async () => {
      timerTracker.hasDragged = true;
      timerTracker.mouseDownTime = Date.now() - 100;

      await timerTracker.handleTimerClick();

      expect(timerTracker.isVisible).toBe(true);
      expect(timerTracker.hasDragged).toBe(false);
    });

    test('should set timer-only mode', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'scrollstop-timer-container';
      document.getElementById.mockReturnValue(mockContainer);

      timerTracker.setTimerOnlyMode(true);

      expect(timerTracker.isTimerOnlyMode).toBe(true);
      expect(mockContainer.style.opacity).toBe('0.9');
      expect(mockContainer.title).toBe('Timer Only Mode - Tracking time without blocking');
    });
  });

  describe('Drag Functionality', () => {
    beforeEach(async () => {
      browser.storage.local.get.mockResolvedValue({
        scrollstop_last_reset_date: '2022-01-01',
        scrollstop_accumulated_time: 0,
      });
      await timerTracker.initialize(false);
    });

    test('should start dragging on mouse move', () => {
      const mockEvent = {
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: jest.fn(),
      };

      timerTracker.handleMouseDown(mockEvent);

      expect(timerTracker.dragOffset).toEqual({ x: 100, y: 100 });
      expect(timerTracker.initialMousePos).toEqual({ x: 100, y: 100 });
      expect(document.addEventListener).toHaveBeenCalledWith('mousemove', timerTracker.handleMouseMove);
    });

    test('should update position during drag', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'scrollstop-timer-container';
      mockContainer.offsetWidth = 100;
      mockContainer.offsetHeight = 50;
      document.getElementById.mockReturnValue(mockContainer);

      // Start dragging
      timerTracker.isDragging = true;
      timerTracker.dragOffset = { x: 50, y: 25 };

      const mockEvent = {
        clientX: 200,
        clientY: 150,
        preventDefault: jest.fn(),
      };

      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

      timerTracker.handleMouseMove(mockEvent);

      expect(mockContainer.style.left).toBe('150px'); // 200 - 50
      expect(mockContainer.style.top).toBe('125px'); // 150 - 25
    });

    test('should save position after drag ends', async () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'scrollstop-timer-container';
      mockContainer.style.left = '100px';
      mockContainer.style.top = '50px';
      document.getElementById.mockReturnValue(mockContainer);

      timerTracker.isDragging = true;

      await timerTracker.handleMouseUp({ preventDefault: jest.fn() });

      expect(browser.storage.local.set).toHaveBeenCalledWith({
        scrollstop_timer_position: {
          left: '100px',
          top: '50px',
          transform: '',
        },
      });
    });
  });

  describe('Cleanup', () => {
    test('should cleanup all resources', () => {
      const mockContainer = document.createElement('div');
      timerTracker.timer = { cleanup: jest.fn() };
      timerTracker.updateInterval = 123;
      document.getElementById.mockReturnValue(mockContainer);

      timerTracker.cleanup();

      expect(mockContainer.remove).toHaveBeenCalled();
      expect(clearInterval).toHaveBeenCalledWith(123);
      expect(window.removeEventListener).toHaveBeenCalled();
      expect(timerTracker.timer).toBeNull();
    });
  });

  describe('Current Total Time', () => {
    test('should calculate current total time', () => {
      timerTracker.accumulatedTime = 1800; // 30 minutes
      timerTracker.startTime = 1640995200000;
      timerTracker.isActive = true;
      
      jest.spyOn(Date, 'now').mockReturnValue(1640995320000); // +120 seconds

      const totalTime = timerTracker.getCurrentTotalTime();

      expect(totalTime).toBe(1920); // 30 minutes + 120 seconds
    });

    test('should return only accumulated time when not active', () => {
      timerTracker.accumulatedTime = 1800;
      timerTracker.isActive = false;

      const totalTime = timerTracker.getCurrentTotalTime();

      expect(totalTime).toBe(1800);
    });
  });
});