/**
 * Adult Sites Blocking Tests
 * Tests for the adult site detection and 4-hour blocking functionality
 */

const StorageHelper = require('../../Shared (Extension)/Resources/modules/utils/storage-helper.js');
const TimeManager = require('../../Shared (Extension)/Resources/modules/utils/time-manager.js');

// Mock browser.storage.local
global.browser = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
  },
};

// Mock window for event dispatching
global.window = {
  dispatchEvent: jest.fn(),
};

// Make StorageHelper available globally for TimeManager
global.StorageHelper = StorageHelper;

describe('Adult Sites Blocking', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Default mock implementations
    browser.storage.local.get.mockImplementation((keys, callback) => {
      const mockData = {
        adultSites: [
          'pornhub.com',
          'xvideos.com',
          'onlyfans.com',
          'baddiesonly.tv',
          'scrolller.com',
          'redtube.com',
          'youporn.com',
          'tube8.com',
          'spankbang.com',
          'xhamster.com',
          'beeg.com',
          'chaturbate.com',
          'cam4.com',
          'stripchat.com',
          'bongacams.com',
          'livejasmin.com',
          'camsoda.com',
          'manyvids.com',
          'clips4sale.com',
          'imlive.com',
          'flirt4free.com',
        ],
        blockedSites: ['facebook.com', 'twitter.com'],
        newsSites: ['cnn.com', 'bbc.com'],
        timeBlocks: {},
      };

      let result;
      if (typeof keys === 'string') {
        result = { [keys]: mockData[keys] };
      } else if (Array.isArray(keys)) {
        result = {};
        keys.forEach((key) => {
          result[key] = mockData[key];
        });
      } else {
        result = mockData;
      }

      // Support both callback and Promise patterns
      if (callback) {
        // Callback pattern (StorageHelper)
        callback(result);
      } else {
        // Promise pattern (TimeManager)
        return Promise.resolve(result);
      }
    });

    browser.storage.local.set.mockImplementation((data, callback) => {
      if (callback) {
        callback();
      } else {
        return Promise.resolve();
      }
    });

    browser.storage.local.remove.mockImplementation((keys, callback) => {
      if (callback) {
        callback();
      } else {
        return Promise.resolve();
      }
    });
  });

  describe('Adult Site Detection', () => {
    test('should detect adult sites correctly', async () => {
      const isAdult1 = await StorageHelper.isCurrentSiteAdult(
        'https://pornhub.com/video/123',
        'pornhub.com'
      );
      expect(isAdult1).toBe(true);

      const isAdult2 = await StorageHelper.isCurrentSiteAdult(
        'https://baddiesonly.tv/stream',
        'baddiesonly.tv'
      );
      expect(isAdult2).toBe(true);

      const isAdult3 = await StorageHelper.isCurrentSiteAdult(
        'https://google.com/search',
        'google.com'
      );
      expect(isAdult3).toBe(false);
    });

    test('should get current site type including adult sites', async () => {
      const siteType1 = await StorageHelper.getCurrentSiteType(
        'https://pornhub.com/video/123',
        'pornhub.com'
      );
      expect(siteType1).toEqual({
        isBlocked: false,
        isNews: false,
        isAdult: true,
      });

      const siteType2 = await StorageHelper.getCurrentSiteType(
        'https://facebook.com/feed',
        'facebook.com'
      );
      expect(siteType2).toEqual({
        isBlocked: true,
        isNews: false,
        isAdult: false,
      });

      const siteType3 = await StorageHelper.getCurrentSiteType('https://cnn.com/news', 'cnn.com');
      expect(siteType3).toEqual({
        isBlocked: false,
        isNews: true,
        isAdult: false,
      });
    });
  });

  describe('Adult Site Category Detection in TimeManager', () => {
    test('should get site category correctly', async () => {
      const category1 = await TimeManager.getSiteCategory('pornhub.com');
      expect(category1).toBe('adult');

      const category2 = await TimeManager.getSiteCategory('facebook.com');
      expect(category2).toBe('blocked');

      const category3 = await TimeManager.getSiteCategory('cnn.com');
      expect(category3).toBe('news');

      const category4 = await TimeManager.getSiteCategory('google.com');
      expect(category4).toBe(null);
    });

    test('should get correct block duration for adult sites', () => {
      const adultDuration = TimeManager.getBlockDuration('adult');
      expect(adultDuration).toBe(4 * 60 * 60 * 1000); // 4 hours

      const blockedDuration = TimeManager.getBlockDuration('blocked');
      expect(blockedDuration).toBe(60 * 60 * 1000); // 1 hour

      const newsDuration = TimeManager.getBlockDuration('news');
      expect(newsDuration).toBe(60 * 60 * 1000); // 1 hour
    });
  });

  describe('Adult Site Time Blocking', () => {
    test('should create 4-hour time block for adult sites', async () => {
      const hostname = 'pornhub.com';
      const startTime = Date.now();

      // Mock Date.now to return a fixed time
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => startTime);

      await TimeManager.createTimeBlock(hostname);

      // Verify the correct block was created
      expect(browser.storage.local.set).toHaveBeenCalledWith(
        {
          timeBlocks: {
            [hostname]: {
              timestamp: startTime,
              siteName: hostname,
              category: 'adult',
            },
          },
        },
        expect.any(Function)
      );

      // Verify event was dispatched with correct duration
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'time-block-created',
          detail: {
            hostname,
            timestamp: startTime,
            category: 'adult',
            duration: 4 * 60 * 60 * 1000, // 4 hours
          },
        })
      );

      // Restore Date.now
      Date.now = originalDateNow;
    });

    test('should check time block status with correct duration', async () => {
      const hostname = 'onlyfans.com';
      const blockTime = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago

      // Mock existing time block
      browser.storage.local.get.mockImplementation((keys, callback) => {
        let result;
        if (keys === 'timeBlocks' || (Array.isArray(keys) && keys.includes('timeBlocks'))) {
          result = {
            timeBlocks: {
              [hostname]: {
                timestamp: blockTime,
                siteName: hostname,
                category: 'adult',
              },
            },
          };
        } else if (
          Array.isArray(keys) &&
          (keys.includes('adultSites') ||
            keys.includes('blockedSites') ||
            keys.includes('newsSites'))
        ) {
          // Handle getSiteCategory call
          result = {
            adultSites: ['onlyfans.com'],
            blockedSites: ['facebook.com', 'twitter.com'],
            newsSites: ['cnn.com', 'bbc.com'],
          };
        } else {
          // Return adult sites data for other calls
          result = {
            adultSites: ['onlyfans.com'],
            blockedSites: [],
            newsSites: [],
          };
        }

        // Support both callback and Promise patterns
        if (callback) {
          callback(result);
        } else {
          return Promise.resolve(result);
        }
      });

      // Should still be blocked (only 2 hours passed out of 4)
      const isBlocked = await TimeManager.isTimeBlocked(hostname);
      expect(isBlocked).toBe(true);

      const remainingTime = await TimeManager.getRemainingTime(hostname);
      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(2 * 60 * 60 * 1000); // Less than 2 hours remaining
    });

    test('should remove expired adult site blocks', async () => {
      const hostname = 'xvideos.com';
      const expiredBlockTime = Date.now() - 5 * 60 * 60 * 1000; // 5 hours ago (expired)

      // Mock expired time block
      browser.storage.local.get.mockImplementation((keys, callback) => {
        let result;
        if (keys === 'timeBlocks' || (Array.isArray(keys) && keys.includes('timeBlocks'))) {
          result = {
            timeBlocks: {
              [hostname]: {
                timestamp: expiredBlockTime,
                siteName: hostname,
                category: 'adult',
              },
            },
          };
        } else if (
          Array.isArray(keys) &&
          (keys.includes('adultSites') ||
            keys.includes('blockedSites') ||
            keys.includes('newsSites'))
        ) {
          result = {
            adultSites: ['xvideos.com'],
            blockedSites: ['facebook.com', 'twitter.com'],
            newsSites: ['cnn.com', 'bbc.com'],
          };
        } else {
          result = {
            adultSites: ['xvideos.com'],
            blockedSites: [],
            newsSites: [],
          };
        }

        // Support both callback and Promise patterns
        if (callback) {
          callback(result);
        } else {
          return Promise.resolve(result);
        }
      });

      // Should not be blocked (5 hours > 4 hours)
      const isBlocked = await TimeManager.isTimeBlocked(hostname);
      expect(isBlocked).toBe(false);

      const remainingTime = await TimeManager.getRemainingTime(hostname);
      expect(remainingTime).toBe(0);
    });
  });

  describe('Adult Site Block Cleanup', () => {
    test('should clean up expired adult site blocks', async () => {
      const currentTime = Date.now();
      const expiredAdultBlock = currentTime - 5 * 60 * 60 * 1000; // 5 hours ago
      const activeAdultBlock = currentTime - 2 * 60 * 60 * 1000; // 2 hours ago
      const expiredSocialBlock = currentTime - 2 * 60 * 60 * 1000; // 2 hours ago (social media)

      // Mock multiple time blocks
      browser.storage.local.get.mockImplementation((keys, callback) => {
        let result;
        if (keys === 'timeBlocks' || (Array.isArray(keys) && keys.includes('timeBlocks'))) {
          result = {
            timeBlocks: {
              'pornhub.com': {
                timestamp: expiredAdultBlock,
                siteName: 'pornhub.com',
                category: 'adult',
              },
              'onlyfans.com': {
                timestamp: activeAdultBlock,
                siteName: 'onlyfans.com',
                category: 'adult',
              },
              'facebook.com': {
                timestamp: expiredSocialBlock,
                siteName: 'facebook.com',
                category: 'blocked',
              },
            },
          };
        } else if (
          Array.isArray(keys) &&
          (keys.includes('adultSites') ||
            keys.includes('blockedSites') ||
            keys.includes('newsSites'))
        ) {
          result = {
            adultSites: ['pornhub.com', 'onlyfans.com'],
            blockedSites: ['facebook.com'],
            newsSites: [],
          };
        } else {
          result = {
            adultSites: ['pornhub.com', 'onlyfans.com'],
            blockedSites: ['facebook.com'],
            newsSites: [],
          };
        }

        // Support both callback and Promise patterns
        if (callback) {
          callback(result);
        } else {
          return Promise.resolve(result);
        }
      });

      await TimeManager.cleanupExpiredBlocks();

      // Should have removed expired adult block and expired social block
      // But kept active adult block
      expect(browser.storage.local.set).toHaveBeenCalledWith(
        {
          timeBlocks: {
            'onlyfans.com': {
              timestamp: activeAdultBlock,
              siteName: 'onlyfans.com',
              category: 'adult',
            },
          },
        },
        expect.any(Function)
      );

      // Should have dispatched removal events
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'time-block-removed',
          detail: { hostname: 'pornhub.com' },
        })
      );

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'time-block-removed',
          detail: { hostname: 'facebook.com' },
        })
      );
    });
  });

  describe('Adult Sites Configuration', () => {
    test('should have comprehensive adult sites list', async () => {
      const adultSites = await StorageHelper.getAdultSites();

      // Check that we have a reasonable number of sites
      expect(adultSites.length).toBeGreaterThan(10);

      // Check for specific sites mentioned in requirements
      expect(adultSites).toContain('pornhub.com');
      expect(adultSites).toContain('onlyfans.com');
      expect(adultSites).toContain('baddiesonly.tv');
      expect(adultSites).toContain('scrolller.com');

      // Check for variety of site types
      expect(adultSites.some((site) => site.includes('xvideos'))).toBe(true);
      expect(adultSites.some((site) => site.includes('cam'))).toBe(true);
    });
  });

  describe('Integration with Choice Dialog', () => {
    test('should trigger choice dialog for adult sites', async () => {
      const siteType = await StorageHelper.getCurrentSiteType(
        'https://pornhub.com/video/123',
        'pornhub.com'
      );

      // Adult sites should trigger the choice dialog
      expect(siteType.isAdult).toBe(true);
      expect(siteType.isBlocked || siteType.isNews || siteType.isAdult).toBe(true);
    });
  });

  describe('Constants and Configuration', () => {
    test('should have correct adult block duration constant', () => {
      expect(TimeManager.ADULT_BLOCK_DURATION).toBe(4 * 60 * 60 * 1000);
      expect(TimeManager.ADULT_BLOCK_DURATION).toBeGreaterThan(TimeManager.BLOCK_DURATION);
      expect(TimeManager.ADULT_BLOCK_DURATION).toBeGreaterThan(TimeManager.NEWS_BLOCK_DURATION);
    });
  });
});
