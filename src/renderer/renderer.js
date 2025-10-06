// Spàrsh Browser Renderer Process
class SparshRenderer {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = null;
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.createInitialTab();
  }

  async loadSettings() {
    try {
      this.settings = await window.electronAPI.getSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = {
        theme: 'light',
        defaultSearchEngine: 'google',
        homepage: 'https://www.google.com'
      };
    }
  }

  setupEventListeners() {
    // New tab button
    document.getElementById('new-tab-btn').addEventListener('click', () => {
      this.createNewTab();
    });

    // Address bar
    const addressInput = document.getElementById('address-input');
    addressInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.navigateToUrl(addressInput.value);
      }
    });

    addressInput.addEventListener('focus', () => {
      this.showAddressSuggestions();
    });

    addressInput.addEventListener('blur', () => {
      setTimeout(() => this.hideAddressSuggestions(), 200);
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

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(searchInput.value);
      }
    });

    searchBtn.addEventListener('click', () => {
      this.performSearch(searchInput.value);
    });

    // Shortcuts
    document.querySelectorAll('.shortcut-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.querySelector('span').textContent;
        this.navigateToUrl(this.getShortcutUrl(text));
      });
    });

    // IPC event listeners
    window.electronAPI.onTabCreated((event, tab) => {
      this.addTab(tab);
    });

    window.electronAPI.onTabUpdated((event, tab) => {
      this.updateTab(tab);
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

      // Ctrl/Cmd + L - Focus address bar
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('address-input').focus();
        document.getElementById('address-input').select();
      }

      // Ctrl/Cmd + R - Reload
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        this.reload();
      }

      // Ctrl/Cmd + Shift + T - Reopen closed tab
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.reopenClosedTab();
      }
    });
  }

  createInitialTab() {
    const initialTab = {
      id: 1,
      url: this.settings.homepage,
      title: 'New Tab',
      favicon: null,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPrivate: false
    };

    this.addTab(initialTab);
    this.setActiveTab(1);
  }

  async createNewTab() {
    try {
      const tab = await window.electronAPI.createTab();
      this.addTab(tab);
      this.setActiveTab(tab.id);
    } catch (error) {
      console.error('Failed to create new tab:', error);
    }
  }

  addTab(tab) {
    this.tabs.set(tab.id, tab);
    this.renderTab(tab);
  }

  updateTab(tab) {
    this.tabs.set(tab.id, tab);
    this.renderTab(tab);
    
    if (tab.id === this.activeTabId) {
      this.updateAddressBar(tab);
    }
  }

  renderTab(tab) {
    const tabBar = document.getElementById('tab-bar');
    const tabsContainer = tabBar.querySelector('.tabs-container');
    
    // Check if tab already exists
    let tabElement = document.querySelector(`[data-tab-id="${tab.id}"]`);
    
    if (!tabElement) {
      tabElement = document.createElement('div');
      tabElement.className = 'tab';
      tabElement.dataset.tabId = tab.id;
      
      tabElement.innerHTML = `
        <div class="tab-content">
          <div class="tab-favicon">${tab.favicon || '🌐'}</div>
          <span class="tab-title">${tab.title}</span>
          <button class="tab-close">×</button>
        </div>
      `;
      
      // Add event listeners
      tabElement.addEventListener('click', () => {
        this.setActiveTab(tab.id);
      });
      
      tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeTab(tab.id);
      });
      
      tabsContainer.appendChild(tabElement);
    } else {
      // Update existing tab
      tabElement.querySelector('.tab-title').textContent = tab.title;
      tabElement.querySelector('.tab-favicon').textContent = tab.favicon || '🌐';
    }
  }

  setActiveTab(tabId) {
    // Update tab appearance
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }
    
    this.activeTabId = tabId;
    const tab = this.tabs.get(tabId);
    
    if (tab) {
      this.updateAddressBar(tab);
      this.updateNavigationButtons(tab);
      this.updateContent(tab);
    }
  }

  updateAddressBar(tab) {
    const addressInput = document.getElementById('address-input');
    addressInput.value = tab.url;
  }

  updateNavigationButtons(tab) {
    document.getElementById('back-btn').disabled = !tab.canGoBack;
    document.getElementById('forward-btn').disabled = !tab.canGoForward;
  }

  updateContent(tab) {
    const webviewContainer = document.getElementById('webview-container');
    const newTabPage = document.getElementById('new-tab-page');
    
    if (tab.url === this.settings.homepage || !tab.url) {
      newTabPage.style.display = 'flex';
    } else {
      newTabPage.style.display = 'none';
      // Here you would load the actual web content
      // For now, we'll just show a placeholder
      this.loadWebContent(tab.url);
    }
  }

  loadWebContent(url) {
    // This is where you would integrate with a web engine
    // For now, we'll just show a placeholder
    const webviewContainer = document.getElementById('webview-container');
    webviewContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #64748b;">
        <h3>Web Content</h3>
        <p>Loading: ${url}</p>
        <p><em>This is a placeholder. In a real implementation, this would load the actual web page.</em></p>
      </div>
    `;
  }

  async navigateToUrl(url) {
    if (!url) return;
    
    try {
      await window.electronAPI.navigate(this.activeTabId, url);
      
      // Update the tab
      const tab = this.tabs.get(this.activeTabId);
      if (tab) {
        tab.url = url;
        tab.isLoading = true;
        this.updateTab(tab);
      }
    } catch (error) {
      console.error('Failed to navigate:', error);
    }
  }

  performSearch(query) {
    if (!query.trim()) return;
    
    const searchUrl = this.getSearchUrl(query);
    this.navigateToUrl(searchUrl);
  }

  getSearchUrl(query) {
    const searchEngines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    };
    
    return searchEngines[this.settings.defaultSearchEngine] || searchEngines.google;
  }

  getShortcutUrl(text) {
    const shortcuts = {
      'Gmail': 'https://mail.google.com',
      'YouTube': 'https://www.youtube.com',
      'Twitter': 'https://twitter.com',
      'Facebook': 'https://www.facebook.com'
    };
    
    return shortcuts[text] || `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  }

  showAddressSuggestions() {
    // This would show search suggestions
    // For now, we'll just hide the suggestions
    const suggestions = document.getElementById('address-suggestions');
    suggestions.style.display = 'none';
  }

  hideAddressSuggestions() {
    const suggestions = document.getElementById('address-suggestions');
    suggestions.style.display = 'none';
  }

  goBack() {
    // Implement back navigation
    console.log('Going back');
  }

  goForward() {
    // Implement forward navigation
    console.log('Going forward');
  }

  reload() {
    // Implement reload
    console.log('Reloading');
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab) return;
    
    this.tabs.delete(tabId);
    
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.remove();
    }
    
    // If this was the active tab, switch to another tab
    if (tabId === this.activeTabId) {
      const remainingTabs = Array.from(this.tabs.keys());
      if (remainingTabs.length > 0) {
        this.setActiveTab(remainingTabs[0]);
      } else {
        this.createNewTab();
      }
    }
  }

  closeActiveTab() {
    if (this.activeTabId) {
      this.closeTab(this.activeTabId);
    }
  }

  reopenClosedTab() {
    // Implement reopen closed tab functionality
    console.log('Reopening closed tab');
  }
}

// Initialize the renderer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SparshRenderer();
});