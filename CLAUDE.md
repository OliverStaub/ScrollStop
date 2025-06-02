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

### File Structure Notes
- Extension resources live in `Shared (Extension)/Resources/`
- Content scripts are loaded in order per `manifest.json`: storage-helper → time-manager → detectors → animation → screens → content coordinator
- Sites configuration in `sites.json` defines which domains trigger the extension