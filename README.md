# 🌐 Spàrsh Browser

<div align="center">
  <img src="assets/logo.svg" alt="Spàrsh Browser" width="200" height="200">
  
  <h3>A Free, Open-Source Web Browser</h3>
  <p>Fast • Secure • Beautiful • Privacy-Focused</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
  [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android-lightgrey.svg)](#)
</div>

---

## ✨ Features

### 🚀 **Performance**
- Lightning-fast browsing with Chromium engine
- Optimized resource usage
- Smooth animations and transitions
- Instant page loading

### 🔒 **Privacy & Security**
- Built-in ad blocker
- Tracker blocking enabled by default
- Private browsing mode
- Secure HTTPS connections
- No data collection

### 🎨 **Modern Design**
- Beautiful, intuitive interface
- Dark mode by default
- Customizable new tab page
- Pixel-accurate UI design
- Smooth animations

### ⚡ **Core Features**
- **Tab Management**: Efficient multi-tab browsing with smooth transitions
- **Smart Address Bar**: Combined search and URL input
- **Bookmarks**: Organize and access your favorite sites
- **History**: Track and revisit your browsing activity
- **Downloads Manager**: Keep track of all your downloads
- **Settings Panel**: Customize your browsing experience

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sparsh-browser.git
cd sparsh-browser

# Install dependencies
npm install

# Start the browser
npm start
```

---

## 🔨 Building

### Windows Build
```bash
npm run build:win
```
Output: `dist/Spàrsh Browser Setup.exe`

### Linux Build
```bash
npm run build:linux
```
Output: `dist/Spàrsh-Browser-*.AppImage`

### Android Build
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android

# Build for Android
npm run build:android
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📖 Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + T` | New Tab |
| `Ctrl + W` | Close Tab |
| `Ctrl + L` | Focus Address Bar |
| `Ctrl + R` | Reload Page |
| `Ctrl + H` | Show History |
| `Ctrl + J` | Show Downloads |
| `Ctrl + D` | Bookmark Current Page |
| `Ctrl + Shift + N` | New Private Window |

### Internal URLs

- `sparsh://newtab` - New Tab page
- `sparsh://history` - Browsing history
- `sparsh://downloads` - Downloads manager
- `sparsh://bookmarks` - Bookmarks manager
- `sparsh://settings` - Settings panel

---

## 🏗️ Architecture

Spàrsh Browser is built with:

- **Electron**: Cross-platform desktop application framework
- **Chromium**: High-performance web rendering engine
- **BrowserView**: Native browser component for web content
- **electron-store**: Persistent settings and data storage

### Project Structure

```
sparsh-browser/
├── src/
│   ├── main.js              # Main Electron process
│   └── renderer/            # UI components
│       ├── index.html       # Main window
│       ├── styles.css       # UI styles
│       ├── renderer.js      # UI logic
│       ├── newtab.html      # New tab page
│       ├── history.html     # History page
│       ├── downloads.html   # Downloads page
│       ├── bookmarks.html   # Bookmarks page
│       └── settings.html    # Settings page
├── assets/
│   ├── logo.svg             # App logo
│   └── icon.png             # App icon
├── package.json             # Project configuration
└── README.md               # This file
```

---

## 🎨 Branding

### Colors

- **Primary**: `#6366f1` (Indigo)
- **Accent**: `#ec4899` (Pink)
- **Background**: `#1a1a2e` (Dark Blue)
- **Surface**: `#16213e` (Navy)

### Typography

- **Font**: System default (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Spàrsh Browser Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🌟 Roadmap

- [x] Core browser functionality
- [x] Tab management
- [x] Bookmarks and history
- [x] Downloads manager
- [x] Settings panel
- [x] Windows build support
- [ ] Android build optimization
- [ ] Extensions support
- [ ] Sync across devices
- [ ] Custom themes
- [ ] Mobile-optimized UI
- [ ] PWA support

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sparsh-browser/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sparsh-browser/discussions)
- **Email**: support@sparsh-browser.com

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Powered by [Chromium](https://www.chromium.org/)
- Inspired by modern browser design principles

---

<div align="center">
  <p>Made with ❤️ by the Spàrsh Browser Team</p>
  <p>
    <a href="https://github.com/yourusername/sparsh-browser">⭐ Star us on GitHub</a>
  </p>
</div>
