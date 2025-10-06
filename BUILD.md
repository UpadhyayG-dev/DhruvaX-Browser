# Build Instructions for Spàrsh Browser

This document provides detailed instructions for building Spàrsh Browser for different platforms.

## Prerequisites

### All Platforms
- Node.js 18 or higher
- npm 9 or higher
- Git

### Windows Build
- Windows 10 or higher
- No additional requirements

### Linux Build
- Ubuntu 20.04 or higher (or equivalent)
- `libgtk-3-dev`, `libnotify-dev`, `libgconf-2-4`, `libnss3`, `libxss1`, `libasound2`

### Android Build
- Android Studio
- Android SDK (API 28+)
- Java Development Kit (JDK) 17
- Gradle 8.0+

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sparsh-browser.git
   cd sparsh-browser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Development Mode

Run the browser in development mode:

```bash
npm start
```

This will launch the Electron application with hot-reload enabled.

## Building for Production

### Windows

```bash
npm run build:win
```

**Output:**
- `dist/Spàrsh Browser Setup X.X.X.exe` - NSIS installer
- `dist/Spàrsh Browser X.X.X.exe` - Portable version

**Requirements:**
- Windows 10 or higher to build
- Targets Windows 10+ users

### Linux

```bash
npm run build:linux
```

**Output:**
- `dist/Spàrsh-Browser-X.X.X.AppImage` - AppImage (portable)
- `dist/sparsh-browser_X.X.X_amd64.deb` - Debian package

**Requirements:**
- Ubuntu/Debian-based system recommended
- Targets most Linux distributions

### macOS (Optional)

```bash
npm run build:mac
```

**Output:**
- `dist/Spàrsh Browser-X.X.X.dmg` - DMG installer
- `dist/Spàrsh Browser-X.X.X-mac.zip` - ZIP archive

**Requirements:**
- macOS 10.13 or higher to build
- Targets macOS 10.13+ users

## Building for Android

### Setup

1. **Install Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialize Capacitor**
   ```bash
   npx cap init "Spàrsh Browser" "com.sparsh.browser"
   ```

3. **Prepare web assets**
   ```bash
   # Create www directory and copy files
   mkdir -p www
   cp -r src/renderer/* www/
   cp src/main.js www/
   ```

4. **Add Android platform**
   ```bash
   npx cap add android
   ```

### Build APK

1. **Sync changes**
   ```bash
   npx cap sync android
   ```

2. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

3. **Build in Android Studio**
   - Click `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
   - Or use command line:
     ```bash
     cd android
     ./gradlew assembleRelease
     ```

**Output:**
- `android/app/build/outputs/apk/release/app-release.apk`

### Build AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

**Output:**
- `android/app/build/outputs/bundle/release/app-release.aab`

## Code Signing

### Windows

For production releases, sign the Windows executable:

1. Obtain a code signing certificate
2. Update `package.json` with certificate info:
   ```json
   "build": {
     "win": {
       "certificateFile": "path/to/cert.pfx",
       "certificatePassword": "password"
     }
   }
   ```

### Android

1. **Generate keystore**
   ```bash
   keytool -genkey -v -keystore sparsh-release.keystore -alias sparsh -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in Android Studio**
   - Build > Generate Signed Bundle / APK
   - Select keystore file and enter credentials
   - Choose release build variant

3. **Or configure in `android/app/build.gradle`**
   ```gradle
   android {
     signingConfigs {
       release {
         storeFile file("sparsh-release.keystore")
         storePassword "password"
         keyAlias "sparsh"
         keyPassword "password"
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
       }
     }
   }
   ```

## Distribution Size

Approximate build sizes:

- **Windows Installer**: ~150-200 MB
- **Linux AppImage**: ~180-220 MB
- **Android APK**: ~50-80 MB
- **Android AAB**: ~40-60 MB

## Troubleshooting

### Windows Build Issues

**Error: "wine not found"**
- This warning can be ignored if building on Windows
- If cross-compiling from Linux/Mac, install Wine

**Error: "electron-builder not found"**
```bash
npm install electron-builder --save-dev
```

### Linux Build Issues

**Error: "Missing dependencies"**
```bash
sudo apt-get install libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

### Android Build Issues

**Error: "SDK location not found"**
1. Set `ANDROID_HOME` environment variable
2. Or create `android/local.properties`:
   ```
   sdk.dir=/path/to/Android/Sdk
   ```

**Error: "Gradle build failed"**
1. Update Android Studio
2. Update Gradle in `android/gradle/wrapper/gradle-wrapper.properties`
3. Sync project with Gradle files

## Automated Builds

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build

on: [push, pull_request]

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-build
          path: dist/*.exe

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:linux
      - uses: actions/upload-artifact@v3
        with:
          name: linux-build
          path: dist/*.AppImage
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Create git tag: `git tag v1.0.0`
5. Push tag: `git push --tags`
6. Build for all platforms
7. Create GitHub release
8. Upload build artifacts
9. Publish release notes

## Support

For build issues:
- Check existing GitHub issues
- Create a new issue with build logs
- Join our Discord community
- Email: support@sparsh-browser.com

## Additional Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/studio/build)
