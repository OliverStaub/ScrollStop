# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL GIT WORKFLOW RULES 🚨

**BEFORE ANY CODE CHANGES:**

1. ✅ **CHECK CURRENT BRANCH**: Run `git branch --show-current` - MUST NOT be "main"
2. ✅ **CREATE FEATURE BRANCH**: If on main, run `git checkout -b feature/descriptive-name`
3. ✅ **VERIFY BRANCH**: Confirm you're on feature branch before any commits

**BEFORE ANY COMMIT:**

1. ✅ **RUN PRECOMMIT**: Always run `npm run precommit` first
2. ✅ **VERIFY BRANCH**: Run `git branch --show-current` - MUST be feature branch
3. ✅ **COMMIT & PUSH**: Commit to feature branch, then push
4. ✅ **CREATE PR**: Use GitHub to create pull request for CI validation

**NEVER COMMIT DIRECTLY TO MAIN BRANCH - This violates the established workflow and bypasses CI validation.**

## Project Overview

ScrollStop is a Safari Web Extension that prevents doomscrolling and excessive browsing across three categories of sites: social media, news, and adult content. It monitors scroll behavior and implements intelligent blocking mechanisms with category-specific durations.

## Build Commands

This is an Xcode project with no external dependencies. Build using:

- **Build for macOS**: Open `ScrollStop.xcodeproj` in Xcode and build the "ScrollStop (macOS)" scheme
- **Build for iOS**: Open `ScrollStop.xcodeproj` in Xcode and build the "ScrollStop (iOS)" scheme

The project generates both host applications and Safari extensions for each platform.

## Architecture

### Multi-Platform Structure

- **Shared (App)**: Common app resources (HTML, CSS, JS, assets) used by both iOS and macOS host apps
- **Shared (Extension)**: Safari extension code shared between platforms
- **iOS (App)** + **macOS (App)**: Platform-specific host applications
- **iOS (Extension)** + **macOS (Extension)**: Platform-specific extension configurations

### Extension Architecture

The extension uses a modular event-driven architecture:

**Core Modules:**

- `content.js` - Main coordinator (`ScrollStopCoordinator`) that orchestrates all modules
- `background.js` - Loads all site categories from `sites.json` and handles extension lifecycle
- `SafariWebExtensionHandler.swift` - Native Swift handler for browser-native communication

**Detection & Blocking Modules:**

- `doomscroll-detector.js` - Monitors scroll distance (4000px threshold)
- `doomscroll-animation.js` - Warning animation when limit exceeded
- `transition-screen.js` - Transition between detection and blocking
- `blocking-screen.js` - Full-page block screen with countdown timer

**Utility Modules:**

- `storage-helper.js` - Browser storage management with multi-category site detection
- `time-manager.js` - Category-aware time-based blocking logic with variable durations

### Event Flow

1. **Detection**: `DoomscrollDetector` monitors scroll distance → fires `doomscroll-detected` event
2. **Warning**: `DoomscrollAnimation` shows decay animation → fires `doomscroll-animation-complete`
3. **Transition**: `TransitionScreen` shows transition → fires `transition-screen-complete`
4. **Blocking**: `BlockingScreen` shows countdown until time block expires → fires `time-block-removed`

### Key Design Patterns

- **Event-driven communication** between modules using custom DOM events
- **Modular initialization** with cleanup methods for each component
- **Shared configuration** through `sites.json` for blocked domains
- **Time-based blocking** with automatic removal and page reload

### Site Categories & Blocking Durations

ScrollStop monitors three distinct categories of sites with different blocking behaviors:

**1. Social Media Sites (60-minute blocks)**

- Facebook, Twitter/X, Instagram, Reddit, TikTok, YouTube, LinkedIn, etc.
- Triggers on excessive scrolling (4000px threshold)
- Standard 60-minute individual site blocks

**2. News Sites (20-minute daily limit, 60-minute blocks)**

- CNN, BBC, Reuters, NYTimes, German/Swiss/Austrian news outlets
- Cumulative time tracking across ALL news sites
- 20-minute daily limit → 60-minute block for all news sites

**3. Adult Sites (4-hour blocks)**

- 89+ sites including major platforms, streaming, cam sites, hentai
- Timer tracking and choice dialog on access
- Extended 4-hour block duration as stronger deterrent
- Comprehensive blocklist: Pornhub, OnlyFans, Xvideos, cam sites, etc.

### Cross-Platform Configuration

ScrollStop now features browser-based configuration that works identically on both iOS and macOS:

**Browser-Based Questionnaire:**

1. **Choice Dialog Integration** - "Configure Activities" option in choice dialog
2. **Multi-Step Setup** - 6 categories: household tasks, hobbies, current tasks, friends, goals, books
3. **Cross-Platform Storage** - Uses browser.storage.local with localStorage fallback
4. **Personalized Blocking Screen** - Shows user-specific activity suggestions

**Key Features:**

- Identical functionality on iOS and macOS extensions
- Real-time data persistence during configuration
- Smart suggestion algorithm prioritizing current tasks
- Fallback to default suggestions when no personal data available

### File Structure Notes

- Extension resources live in `Shared (Extension)/Resources/`
- Content scripts are loaded in order per `manifest.json`: timer → storage-helper → time-manager → timer-tracker → detectors → animation → screens → content coordinator
- Sites configuration in `sites.json` defines which domains trigger the extension
- iOS app uses WebView to display HTML-based walkthrough UI

**IMPORTANT: Manifest.json File Paths**

