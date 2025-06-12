# ScrollStop

[![CI/CD Pipeline](https://github.com/oliverstaub/ScrollStop/actions/workflows/ci.yml/badge.svg)](https://github.com/oliverstaub/ScrollStop/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=oliverstaub_ScrollStop&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=oliverstaub_ScrollStop)
[![codecov](https://codecov.io/gh/oliverstaub/ScrollStop/branch/main/graph/badge.svg)](https://codecov.io/gh/oliverstaub/ScrollStop)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-FF6B35.svg)](https://claude.ai/code)

A Safari Web Extension that prevents doomscrolling on social media sites and tracks news reading time with intelligent blocking mechanisms.

## ✨ Features

### 🚫 Social Media Blocking

- **Scroll Detection**: Monitors scrolling behavior on social media sites (Facebook, Twitter/X, Instagram, Reddit, TikTok, etc.)
- **4000px Threshold**: Triggers warning and blocking after excessive scrolling
- **60-Minute Blocks**: Individual site blocking with countdown timer
- **Choice Dialog**: Choose between full functionality, timer-only, or immediate block

### 📰 News Site Tracking

- **Time Tracking**: Monitors time spent across all news sites (CNN, BBC, Spiegel, NZZ, etc.)
- **20-Minute Daily Limit**: Cumulative tracking across all news sources
- **1-Hour Block**: Blocks all news sites when daily limit exceeded
- **International Support**: Includes German, Swiss, and Austrian news outlets

### ⏱️ Timer Tracker

- **Persistent Timer**: Draggable timer showing accumulated daily time
- **Cross-Platform**: Works on both social media and news sites
- **Daily Reset**: Automatically resets at midnight
- **Click to Hide**: Hide timer until next page reload

### 🎨 Modern UI

- **Glassmorphism Design**: Beautiful blur effects and transparency
- **Choice Dialog**: Clean 3-option interface on site visits
- **Blocking Screen**: Personalized suggestions and countdown timer
- **Dark Mode Support**: Optimized for both light and dark themes

## How it Works

ScrollStop provides intelligent protection against both doomscrolling and excessive news consumption:

1. **Social Media Sites**: Detects excessive scrolling (4000px) and blocks individual sites for 60 minutes
2. **News Sites**: Tracks reading time across all news sources with a 20-minute daily limit
3. **Choice System**: Users choose how to engage with each site on every visit
4. **Timer Tracking**: Continuous time tracking with daily reset functionality

## 🚀 Installation

### Requirements

- macOS 11.0+ or iOS 14.0+
- Safari 14.0+
- Xcode 13.0+ (for building)

### Building from Source

1. **Clone the repository**:

   ```bash
   git clone https://github.com/oliverstaub/ScrollStop.git
   cd ScrollStop
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run tests and validation**:

   ```bash
   npm test
   ```

4. **Open in Xcode**:

   ```bash
   open ScrollStop.xcodeproj
   ```

5. **Build and run**:
   - Select "ScrollStop (macOS)" or "ScrollStop (iOS)" scheme
   - Build and run the project
   - Enable the extension in Safari preferences

## 🧪 Development & Testing

### Running Tests

**Always run tests after making changes:**

```bash
# Run all tests (unit + integration)
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint JavaScript code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Auto-format code
npm run format

# Validate all files (lint + format + tests)
npm run validate
```

### Extension Validation

```bash
# Validate manifest.json structure
npm run validate:manifest

# Validate sites.json configuration
npm run validate:sites

# Check manifest file paths (critical for build)
npm run build:check
```

### Pre-commit Validation

**IMPORTANT**: Always run this before committing:

```bash
npm run precommit
```

This runs the complete validation and formatting suite:

- 🎨 **Prettier code formatting** (auto-fixes formatting issues)
- ✅ **ESLint code quality checks**
- ✅ **Prettier format validation**
- ✅ **Unit and integration tests**
- ✅ **Manifest and sites validation**
- ✅ **File path verification**

**Note**: Prettier will automatically fix formatting issues before validation, ensuring consistent code style across the entire codebase.

### 🔧 Development Workflow

1. **Make your changes** to the extension code
2. **Run tests**: `npm test`
3. **Validate code**: `npm run validate`
4. **Test in Safari**: Build and test the extension
5. **Commit changes**: Tests run automatically via GitHub Actions
6. **Create PR**: Full CI/CD pipeline validates your changes

### 📊 Test Coverage

Our test suite covers:

- **Unit Tests**: Core modules (TimeManager, StorageHelper, TimerTracker)
- **Integration Tests**: Full extension flow and site detection
- **Validation Tests**: Manifest structure and sites configuration
- **Security Tests**: Code scanning and dependency checks

Target coverage: **>80%** for all critical paths.

### 🚨 Important Notes

- **File Paths**: The build process flattens all files. Only use flat filenames in `manifest.json`
- **Testing**: Run `npm test` after every change - this is enforced by CI/CD
- **Validation**: Scripts automatically check manifest and sites configuration
- **Memory**: Tests include memory leak detection for timer components

## 🏗️ Architecture

### Project Structure

```
ScrollStop/
├── Shared (App)/           # iOS/macOS host app resources
├── Shared (Extension)/     # Safari extension code
│   └── Resources/
│       ├── manifest.json   # Extension manifest
│       ├── sites.json      # Blocked/news sites config
│       ├── content.js      # Main coordinator
│       ├── background.js   # Background script
│       └── modules/        # Core modules
├── iOS (App|Extension)/    # iOS-specific code
├── macOS (App|Extension)/  # macOS-specific code
├── tests/                  # Test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── mocks/             # Test mocks
└── scripts/               # Validation scripts
```

### Key Modules

- **`content.js`**: Main coordinator orchestrating all modules
- **`time-manager.js`**: Handles time blocks and news time tracking
- **`storage-helper.js`**: Cross-browser storage abstraction
- **`timer-tracker.js`**: Persistent timer with drag functionality
- **`choice-dialog.js`**: User choice interface
- **`blocking-screen.js`**: Full-page blocking with countdown

## 🚀 CI/CD Pipeline Documentation

Our comprehensive GitHub Actions pipeline ensures code quality and reliability across all platforms.

### Pipeline Overview

The CI/CD system consists of 6 parallel jobs that run on every push and pull request:

#### 1. **lint-and-test** (Primary Pipeline)

**Purpose**: Code quality validation and testing  
**Runtime**: ~2-3 minutes (with caching)

```yaml
- ESLint code quality checks
- Prettier formatting validation
- Manifest.json structure validation
- Sites.json configuration validation
- File path verification (critical for Xcode builds)
- Unit tests (TimeManager, StorageHelper, TimerTracker)
- Integration tests (full extension workflow)
- Test coverage generation and Codecov upload
```

#### 2. **build-macos**

**Purpose**: macOS Safari extension build verification  
**Runtime**: ~3-4 minutes

```yaml
- Xcode latest-stable setup
- ScrollStop (macOS) scheme build
- Release configuration compilation
- Artifact archival (7-day retention)
```

#### 3. **build-ios**

**Purpose**: iOS Safari extension build verification  
**Runtime**: ~3-4 minutes

```yaml
- Xcode latest-stable setup
- ScrollStop (iOS) scheme build
- iOS generic platform targeting
- Release configuration compilation
- Artifact archival (7-day retention)
```

#### 4. **security-scan**

**Purpose**: Security vulnerability detection  
**Runtime**: ~1-2 minutes

```yaml
- Semgrep security analysis (JavaScript, secrets, security-audit)
- SARIF report generation and upload
- TruffleHog secret detection with verification
- CodeQL integration for GitHub Security tab
```

#### 5. **dependency-scan**

**Purpose**: Dependency security and licensing  
**Runtime**: ~1-2 minutes

```yaml
- npm audit for known vulnerabilities
- Dependency review for license compliance
- Package version conflict detection
```

#### 6. **performance-test**

**Purpose**: Performance monitoring (placeholder)  
**Runtime**: ~30 seconds

```yaml
- Performance test framework (to be implemented)
- Memory leak detection (to be implemented)
- Extension load time monitoring (planned)
```

### Caching Strategy

**npm Dependencies**: Dual-layer caching for optimal speed

- `setup-node@v4` built-in npm cache
- `actions/cache@v4` for node_modules
- Cache key: `runner.os-node-hashFiles('package-lock.json')`
- **Performance**: 5 minutes → 30 seconds on cache hits

### Feature Branch Workflow

**Development Process**:

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and run `npm run precommit`
3. Push branch: `git push origin feature/feature-name`
4. Create Pull Request → Triggers full CI/CD validation
5. Review results, fix any failures
6. Merge after all checks pass

**Benefits**:

- ✅ Catches issues before main branch
- ✅ Ensures all tests pass before merge
- ✅ Validates cross-platform builds
- ✅ Security scanning on every change
- ✅ Code quality enforcement

### Pipeline Triggers

- **Push to main/develop**: Full pipeline execution
- **Pull Request to main**: Full pipeline + dependency review
- **Manual dispatch**: Available for all workflows

### Status Monitoring

Monitor pipeline status via:

- GitHub Actions tab
- README badges (CI/CD Pipeline, Extension Validation)
- Email notifications on failures
- Codecov reports for test coverage trends

## 📄 License

This project is proprietary software. All rights reserved.

**Commercial License**: This software is intended for commercial distribution via the Apple App Store. Unauthorized copying, distribution, or modification is prohibited without explicit written permission from the author.  
**Year**: 2024

This project was developed from scratch specifically for Safari, with custom implementations for cross-platform compatibility and news tracking functionality.
