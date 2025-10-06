// Main Browser Application Logic
class SparshBrowser {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.settings = {};
    this.history = [];
    this.bookmarks = [];
    this.downloads = [];
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.createInitialTab();
    this.setupWebview();
  }

  async loadSettings() {
    try {
      this.settings = await window.electronAPI.getSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = {
        homepage: 'about:blank',
        searchEngine: 'google',
        theme: 'light',
        privateMode: false
      };
    }
  }

  setupEventListeners() {
    // Window controls
    document.getElementById('minimize-btn').addEventListener('click', () => {
      window.electronAPI.minimizeWindow();
    });

    document.getElementById('maximize-btn').addEventListener('click', () => {
      window.electronAPI.maximizeWindow();
    });

    document.getElementById('close-btn').addEventListener('click', () => {
      window.electronAPI.closeWindow();
    });

    // Address bar
    const addressBar = document.getElementById('address-bar');
    addressBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.navigateToUrl(addressBar.value);
      }
    });

    addressBar.addEventListener('input', (e) => {
      this.handleAddressBarInput(e.target.value);
    });

    // New tab search
    const newTabSearch = document.getElementById('new-tab-search');
    newTabSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.navigateToUrl(e.target.value);
      }
    });

    // Search button
    document.getElementById('search-btn').addEventListener('click', () => {
      const query = newTabSearch.value;
      if (query) {
        this.navigateToUrl(query);
      }
    });

    // Navigation buttons
    document.getElementById('back-btn').addEventListener('click', () => {
      this.goBack();
    });

    document.getElementById('forward-btn').addEventListener('click', () => {
      this.goForward();
    });

    document.getElementById('reload-btn').addEventListener('click', () => {
      this.reload();
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      this.toggleSidebar();
    });

    // New tab button
    document.getElementById('new-tab-btn').addEventListener('click', () => {
      this.createNewTab();
    });

    // Bookmark button
    document.getElementById('bookmark-btn').addEventListener('click', () => {
      this.toggleBookmark();
    });

    // Menu button
    document.getElementById('menu-btn').addEventListener('click', () => {
      this.showMenu();
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + T - New tab
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        this.createNewTab();
      }

      // Ctrl/Cmd + W - Close tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        this.closeActiveTab();
      }

      // Ctrl/Cmd + R - Reload
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        this.reload();
      }

      // Ctrl/Cmd + L - Focus address bar
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        this.focusAddressBar();
      }

      // Ctrl/Cmd + Shift + N - New private tab
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        this.createPrivateTab();
      }

      // Ctrl/Cmd + Tab - Switch tabs
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        this.switchToNextTab();
      }

      // Ctrl/Cmd + Shift + Tab - Switch tabs (reverse)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        this.switchToPreviousTab();
      }

      // F5 - Reload
      if (e.key === 'F5') {
        e.preventDefault();
        this.reload();
      }

      // Escape - Close suggestions/menus
      if (e.key === 'Escape') {
        this.closeSuggestions();
      }
    });
  }

  createInitialTab() {
    const tabId = this.generateTabId();
    const tab = {
      id: tabId,
      title: 'New Tab',
      url: 'about:blank',
      favicon: '🌐',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPrivate: false,
      isActive: true
    };

    this.tabs.push(tab);
    this.activeTabId = tabId;
    this.renderTabs();
    this.showNewTabPage();
  }

  createNewTab(url = 'about:blank', isPrivate = false) {
    const tabId = this.generateTabId();
    const tab = {
      id: tabId,
      title: 'New Tab',
      url: url,
      favicon: '🌐',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPrivate: isPrivate,
      isActive: true
    };

    // Deactivate current active tab
    if (this.activeTabId) {
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.isActive = false;
      }
    }

    this.tabs.push(tab);
    this.activeTabId = tabId;
    this.renderTabs();
    
    if (url !== 'about:blank') {
      this.navigateToUrl(url);
    } else {
      this.showNewTabPage();
    }
  }

  createPrivateTab() {
    this.createNewTab('about:blank', true);
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const tab = this.tabs[tabIndex];
    this.tabs.splice(tabIndex, 1);

    // If closing active tab, switch to another tab
    if (tab.id === this.activeTabId) {
      if (this.tabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
        this.activeTabId = this.tabs[newActiveIndex].id;
        this.tabs[newActiveIndex].isActive = true;
        this.switchToTab(this.activeTabId);
      } else {
        this.activeTabId = null;
        this.showNewTabPage();
      }
    }

    this.renderTabs();
  }

  closeActiveTab() {
    if (this.activeTabId) {
      this.closeTab(this.activeTabId);
    }
  }

  switchToTab(tabId) {
    // Deactivate current active tab
    if (this.activeTabId) {
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.isActive = false;
      }
    }

    // Activate new tab
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.isActive = true;
      this.activeTabId = tabId;
      this.updateAddressBar();
      this.updateNavigationButtons();
      
      if (tab.url === 'about:blank') {
        this.showNewTabPage();
      } else {
        this.showWebview(tab.url);
      }
    }

    this.renderTabs();
  }

  switchToNextTab() {
    if (this.tabs.length <= 1) return;

    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
    const nextIndex = (currentIndex + 1) % this.tabs.length;
    this.switchToTab(this.tabs[nextIndex].id);
  }

  switchToPreviousTab() {
    if (this.tabs.length <= 1) return;

    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
    const prevIndex = currentIndex === 0 ? this.tabs.length - 1 : currentIndex - 1;
    this.switchToTab(this.tabs[prevIndex].id);
  }

  navigateToUrl(url) {
    if (!url) return;

    // Handle special URLs
    if (url === 'about:blank' || url === 'about:newtab') {
      this.showNewTabPage();
      return;
    }

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
      // Check if it looks like a domain
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        // Treat as search query
        url = this.getSearchUrl(url);
      }
    }

    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    if (activeTab) {
      activeTab.url = url;
      activeTab.isLoading = true;
      this.updateAddressBar();
      this.renderTabs();
      this.showWebview(url);
    }
  }

  getSearchUrl(query) {
    const searchEngines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    };
    
    return searchEngines[this.settings.searchEngine] || searchEngines.google;
  }

  handleAddressBarInput(value) {
    // Show suggestions based on input
    this.showSuggestions(value);
  }

  showSuggestions(query) {
    // Implementation for address bar suggestions
    // This would typically search through history, bookmarks, and popular sites
  }

  closeSuggestions() {
    // Hide suggestions dropdown
  }

  goBack() {
    const webview = document.getElementById('webview');
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  }

  goForward() {
    const webview = document.getElementById('webview');
    if (webview && webview.canGoForward()) {
      webview.goForward();
    }
  }

  reload() {
    const webview = document.getElementById('webview');
    if (webview) {
      webview.reload();
    }
  }

  focusAddressBar() {
    const addressBar = document.getElementById('address-bar');
    addressBar.focus();
    addressBar.select();
  }

  showNewTabPage() {
    document.getElementById('webview-container').style.display = 'none';
    document.getElementById('new-tab-page').style.display = 'flex';
  }

  showWebview(url) {
    document.getElementById('new-tab-page').style.display = 'none';
    document.getElementById('webview-container').style.display = 'block';
    
    const webview = document.getElementById('webview');
    if (webview) {
      webview.src = url;
    }
  }

  setupWebview() {
    const webview = document.getElementById('webview');
    if (!webview) return;

    webview.addEventListener('did-start-loading', () => {
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.isLoading = true;
        this.renderTabs();
      }
    });

    webview.addEventListener('did-stop-loading', () => {
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.isLoading = false;
        activeTab.url = webview.getURL();
        activeTab.title = webview.getTitle() || 'Untitled';
        this.updateAddressBar();
        this.updateNavigationButtons();
        this.renderTabs();
      }
    });

    webview.addEventListener('did-fail-load', (event) => {
      console.error('Failed to load:', event.errorDescription);
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.isLoading = false;
        this.renderTabs();
      }
    });

    webview.addEventListener('page-title-updated', (event) => {
      const activeTab = this.tabs.find(t => t.id === this.activeTabId);
      if (activeTab) {
        activeTab.title = event.title;
        this.renderTabs();
      }
    });
  }

  updateAddressBar() {
    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    if (activeTab) {
      document.getElementById('address-bar').value = activeTab.url;
    }
  }

  updateNavigationButtons() {
    const webview = document.getElementById('webview');
    if (webview) {
      document.getElementById('back-btn').disabled = !webview.canGoBack();
      document.getElementById('forward-btn').disabled = !webview.canGoForward();
    }
  }

  renderTabs() {
    const tabsContainer = document.querySelector('.tabs-container');
    tabsContainer.innerHTML = '';

    this.tabs.forEach(tab => {
      const tabElement = document.createElement('div');
      tabElement.className = `tab ${tab.isActive ? 'active' : ''} ${tab.isPrivate ? 'private' : ''} ${tab.isLoading ? 'loading' : ''}`;
      tabElement.dataset.tabId = tab.id;

      tabElement.innerHTML = `
        <div class="tab-content">
          <div class="tab-icon">${tab.favicon}</div>
          <span class="tab-title">${tab.title}</span>
          <button class="tab-close">×</button>
        </div>
      `;

      // Tab click handler
      tabElement.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
          this.switchToTab(tab.id);
        }
      });

      // Tab close handler
      tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeTab(tab.id);
      });

      tabsContainer.appendChild(tabElement);
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-hidden');
  }

  toggleBookmark() {
    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    if (activeTab && activeTab.url !== 'about:blank') {
      // Toggle bookmark
      const bookmarkBtn = document.getElementById('bookmark-btn');
      bookmarkBtn.classList.toggle('bookmarked');
    }
  }

  showMenu() {
    // Show context menu or settings
    console.log('Show menu');
  }

  generateTabId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Initialize the browser when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sparshBrowser = new SparshBrowser();
});

// Expose API for Electron main process
window.electronAPI = {
  minimizeWindow: () => {
    // This would be handled by Electron's main process
  },
  maximizeWindow: () => {
    // This would be handled by Electron's main process
  },
  closeWindow: () => {
    // This would be handled by Electron's main process
  },
  getSettings: async () => {
    // This would be handled by Electron's main process
    return {};
  }
};