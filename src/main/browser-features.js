// Spàrsh Browser Core Features

const { ipcMain, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');

class BrowserFeatures {
  constructor() {
    this.store = new Store();
    this.downloads = [];
    this.history = [];
    this.bookmarks = [];
    this.settings = this.loadSettings();
  }

  loadSettings() {
    return {
      theme: 'light',
      defaultSearchEngine: 'google',
      homepage: 'https://www.google.com',
      privateMode: false,
      enableJavaScript: true,
      enableCookies: true,
      enableImages: true,
      enablePlugins: true,
      downloadPath: path.join(require('os').homedir(), 'Downloads'),
      autoDownload: false,
      showBookmarksBar: true,
      showStatusBar: true,
      showAddressBar: true,
      showTabBar: true,
      zoomLevel: 100,
      ...this.store.get('settings', {})
    };
  }

  saveSettings() {
    this.store.set('settings', this.settings);
  }

  // Downloads Management
  async startDownload(url, filename, windowId) {
    try {
      const downloadId = Date.now().toString();
      const downloadPath = path.join(this.settings.downloadPath, filename);
      
      const download = {
        id: downloadId,
        url,
        filename,
        path: downloadPath,
        status: 'downloading',
        progress: 0,
        startTime: new Date(),
        endTime: null,
        size: 0,
        received: 0
      };

      this.downloads.push(download);
      
      // Notify renderer
      const window = BrowserWindow.fromId(windowId);
      if (window) {
        window.webContents.send('download-started', download);
      }

      // Simulate download (in real implementation, use actual download logic)
      setTimeout(() => {
        download.status = 'completed';
        download.endTime = new Date();
        download.progress = 100;
        
        if (window) {
          window.webContents.send('download-completed', download);
        }
      }, 2000);

      return download;
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  getDownloads() {
    return this.downloads;
  }

  clearDownloads() {
    this.downloads = [];
  }

  // History Management
  addToHistory(url, title, favicon) {
    const historyItem = {
      id: Date.now().toString(),
      url,
      title,
      favicon,
      timestamp: new Date(),
      visitCount: 1
    };

    // Check if URL already exists
    const existingIndex = this.history.findIndex(item => item.url === url);
    if (existingIndex !== -1) {
      this.history[existingIndex].visitCount++;
      this.history[existingIndex].timestamp = new Date();
    } else {
      this.history.unshift(historyItem);
      // Keep only last 1000 items
      if (this.history.length > 1000) {
        this.history = this.history.slice(0, 1000);
      }
    }

    this.saveHistory();
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  searchHistory(query) {
    return this.history.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.url.toLowerCase().includes(query.toLowerCase())
    );
  }

  saveHistory() {
    this.store.set('history', this.history);
  }

  loadHistory() {
    this.history = this.store.get('history', []);
  }

  // Bookmarks Management
  addBookmark(url, title, favicon) {
    const bookmark = {
      id: Date.now().toString(),
      url,
      title,
      favicon,
      dateAdded: new Date(),
      folder: 'Bookmarks'
    };

    this.bookmarks.push(bookmark);
    this.saveBookmarks();
    return bookmark;
  }

  removeBookmark(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    this.saveBookmarks();
  }

  getBookmarks() {
    return this.bookmarks;
  }

  searchBookmarks(query) {
    return this.bookmarks.filter(bookmark => 
      bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(query.toLowerCase())
    );
  }

  saveBookmarks() {
    this.store.set('bookmarks', this.bookmarks);
  }

  loadBookmarks() {
    this.bookmarks = this.store.get('bookmarks', []);
  }

  // Settings Management
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getSettings() {
    return this.settings;
  }

  resetSettings() {
    this.settings = this.loadSettings();
    this.saveSettings();
  }

  // Private Mode
  enablePrivateMode() {
    this.settings.privateMode = true;
    this.saveSettings();
  }

  disablePrivateMode() {
    this.settings.privateMode = false;
    this.saveSettings();
  }

  isPrivateMode() {
    return this.settings.privateMode;
  }

  // Search Suggestions
  getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];

    const suggestions = [];
    
    // Add history suggestions
    const historySuggestions = this.history
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.url.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(item => ({
        type: 'history',
        title: item.title,
        url: item.url,
        favicon: item.favicon
      }));

    suggestions.push(...historySuggestions);

    // Add bookmark suggestions
    const bookmarkSuggestions = this.bookmarks
      .filter(bookmark => 
        bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(bookmark => ({
        type: 'bookmark',
        title: bookmark.title,
        url: bookmark.url,
        favicon: bookmark.favicon
      }));

    suggestions.push(...bookmarkSuggestions);

    // Add search suggestions (in real implementation, use search API)
    const searchSuggestions = [
      { type: 'search', title: `Search for "${query}"`, url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
      { type: 'search', title: `Search "${query}" on YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` },
      { type: 'search', title: `Search "${query}" on Wikipedia`, url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}` }
    ];

    suggestions.push(...searchSuggestions);

    return suggestions.slice(0, 8);
  }

  // File Operations
  async openFile(filePath) {
    try {
      await shell.openPath(filePath);
      return true;
    } catch (error) {
      console.error('Failed to open file:', error);
      return false;
    }
  }

  async showSaveDialog(windowId, options = {}) {
    const window = BrowserWindow.fromId(windowId);
    if (!window) return null;

    const result = await dialog.showSaveDialog(window, {
      title: 'Save File',
      defaultPath: options.defaultPath || 'untitled',
      filters: options.filters || [
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    return result.canceled ? null : result.filePath;
  }

  async showOpenDialog(windowId, options = {}) {
    const window = BrowserWindow.fromId(windowId);
    if (!window) return null;

    const result = await dialog.showOpenDialog(window, {
      title: 'Open File',
      properties: ['openFile'],
      filters: options.filters || [
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    return result.canceled ? null : result.filePaths[0];
  }

  // Initialize features
  initialize() {
    this.loadHistory();
    this.loadBookmarks();
    this.setupIPC();
  }

  setupIPC() {
    // Downloads
    ipcMain.handle('start-download', async (event, url, filename, windowId) => {
      return await this.startDownload(url, filename, windowId);
    });

    ipcMain.handle('get-downloads', () => {
      return this.getDownloads();
    });

    ipcMain.handle('clear-downloads', () => {
      this.clearDownloads();
    });

    // History
    ipcMain.handle('add-to-history', (event, url, title, favicon) => {
      this.addToHistory(url, title, favicon);
    });

    ipcMain.handle('get-history', () => {
      return this.getHistory();
    });

    ipcMain.handle('clear-history', () => {
      this.clearHistory();
    });

    ipcMain.handle('search-history', (event, query) => {
      return this.searchHistory(query);
    });

    // Bookmarks
    ipcMain.handle('add-bookmark', (event, url, title, favicon) => {
      return this.addBookmark(url, title, favicon);
    });

    ipcMain.handle('remove-bookmark', (event, id) => {
      this.removeBookmark(id);
    });

    ipcMain.handle('get-bookmarks', () => {
      return this.getBookmarks();
    });

    ipcMain.handle('search-bookmarks', (event, query) => {
      return this.searchBookmarks(query);
    });

    // Settings
    ipcMain.handle('update-settings', (event, newSettings) => {
      this.updateSettings(newSettings);
    });

    ipcMain.handle('get-settings', () => {
      return this.getSettings();
    });

    ipcMain.handle('reset-settings', () => {
      this.resetSettings();
    });

    // Search suggestions
    ipcMain.handle('get-search-suggestions', (event, query) => {
      return this.getSearchSuggestions(query);
    });

    // File operations
    ipcMain.handle('open-file', async (event, filePath) => {
      return await this.openFile(filePath);
    });

    ipcMain.handle('show-save-dialog', async (event, options) => {
      return await this.showSaveDialog(event.sender.id, options);
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
      return await this.showOpenDialog(event.sender.id, options);
    });
  }
}

module.exports = BrowserFeatures;