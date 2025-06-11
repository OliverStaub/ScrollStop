# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScrollStop is a Safari Web Extension that prevents doomscrolling on social media sites. It monitors scroll behavior on blocked sites (Facebook, Twitter/X, Instagram, Reddit, etc.) and implements a blocking mechanism when excessive scrolling is detected.

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
- `background.js` - Loads blocked sites from `sites.json` and handles extension lifecycle
- `SafariWebExtensionHandler.swift` - Native Swift handler for browser-native communication

**Detection & Blocking Modules:**
- `doomscroll-detector.js` - Monitors scroll distance (4000px threshold)
- `doomscroll-animation.js` - Warning animation when limit exceeded
- `transition-screen.js` - Transition between detection and blocking
- `blocking-screen.js` - Full-page block screen with countdown timer

**Utility Modules:**
- `storage-helper.js` - Browser storage management
- `time-manager.js` - Time-based blocking logic

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

### iOS Welcome Walkthrough
The iOS app includes an interactive setup walkthrough that guides users through:
1. **Welcome screen** - Explains ScrollStop's purpose
2. **Safari extension setup** - Step-by-step instructions for enabling in Settings
3. **iOS Shortcuts guidance** - Explains why/how to redirect social media apps to Safari
4. **Completion screen** - Confirms setup and explains how ScrollStop works

**Key Features:**
- Remembers completion state using localStorage
- Shows simplified version after walkthrough is completed
- Includes placeholder for YouTube tutorial link
- Responsive design with dark mode support

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

## Memories
- mesmorize

### Timer Tracker Feature Implementation (Session Summary)

**What We Built Today:**
- **Timer Tracker Feature**: A persistent, draggable timer that tracks cumulative time spent on social media sites
- **HeadlessButton Integration**: Replaced all HTML buttons with a standardized HeadlessButton component across the iOS app
- **Glassmorphism Timer Component**: Enhanced existing timer.js with better visibility on bright backgrounds

**Key Features Implemented:**
1. **Persistent Time Tracking**: Timer accumulates time across different social media sites (Instagram → YouTube → Twitter, etc.)
2. **Daily Reset**: Automatically resets at 12 AM each day
3. **Click to Hide**: Click timer to hide until next page reload  
4. **Drag & Drop**: Grab and move timer anywhere on screen, position persists
5. **Smart Dragging**: Prevents accidental hiding during drag operations
6. **Cross-Browser Storage**: Compatible with Safari extension APIs with localStorage fallback
7. **Position Reset**: Timer returns to default center-top position on page reload

**Technical Architecture:**
- **timer-tracker.js**: Main module managing timer logic, storage, and UI interactions
- **StorageWrapper**: Cross-browser storage compatibility layer
- **Integration**: Added to content.js coordinator and manifest.json loading order
- **Visual Improvements**: Dark glassmorphism design with white text and strong shadows for visibility

**Button System Overhaul:**
- **Standardized Design**: All iOS app buttons now use HeadlessButton component
- **Consistent Styling**: Blue primary buttons, outline secondary buttons  
- **Fallback Support**: macOS app includes fallback if HeadlessButton fails to load
- **Touch Targets**: Enhanced mobile accessibility

**Build Process Notes:**
- **Critical Lesson**: manifest.json must use flat file names only (no folder paths) due to build flattening
- **File Organization**: Development files in subdirectories, but manifest references by filename only
- **Xcode Integration**: Remember to add new files to build targets in Xcode

**User Experience:**
- **Awareness Tool**: Continuous visibility of time spent on social media
- **Non-Intrusive**: Can be hidden with single click, reappears on reload
- **Customizable Position**: User can drag to preferred screen location
- **Persistent Data**: Time accumulates across sessions and different sites