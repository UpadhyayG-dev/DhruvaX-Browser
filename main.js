const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Spàrsh Browser',
    titleBarStyle: 'default',
    frame: true,
    show: false
  });

  // Load the main HTML file
  mainWindow.loadFile('src/index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open the DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle new window creation
  mainWindow.webContents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    mainWindow.loadURL(navigationUrl);
  });

  // Handle download requests
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set download location
    item.setSavePath(path.join(app.getPath('downloads'), item.getFilename()));

    item.once('done', (event, state) => {
      if (state === 'completed') {
        // Show notification or handle download completion
        mainWindow.webContents.send('download-completed', {
          filename: item.getFilename(),
          path: item.getSavePath()
        });
      }
    });
  });

  // Create application menu
  createMenu();

  return mainWindow;
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createWindow();
          }
        },
        {
          label: 'New Tab',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            mainWindow.webContents.send('new-tab');
          }
        },
        { type: 'separator' },
        {
          label: 'Open Location',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            mainWindow.webContents.send('focus-address-bar');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
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
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          }
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Home',
          accelerator: 'Alt+Home',
          click: () => {
            mainWindow.webContents.send('go-home');
          }
        }
      ]
    },
    {
      label: 'Bookmarks',
      submenu: [
        {
          label: 'Add Bookmark',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('add-bookmark');
          }
        },
        {
          label: 'Show Bookmarks',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('show-bookmarks');
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Downloads',
          click: () => {
            mainWindow.webContents.send('show-downloads');
          }
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('show-settings');
          }
        },
        {
          label: 'Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Spàrsh Browser',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Spàrsh Browser',
              message: 'Spàrsh Browser v1.0.0',
              detail: 'A free, open-source web browser.\nBuilt with Electron and love.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('get-bookmarks', () => {
  return store.get('bookmarks', []);
});

ipcMain.handle('save-bookmarks', (event, bookmarks) => {
  store.set('bookmarks', bookmarks);
});

ipcMain.handle('get-history', () => {
  return store.get('history', []);
});

ipcMain.handle('save-history', (event, history) => {
  store.set('history', history);
});

ipcMain.handle('get-settings', () => {
  return store.get('settings', {
    homePage: 'https://www.google.com',
    searchEngine: 'https://www.google.com/search?q=',
    theme: 'system'
  });
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    contents.loadURL(navigationUrl);
  });
});