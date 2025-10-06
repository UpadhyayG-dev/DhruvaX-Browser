// Tab Management System
class TabManager {
  constructor(browser) {
    this.browser = browser;
    this.tabCounter = 0;
    this.setupTabDragAndDrop();
  }

  createTab(options = {}) {
    const tabId = this.generateTabId();
    const tab = {
      id: tabId,
      title: options.title || 'New Tab',
      url: options.url || 'about:blank',
      favicon: options.favicon || '🌐',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPrivate: options.isPrivate || false,
      isActive: false,
      isPinned: options.isPinned || false,
      isMuted: false,
      lastAccessed: Date.now(),
      createdAt: Date.now()
    };

    return tab;
  }

  addTab(tab) {
    this.browser.tabs.push(tab);
    this.browser.activeTabId = tab.id;
    tab.isActive = true;
    
    // Deactivate other tabs
    this.browser.tabs.forEach(t => {
      if (t.id !== tab.id) {
        t.isActive = false;
      }
    });

    this.renderTabs();
    this.updateTabOrder();
  }

  removeTab(tabId) {
    const tabIndex = this.browser.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return false;

    const tab = this.browser.tabs[tabIndex];
    this.browser.tabs.splice(tabIndex, 1);

    // If removing active tab, switch to another tab
    if (tab.id === this.browser.activeTabId) {
      if (this.browser.tabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, this.browser.tabs.length - 1);
        this.browser.activeTabId = this.browser.tabs[newActiveIndex].id;
        this.browser.tabs[newActiveIndex].isActive = true;
        this.browser.switchToTab(this.browser.activeTabId);
      } else {
        this.browser.activeTabId = null;
        this.browser.showNewTabPage();
      }
    }

