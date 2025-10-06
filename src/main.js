const { app, BrowserWindow, BrowserView, ipcMain, session, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let views = new Map();
let activeViewId = null;

// Initialize default settings
if (!store.has('settings')) {
  store.set('settings', {
    defaultSearchEngine: 'https://www.google.com/search?q=',
    homePage: 'sparsh://newtab',
    darkMode: true,
    adBlockEnabled: true,
    downloadsPath: app.getPath('downloads')
  });
}

// Initialize bookmarks and history
if (!store.has('bookmarks')) {
  store.set('bookmarks', [
    { id: '1', title: 'Google', url: 'https://www.google.com', favicon: '' },
    { id: '2', title: 'YouTube', url: 'https://www.youtube.com', favicon: '' },
    { id: '3', title: 'GitHub', url: 'https://www.github.com', favicon: '' }
  ]);
}

if (!store.has('history')) {
  store.set('history', []);
}

if (!store.has('downloads')) {
  store.set('downloads', []);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Remove default menu
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Handle window controls
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow.close());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Tab management
ipcMain.handle('create-tab', async (event, url) => {
  const viewId = `view-${Date.now()}`;
  const bounds = mainWindow.getBounds();
  
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.addBrowserView(view);
  
  // Position below UI (approximately 130px for UI elements)
  view.setBounds({ x: 0, y: 130, width: bounds.width, height: bounds.height - 130 });
  view.setAutoResize({ width: true, height: true });

  views.set(viewId, view);
  
  const loadUrl = url || 'sparsh://newtab';
  
  if (loadUrl.startsWith('sparsh://newtab')) {
    view.webContents.loadFile(path.join(__dirname, 'renderer/newtab.html'));
  } else if (loadUrl.startsWith('sparsh://')) {
    handleInternalUrl(view, loadUrl);
  } else {
    view.webContents.loadURL(loadUrl);
  }

  activeViewId = viewId;

  // Track navigation
  view.webContents.on('did-navigate', (event, url) => {
    mainWindow.webContents.send('tab-navigated', { viewId, url, title: view.webContents.getTitle() });
    addToHistory(url, view.webContents.getTitle());
  });

  view.webContents.on('did-navigate-in-page', (event, url) => {
    mainWindow.webContents.send('tab-navigated', { viewId, url, title: view.webContents.getTitle() });
  });

  view.webContents.on('page-title-updated', (event, title) => {
    mainWindow.webContents.send('tab-title-updated', { viewId, title });
  });

  view.webContents.on('page-favicon-updated', (event, favicons) => {
    mainWindow.webContents.send('tab-favicon-updated', { viewId, favicon: favicons[0] });
  });

  return viewId;
});

ipcMain.handle('switch-tab', async (event, viewId) => {
  if (views.has(viewId)) {
    // Hide all views
    views.forEach((view) => {
      mainWindow.removeBrowserView(view);
    });
    
    // Show selected view
    const view = views.get(viewId);
    mainWindow.addBrowserView(view);
    
    const bounds = mainWindow.getBounds();
    view.setBounds({ x: 0, y: 130, width: bounds.width, height: bounds.height - 130 });
    
    activeViewId = viewId;
    return true;
  }
  return false;
});

ipcMain.handle('close-tab', async (event, viewId) => {
  if (views.has(viewId)) {
    const view = views.get(viewId);
    mainWindow.removeBrowserView(view);
    view.webContents.destroy();
    views.delete(viewId);
    
    if (activeViewId === viewId) {
      activeViewId = null;
    }
    
    return true;
  }
  return false;
});

ipcMain.handle('navigate-to', async (event, url) => {
  if (activeViewId && views.has(activeViewId)) {
    const view = views.get(activeViewId);
    
    if (url.startsWith('sparsh://newtab')) {
      view.webContents.loadFile(path.join(__dirname, 'renderer/newtab.html'));
    } else if (url.startsWith('sparsh://')) {
      handleInternalUrl(view, url);
    } else {
      // Add protocol if missing
      if (!url.match(/^https?:\/\//)) {
        // Check if it's a search query or URL
        if (url.includes(' ') || !url.includes('.')) {
          url = store.get('settings.defaultSearchEngine') + encodeURIComponent(url);
        } else {
          url = 'https://' + url;
        }
      }
      view.webContents.loadURL(url);
    }
    return true;
  }
  return false;
});

ipcMain.handle('go-back', async () => {
  if (activeViewId && views.has(activeViewId)) {
    const view = views.get(activeViewId);
    if (view.webContents.canGoBack()) {
      view.webContents.goBack();
      return true;
    }
  }
  return false;
});

ipcMain.handle('go-forward', async () => {
  if (activeViewId && views.has(activeViewId)) {
    const view = views.get(activeViewId);
    if (view.webContents.canGoForward()) {
      view.webContents.goForward();
      return true;
    }
  }
  return false;
});

ipcMain.handle('reload', async () => {
  if (activeViewId && views.has(activeViewId)) {
    const view = views.get(activeViewId);
    view.webContents.reload();
    return true;
  }
  return false;
});

ipcMain.handle('stop-loading', async () => {
  if (activeViewId && views.has(activeViewId)) {
    const view = views.get(activeViewId);
    view.webContents.stop();
    return true;
  }
  return false;
});

// Bookmarks management
ipcMain.handle('get-bookmarks', async () => {
  return store.get('bookmarks', []);
});

ipcMain.handle('add-bookmark', async (event, bookmark) => {
  const bookmarks = store.get('bookmarks', []);
  const newBookmark = {
    id: Date.now().toString(),
    ...bookmark,
    createdAt: new Date().toISOString()
  };
  bookmarks.push(newBookmark);
  store.set('bookmarks', bookmarks);
  return newBookmark;
});

ipcMain.handle('remove-bookmark', async (event, id) => {
  const bookmarks = store.get('bookmarks', []);
  const filtered = bookmarks.filter(b => b.id !== id);
  store.set('bookmarks', filtered);
  return true;
});

// History management
function addToHistory(url, title) {
  if (url.startsWith('sparsh://')) return;
  
  const history = store.get('history', []);
  const entry = {
    id: Date.now().toString(),
    url,
    title: title || url,
    visitedAt: new Date().toISOString()
  };
  
  history.unshift(entry);
  
  // Keep only last 1000 entries
  if (history.length > 1000) {
    history.pop();
  }
  
  store.set('history', history);
}

ipcMain.handle('get-history', async () => {
  return store.get('history', []);
});

ipcMain.handle('clear-history', async () => {
  store.set('history', []);
  return true;
});

// Downloads management
ipcMain.handle('get-downloads', async () => {
  return store.get('downloads', []);
});

// Settings management
ipcMain.handle('get-settings', async () => {
  return store.get('settings');
});

ipcMain.handle('update-settings', async (event, settings) => {
  const current = store.get('settings');
  store.set('settings', { ...current, ...settings });
  return store.get('settings');
});

function handleInternalUrl(view, url) {
  if (url === 'sparsh://history') {
    view.webContents.loadFile(path.join(__dirname, 'renderer/history.html'));
  } else if (url === 'sparsh://downloads') {
    view.webContents.loadFile(path.join(__dirname, 'renderer/downloads.html'));
  } else if (url === 'sparsh://settings') {
    view.webContents.loadFile(path.join(__dirname, 'renderer/settings.html'));
  } else if (url === 'sparsh://bookmarks') {
    view.webContents.loadFile(path.join(__dirname, 'renderer/bookmarks.html'));
  }
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle downloads
app.on('ready', () => {
  session.defaultSession.on('will-download', (event, item, webContents) => {
    const downloads = store.get('downloads', []);
    const download = {
      id: Date.now().toString(),
      filename: item.getFilename(),
      url: item.getURL(),
      totalBytes: item.getTotalBytes(),
      startTime: new Date().toISOString(),
      status: 'downloading'
    };
    
    downloads.unshift(download);
    store.set('downloads', downloads);
    
    mainWindow.webContents.send('download-started', download);
    
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        download.status = 'interrupted';
      } else if (state === 'progressing') {
        download.receivedBytes = item.getReceivedBytes();
        download.progress = (item.getReceivedBytes() / item.getTotalBytes()) * 100;
      }
      mainWindow.webContents.send('download-progress', download);
    });
    
    item.once('done', (event, state) => {
      download.status = state;
      download.path = item.getSavePath();
      const allDownloads = store.get('downloads', []);
      const index = allDownloads.findIndex(d => d.id === download.id);
      if (index !== -1) {
        allDownloads[index] = download;
        store.set('downloads', allDownloads);
      }
      mainWindow.webContents.send('download-completed', download);
    });
  });
});
