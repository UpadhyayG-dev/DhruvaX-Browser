# Installation Guide for Spàrsh Browser

This guide will help you install and set up Spàrsh Browser on your system.

## Table of Contents
- [System Requirements](#system-requirements)
- [Installing from Source](#installing-from-source)
- [Installing Pre-built Binaries](#installing-pre-built-binaries)
- [First Run](#first-run)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Windows
- **OS**: Windows 10 or higher (64-bit)
- **RAM**: 4 GB minimum, 8 GB recommended
- **Storage**: 500 MB free space
- **Display**: 1024x768 minimum resolution

### Linux
- **OS**: Ubuntu 20.04+, Debian 10+, or equivalent
- **RAM**: 4 GB minimum, 8 GB recommended
- **Storage**: 500 MB free space
- **Display**: 1024x768 minimum resolution
- **Dependencies**: `libgtk-3-0`, `libnotify4`, `libnss3`, `libxss1`, `libxtst6`, `libasound2`

### Android
- **OS**: Android 8.0 (Oreo) or higher
- **RAM**: 2 GB minimum, 4 GB recommended
- **Storage**: 200 MB free space

## Installing from Source

### Prerequisites
1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Recommended: Node.js 18 LTS or higher
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Install Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation:
     ```bash
     git --version
     ```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/sparsh-browser.git
   cd sparsh-browser
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Browser**
   ```bash
   npm start
   ```

### Building for Distribution

**Windows:**
```bash
npm run build:win
```
Output: `dist/Spàrsh Browser Setup.exe`

**Linux:**
```bash
npm run build:linux
```
Output: `dist/Spàrsh-Browser-*.AppImage`

**Android:**
```bash
npm run build:android
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

## Installing Pre-built Binaries

### Windows

1. **Download the Installer**
   - Go to [Releases](https://github.com/yourusername/sparsh-browser/releases)
   - Download `Spàrsh-Browser-Setup-1.0.0.exe`

2. **Run the Installer**
   - Double-click the downloaded file
   - Follow the installation wizard
   - Choose installation location
   - Click "Install"

3. **Launch**
   - Find "Spàrsh Browser" in Start Menu
   - Or use desktop shortcut

**Portable Version:**
- Download `Spàrsh-Browser-1.0.0.exe`
- Run directly without installation

### Linux

#### AppImage (Universal)

1. **Download AppImage**
   ```bash
   wget https://github.com/yourusername/sparsh-browser/releases/download/v1.0.0/Spàrsh-Browser-1.0.0.AppImage
   ```

2. **Make Executable**
   ```bash
   chmod +x Spàrsh-Browser-1.0.0.AppImage
   ```

3. **Run**
   ```bash
   ./Spàrsh-Browser-1.0.0.AppImage
   ```

#### Debian/Ubuntu (DEB Package)

1. **Download DEB**
   ```bash
   wget https://github.com/yourusername/sparsh-browser/releases/download/v1.0.0/sparsh-browser_1.0.0_amd64.deb
   ```

2. **Install**
   ```bash
   sudo dpkg -i sparsh-browser_1.0.0_amd64.deb
   sudo apt-get install -f  # Fix dependencies if needed
   ```

3. **Run**
   ```bash
   sparsh-browser
   ```

### Android

#### APK Installation

1. **Enable Unknown Sources**
   - Go to Settings > Security
   - Enable "Unknown Sources" or "Install Unknown Apps"

2. **Download APK**
   - Visit releases page on your Android device
   - Download `sparsh-browser-1.0.0.apk`

3. **Install**
   - Open Downloads folder
   - Tap the APK file
   - Tap "Install"

4. **Launch**
   - Find "Spàrsh Browser" in app drawer

#### Google Play Store (Future)
- Will be available once published

## First Run

### Initial Setup

1. **First Launch**
   - The browser will open with a new tab page
   - Default search engine is Google
   - Dark mode is enabled by default

2. **Import Bookmarks (Optional)**
   - Currently manual import
   - Future versions will support import/export

3. **Customize Settings**
   - Click menu (⋮) > Settings
   - Choose your preferences:
     - Default search engine
     - Home page
     - Privacy options
     - Download location

### Default Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Tab | Ctrl+T |
| Close Tab | Ctrl+W |
| Focus Address Bar | Ctrl+L |
| Reload | Ctrl+R |
| History | Ctrl+H |
| Downloads | Ctrl+J |
| Bookmark | Ctrl+D |
| Settings | Ctrl+, |

## Troubleshooting

### Windows Issues

**Problem: "Windows protected your PC" warning**
- Click "More info"
- Click "Run anyway"
- This happens because the app isn't signed yet

**Problem: Installation fails**
- Disable antivirus temporarily
- Run installer as Administrator
- Check available disk space

**Problem: App doesn't launch**
- Check Windows version (must be 10+)
- Update Windows
- Reinstall the app

### Linux Issues

**Problem: AppImage won't run**
```bash
# Install FUSE
sudo apt install libfuse2

# Or extract and run
./Spàrsh-Browser-1.0.0.AppImage --appimage-extract
./squashfs-root/sparsh-browser
```

**Problem: Missing dependencies**
```bash
# Ubuntu/Debian
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 libasound2

# Fedora
sudo dnf install gtk3 libnotify nss libXScrnSaver libXtst alsa-lib
```

**Problem: Icon doesn't appear**
```bash
# Manually create desktop entry
nano ~/.local/share/applications/sparsh-browser.desktop
```

### Android Issues

**Problem: Installation blocked**
- Enable "Install from Unknown Sources"
- Or use ADB:
  ```bash
  adb install sparsh-browser-1.0.0.apk
  ```

**Problem: App crashes on startup**
- Clear app data
- Reinstall the app
- Check Android version (8.0+)

**Problem: Slow performance**
- Close background apps
- Clear browser cache (Settings > Privacy)
- Check available storage

### General Issues

**Problem: Slow performance**
- Close unnecessary tabs
- Clear browsing data
- Restart the browser
- Check system resources

**Problem: Can't access certain websites**
- Check internet connection
- Try HTTPS version
- Disable ad blocker temporarily
- Check firewall settings

**Problem: Downloads not working**
- Check download location permissions
- Verify available storage space
- Try different download location

## Uninstallation

### Windows
1. Open Settings > Apps
2. Find "Spàrsh Browser"
3. Click "Uninstall"

Or use the uninstaller:
- Start Menu > Spàrsh Browser > Uninstall

### Linux (DEB)
```bash
sudo apt-get remove sparsh-browser
```

### Linux (AppImage)
```bash
rm Spàrsh-Browser-1.0.0.AppImage
```

### Android
1. Long press app icon
2. Tap "Uninstall"

Or:
- Settings > Apps > Spàrsh Browser > Uninstall

## Updating

### Automatic Updates (Future)
- Will check for updates automatically
- Notify when update available
- One-click update

### Manual Updates (Current)
1. Download latest version
2. Install over existing version
3. Settings and data are preserved

## Data Locations

### Windows
- **Settings**: `%APPDATA%\sparsh-browser\`
- **Cache**: `%APPDATA%\sparsh-browser\Cache\`
- **Downloads**: `%USERPROFILE%\Downloads\`

### Linux
- **Settings**: `~/.config/sparsh-browser/`
- **Cache**: `~/.cache/sparsh-browser/`
- **Downloads**: `~/Downloads/`

### Android
- **Settings**: `/data/data/com.sparsh.browser/`
- **Downloads**: `/sdcard/Download/`

## Getting Help

### Resources
- **Documentation**: See README.md
- **FAQ**: Check GitHub wiki
- **Issues**: [GitHub Issues](https://github.com/yourusername/sparsh-browser/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sparsh-browser/discussions)

### Contact
- **Email**: support@sparsh-browser.com
- **Security**: security@sparsh-browser.com

---

Thank you for choosing Spàrsh Browser! 🌐
