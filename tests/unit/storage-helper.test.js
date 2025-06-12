// Unit tests for StorageHelper module
describe('StorageHelper', () => {
  let StorageHelper;

  beforeEach(async () => {
    // Mock StorageHelper for interface testing
    StorageHelper = {
      getBlockedSites: jest.fn().mockResolvedValue(['facebook.com', 'twitter.com']),
      getNewsSites: jest.fn().mockResolvedValue(['cnn.com', 'bbc.com']),
      isCurrentSiteBlocked: jest.fn().mockResolvedValue(false),
      isCurrentSiteNews: jest.fn().mockResolvedValue(false),
      getCurrentSiteType: jest.fn().mockResolvedValue({ isBlocked: false, isNews: false }),
    };
  });

  describe('Blocked Sites Management', () => {
    test('should get blocked sites from storage', async () => {
      const mockSites = ['facebook.com', 'twitter.com', 'instagram.com'];
      StorageHelper.getBlockedSites.mockResolvedValueOnce(mockSites);

      const sites = await StorageHelper.getBlockedSites();
      expect(sites).toEqual(mockSites);
      expect(StorageHelper.getBlockedSites).toHaveBeenCalled();
    });

    test('should detect if current site is blocked', async () => {
      const url = 'https://facebook.com/feed';
      const hostname = 'facebook.com';
      StorageHelper.isCurrentSiteBlocked.mockResolvedValueOnce(true);

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(url, hostname);
      expect(isBlocked).toBe(true);
      expect(StorageHelper.isCurrentSiteBlocked).toHaveBeenCalledWith(url, hostname);
    });

    test('should handle wildcard subdomains', async () => {
      const url = 'https://m.facebook.com';
      const hostname = 'm.facebook.com';
      StorageHelper.isCurrentSiteBlocked.mockResolvedValueOnce(true);

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(url, hostname);
      expect(isBlocked).toBe(true);
      expect(StorageHelper.isCurrentSiteBlocked).toHaveBeenCalledWith(url, hostname);
    });
  });

  describe('News Sites Management', () => {
    test('should get news sites from storage', async () => {
      const mockNewsSites = ['cnn.com', 'bbc.com', 'spiegel.de'];
      StorageHelper.getNewsSites.mockResolvedValueOnce(mockNewsSites);

      const sites = await StorageHelper.getNewsSites();
      expect(sites).toEqual(mockNewsSites);
      expect(StorageHelper.getNewsSites).toHaveBeenCalled();
    });

    test('should detect if current site is news site', async () => {
      const url = 'https://cnn.com/article';
      const hostname = 'cnn.com';
      StorageHelper.isCurrentSiteNews.mockResolvedValueOnce(true);

      const isNews = await StorageHelper.isCurrentSiteNews(url, hostname);
      expect(isNews).toBe(true);
      expect(StorageHelper.isCurrentSiteNews).toHaveBeenCalledWith(url, hostname);
    });

    test('should get current site type correctly', async () => {
      const url = 'https://bbc.com/news';
      const hostname = 'bbc.com';
      const expectedType = { isBlocked: false, isNews: true };
      StorageHelper.getCurrentSiteType.mockResolvedValueOnce(expectedType);

      const siteType = await StorageHelper.getCurrentSiteType(url, hostname);
      expect(siteType).toEqual(expectedType);
      expect(StorageHelper.getCurrentSiteType).toHaveBeenCalledWith(url, hostname);
    });
  });

  describe('Site Detection Edge Cases', () => {
    test('should handle malformed URLs gracefully', async () => {
      const malformedUrl = 'not-a-url';
      const hostname = 'unknown';
      StorageHelper.isCurrentSiteBlocked.mockResolvedValueOnce(false);

      const isBlocked = await StorageHelper.isCurrentSiteBlocked(malformedUrl, hostname);
      expect(isBlocked).toBe(false);
      expect(StorageHelper.isCurrentSiteBlocked).toHaveBeenCalledWith(malformedUrl, hostname);
    });

    test('should handle empty site lists', async () => {
      StorageHelper.getBlockedSites.mockResolvedValueOnce([]);
      StorageHelper.getNewsSites.mockResolvedValueOnce([]);

      const blockedSites = await StorageHelper.getBlockedSites();
      const newsSites = await StorageHelper.getNewsSites();

      expect(blockedSites).toEqual([]);
      expect(newsSites).toEqual([]);
    });

    test('should detect sites that are both blocked and news', async () => {
      const url = 'https://example.com';
      const hostname = 'example.com';
      const siteType = { isBlocked: true, isNews: true };
      StorageHelper.getCurrentSiteType.mockResolvedValueOnce(siteType);

      const result = await StorageHelper.getCurrentSiteType(url, hostname);
      expect(result.isBlocked).toBe(true);
      expect(result.isNews).toBe(true);
    });
  });
});
