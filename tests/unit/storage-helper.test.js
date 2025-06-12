// Unit tests for StorageHelper module
const path = require('path');

const StorageHelperPath = path.join(
  __dirname,
  '../../Shared (Extension)/Resources/modules/utils/storage-helper.js'
);
let StorageHelper;

describe('StorageHelper', () => {
  beforeEach(async () => {
    // Reset global state
    delete global.window.StorageHelper;

    // Load the module
    const moduleCode = require('fs').readFileSync(StorageHelperPath, 'utf8');
    eval(moduleCode);
    StorageHelper = global.window.StorageHelper;
  });

  describe('Blocked Sites Management', () => {
    test('should get blocked sites from storage', async () => {
      const mockSites = ['facebook.com', 'twitter.com', 'instagram.com'];
      browser.storage.local.get.mockResolvedValueOnce({ blockedSites: mockSites });

      const sites = await StorageHelper.getBlockedSites();

      expect(browser.storage.local.get).toHaveBeenCalledWith(['blockedSites']);
      expect(sites).toEqual(mockSites);
    });

    test('should return empty array when no blocked sites stored', async () => {
      browser.storage.local.get.mockResolvedValueOnce({});

      const sites = await StorageHelper.getBlockedSites();

      expect(sites).toEqual([]);
    });

    test('should set blocked sites in storage', async () => {
      const mockSites = ['facebook.com', 'twitter.com'];

      await StorageHelper.setBlockedSites(mockSites);

      expect(browser.storage.local.set).toHaveBeenCalledWith({ blockedSites: mockSites });
    });

    test('should detect if current site is blocked', async () => {
      const mockSites = ['facebook.com', 'twitter.com', 'instagram.com'];
      browser.storage.local.get.mockResolvedValueOnce({ blockedSites: mockSites });

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(
        'https://facebook.com/feed',
        'facebook.com'
      );

      expect(isBlocked).toBe(true);
    });

    test('should handle sites with https prefix', async () => {
      const mockSites = ['https://facebook.com', 'twitter.com'];
      browser.storage.local.get.mockResolvedValueOnce({ blockedSites: mockSites });

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(
        'https://facebook.com/feed',
        'facebook.com'
      );

      expect(isBlocked).toBe(true);
    });

    test('should not detect unblocked sites', async () => {
      const mockSites = ['facebook.com', 'twitter.com'];
      browser.storage.local.get.mockResolvedValueOnce({ blockedSites: mockSites });

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(
        'https://google.com/search',
        'google.com'
      );

      expect(isBlocked).toBe(false);
    });
  });

  describe('News Sites Management', () => {
    test('should get news sites from storage', async () => {
      const mockNewsSites = ['cnn.com', 'bbc.com', 'spiegel.de'];
      browser.storage.local.get.mockResolvedValueOnce({ newsSites: mockNewsSites });

      const sites = await StorageHelper.getNewsSites();

      expect(browser.storage.local.get).toHaveBeenCalledWith(['newsSites']);
      expect(sites).toEqual(mockNewsSites);
    });

    test('should return empty array when no news sites stored', async () => {
      browser.storage.local.get.mockResolvedValueOnce({});

      const sites = await StorageHelper.getNewsSites();

      expect(sites).toEqual([]);
    });

    test('should detect if current site is news site', async () => {
      const mockNewsSites = ['cnn.com', 'bbc.com', 'spiegel.de'];
      browser.storage.local.get.mockResolvedValueOnce({ newsSites: mockNewsSites });

      const isNews = await StorageHelper.isCurrentSiteNews(
        'https://cnn.com/politics/article',
        'cnn.com'
      );

      expect(isNews).toBe(true);
    });

    test('should detect German news sites', async () => {
      const mockNewsSites = ['spiegel.de', 'zeit.de', 'faz.net'];
      browser.storage.local.get.mockResolvedValueOnce({ newsSites: mockNewsSites });

      const isNews = await StorageHelper.isCurrentSiteNews(
        'https://spiegel.de/politik/artikel',
        'spiegel.de'
      );

      expect(isNews).toBe(true);
    });

    test('should not detect non-news sites as news', async () => {
      const mockNewsSites = ['cnn.com', 'bbc.com'];
      browser.storage.local.get.mockResolvedValueOnce({ newsSites: mockNewsSites });

      const isNews = await StorageHelper.isCurrentSiteNews(
        'https://facebook.com/feed',
        'facebook.com'
      );

      expect(isNews).toBe(false);
    });
  });

  describe('Site Type Detection', () => {
    test('should get current site type for blocked site', async () => {
      browser.storage.local.get
        .mockResolvedValueOnceWith({ blockedSites: ['facebook.com'] })
        .mockResolvedValueOnceWith({ newsSites: ['cnn.com'] });

      const siteType = await StorageHelper.getCurrentSiteType(
        'https://facebook.com/feed',
        'facebook.com'
      );

      expect(siteType).toEqual({
        isBlocked: true,
        isNews: false,
      });
    });

    test('should get current site type for news site', async () => {
      browser.storage.local.get
        .mockResolvedValueOnceWith({ blockedSites: ['facebook.com'] })
        .mockResolvedValueOnceWith({ newsSites: ['cnn.com'] });

      const siteType = await StorageHelper.getCurrentSiteType(
        'https://cnn.com/politics',
        'cnn.com'
      );

      expect(siteType).toEqual({
        isBlocked: false,
        isNews: true,
      });
    });

    test('should get current site type for untracked site', async () => {
      browser.storage.local.get
        .mockResolvedValueOnceWith({ blockedSites: ['facebook.com'] })
        .mockResolvedValueOnceWith({ newsSites: ['cnn.com'] });

      const siteType = await StorageHelper.getCurrentSiteType(
        'https://google.com/search',
        'google.com'
      );

      expect(siteType).toEqual({
        isBlocked: false,
        isNews: false,
      });
    });

    test('should handle site that is both blocked and news (edge case)', async () => {
      // This shouldn't happen in practice, but test the logic
      browser.storage.local.get
        .mockResolvedValueOnceWith({ blockedSites: ['example.com'] })
        .mockResolvedValueOnceWith({ newsSites: ['example.com'] });

      const siteType = await StorageHelper.getCurrentSiteType('https://example.com', 'example.com');

      expect(siteType).toEqual({
        isBlocked: true,
        isNews: true,
      });
    });
  });

  describe('Time Blocks Management', () => {
    test('should get time blocks from storage', async () => {
      const mockTimeBlocks = {
        'facebook.com': { timestamp: Date.now(), siteName: 'facebook.com' },
      };
      browser.storage.local.get.mockResolvedValueOnce({ timeBlocks: mockTimeBlocks });

      const timeBlocks = await StorageHelper.getTimeBlocks();

      expect(browser.storage.local.get).toHaveBeenCalledWith(['timeBlocks']);
      expect(timeBlocks).toEqual(mockTimeBlocks);
    });

    test('should return empty object when no time blocks stored', async () => {
      browser.storage.local.get.mockResolvedValueOnce({});

      const timeBlocks = await StorageHelper.getTimeBlocks();

      expect(timeBlocks).toEqual({});
    });

    test('should set time blocks in storage', async () => {
      const mockTimeBlocks = {
        'facebook.com': { timestamp: Date.now(), siteName: 'facebook.com' },
      };

      await StorageHelper.setTimeBlocks(mockTimeBlocks);

      expect(browser.storage.local.set).toHaveBeenCalledWith({ timeBlocks: mockTimeBlocks });
    });
  });
});
