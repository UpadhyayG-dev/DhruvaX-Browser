// Navigation and URL Management
class NavigationManager {
  constructor(browser) {
    this.browser = browser;
    this.history = [];
    this.currentHistoryIndex = -1;
    this.suggestions = [];
    this.setupNavigationHandlers();
  }

  setupNavigationHandlers() {
    // Address bar navigation
    const addressBar = document.getElementById('address-bar');
    if (addressBar) {
      addressBar.addEventListener('keydown', (e) => this.handleAddressBarKeydown(e));
      addressBar.addEventListener('input', (e) => this.handleAddressBarInput(e));
      addressBar.addEventListener('focus', () => this.handleAddressBarFocus());
      addressBar.addEventListener('blur', () => this.handleAddressBarBlur());
    }

    // New tab search
    const newTabSearch = document.getElementById('new-tab-search');
    if (newTabSearch) {
      newTabSearch.addEventListener('keydown', (e) => this.handleNewTabSearchKeydown(e));
      newTabSearch.addEventListener('input', (e) => this.handleNewTabSearchInput(e));
    }

    // Navigation buttons
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const reloadBtn = document.getElementById('reload-btn');

    if (backBtn) backBtn.addEventListener('click', () => this.goBack());
    if (forwardBtn) forwardBtn.addEventListener('click', () => this.goForward());
    if (reloadBtn) reloadBtn.addEventListener('click', () => this.reload());
  }

