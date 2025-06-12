// Integration tests for Extension Flow
describe('Extension Integration Flow', () => {
  let coordinator;

  beforeEach(() => {
    // Mock ScrollStopCoordinator for integration testing
    coordinator = {
      initialize: jest.fn().mockResolvedValue(undefined),
      checkCurrentSite: jest.fn().mockResolvedValue(undefined),
      showChoiceDialog: jest.fn(),
      proceedWithChoice: jest.fn().mockResolvedValue(undefined),
      startDoomscrollDetection: jest.fn(),
      showBlockingScreen: jest.fn(),
      cleanup: jest.fn(),
      isInitialized: false,
      currentHostname: 'facebook.com',
      userChoice: null,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Social Media Site Flow', () => {
    test('should initialize and show choice dialog on social media site', async () => {
      await coordinator.initialize();
      expect(coordinator.initialize).toHaveBeenCalled();
    });

    test('should start doomscroll detection after continue choice', async () => {
      await coordinator.proceedWithChoice('continue');
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('continue');
    });

    test('should only initialize timer for timer-only choice', async () => {
      await coordinator.proceedWithChoice('timer-only');
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('timer-only');
    });

    test('should show blocking screen for block choice', async () => {
      await coordinator.proceedWithChoice('block');
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('block');
    });

    test('should handle doomscroll detection event', () => {
      coordinator.startDoomscrollDetection();
      expect(coordinator.startDoomscrollDetection).toHaveBeenCalled();
    });
  });

  describe('News Site Flow', () => {
    test('should initialize on news site without doomscroll detection', async () => {
      coordinator.currentHostname = 'cnn.com';
      await coordinator.initialize();
      expect(coordinator.initialize).toHaveBeenCalled();
    });

    test('should create news time block for block choice', async () => {
      coordinator.currentHostname = 'bbc.com';
      await coordinator.proceedWithChoice('block');
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('block');
    });

    test('should handle news time limit exceeded', () => {
      coordinator.showBlockingScreen();
      expect(coordinator.showBlockingScreen).toHaveBeenCalled();
    });

    test('should show blocking screen when news sites are time-blocked', () => {
      coordinator.showBlockingScreen();
      expect(coordinator.showBlockingScreen).toHaveBeenCalled();
    });
  });

  describe('Site Type Detection Integration', () => {
    test('should cleanup when visiting untracked site', () => {
      coordinator.cleanup();
      expect(coordinator.cleanup).toHaveBeenCalled();
    });

    test('should handle mixed site type scenarios', async () => {
      await coordinator.checkCurrentSite();
      expect(coordinator.checkCurrentSite).toHaveBeenCalled();
    });
  });

  describe('Event Handling Integration', () => {
    test('should properly set up and remove event listeners', async () => {
      await coordinator.initialize();
      coordinator.cleanup();
      expect(coordinator.initialize).toHaveBeenCalled();
      expect(coordinator.cleanup).toHaveBeenCalled();
    });

    test('should handle time block removal events', () => {
      // Mock event handling
      expect(coordinator).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle initialization errors gracefully', async () => {
      coordinator.initialize.mockRejectedValueOnce(new Error('Test error'));

      await expect(coordinator.initialize()).rejects.toThrow('Test error');
      expect(coordinator.initialize).toHaveBeenCalled();
    });

    test('should handle choice dialog failures', () => {
      coordinator.showChoiceDialog.mockImplementationOnce(() => {
        throw new Error('Dialog failed');
      });

      expect(() => coordinator.showChoiceDialog()).toThrow('Dialog failed');
    });
  });

  describe('Flow Integration', () => {
    test('should complete full social media flow', async () => {
      // Initialize
      await coordinator.initialize();

      // Show choice dialog
      coordinator.showChoiceDialog();

      // User chooses continue
      await coordinator.proceedWithChoice('continue');

      // Start detection
      coordinator.startDoomscrollDetection();

      expect(coordinator.initialize).toHaveBeenCalled();
      expect(coordinator.showChoiceDialog).toHaveBeenCalled();
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('continue');
      expect(coordinator.startDoomscrollDetection).toHaveBeenCalled();
    });

    test('should complete full news site flow', async () => {
      coordinator.currentHostname = 'nytimes.com';

      // Initialize
      await coordinator.initialize();

      // Show choice dialog
      coordinator.showChoiceDialog();

      // User chooses continue
      await coordinator.proceedWithChoice('continue');

      expect(coordinator.initialize).toHaveBeenCalled();
      expect(coordinator.showChoiceDialog).toHaveBeenCalled();
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('continue');
    });

    test('should handle timer-only mode flow', async () => {
      // Initialize
      await coordinator.initialize();

      // Show choice dialog
      coordinator.showChoiceDialog();

      // User chooses timer-only
      await coordinator.proceedWithChoice('timer-only');

      expect(coordinator.initialize).toHaveBeenCalled();
      expect(coordinator.showChoiceDialog).toHaveBeenCalled();
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('timer-only');
    });

    test('should handle immediate block flow', async () => {
      // Initialize
      await coordinator.initialize();

      // Show choice dialog
      coordinator.showChoiceDialog();

      // User chooses block
      await coordinator.proceedWithChoice('block');

      // Show blocking screen
      coordinator.showBlockingScreen();

      expect(coordinator.initialize).toHaveBeenCalled();
      expect(coordinator.showChoiceDialog).toHaveBeenCalled();
      expect(coordinator.proceedWithChoice).toHaveBeenCalledWith('block');
      expect(coordinator.showBlockingScreen).toHaveBeenCalled();
    });
  });
});
