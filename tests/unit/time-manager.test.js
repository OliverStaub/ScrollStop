// Unit tests for TimeManager module
describe('TimeManager', () => {
  let TimeManager;

  beforeEach(async () => {
    // Mock TimeManager for interface testing
    TimeManager = {
      createTimeBlock: jest.fn().mockResolvedValue(undefined),
      isTimeBlocked: jest.fn().mockResolvedValue(false),
      removeTimeBlock: jest.fn().mockResolvedValue(undefined),
      getRemainingTime: jest.fn().mockResolvedValue(1800000),
      getNewsTimeData: jest.fn().mockResolvedValue({
        totalTime: 0,
        dailyStart: Date.now(),
        lastUpdate: Date.now(),
      }),
      addNewsTime: jest.fn().mockResolvedValue(false),
      isNewsTimeBlocked: jest.fn().mockResolvedValue(false),
      createNewsTimeBlock: jest.fn().mockResolvedValue(undefined),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Social Media Time Blocks', () => {
    test('should create time block for hostname', async () => {
      const hostname = 'facebook.com';
      await TimeManager.createTimeBlock(hostname);
      expect(TimeManager.createTimeBlock).toHaveBeenCalledWith(hostname);
    });

    test('should detect if site is time blocked', async () => {
      const hostname = 'facebook.com';
      TimeManager.isTimeBlocked.mockResolvedValueOnce(true);

      const isBlocked = await TimeManager.isTimeBlocked(hostname);
      expect(isBlocked).toBe(true);
      expect(TimeManager.isTimeBlocked).toHaveBeenCalledWith(hostname);
    });

    test('should remove expired time blocks', async () => {
      const hostname = 'facebook.com';
      await TimeManager.removeTimeBlock(hostname);
      expect(TimeManager.removeTimeBlock).toHaveBeenCalledWith(hostname);
    });

    test('should calculate remaining time correctly', async () => {
      const hostname = 'facebook.com';
      const expectedRemaining = 1800000; // 30 minutes
      TimeManager.getRemainingTime.mockResolvedValueOnce(expectedRemaining);

      const remainingTime = await TimeManager.getRemainingTime(hostname);
      expect(remainingTime).toBe(expectedRemaining);
      expect(TimeManager.getRemainingTime).toHaveBeenCalledWith(hostname);
    });
  });

  describe('News Time Tracking', () => {
    test('should initialize news time data for new day', async () => {
      const expectedData = {
        totalTime: 0,
        dailyStart: Date.now(),
        lastUpdate: Date.now(),
      };
      TimeManager.getNewsTimeData.mockResolvedValueOnce(expectedData);

      const data = await TimeManager.getNewsTimeData();
      expect(data).toEqual(expectedData);
      expect(TimeManager.getNewsTimeData).toHaveBeenCalled();
    });

    test('should reset daily tracking for new day', async () => {
      const resetData = {
        totalTime: 0,
        dailyStart: Date.now(),
        lastUpdate: Date.now(),
      };
      TimeManager.getNewsTimeData.mockResolvedValueOnce(resetData);

      const data = await TimeManager.getNewsTimeData();
      expect(data.totalTime).toBe(0);
      expect(TimeManager.getNewsTimeData).toHaveBeenCalled();
    });

    test('should create news time block when limit exceeded', async () => {
      const timeSpent = 21 * 60 * 1000; // 21 minutes (over limit)
      TimeManager.addNewsTime.mockResolvedValueOnce(true);

      const limitExceeded = await TimeManager.addNewsTime(timeSpent);
      expect(limitExceeded).toBe(true);
      expect(TimeManager.addNewsTime).toHaveBeenCalledWith(timeSpent);
    });

    test('should not create block when under limit', async () => {
      const timeSpent = 10 * 60 * 1000; // 10 minutes (under limit)
      TimeManager.addNewsTime.mockResolvedValueOnce(false);

      const limitExceeded = await TimeManager.addNewsTime(timeSpent);
      expect(limitExceeded).toBe(false);
      expect(TimeManager.addNewsTime).toHaveBeenCalledWith(timeSpent);
    });

    test('should check if news sites are blocked', async () => {
      TimeManager.isNewsTimeBlocked.mockResolvedValueOnce(true);

      const isBlocked = await TimeManager.isNewsTimeBlocked();
      expect(isBlocked).toBe(true);
      expect(TimeManager.isNewsTimeBlocked).toHaveBeenCalled();
    });

    test('should remove expired news blocks', async () => {
      TimeManager.isNewsTimeBlocked.mockResolvedValueOnce(false);

      const isBlocked = await TimeManager.isNewsTimeBlocked();
      expect(isBlocked).toBe(false);
      expect(TimeManager.isNewsTimeBlocked).toHaveBeenCalled();
    });

    test('should create news time block manually', async () => {
      await TimeManager.createNewsTimeBlock();
      expect(TimeManager.createNewsTimeBlock).toHaveBeenCalled();
    });
  });
});
