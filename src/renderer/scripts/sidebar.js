// Sidebar Management System
class SidebarManager {
  constructor(browser) {
    this.browser = browser;
    this.isVisible = false;
    this.currentSection = 'bookmarks';
    this.setupSidebarHandlers();
    this.loadSidebarData();
  }

  setupSidebarHandlers() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Sidebar close
    const sidebarClose = document.getElementById('sidebar-close');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => this.hideSidebar());
    }

    // Overlay click to close
    this.createOverlay();
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => this.hideSidebar());
  }

  toggleSidebar() {
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  showSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('sidebar-hidden');
      sidebar.classList.add('sidebar-visible');
    }
    
    if (overlay) {
      overlay.classList.add('visible');
    }
    
    this.isVisible = true;
    this.updateSidebarContent();
  }

  hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.add('sidebar-hidden');
      sidebar.classList.remove('sidebar-visible');
    }
    
    if (overlay) {
      overlay.classList.remove('visible');
    }
    
    this.isVisible = false;
  }

  updateSidebarContent() {
    this.renderBookmarks();
    this.renderHistory();
    this.renderDownloads();
  }

  loadSidebarData() {
    this.loadBookmarks();
    this.loadHistory();
    this.loadDownloads();
  }

  // Bookmarks Management
  loadBookmarks() {
    const saved = localStorage.getItem('sparsh_bookmarks');
    if (saved) {
      try {
        this.browser.bookmarks = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        this.browser.bookmarks = [];
      }
    } else {
      this.browser.bookmarks = this.getDefaultBookmarks();
    }
  }

  getDefaultBookmarks() {
    return [
      {
        id: 'bookmark_1',
        title: 'Spàrsh Homepage',
        url: 'about:home',
        icon: '🌌',
        folder: 'default',
        dateAdded: Date.now()
      },
      {
        id: 'bookmark_2',
        title: 'Google',
        url: 'https://www.google.com',
        icon: '🔍',
        folder: 'default',
        dateAdded: Date.now()
      },
      {
        id: 'bookmark_3',
        title: 'GitHub',
        url: 'https://github.com',
        icon: '💻',
        folder: 'default',
        dateAdded: Date.now()
      }
    ];
  }

  saveBookmarks() {
    localStorage.setItem('sparsh_bookmarks', JSON.stringify(this.browser.bookmarks));
  }

  addBookmark(url, title, folder = 'default') {
    const bookmark = {
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || 'Untitled',
      url: url,
      icon: this.getFaviconForUrl(url),
      folder: folder,
      dateAdded: Date.now()
    };

    this.browser.bookmarks.unshift(bookmark);
    this.saveBookmarks();
    this.renderBookmarks();
  }

  removeBookmark(bookmarkId) {
    this.browser.bookmarks = this.browser.bookmarks.filter(b => b.id !== bookmarkId);
    this.saveBookmarks();
    this.renderBookmarks();
  }

  updateBookmark(bookmarkId, updates) {
    const bookmark = this.browser.bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      Object.assign(bookmark, updates);
      this.saveBookmarks();
      this.renderBookmarks();
    }
  }

  renderBookmarks() {
    const bookmarkList = document.querySelector('.bookmark-list');
    if (!bookmarkList) return;

    bookmarkList.innerHTML = '';

    if (this.browser.bookmarks.length === 0) {
      bookmarkList.innerHTML = '<div class="empty-state">No bookmarks yet</div>';
      return;
    }

    this.browser.bookmarks.forEach(bookmark => {
      const bookmarkElement = this.createBookmarkElement(bookmark);
      bookmarkList.appendChild(bookmarkElement);
    });
  }

  createBookmarkElement(bookmark) {
    const element = document.createElement('div');
    element.className = 'bookmark-item';
    element.dataset.bookmarkId = bookmark.id;

    element.innerHTML = `
      <span class="bookmark-icon">${bookmark.icon}</span>
      <span class="bookmark-title">${bookmark.title}</span>
    `;

    element.addEventListener('click', () => {
      this.browser.navigateToUrl(bookmark.url);
      this.hideSidebar();
    });

    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showBookmarkContextMenu(e, bookmark);
    });

    return element;
  }

  showBookmarkContextMenu(event, bookmark) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'sidebar-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.zIndex = '1000';

    const menuItems = [
      { text: 'Open', action: () => this.browser.navigateToUrl(bookmark.url) },
      { text: 'Open in New Tab', action: () => this.browser.createNewTab(bookmark.url) },
      { text: 'Edit', action: () => this.editBookmark(bookmark) },
      { text: 'Delete', action: () => this.removeBookmark(bookmark.id), danger: true }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = `sidebar-context-menu-item ${item.danger ? 'danger' : ''}`;
      menuItem.textContent = item.text;
      menuItem.addEventListener('click', () => {
        item.action();
        contextMenu.remove();
      });
      contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    const closeMenu = (e) => {
      if (!contextMenu.contains(e.target)) {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }

  editBookmark(bookmark) {
    const newTitle = prompt('Edit bookmark title:', bookmark.title);
    if (newTitle && newTitle !== bookmark.title) {
      this.updateBookmark(bookmark.id, { title: newTitle });
    }
  }

  // History Management
  loadHistory() {
    const saved = localStorage.getItem('sparsh_history');
    if (saved) {
      try {
        this.browser.history = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load history:', error);
        this.browser.history = [];
      }
    }
  }

  renderHistory() {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;

    historyList.innerHTML = '';

    if (this.browser.history.length === 0) {
      historyList.innerHTML = '<div class="empty-state">No history yet</div>';
      return;
    }

    // Show recent history (last 20 items)
    const recentHistory = this.browser.history.slice(0, 20);
    
    recentHistory.forEach(historyItem => {
      const historyElement = this.createHistoryElement(historyItem);
      historyList.appendChild(historyElement);
    });
  }

  createHistoryElement(historyItem) {
    const element = document.createElement('div');
    element.className = 'history-item';
    element.dataset.historyId = historyItem.id;

    const timeAgo = this.getTimeAgo(historyItem.timestamp);

    element.innerHTML = `
      <span class="history-time">${timeAgo}</span>
      <span class="history-title">${historyItem.title}</span>
    `;

    element.addEventListener('click', () => {
      this.browser.navigateToUrl(historyItem.url);
      this.hideSidebar();
    });

    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showHistoryContextMenu(e, historyItem);
    });

    return element;
  }

  showHistoryContextMenu(event, historyItem) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'sidebar-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.zIndex = '1000';

    const menuItems = [
      { text: 'Open', action: () => this.browser.navigateToUrl(historyItem.url) },
      { text: 'Open in New Tab', action: () => this.browser.createNewTab(historyItem.url) },
      { text: 'Copy URL', action: () => this.copyToClipboard(historyItem.url) },
      { text: 'Delete', action: () => this.removeFromHistory(historyItem.id), danger: true }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = `sidebar-context-menu-item ${item.danger ? 'danger' : ''}`;
      menuItem.textContent = item.text;
      menuItem.addEventListener('click', () => {
        item.action();
        contextMenu.remove();
      });
      contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    const closeMenu = (e) => {
      if (!contextMenu.contains(e.target)) {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }

  removeFromHistory(historyId) {
    this.browser.history = this.browser.history.filter(h => h.id !== historyId);
    this.saveHistory();
    this.renderHistory();
  }

  saveHistory() {
    localStorage.setItem('sparsh_history', JSON.stringify(this.browser.history));
  }

  // Downloads Management
  loadDownloads() {
    const saved = localStorage.getItem('sparsh_downloads');
    if (saved) {
      try {
        this.browser.downloads = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load downloads:', error);
        this.browser.downloads = [];
      }
    }
  }

  renderDownloads() {
    const downloadsList = document.querySelector('.downloads-list');
    if (!downloadsList) return;

    downloadsList.innerHTML = '';

    if (this.browser.downloads.length === 0) {
      downloadsList.innerHTML = '<div class="empty-state">No downloads yet</div>';
      return;
    }

    this.browser.downloads.forEach(download => {
      const downloadElement = this.createDownloadElement(download);
      downloadsList.appendChild(downloadElement);
    });
  }

  createDownloadElement(download) {
    const element = document.createElement('div');
    element.className = 'download-item';
    element.dataset.downloadId = download.id;

    const progressBar = download.progress < 100 ? 
      `<div class="download-progress">
        <div class="download-progress-bar" style="width: ${download.progress}%"></div>
      </div>` : '';

    element.innerHTML = `
      <span class="download-icon">${download.icon}</span>
      <span class="download-name">${download.name}</span>
      ${progressBar}
      <span class="download-status">${download.status}</span>
    `;

    element.addEventListener('click', () => {
      if (download.status === 'completed') {
        this.openDownload(download);
      }
    });

    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showDownloadContextMenu(e, download);
    });

    return element;
  }

  showDownloadContextMenu(event, download) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'sidebar-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.zIndex = '1000';

    const menuItems = [
      { text: 'Open', action: () => this.openDownload(download), disabled: download.status !== 'completed' },
      { text: 'Show in Folder', action: () => this.showInFolder(download), disabled: download.status !== 'completed' },
      { text: 'Copy URL', action: () => this.copyToClipboard(download.url) },
      { text: 'Delete', action: () => this.removeDownload(download.id), danger: true }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = `sidebar-context-menu-item ${item.danger ? 'danger' : ''} ${item.disabled ? 'disabled' : ''}`;
      menuItem.textContent = item.text;
      if (!item.disabled) {
        menuItem.addEventListener('click', () => {
          item.action();
          contextMenu.remove();
        });
      }
      contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    const closeMenu = (e) => {
      if (!contextMenu.contains(e.target)) {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }

  addDownload(url, filename, size) {
    const download = {
      id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: url,
      name: filename,
      size: size,
      progress: 0,
      status: 'downloading',
      icon: this.getFileIcon(filename),
      dateAdded: Date.now()
    };

    this.browser.downloads.unshift(download);
    this.saveDownloads();
    this.renderDownloads();
    return download;
  }

  updateDownloadProgress(downloadId, progress) {
    const download = this.browser.downloads.find(d => d.id === downloadId);
    if (download) {
      download.progress = progress;
      if (progress >= 100) {
        download.status = 'completed';
      }
      this.saveDownloads();
      this.renderDownloads();
    }
  }

  removeDownload(downloadId) {
    this.browser.downloads = this.browser.downloads.filter(d => d.id !== downloadId);
    this.saveDownloads();
    this.renderDownloads();
  }

  saveDownloads() {
    localStorage.setItem('sparsh_downloads', JSON.stringify(this.browser.downloads));
  }

  openDownload(download) {
    // Implementation to open downloaded file
    console.log('Opening download:', download.name);
  }

  showInFolder(download) {
    // Implementation to show file in folder
    console.log('Showing in folder:', download.name);
  }

  // Utility functions
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  getFaviconForUrl(url) {
    try {
      const urlObj = new URL(url);
      return '🌐'; // Default favicon
    } catch (error) {
      return '🌐';
    }
  }

  getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'txt': '📄',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'avi': '🎥',
      'mp3': '🎵',
      'wav': '🎵',
      'zip': '📦',
      'rar': '📦',
      'exe': '⚙️',
      'dmg': '💿'
    };
    return iconMap[extension] || '📁';
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }
}

// Export for use in main browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarManager;
}