- All JavaScript files referenced in `manifest.json` must use flat file names (e.g., `"timer.js"`, `"content.js"`)
- DO NOT include folder paths like `"components/timer.js"` or `"modules/utils/storage-helper.js"`
- The build process flattens all files into one directory, so paths with directories will break
- Even though files are organized in subdirectories during development, manifest must reference them by filename only

## Component Architecture

**CRITICAL RULE: Use only HeadlessButton components for all interactive UI elements.**

### Available Components

**Component Locations:**
- **Primary**: `/Shared (Extension)/Resources/components/` - Extension components
- **Source**: `/UIComponentsJs/` - Full component library (source of truth)

**Core Components:**
- `HeadlessButton` - All buttons must use this component
- `HeadlessDialog` - Dialog containers with glassmorphism styling
- `HeadlessDivider` - Section dividers (soft/hard styles)
- `SwipeCards` - Activity card interface for blocking screen
- `ActivityTimer` - 5-minute focus timer component
- `QuestionnaireConfig` - Browser-based configuration interface

### Component Usage Policy
```javascript
// ✅ CORRECT - Use HeadlessButton
const button = new HeadlessButton('Configure Activities', {
  color: 'blue',
  onClick: () => this.handleClick()
});

// ❌ WRONG - Never use custom CSS buttons
<button style="background: red;">Custom Button</button>
```

**CRITICAL RULE: If component is not available, make it available - NEVER write custom CSS.**

Examples:
- Popup context: Load `button.js` and make `window.HeadlessButton` available
- Missing component: Copy from `/UIComponentsJs/` to `/components/` and add to manifest.json
- Always use standard components, never fallback to custom styling

### Color Scheme
- **Primary**: `color: 'blue'` (ScrollStop brand green)
- **Secondary**: `color: 'zinc', outline: true` (gray outline)
- **Destructive**: `color: 'red'` (delete/cancel actions)

## Implementation Standards

- **Choice Dialog**: Continue (blue), Configure Activities (zinc outline), Block Now (red outline) with HeadlessDivider separation
- **Questionnaire**: Add (blue), Previous (zinc outline), Cancel (red outline), Next/Finish (blue) with fallback support
- **Popup**: Configure Activities (blue) with minimal CSS, HeadlessButton for all interactive elements  
- **Cross-Platform**: Extensions use HeadlessButton, iOS app uses SwiftUI
- **Adult Sites Blocking**: 4-hour blocks, 89+ sites, timer tracking and choice dialog
- **Workflow**: Feature branches, `npm run precommit`, PR validation, Dependabot updates

## Custom CSS Cleanup

**NEVER use custom CSS for buttons.** Files requiring cleanup:
- `/modules/choice-dialog/choice-dialog.js` - Simple dialog fallback has extensive custom CSS
- `/modules/blocking-screen/blocking-screen.js` - Custom button styles  
- `/components/activity-timer.js` - Custom button implementations
- **Always use HeadlessButton components. No fallback strategies needed - if you have a component, you have a component.**

### Key Features

**Personalized Blocking Screen:**
- Browser-based questionnaire system with 6 categories: household tasks, hobbies, current tasks, friends, goals, books
- Swipeable activity cards showing user's personal data instead of generic suggestions
- Cross-platform compatibility - identical on iOS and macOS
- Smart suggestion algorithm prioritizing current tasks

**Modern Blocking Interface:**
- Tinder-like swipe cards for activity selection (right = accept, left = reject)
- 5-minute focus timer for selected activities with completion tracking
- Choice dialog: "Continue with ScrollStop", "Configure Activities", or "Block Now"
- Grayscale filter activates after 5 minutes only in "Continue" mode
- Browser-based configuration system replaces iOS-specific questionnaire

### Technical Notes

**Component Architecture:**
- Components in `/components/`, modules in `/modules/`
- HeadlessButton components must use `window.` prefix in extension context
- SwipeCards and ActivityTimer components moved to proper folders for build process

**Build Process:**
- Xcode flattens directory structure for Safari extension
- Manifest.json must use flat file names only (no folder paths)
- Files organized in subdirectories during development but referenced by filename only

**Recent Changes:**
- Removed "Timer Only" option from choice dialog - simplified to 2 options
- Grayscale filter now only activates when user chooses "Continue with ScrollStop"
- Eliminated timer-only mode logic from coordinator and timer-tracker modules
- Added ScrollStop branding title to blocking screen
- Implemented dark mode support for blocking screen
- Platform-specific features: activities/swipe cards only show on iOS (has companion app), macOS shows clean countdown-only interface


## Design System

### Glassmorphism Color Scheme

All extension UI elements use consistent glassmorphism styling:

**Background:**

- Main: `rgba(0, 0, 0, 0.25)` with `backdrop-filter: blur(12px) saturate(150%)`
- Border: `1.5px solid rgba(255, 255, 255, 0.22)`
- Shadow: `0px 4px 32px rgba(0, 0, 0, 0.35), 0px 8px 64px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255, 255, 255, 0.27)`

**Colors:**

- Primary accent: `#34c759` (green, matches iOS system green)
- Primary text: `white` with `text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8)`
- Secondary text: `rgba(255, 255, 255, 0.8)` with subtle shadow
- Primary button: `rgba(52, 199, 89, 0.9)` background
- Secondary buttons: `rgba(255, 255, 255, 0.1)` background with `rgba(255, 255, 255, 0.3)` border

**Interactions:**

- Hover: `scale(1.02)` with `box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3)`
- Border radius: `20px` for dialogs, `12px` for buttons
- Transitions: `all 0.2s ease`

