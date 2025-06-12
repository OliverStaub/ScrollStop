// Unit tests for TimeManager module
const path = require('path');

// Import the TimeManager module
const TimeManagerPath = path.join(__dirname, '../../Shared (Extension)/Resources/modules/utils/time-manager.js');
let TimeManager;

describe('TimeManager', () => {
  beforeEach(async () => {
    // Reset global state
    delete global.window.TimeManager;
    
    // Mock current time
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000); // Fixed timestamp
    
    // Load the module
    const moduleCode = require('fs').readFileSync(TimeManagerPath, 'utf8');
    eval(moduleCode);
    TimeManager = global.window.TimeManager;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Social Media Time Blocks', () => {
    test('should create time block for hostname', async () => {
      const hostname = 'facebook.com';
      
      await TimeManager.createTimeBlock(hostname);
      
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        timeBlocks: {
          [hostname]: {
            timestamp: 1640995200000,
            siteName: hostname,
          },
        },
      });
    });

    test('should detect if site is time blocked', async () => {
      const hostname = 'facebook.com';
      const currentTime = 1640995200000;
      const blockTime = currentTime - (30 * 60 * 1000); // 30 minutes ago
      
      browser.storage.local.get.mockResolvedValueOnce({
        timeBlocks: {
          [hostname]: {
            timestamp: blockTime,
            siteName: hostname,
          },
        },
      });

      const isBlocked = await TimeManager.isTimeBlocked(hostname);
      expect(isBlocked).toBe(true);
    });

    test('should remove expired time blocks', async () => {
      const hostname = 'facebook.com';
      const currentTime = 1640995200000;
      const expiredTime = currentTime - (70 * 60 * 1000); // 70 minutes ago (expired)
      
      browser.storage.local.get.mockResolvedValueOnce({
        timeBlocks: {
          [hostname]: {
            timestamp: expiredTime,
            siteName: hostname,
          },
        },
      });

      const isBlocked = await TimeManager.isTimeBlocked(hostname);
      expect(isBlocked).toBe(false);
      expect(TimeManager.removeTimeBlock).toHaveBeenCalledWith(hostname);
    });

    test('should calculate remaining time correctly', async () => {
      const hostname = 'facebook.com';
      const currentTime = 1640995200000;
      const blockTime = currentTime - (30 * 60 * 1000); // 30 minutes ago
      
      browser.storage.local.get.mockResolvedValueOnce({
        timeBlocks: {
          [hostname]: {
            timestamp: blockTime,
            siteName: hostname,
          },
        },
      });

      const remainingTime = await TimeManager.getRemainingTime(hostname);
      const expectedRemaining = 30 * 60 * 1000; // 30 minutes remaining
      expect(remainingTime).toBe(expectedRemaining);
    });
  });

  describe('News Time Tracking', () => {
    test('should initialize news time data for new day', async () => {
      browser.storage.local.get.mockResolvedValueOnce({});
      
      const data = await TimeManager.getNewsTimeData();
      
      expect(data).toEqual({
        dailyStart: 1640995200000,
        totalTime: 0,
        blocked: false,
        blockedUntil: 0,
      });
    });

    test('should reset daily tracking for new day', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: yesterday,
          totalTime: 15 * 60 * 1000, // 15 minutes from yesterday
          blocked: false,
          blockedUntil: 0,
        },
      });
      
      const data = await TimeManager.getNewsTimeData();
      
      expect(data.totalTime).toBe(0); // Should reset
      expect(new Date(data.dailyStart).toDateString()).toBe(new Date().toDateString());
    });

    test('should create news time block when limit exceeded', async () => {
      const timeSpent = 21 * 60 * 1000; // 21 minutes (exceeds 20min limit)
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: Date.now(),
          totalTime: 0,
          blocked: false,
          blockedUntil: 0,
        },
      });

      const limitExceeded = await TimeManager.addNewsTime(timeSpent);
      
      expect(limitExceeded).toBe(true);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        newsTimeData: expect.objectContaining({
          blocked: true,
          blockedUntil: expect.any(Number),
        }),
      });
    });

    test('should not create block when under limit', async () => {
      const timeSpent = 10 * 60 * 1000; // 10 minutes (under 20min limit)
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: Date.now(),
          totalTime: 5 * 60 * 1000, // 5 minutes existing
          blocked: false,
          blockedUntil: 0,
        },
      });

      const limitExceeded = await TimeManager.addNewsTime(timeSpent);
      
      expect(limitExceeded).toBe(false);
      expect(browser.storage.local.set).toHaveBeenCalledWith({
        newsTimeData: expect.objectContaining({
          totalTime: 15 * 60 * 1000, // 5 + 10 = 15 minutes
          blocked: false,
        }),
      });
    });

    test('should check if news sites are blocked', async () => {
      const currentTime = 1640995200000;
      const blockTime = currentTime + (30 * 60 * 1000); // Blocked for 30 more minutes
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: currentTime,
          totalTime: 20 * 60 * 1000,
          blocked: true,
          blockedUntil: blockTime,
        },
      });

      const isBlocked = await TimeManager.isNewsTimeBlocked();
      expect(isBlocked).toBe(true);
    });

    test('should remove expired news blocks', async () => {
      const currentTime = 1640995200000;
      const expiredTime = currentTime - (10 * 60 * 1000); // Expired 10 minutes ago
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: currentTime,
          totalTime: 20 * 60 * 1000,
          blocked: true,
          blockedUntil: expiredTime,
        },
      });

      const isBlocked = await TimeManager.isNewsTimeBlocked();
      expect(isBlocked).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    test('should format time correctly', () => {
      expect(TimeManager.formatTime(65000)).toBe('1:05'); // 1 minute 5 seconds
      expect(TimeManager.formatTime(3661000)).toBe('61:01'); // 61 minutes 1 second
      expect(TimeManager.formatTime(5000)).toBe('0:05'); // 5 seconds
    });

    test('should get remaining news time', async () => {
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: Date.now(),
          totalTime: 15 * 60 * 1000, // 15 minutes used
          blocked: false,
          blockedUntil: 0,
        },
      });

      const remaining = await TimeManager.getRemainingNewsTime();
      expect(remaining).toBe(5 * 60 * 1000); // 5 minutes remaining
    });

    test('should get remaining news block time', async () => {
      const currentTime = 1640995200000;
      const blockUntil = currentTime + (45 * 60 * 1000); // 45 minutes remaining
      
      browser.storage.local.get.mockResolvedValueOnce({
        newsTimeData: {
          dailyStart: currentTime,
          totalTime: 20 * 60 * 1000,
          blocked: true,
          blockedUntil: blockUntil,
        },
      });

      const remaining = await TimeManager.getRemainingNewsBlockTime();
      expect(remaining).toBe(45 * 60 * 1000);
    });
  });
});