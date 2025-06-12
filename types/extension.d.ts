/**
 * TypeScript definitions for ScrollStop Safari Extension
 * Provides type safety for the extension's core modules and data structures
 */

// Global browser APIs
declare global {
  const browser: {
    storage: {
      local: {
        get(keys: string | string[] | null): Promise<{ [key: string]: any }>;
        set(items: { [key: string]: any }): Promise<void>;
      };
    };
    runtime: {
      getURL(path: string): string;
      onMessage: {
        addListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
        removeListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
      };
    };
  };

  const chrome: typeof browser;
}

// News Time Tracking Data
export interface NewsTimeData {
  dailyStart: number;
  totalTime: number;
  blocked: boolean;
  blockedUntil: number;
}

// Site Type Information
export interface SiteType {
  isBlocked: boolean;
  isNews: boolean;
}

// Time Block Information
export interface TimeBlockInfo {
  timestamp: number;
  siteName: string;
}

// Time Blocks Storage
export interface TimeBlocks {
  [hostname: string]: TimeBlockInfo;
}

// Sites Configuration
export interface SitesConfig {
  blockedSites: string[];
  newsSites: string[];
}

// Timer Tracker Storage Keys
export interface TimerStorageKeys {
  ACCUMULATED_TIME: string;
  LAST_RESET_DATE: string;
  TIMER_POSITION: string;
  TIMER_VISIBLE: string;
}

// Timer Position
export interface TimerPosition {
  left: string;
  top: string;
  transform: string;
}

// Drag State
export interface DragState {
  x: number;
  y: number;
}

// Choice Dialog Options
export interface ChoiceDialogOptions {
  siteTitle?: string;
  onChoiceMade?: (choice: string) => void;
}

// User Choice Types
export type UserChoice = 'continue' | 'timer-only' | 'block';

// Event Detail Types
export interface DoomscrollEventDetail {
  scrollDistance?: number;
  swipeCount?: number;
}

export interface TimeBlockEventDetail {
  hostname: string;
  timestamp?: number;
}

export interface NewsTimeLimitEventDetail {
  sessionTime: number;
}

export interface NewsTimeBlockEventDetail {
  blockedUntil: number;
}

// Component Configuration Interfaces
export interface DoomscrollDetectorConfig {
  scrollLimit: number;
  swipeLimit: number;
}

export interface DoomscrollAnimationConfig {
  flashInterval: number;
  screenDecayTime: number;
}

export interface TransitionScreenConfig {
  transitionDuration: number;
}

export interface BlockingScreenConfig {
  updateInterval: number;
}

export interface TimerTrackerConfig {
  width?: string;
  height?: string;
  fontSize?: string;
  padding?: string;
  clickToToggle?: boolean;
  onClick?: (event: Event) => void;
}

// Module Class Interfaces
export interface ITimeManager {
  isTimeBlocked(hostname: string): Promise<boolean>;
  createTimeBlock(hostname: string): Promise<void>;
  removeTimeBlock(hostname: string): Promise<void>;
  getRemainingTime(hostname: string): Promise<number>;
  formatTime(milliseconds: number): string;
  cleanupExpiredBlocks(): Promise<void>;

  // News time methods
  getNewsTimeData(): Promise<NewsTimeData>;
  setNewsTimeData(data: NewsTimeData): Promise<void>;
  isNewsTimeBlocked(): Promise<boolean>;
  createNewsTimeBlock(): Promise<void>;
  removeNewsTimeBlock(): Promise<void>;
  addNewsTime(timeSpent: number): Promise<boolean>;
  getRemainingNewsTime(): Promise<number>;
  getRemainingNewsBlockTime(): Promise<number>;
  cleanupExpiredNewsBlocks(): Promise<void>;
}

export interface IStorageHelper {
  getBlockedSites(): Promise<string[]>;
  setBlockedSites(sites: string[]): Promise<void>;
  getNewsSites(): Promise<string[]>;
  setNewsSites(sites: string[]): Promise<void>;
  getTimeBlocks(): Promise<TimeBlocks>;
  setTimeBlocks(timeBlocks: TimeBlocks): Promise<void>;
  isCurrentSiteBlocked(url: string, hostname: string): Promise<boolean>;
  isCurrentSiteNews(url: string, hostname: string): Promise<boolean>;
  getCurrentSiteType(url: string, hostname: string): Promise<SiteType>;
}

