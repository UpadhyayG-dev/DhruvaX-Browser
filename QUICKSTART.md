# Quick Start Guide - Spàrsh Browser

Get up and running with Spàrsh Browser in minutes!

## 🚀 5-Minute Setup

### Step 1: Prerequisites

Install Node.js (18+):
- Download from [nodejs.org](https://nodejs.org/)
- Choose LTS version
- Verify: `node --version` and `npm --version`

### Step 2: Get the Code

```bash
# Clone repository
git clone https://github.com/yourusername/sparsh-browser.git

# Navigate to directory
cd sparsh-browser

# Install dependencies
npm install
```

### Step 3: Run!

```bash
npm start
```

That's it! The browser should open automatically.

## 🎯 First Steps

### 1. Browse the Web
- Type a URL in the address bar
- Or type a search query
- Press Enter

### 2. Open Multiple Tabs
- Click the **+** button
- Or press `Ctrl + T`

### 3. Bookmark a Page
- Visit your favorite site
- Click the bookmark icon (⭐)
- Or press `Ctrl + D`

### 4. View Your History
- Click the menu button (⋮)
- Select "History"
- Or press `Ctrl + H`

### 5. Customize Settings
- Click the menu button (⋮)
- Select "Settings"
- Change search engine, home page, etc.

## ⌨️ Essential Shortcuts

| What | Shortcut |
|------|----------|
| New Tab | `Ctrl + T` |
| Close Tab | `Ctrl + W` |
| Address Bar | `Ctrl + L` |
| Reload | `Ctrl + R` |
| Bookmark | `Ctrl + D` |

## 📱 Building for Production

### Windows Build
```bash
npm run build:win
```
Find installer in `dist/` folder.

### Linux Build
```bash
npm run build:linux
```
Find AppImage in `dist/` folder.

### Android Build
```bash
# First time setup
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android

# Build
npm run build:android
```
Find APK in `android/app/build/outputs/apk/release/`.

## 🎨 Customize Your Experience

### Change Search Engine
1. Settings > General
2. Select from: Google, Bing, DuckDuckGo, Brave

### Set Home Page
1. Settings > General
2. Enter your preferred URL

### Privacy Settings
1. Settings > Privacy & Security
2. Enable ad blocker
3. Enable Do Not Track
4. Choose clear on exit

### Appearance
1. Settings > Appearance
2. Toggle dark mode
3. Show/hide bookmarks bar

## 🆘 Common Issues

### Browser won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Build fails
```bash
# Make sure you have build tools
npm install electron-builder --save-dev
```

### Port already in use
```bash
# Kill existing process
# Windows: taskkill /F /IM electron.exe
# Linux/Mac: killall electron
npm start
```

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **All Features**: See [FEATURES.md](FEATURES.md)
- **Build Guide**: See [BUILD.md](BUILD.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## 💡 Tips & Tricks

### Developer Tools
- Press `F12` to open dev tools
- Right-click and select "Inspect"

### Private Browsing
- Menu > New Private Window
- Or `Ctrl + Shift + N`

### Bookmark Bar
- Show in Settings > Appearance
- Quick access to favorites

### Search from Address Bar
- No need to visit Google
- Just type and press Enter

### Keyboard Navigation
- `Ctrl + Tab`: Next tab
- `Ctrl + Shift + Tab`: Previous tab
- `Alt + ←`: Back
- `Alt + →`: Forward

## 🎓 Video Tutorials (Coming Soon)

- Installing Spàrsh Browser
- Basic browsing
- Managing bookmarks
- Privacy settings
- Building from source

## 🌟 Pro Tips

1. **Use keyboard shortcuts** - Much faster than clicking
2. **Organize bookmarks** - Create folders for different categories
3. **Clear cache regularly** - Keep browser fast
4. **Update frequently** - Get latest features and security
5. **Contribute** - Report bugs, suggest features!

## 🤝 Get Help

Stuck? We're here to help!

- **GitHub Issues**: Report bugs
- **Discussions**: Ask questions
- **Email**: support@sparsh-browser.com

## 🎉 You're Ready!

Start browsing with Spàrsh Browser. Enjoy the speed, privacy, and beauty!

### Next Steps:
1. ⭐ Star the repo on GitHub
2. 🐦 Follow us on Twitter
3. 📢 Share with friends
4. 💻 Contribute to development

---

**Happy Browsing!** 🌐
