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
- **UI Components Policy**: Only use UIComponentsJS components for all web UI elements. No other UI frameworks or plain HTML/CSS elements. iOS app uses SwiftUI natively.
- **Choice Dialog Feature**: When accessing blocked sites, users see a dialog with 3 options: Continue with ScrollStop (full functionality), Timer Only (no blocking), or Block Now (immediate block). Appears on every page reload.

### iOS App Personalization Features Implementation (Session Summary)

**What We Built Today:**
- **Comprehensive Questionnaire System**: Created QuestionnaireView with 5 detailed categories for personalized recommendations
- **Bilingual Support**: Full German/English language support with LanguageManager
- **Personalized Blocking Screen**: Updated blocking screen to show user-specific suggestions based on questionnaire data
- **iOS UI Improvements**: Removed welcome screen and disabled dark mode for better UX

**Key Features Implemented:**

**1. QuestionnaireView System:**
- **5 Categories**: Household tasks, hobbies, current tasks, friends, goals, books
- **Smart Data Management**: Auto-deletion of current tasks after 2 weeks
- **Progress Tracking**: Visual progress indicator with step-by-step navigation
- **Real-time Persistence**: Data saved immediately as user adds items
- **Bilingual Interface**: Complete German/English support throughout

**2. Personalized Blocking Screen:**
- **Smart Recommendations**: Shows actual user tasks instead of generic suggestions
- **Priority System**: Current tasks → household → friends → hobbies → books → goals
- **Randomization**: Picks random items from each category for variety
- **Fallback System**: Default suggestions when no personal data available
- **Cross-Platform Data**: Bridge between iOS app and Safari extension storage

**3. Bilingual Support (LanguageManager):**
- **Complete Translation**: All UI elements, placeholders, descriptions in German/English
- **Auto-Detection**: Detects system language preference
- **Manual Override**: Users can switch languages in questionnaire
- **Consistent Keys**: Standardized localization key system

**4. iOS App UX Improvements:**
- **Streamlined Walkthrough**: Removed welcome screen, starts directly with extension setup
- **Light Mode Only**: Disabled dark mode for consistent appearance
- **Integrated Questionnaire**: Replaced simple ProfileSetupView with comprehensive QuestionnaireView

**Technical Architecture:**
- **Data Bridge**: iOS app stores questionnaire data with `scrollstop_` prefixes for extension access
- **Storage Strategy**: UserDefaults for iOS, browser.storage.local for extension with localStorage fallback
- **Async Blocking Screen**: Updated blocking screen to handle async data loading
- **Smart Suggestions**: Algorithm that prioritizes current tasks and mixes categories

**User Experience Flow:**
1. **Setup Extension**: User enables Safari extension
2. **Setup Shortcuts**: User configures iOS shortcuts for social media redirection  
3. **Personal Questionnaire**: User fills out 5 categories of personal data
4. **Personalized Blocking**: When blocked, sees specific tasks from their questionnaire
5. **Meaningful Alternatives**: Easy transition from scrolling to productive activities

**Data Categories & Examples:**
- **Household Tasks**: "Do laundry", "Clean table", "Empty dishwasher"
- **Hobbies**: "Cycling", "Gym", "Programming", "Guitar"
- **Current Tasks**: "Study for exam", "Buy groceries" (auto-deleted after 2 weeks)
- **Friends**: "Sister", "Flavio", "Samu" → becomes "Call Sister"
- **Goals**: "Be more patient", "Exercise daily" → becomes "Work on: Be more patient"
- **Books**: "Atomic Habits", "The Lean Startup" → becomes "Read 'Atomic Habits'"

**Implementation Benefits:**
- **Higher Engagement**: Personal tasks more motivating than generic suggestions
- **Cultural Support**: German users get native language experience
- **Smart Prioritization**: Current tasks appear first when user is blocked
- **Reduced Friction**: Easier to leave social media when you see specific alternatives
- **Data Persistence**: Questionnaire data survives app updates and device changes

**Technical Lessons:**
- **Async Patterns**: Updated blocking screen methods to handle async suggestion generation
- **Cross-Platform Storage**: Used consistent key prefixes for data sharing between app and extension
- **Language Management**: Centralized translation system with fallback to keys
- **State Management**: Proper state handling for multi-step questionnaire flow

**Code Quality Improvements:**
- **Comprehensive Error Handling**: Graceful fallbacks when personal data unavailable
- **Memory Management**: Proper cleanup of old current tasks
- **Type Safety**: Strong typing throughout Swift components
- **Modular Design**: Separate concerns for data management, UI, and storage

**User Impact:**
The app now transforms from a simple blocking tool into a personalized productivity assistant that knows the user's specific goals, tasks, and relationships, making it much easier to break the scrolling habit by providing meaningful, actionable alternatives.

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

**iOS App UI Recommendation:**
- **Issue Identified**: Web-based walkthrough with JavaScript buttons is unreliable on iOS
- **Recommended Solution**: Replace HTML/CSS/JS walkthrough with native SwiftUI interface
- **Benefits**: More reliable, better iOS integration, proper native styling, no script loading issues
- **Implementation**: Create SwiftUI views for welcome, setup steps, and completion screens