export interface ITimerTracker {
  initialize(isNewsMode?: boolean): Promise<void>;
  checkDailyReset(): Promise<void>;
  loadAccumulatedTime(): Promise<void>;
  createTimer(): Promise<void>;
  startTracking(): void;
  stopTracking(): Promise<void>;
  updateTimerDisplay(): void;
  saveAccumulatedTime(): Promise<void>;
  cleanup(): void;
  getCurrentTotalTime(): number;
  setTimerOnlyMode(enabled: boolean): void;
  resetTimer(): Promise<void>;
  hideTimer(): Promise<void>;
  handleTimerClick(event?: Event): Promise<void>;
}

export interface IDoomscrollDetector {
  initialize(): void;
  destroy(): void;
  isActive(): boolean;
  getCurrentScrollDistance(): number;
  reset(): void;
}

export interface IBlockingScreen {
  show(): Promise<void>;
  cleanup(): void;
  isActive(): boolean;
  updateCountdown(): Promise<void>;
  refreshCountdown(): void;
}

export interface IChoiceDialog {
  show(): Promise<string>;
  cleanup(): void;
  clearSessionChoice(hostname: string): Promise<void>;
}

// Global Module Declarations
declare global {
  var TimeManager: ITimeManager;
  var StorageHelper: IStorageHelper;
  var TimerTracker: {
    new (): ITimerTracker;
  };
  var DoomscrollDetector: {
    new (config: DoomscrollDetectorConfig): IDoomscrollDetector;
  };
  var DoomscrollAnimation: {
    new (config: DoomscrollAnimationConfig): any;
  };
  var TransitionScreen: {
    new (config: TransitionScreenConfig): any;
  };
  var BlockingScreen: {
    new (config: BlockingScreenConfig): IBlockingScreen;
  };
  var ChoiceDialog: {
    new (options: ChoiceDialogOptions): IChoiceDialog;
  };
  var GlassmorphismTimer: {
    new (initialTime: number, config: TimerTrackerConfig): any;
  };
  var HeadlessDialog: {
    new (config: any): any;
  };
  var HeadlessButton: {
    new (text: string, config: any): any;
  };
  var HeadlessDialogTitle: {
    new (text: string): any;
  };
  var HeadlessDialogBody: {
    new (): any;
  };
}

// Custom Event Types
export interface ScrollStopCustomEvent extends CustomEvent {
  detail:
    | DoomscrollEventDetail
    | TimeBlockEventDetail
    | NewsTimeLimitEventDetail
    | NewsTimeBlockEventDetail;
}

// Storage Constants
export const STORAGE_KEYS = {
  BLOCKED_SITES: 'blockedSites',
  NEWS_SITES: 'newsSites',
  TIME_BLOCKS: 'timeBlocks',
  NEWS_TIME_DATA: 'newsTimeData',
  ACCUMULATED_TIME: 'scrollstop_accumulated_time',
  LAST_RESET_DATE: 'scrollstop_last_reset_date',
  TIMER_POSITION: 'scrollstop_timer_position',
  TIMER_VISIBLE: 'scrollstop_timer_visible',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  BLOCK_DURATION: 60 * 60 * 1000, // 60 minutes in milliseconds
  NEWS_TIME_LIMIT: 20 * 60 * 1000, // 20 minutes in milliseconds
  NEWS_BLOCK_DURATION: 60 * 60 * 1000, // 60 minutes in milliseconds
  DAILY_RESET_TIME: 0, // Midnight
} as const;

// Event Names
export const EVENT_NAMES = {
  DOOMSCROLL_DETECTED: 'doomscroll-detected',
  DOOMSCROLL_ANIMATION_COMPLETE: 'doomscroll-animation-complete',
  TRANSITION_SCREEN_COMPLETE: 'transition-screen-complete',
  TIME_BLOCK_CREATED: 'time-block-created',
  TIME_BLOCK_REMOVED: 'time-block-removed',
  NEWS_TIME_BLOCK_CREATED: 'news-time-block-created',
  NEWS_TIME_BLOCK_REMOVED: 'news-time-block-removed',
  NEWS_TIME_LIMIT_EXCEEDED: 'news-time-limit-exceeded',
  CHOICE_DIALOG_COMPLETE: 'choice-dialog-complete',
} as const;

export {};