  handleAddressBarKeydown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.navigateToUrl(e.target.value);
        break;
      case 'Escape':
        e.preventDefault();
        this.clearSuggestions();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.selectNextSuggestion();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectPreviousSuggestion();
        break;
    }
  }

  handleAddressBarInput(e) {
    const query = e.target.value;
    this.updateSuggestions(query);
  }

  handleAddressBarFocus() {
    const query = document.getElementById('address-bar').value;
    if (query) {
      this.updateSuggestions(query);
    }
  }

  handleAddressBarBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.clearSuggestions();
    }, 200);
  }

  handleNewTabSearchKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.navigateToUrl(e.target.value);
    }
  }

  handleNewTabSearchInput(e) {
    // Handle new tab search input
  }

  navigateToUrl(url) {
    if (!url || url.trim() === '') return;

    const trimmedUrl = url.trim();
    
    // Handle special URLs
    if (this.isSpecialUrl(trimmedUrl)) {
      this.handleSpecialUrl(trimmedUrl);
      return;
    }

    // Add protocol if missing
    const finalUrl = this.normalizeUrl(trimmedUrl);
    
    // Update active tab
    const activeTab = this.browser.tabs.find(t => t.id === this.browser.activeTabId);
    if (activeTab) {
      activeTab.url = finalUrl;
      activeTab.isLoading = true;
      this.browser.updateAddressBar();
      this.browser.renderTabs();
      
      // Add to history
      this.addToHistory(finalUrl, activeTab.title);
      
      // Navigate
      this.performNavigation(finalUrl);
    }
  }

  isSpecialUrl(url) {
    const specialUrls = [
      'about:blank',
      'about:newtab',
      'about:home',
      'about:settings',
      'about:bookmarks',
      'about:history',
      'about:downloads'
    ];
    return specialUrls.includes(url.toLowerCase());
  }

  handleSpecialUrl(url) {
    switch (url.toLowerCase()) {
      case 'about:blank':
      case 'about:newtab':
      case 'about:home':
        this.browser.showNewTabPage();
        break;
      case 'about:settings':
        this.showSettings();
        break;
      case 'about:bookmarks':
        this.showBookmarks();
        break;
      case 'about:history':
        this.showHistory();
        break;
      case 'about:downloads':
        this.showDownloads();
        break;
    }
  }

  normalizeUrl(url) {
    // If it looks like a domain, add https://
    if (this.looksLikeDomain(url)) {
      return 'https://' + url;
    }
    
    // If it looks like a search query, use search engine
    if (this.looksLikeSearchQuery(url)) {
      return this.getSearchUrl(url);
    }
    
    return url;
  }

  looksLikeDomain(url) {
    // Simple domain detection
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(url) && !url.includes(' ');
  }

  looksLikeSearchQuery(url) {
    // If it contains spaces or doesn't look like a URL, treat as search
    return url.includes(' ') || (!url.includes('.') && !url.startsWith('http'));
  }

  getSearchUrl(query) {
    const searchEngines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`
    };
    
    const engine = this.browser.settings.searchEngine || 'google';
    return searchEngines[engine];
  }

  performNavigation(url) {
    const webview = document.getElementById('webview');
    if (webview) {
      webview.src = url;
      this.browser.showWebview(url);
    }
  }

  goBack() {
    const webview = document.getElementById('webview');
    if (webview && webview.canGoBack()) {
      webview.goBack();
      this.updateNavigationButtons();
    }
  }

  goForward() {
    const webview = document.getElementById('webview');
    if (webview && webview.canGoForward()) {
      webview.goForward();
      this.updateNavigationButtons();
    }
  }

  reload() {
    const webview = document.getElementById('webview');
    if (webview) {
      webview.reload();
    }
  }

  updateNavigationButtons() {
    const webview = document.getElementById('webview');
    if (webview) {
      const backBtn = document.getElementById('back-btn');
      const forwardBtn = document.getElementById('forward-btn');
      
      if (backBtn) backBtn.disabled = !webview.canGoBack();
      if (forwardBtn) forwardBtn.disabled = !webview.canGoForward();
    }
  }

  updateSuggestions(query) {
    if (!query || query.length < 2) {
      this.clearSuggestions();
      return;
    }

    this.suggestions = this.generateSuggestions(query);
    this.showSuggestions();
  }

  generateSuggestions(query) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // History suggestions
    this.history.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || 
          item.url.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'history',
          title: item.title,
          url: item.url,
          icon: '🕒'
        });
      }
    });

    // Bookmark suggestions
    this.browser.bookmarks.forEach(bookmark => {
      if (bookmark.title.toLowerCase().includes(lowerQuery) || 
          bookmark.url.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'bookmark',
          title: bookmark.title,
          url: bookmark.url,
          icon: '⭐'
        });
      }
    });

    // Popular sites suggestions
    const popularSites = [
      { title: 'Google', url: 'https://www.google.com', icon: '🔍' },
      { title: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
      { title: 'GitHub', url: 'https://github.com', icon: '💻' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '❓' },
      { title: 'Reddit', url: 'https://www.reddit.com', icon: '🤖' }
    ];

    popularSites.forEach(site => {
      if (site.title.toLowerCase().includes(lowerQuery) || 
          site.url.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'popular',
          title: site.title,
          url: site.url,
          icon: site.icon
        });
      }
    });

    // Search suggestions
    if (this.looksLikeSearchQuery(query)) {
      suggestions.push({
        type: 'search',
        title: `Search for "${query}"`,
        url: this.getSearchUrl(query),
        icon: '🔍'
      });
    }

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  showSuggestions() {
    this.clearSuggestions();

    if (this.suggestions.length === 0) return;

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'address-suggestions';
    suggestionsContainer.id = 'address-suggestions';

    this.suggestions.forEach((suggestion, index) => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className = 'suggestion-item';
      suggestionElement.dataset.index = index;

      suggestionElement.innerHTML = `
        <div class="suggestion-icon">${suggestion.icon}</div>
        <div class="suggestion-content">
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-url">${suggestion.url}</div>
        </div>
      `;

      suggestionElement.addEventListener('click', () => {
        this.selectSuggestion(suggestion);
      });

      suggestionElement.addEventListener('mouseenter', () => {
        this.selectSuggestionByIndex(index);
      });

      suggestionsContainer.appendChild(suggestionElement);
    });

    const addressBarWrapper = document.querySelector('.address-bar-wrapper');
    addressBarWrapper.appendChild(suggestionsContainer);
  }

  clearSuggestions() {
    const suggestions = document.getElementById('address-suggestions');
    if (suggestions) {
      suggestions.remove();
    }
  }

  selectSuggestion(suggestion) {
    this.navigateToUrl(suggestion.url);
    this.clearSuggestions();
  }

  selectSuggestionByIndex(index) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach((item, i) => {
      item.classList.toggle('selected', i === index);
    });
  }

  selectNextSuggestion() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    const selected = document.querySelector('.suggestion-item.selected');
    
    if (selected) {
      const currentIndex = parseInt(selected.dataset.index);
      const nextIndex = (currentIndex + 1) % suggestions.length;
      this.selectSuggestionByIndex(nextIndex);
    } else if (suggestions.length > 0) {
      this.selectSuggestionByIndex(0);
    }
  }

  selectPreviousSuggestion() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    const selected = document.querySelector('.suggestion-item.selected');
    
    if (selected) {
      const currentIndex = parseInt(selected.dataset.index);
      const prevIndex = currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
      this.selectSuggestionByIndex(prevIndex);
    } else if (suggestions.length > 0) {
      this.selectSuggestionByIndex(suggestions.length - 1);
    }
  }

  addToHistory(url, title) {
    const historyItem = {
      url: url,
      title: title || 'Untitled',
      timestamp: Date.now(),
      visitCount: 1
    };

    // Check if URL already exists in history
    const existingIndex = this.history.findIndex(item => item.url === url);
    if (existingIndex !== -1) {
      this.history[existingIndex].visitCount++;
      this.history[existingIndex].timestamp = Date.now();
      this.history[existingIndex].title = title || this.history[existingIndex].title;
    } else {
      this.history.unshift(historyItem);
    }

    // Limit history size
    if (this.history.length > 1000) {
      this.history = this.history.slice(0, 1000);
    }

    this.saveHistory();
  }

  saveHistory() {
    localStorage.setItem('sparsh_history', JSON.stringify(this.history));
  }

  loadHistory() {
    const saved = localStorage.getItem('sparsh_history');
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load history:', error);
        this.history = [];
      }
    }
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  // Special page handlers
  showSettings() {
    console.log('Show settings page');
    // Implementation for settings page
  }

  showBookmarks() {
    console.log('Show bookmarks page');
    // Implementation for bookmarks page
  }

  showHistory() {
    console.log('Show history page');
    // Implementation for history page
  }

  showDownloads() {
    console.log('Show downloads page');
    // Implementation for downloads page
  }

  // URL validation
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Get favicon for URL
  getFaviconUrl(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch (error) {
      return null;
    }
  }

  // Security status
  getSecurityStatus(url) {
    if (url.startsWith('https://')) {
      return 'secure';
    } else if (url.startsWith('http://')) {
      return 'insecure';
    } else {
      return 'unknown';
    }
  }

  updateSecurityIndicator(url) {
    const securityBtn = document.getElementById('security-btn');
    if (securityBtn) {
      const status = this.getSecurityStatus(url);
      securityBtn.className = `address-icon ${status}`;
      
      switch (status) {
        case 'secure':
          securityBtn.textContent = '🔒';
          break;
        case 'insecure':
          securityBtn.textContent = '⚠️';
          break;
        default:
          securityBtn.textContent = '❓';
      }
    }
  }
}

// Export for use in main browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}