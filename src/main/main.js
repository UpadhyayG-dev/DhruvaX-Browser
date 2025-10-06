const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const BrowserFeatures = require('./browser-features');

// Initialize store for settings
const store = new Store();

class SparshBrowser {
  constructor() {
    this.windows = new Map();
    this.tabIdCounter = 0;
    this.browserFeatures = new BrowserFeatures();
    this.settings = this.browserFeatures.getSettings();
  }

  createWindow() {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false
    });

    // Load the renderer
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
      this.windows.delete(mainWindow.id);
    });

    this.windows.set(mainWindow.id, mainWindow);
    return mainWindow;
  }

  createTab(windowId, url = null) {
    const window = this.windows.get(windowId);
    if (!window) return null;

    const tabId = ++this.tabIdCounter;
    const tab = {
      id: tabId,
      url: url || this.settings.homepage,
      title: 'New Tab',
      favicon: null,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPrivate: this.settings.privateMode
    };

    // Send tab creation to renderer
    window.webContents.send('tab-created', tab);
    return tab;
  }

  navigateToUrl(tabId, url) {
    // Handle different URL types
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    // Update tab URL
    const tab = this.findTabById(tabId);
    if (tab) {
      tab.url = url;
      tab.isLoading = true;
      
      // Send navigation update to renderer
      const window = this.findWindowByTabId(tabId);
      if (window) {
        window.webContents.send('tab-updated', tab);
      }
    }
  }

  findTabById(tabId) {
    // This would be implemented with proper tab management
    return { id: tabId, url: '', title: '', favicon: null, isLoading: false };
  }

  findWindowByTabId(tabId) {
    // This would find the window containing the tab
    return this.windows.values().next().value;
  }

  setupMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Tab',
            accelerator: 'CmdOrCtrl+T',
            click: () => {
              const activeWindow = BrowserWindow.getFocusedWindow();
              if (activeWindow) {
                this.createTab(activeWindow.id);
              }
            }
          },
          {
            label: 'New Window',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.createWindow();
            }
          },
          { type: 'separator' },
          {
            label: 'Private Window',
            accelerator: 'CmdOrCtrl+Shift+N',
            click: () => {
              this.settings.privateMode = true;
              this.createWindow();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIPC() {
    ipcMain.handle('navigate', async (event, tabId, url) => {
      this.navigateToUrl(tabId, url);
    });

    ipcMain.handle('create-tab', async (event, windowId) => {
      return this.createTab(windowId);
    });

    ipcMain.handle('get-settings', async () => {
      return this.settings;
    });

    ipcMain.handle('update-settings', async (event, newSettings) => {
      this.settings = { ...this.settings, ...newSettings };
      store.set('settings', this.settings);
    });
  }

  async initialize() {
    // Initialize browser features
    this.browserFeatures.initialize();

    // Setup auto-updater
    autoUpdater.checkForUpdatesAndNotify();

    // Setup menu
    this.setupMenu();

    // Setup IPC handlers
    this.setupIPC();

    // Create initial window
    app.whenReady().then(() => {
      this.createWindow();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }
}

// Initialize the browser
const browser = new SparshBrowser();
browser.initialize();