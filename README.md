# Spàrsh Browser

<div align="center">
  <img src="assets/logo.svg" alt="Spàrsh Browser Logo" width="128" height="128">

  **A free, open-source web browser that faithfully reproduces the visual design, layout, interactions, and UX of Comet Browser while using the Spàrsh brand.**

  [![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
  [![Platform: Cross-Platform](https://img.shields.io/badge/Platform-Cross%20Platform-green.svg)](https://github.com/sparsh-browser/sparsh-browser)
  [![Build Status](https://img.shields.io/badge/Build-Active-yellow.svg)](https://github.com/sparsh-browser/sparsh-browser)

</div>

## ✨ Features

- 🚀 **Fast & Secure**: Built on Electron with modern web technologies
- 🎨 **Pixel-Perfect UI**: Faithful reproduction of Comet Browser's design
- 📱 **Cross-Platform**: Native builds for Windows, macOS, Linux, and Android
- 🔒 **Privacy-Focused**: Built-in privacy features and secure browsing
- 📚 **Smart Bookmarks**: Easy bookmark management with search
- 🔍 **Intelligent Search**: Auto-detects search queries vs URLs
- 📱 **Mobile-Optimized**: Responsive design for mobile devices
- 🌙 **Dark Theme**: Beautiful dark theme with system preference detection
- ⚡ **Smooth Animations**: Buttery smooth interactions and transitions
- 🔧 **Customizable**: Settings for home page, search engine, and more

## 🏗️ Architecture

Spàrsh Browser is built using modern web technologies:

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Electron for desktop, Cordova for mobile
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Font Awesome for consistent iconography
- **Storage**: Electron Store for persistent data
- **Build System**: Electron Builder for desktop, Cordova CLI for mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Desktop Development

```bash
# Clone the repository
git clone https://github.com/sparsh-browser/sparsh-browser.git
cd sparsh-browser

# Install dependencies
npm install

# Start development server
npm start

# Build for your current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### Android Development

```bash
# Install Cordova CLI (one-time setup)
npm install -g cordova

# Add Android platform
cordova platform add android

# Build Android APK
cordova build android

# Run on connected device/emulator
cordova run android
```

## 📦 Building from Source

### Windows Build

```bash
# Install dependencies
npm install

# Build Windows installer
npm run build:win
```

**Output**: `dist/Spàrsh Browser Setup X.X.X.exe`

### Android Build

```bash
# Install Cordova and build tools
npm install -g cordova

# Add Android platform
cordova platform add android

# Build APK
cordova build android
```

**Output**: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

### Linux/macOS Build

```bash
# Build for current platform
npm run build
```

## 🔧 Development

### Project Structure

```
sparsh-browser/
├── src/                    # Source files
│   ├── index.html         # Main browser interface
│   ├── preload.js         # Electron preload script
│   ├── android-styles.css # Mobile-specific styles
│   └── manifest.json      # PWA manifest
├── assets/                # Brand assets and icons
│   ├── logo.svg          # Spàrsh logo
│   └── icon.ico          # Windows icon
├── main.js               # Electron main process
├── package.json          # Desktop dependencies
├── config.xml           # Cordova configuration
├── android-build.sh     # Android build script
├── windows-build.sh     # Windows build script
└── README.md           # This file
```

### Key Components

- **Main Process** (`main.js`): Handles window creation, menu, and system integration
- **Renderer Process** (`src/index.html`): Browser UI and webview management
- **Preload Script** (`src/preload.js`): Secure communication bridge
- **WebView**: Displays web content with security restrictions

### Adding Features

1. **UI Changes**: Edit `src/index.html` and related styles
2. **Native Features**: Modify `main.js` for system integration
3. **Mobile Support**: Update `src/android-styles.css` for responsive design
4. **Build Configuration**: Update `package.json` and `config.xml`

## 🎨 Design System

### Colors

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#06b6d4` (Cyan)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Sizes**: 12px - 24px (responsive scaling)
- **Weights**: 400, 500, 600, 700

### Spacing

- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 🔒 Security

- **Context Isolation**: Enabled for renderer process security
- **Node Integration**: Disabled in renderer for security
- **Web Security**: Enabled with secure defaults
- **Content Security Policy**: Configured for XSS protection

## 🌟 Browser Features

### Core Features ✅

- [x] Tabbed browsing (single tab for now, expandable)
- [x] Address bar with auto-complete
- [x] Navigation controls (back, forward, refresh)
- [x] Bookmark management
- [x] History tracking
- [x] Settings configuration
- [x] Download management
- [x] Zoom controls
- [x] Context menus

### Advanced Features 🔄

- [ ] Multi-tab support
- [ ] Private browsing mode
- [ ] Extension system
- [ ] Developer tools integration
- [ ] Password manager
- [ ] Ad blocker
- [ ] VPN integration

## 📱 Mobile Support

### Android

- **Framework**: Cordova/PhoneGap
- **WebView**: Android System WebView
- **Features**: Touch-optimized UI, mobile navigation
- **Distribution**: APK file for sideloading or Play Store

### PWA Features

- **Installable**: Can be installed as a Progressive Web App
- **Offline Support**: Basic offline functionality
- **Responsive**: Adapts to different screen sizes

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Contribution Guidelines

- Follow the existing code style and structure
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and collaborative

### Areas for Contribution

- **UI/UX Improvements**: Enhance the visual design
- **Feature Development**: Add new browser capabilities
- **Platform Support**: Improve mobile or desktop experience
- **Performance**: Optimize rendering and memory usage
- **Localization**: Add support for multiple languages
- **Testing**: Expand test coverage

## 📄 License

Spàrsh Browser is licensed under the **Apache License 2.0**.

```
Copyright 2024 Spàrsh Browser Team

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## 🙏 Acknowledgments

- **Comet Browser**: Inspiration for design and UX patterns
- **Electron**: Cross-platform desktop application framework
- **Cordova**: Mobile application development framework
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Inter Font**: Modern, readable typeface

## 📞 Contact

- **Website**: https://sparsh.browser
- **GitHub**: https://github.com/sparsh-browser/sparsh-browser
- **Issues**: https://github.com/sparsh-browser/sparsh-browser/issues
- **Discussions**: https://github.com/sparsh-browser/sparsh-browser/discussions

## 🗺️ Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic browser functionality
- ✅ Cross-platform builds
- ✅ Spàrsh branding and design
- ✅ Core feature set

### Phase 2: Enhancement (Next)
- 🔄 Multi-tab support
- 🔄 Extension system
- 🔄 Advanced privacy features
- 🔄 Performance optimizations

### Phase 3: Polish (Future)
- 🔄 Advanced developer tools
- 🔄 Internationalization
- 🔄 Cloud sync features
- 🔄 App store distribution

---

<div align="center">
  <p><strong>Built with ❤️ for the open-source community</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>