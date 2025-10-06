# Spàrsh Browser Development Guide

This document provides detailed information for developers working on Spàrsh Browser.

## Architecture Overview

Spàrsh Browser is built using a multi-platform architecture:

- **Windows**: Electron-based desktop application
- **Android**: Native Android app with WebView integration
- **Shared Core**: Common utilities and constants

## Technology Stack

### Windows (Electron)
- **Main Process**: Node.js with Electron APIs
- **Renderer Process**: HTML, CSS, JavaScript
- **WebView**: Chromium-based web engine
- **Storage**: Electron Store for settings and data

### Android
- **Language**: Kotlin
- **UI Framework**: Android Views with Material Design
- **WebView**: Android WebView component
- **Storage**: Room database for persistent data

## Project Structure

```
sparsh-browser/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.js             # Main application entry point
│   │   ├── browser-features.js # Core browser functionality
│   │   └── preload.js          # Preload script for security
│   ├── renderer/               # Electron renderer process
│   │   ├── index.html          # Main UI structure
│   │   ├── styles.css          # Application styles
│   │   └── renderer.js         # Renderer process logic
│   └── shared/                 # Shared utilities
│       ├── constants.js        # Application constants
│       └── utils.js            # Utility functions
├── android/                    # Android application
│   ├── app/                    # Android app module
│   │   ├── src/main/           # Main source code
│   │   │   ├── java/           # Kotlin/Java source
│   │   │   ├── res/            # Android resources
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle        # Android build configuration
│   └── build.gradle            # Project build configuration
├── assets/                     # Application assets
│   └── icons/                  # Application icons
├── scripts/                    # Build and utility scripts
└── docs/                       # Documentation
```

## Core Features

### Tab Management
- Create, close, and switch between tabs
- Tab state persistence
- Visual tab indicators
- Tab history and navigation

### Address Bar
- URL input and validation
- Search suggestions
- Navigation history
- Security indicators

### Web Content
- WebView integration
- JavaScript execution
- Cookie management
- Download handling

### Settings
- Theme selection (light/dark)
- Search engine preferences
- Privacy settings
- Download preferences

### Bookmarks
- Add, remove, and organize bookmarks
- Bookmark folders
- Import/export functionality

### History
- Browsing history tracking
- History search and filtering
- History management

### Downloads
- Download progress tracking
- Download management
- File type handling

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/sparsh-browser/sparsh-browser.git
cd sparsh-browser

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Making Changes

1. Create a feature branch
2. Make your changes
3. Test on both platforms
4. Run linting and tests
5. Submit a pull request

### 3. Testing

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### 4. Building

```bash
# Build for Windows
npm run build:windows

# Build for Android
npm run build:android

# Build for all platforms
npm run build:all
```

## Platform-Specific Development

### Windows (Electron)

The Windows version uses Electron for cross-platform desktop functionality.

**Key Files:**
- `src/main/main.js` - Main process entry point
- `src/main/browser-features.js` - Core browser functionality
- `src/renderer/` - UI and renderer process

**Development:**
```bash
npm run dev
```

### Android

The Android version is a native app with WebView integration.

**Key Files:**
- `android/app/src/main/java/` - Kotlin source code
- `android/app/src/main/res/` - Android resources
- `android/app/build.gradle` - Build configuration

**Development:**
```bash
cd android
./gradlew assembleDebug
```

## Code Style Guidelines

### JavaScript/TypeScript
- Use ESLint configuration
- Follow Prettier formatting
- Use meaningful variable names
- Add JSDoc comments for functions

### Kotlin
- Follow Android Kotlin style guide
- Use meaningful variable names
- Add KDoc comments for functions
- Follow Material Design guidelines

### CSS
- Use CSS custom properties for theming
- Follow BEM methodology for class names
- Use consistent spacing and typography
- Support both light and dark themes

## Security Considerations

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Secure preload scripts
- CSP headers for content security

### Android Security
- WebView security settings
- Permission management
- Secure storage for sensitive data
- Network security configuration

## Performance Optimization

### Electron
- Lazy loading of components
- Efficient memory management
- Optimized WebView settings
- Resource caching

### Android
- RecyclerView for efficient lists
- Image loading optimization
- Memory leak prevention
- Background task optimization

## Debugging

### Electron
- Use Chrome DevTools
- Enable debug logging
- Use Electron DevTools extensions

### Android
- Use Android Studio debugger
- Enable WebView debugging
- Use logcat for logging

## Release Process

1. Update version numbers
2. Update changelog
3. Run full test suite
4. Build all platforms
5. Test builds thoroughly
6. Create GitHub release
7. Publish to distribution channels

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## Support

For development questions and support:
- GitHub Issues
- Community Discussions
- Developer Documentation