    this.renderTabs();
    return true;
  }

  switchToTab(tabId) {
    const tab = this.browser.tabs.find(t => t.id === tabId);
    if (!tab) return false;

    // Deactivate current active tab
    if (this.browser.activeTabId) {
      const activeTab = this.browser.tabs.find(t => t.id === this.browser.activeTabId);
      if (activeTab) {
        activeTab.isActive = false;
      }
    }

    // Activate new tab
    tab.isActive = true;
    tab.lastAccessed = Date.now();
    this.browser.activeTabId = tabId;

    this.renderTabs();
    this.updateTabOrder();
    return true;
  }

  duplicateTab(tabId) {
    const originalTab = this.browser.tabs.find(t => t.id === tabId);
    if (!originalTab) return false;

    const newTab = this.createTab({
      title: originalTab.title + ' (Copy)',
      url: originalTab.url,
      favicon: originalTab.favicon,
      isPrivate: originalTab.isPrivate
    });

    this.addTab(newTab);
    return true;
  }

  pinTab(tabId) {
    const tab = this.browser.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.isPinned = !tab.isPinned;
      this.renderTabs();
      return true;
    }
    return false;
  }

  muteTab(tabId) {
    const tab = this.browser.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.isMuted = !tab.isMuted;
      this.renderTabs();
      return true;
    }
    return false;
  }

  closeOtherTabs(tabId) {
    const tab = this.browser.tabs.find(t => t.id === tabId);
    if (!tab) return false;

    this.browser.tabs = [tab];
    this.browser.activeTabId = tabId;
    tab.isActive = true;

    this.renderTabs();
    return true;
  }

  closeTabsToTheRight(tabId) {
    const tabIndex = this.browser.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return false;

    this.browser.tabs = this.browser.tabs.slice(0, tabIndex + 1);
    
    if (this.browser.activeTabId === tabId) {
      this.browser.activeTabId = tabId;
    }

    this.renderTabs();
    return true;
  }

  closeTabsToTheLeft(tabId) {
    const tabIndex = this.browser.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return false;

    this.browser.tabs = this.browser.tabs.slice(tabIndex);
    
    if (this.browser.activeTabId === tabId) {
      this.browser.activeTabId = tabId;
    }

    this.renderTabs();
    return true;
  }

  closeAllTabs() {
    this.browser.tabs = [];
    this.browser.activeTabId = null;
    this.browser.showNewTabPage();
    this.renderTabs();
  }

  reopenClosedTab() {
    // This would restore the most recently closed tab
    // Implementation would require maintaining a closed tabs history
  }

  renderTabs() {
    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    // Sort tabs: pinned first, then by last accessed
    const sortedTabs = [...this.browser.tabs].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastAccessed - a.lastAccessed;
    });

    sortedTabs.forEach(tab => {
      const tabElement = this.createTabElement(tab);
      tabsContainer.appendChild(tabElement);
    });
  }

  createTabElement(tab) {
    const tabElement = document.createElement('div');
    tabElement.className = `tab ${tab.isActive ? 'active' : ''} ${tab.isPrivate ? 'private' : ''} ${tab.isLoading ? 'loading' : ''} ${tab.isPinned ? 'pinned' : ''}`;
    tabElement.dataset.tabId = tab.id;

    tabElement.innerHTML = `
      <div class="tab-content">
        <div class="tab-icon">${tab.favicon}</div>
        <span class="tab-title">${tab.title}</span>
        <button class="tab-close">×</button>
      </div>
    `;

    // Add event listeners
    this.setupTabEventListeners(tabElement, tab);

    return tabElement;
  }

  setupTabEventListeners(tabElement, tab) {
    // Tab click handler
    tabElement.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        this.switchToTab(tab.id);
      }
    });

    // Tab close handler
    const closeBtn = tabElement.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeTab(tab.id);
    });

    // Tab context menu
    tabElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showTabContextMenu(e, tab);
    });

    // Tab double-click to close
    tabElement.addEventListener('dblclick', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        this.removeTab(tab.id);
      }
    });
  }

  showTabContextMenu(event, tab) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const contextMenu = document.createElement('div');
    contextMenu.className = 'tab-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.zIndex = '1000';

    const menuItems = [
      { text: 'New Tab', action: () => this.browser.createNewTab() },
      { text: 'Duplicate Tab', action: () => this.duplicateTab(tab.id) },
      { text: 'Pin Tab', action: () => this.pinTab(tab.id) },
      { text: 'Mute Tab', action: () => this.muteTab(tab.id) },
      { text: 'Close Tab', action: () => this.removeTab(tab.id), danger: true },
      { text: 'Close Other Tabs', action: () => this.closeOtherTabs(tab.id) },
      { text: 'Close Tabs to the Right', action: () => this.closeTabsToTheRight(tab.id) },
      { text: 'Close Tabs to the Left', action: () => this.closeTabsToTheLeft(tab.id) },
      { text: 'Close All Tabs', action: () => this.closeAllTabs(), danger: true }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = `tab-context-menu-item ${item.danger ? 'danger' : ''}`;
      menuItem.textContent = item.text;
      menuItem.addEventListener('click', () => {
        item.action();
        contextMenu.remove();
      });
      contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    // Close menu when clicking outside
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

  setupTabDragAndDrop() {
    let draggedTab = null;
    let dragOverTab = null;

    document.addEventListener('dragstart', (e) => {
      if (e.target.closest('.tab')) {
        draggedTab = e.target.closest('.tab');
        draggedTab.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedTab.outerHTML);
      }
    });

    document.addEventListener('dragend', (e) => {
      if (draggedTab) {
        draggedTab.classList.remove('dragging');
        draggedTab = null;
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      const tab = e.target.closest('.tab');
      if (tab && tab !== draggedTab) {
        dragOverTab = tab;
        tab.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      if (e.target.closest('.tab')) {
        e.target.closest('.tab').classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const tab = e.target.closest('.tab');
      if (tab && draggedTab && tab !== draggedTab) {
        this.reorderTabs(draggedTab.dataset.tabId, tab.dataset.tabId);
      }
      
      // Clean up
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('drag-over');
      });
    });
  }

  reorderTabs(draggedTabId, targetTabId) {
    const draggedIndex = this.browser.tabs.findIndex(t => t.id === draggedTabId);
    const targetIndex = this.browser.tabs.findIndex(t => t.id === targetTabId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const draggedTab = this.browser.tabs.splice(draggedIndex, 1)[0];
    this.browser.tabs.splice(targetIndex, 0, draggedTab);
    
    this.renderTabs();
  }

  updateTabOrder() {
    // Update tab order based on last accessed time
    this.browser.tabs.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastAccessed - a.lastAccessed;
    });
  }

  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Tab search functionality
  searchTabs(query) {
    const results = this.browser.tabs.filter(tab => 
      tab.title.toLowerCase().includes(query.toLowerCase()) ||
      tab.url.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }

  // Tab groups (future feature)
  createTabGroup(name, tabs) {
    // Implementation for tab groups
  }

  // Tab session management
  saveTabSession() {
    const session = {
      tabs: this.browser.tabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favicon: tab.favicon,
        isPrivate: tab.isPrivate,
        isPinned: tab.isPinned
      })),
      activeTabId: this.browser.activeTabId,
      timestamp: Date.now()
    };
    
    localStorage.setItem('sparsh_tab_session', JSON.stringify(session));
  }

  restoreTabSession() {
    const sessionData = localStorage.getItem('sparsh_tab_session');
    if (!sessionData) return false;

    try {
      const session = JSON.parse(sessionData);
      this.browser.tabs = session.tabs.map(tabData => ({
        ...tabData,
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isActive: false,
        isMuted: false,
        lastAccessed: Date.now(),
        createdAt: Date.now()
      }));

      if (session.activeTabId) {
        this.browser.activeTabId = session.activeTabId;
        const activeTab = this.browser.tabs.find(t => t.id === session.activeTabId);
        if (activeTab) {
          activeTab.isActive = true;
        }
      }

      this.renderTabs();
      return true;
    } catch (error) {
      console.error('Failed to restore tab session:', error);
      return false;
    }
  }
}

// Export for use in main browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TabManager;
}