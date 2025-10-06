// Settings Management System
class SettingsManager {
  constructor(browser) {
    this.browser = browser;
    this.settings = {
      // General settings
      homepage: 'about:newtab',
      searchEngine: 'google',
      theme: 'light',
      language: 'en',
      
      // Privacy settings
      privateMode: false,
      clearDataOnExit: false,
      blockTrackers: true,
      blockAds: false,
      
      // Appearance settings
      showBookmarksBar: true,
      showStatusBar: false,
      compactMode: false,
      fontSize: 'medium',
      
      // Advanced settings
      enableJavaScript: true,
      enableImages: true,
      enablePlugins: true,
      enableWebGL: true,
      
      // Download settings
      downloadPath: '',
      askWhereToSave: true,
      autoOpenDownloads: false,
      
      // Security settings
      enableHttpsOnly: false,
      enableSafeBrowsing: true,
      enablePasswordManager: true,
      
      // Performance settings
      hardwareAcceleration: true,
      maxTabs: 50,
      memoryLimit: 512
    };
    
    this.loadSettings();
    this.setupSettingsHandlers();
  }

  loadSettings() {
    const saved = localStorage.getItem('sparsh_settings');
    if (saved) {
      try {
        const loadedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...loadedSettings };
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }

  saveSettings() {
    localStorage.setItem('sparsh_settings', JSON.stringify(this.settings));
  }

  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.applySetting(key, value);
  }

  applySetting(key, value) {
    switch (key) {
      case 'theme':
        this.applyTheme(value);
        break;
      case 'fontSize':
        this.applyFontSize(value);
        break;
      case 'compactMode':
        this.applyCompactMode(value);
        break;
      case 'showBookmarksBar':
        this.applyBookmarksBar(value);
        break;
      case 'searchEngine':
        this.applySearchEngine(value);
        break;
    }
  }

  applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--background-color', '#0f172a');
      document.documentElement.style.setProperty('--surface-color', '#1e293b');
      document.documentElement.style.setProperty('--text-primary', '#f1f5f9');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--surface-color', '#f8fafc');
      document.documentElement.style.setProperty('--text-primary', '#1e293b');
      document.documentElement.style.setProperty('--text-secondary', '#64748b');
    }
  }

  applyFontSize(size) {
    const sizeMap = {
      'small': '12px',
      'medium': '14px',
      'large': '16px',
      'extra-large': '18px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', sizeMap[size] || '14px');
  }

  applyCompactMode(enabled) {
    if (enabled) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }

  applyBookmarksBar(show) {
    const bookmarksBar = document.getElementById('bookmarks-bar');
    if (bookmarksBar) {
      bookmarksBar.style.display = show ? 'block' : 'none';
    }
  }

  applySearchEngine(engine) {
    // Update search engine for new searches
    console.log('Search engine changed to:', engine);
  }

  setupSettingsHandlers() {
    // Settings can be accessed via keyboard shortcut or menu
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        this.showSettings();
      }
    });
  }

  showSettings() {
    this.createSettingsModal();
  }

  createSettingsModal() {
    // Remove existing modal
    const existingModal = document.getElementById('settings-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'settings-modal';
    modal.innerHTML = this.getSettingsHTML();

    document.body.appendChild(modal);

    // Setup event listeners
    this.setupSettingsModalHandlers(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('visible');
    }, 10);
  }

  getSettingsHTML() {
    return `
      <div class="settings-overlay">
        <div class="settings-container">
          <div class="settings-header">
            <h2>Settings</h2>
            <button id="settings-close" class="settings-close">×</button>
          </div>
          
          <div class="settings-content">
            <div class="settings-sidebar">
              <div class="settings-nav">
                <button class="settings-nav-item active" data-section="general">General</button>
                <button class="settings-nav-item" data-section="privacy">Privacy</button>
                <button class="settings-nav-item" data-section="appearance">Appearance</button>
                <button class="settings-nav-item" data-section="advanced">Advanced</button>
                <button class="settings-nav-item" data-section="downloads">Downloads</button>
                <button class="settings-nav-item" data-section="security">Security</button>
              </div>
            </div>
            
            <div class="settings-main">
              <div class="settings-section active" id="general-settings">
                ${this.getGeneralSettingsHTML()}
              </div>
              
              <div class="settings-section" id="privacy-settings">
                ${this.getPrivacySettingsHTML()}
              </div>
              
              <div class="settings-section" id="appearance-settings">
                ${this.getAppearanceSettingsHTML()}
              </div>
              
              <div class="settings-section" id="advanced-settings">
                ${this.getAdvancedSettingsHTML()}
              </div>
              
              <div class="settings-section" id="downloads-settings">
                ${this.getDownloadsSettingsHTML()}
              </div>
              
              <div class="settings-section" id="security-settings">
                ${this.getSecuritySettingsHTML()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getGeneralSettingsHTML() {
    return `
      <h3>General</h3>
      
      <div class="setting-group">
        <label for="homepage-setting">Homepage</label>
        <input type="text" id="homepage-setting" value="${this.settings.homepage}" placeholder="about:newtab">
      </div>
      
      <div class="setting-group">
        <label for="search-engine-setting">Search Engine</label>
        <select id="search-engine-setting">
          <option value="google" ${this.settings.searchEngine === 'google' ? 'selected' : ''}>Google</option>
          <option value="bing" ${this.settings.searchEngine === 'bing' ? 'selected' : ''}>Bing</option>
          <option value="duckduckgo" ${this.settings.searchEngine === 'duckduckgo' ? 'selected' : ''}>DuckDuckGo</option>
          <option value="yahoo" ${this.settings.searchEngine === 'yahoo' ? 'selected' : ''}>Yahoo</option>
        </select>
      </div>
      
      <div class="setting-group">
        <label for="language-setting">Language</label>
        <select id="language-setting">
          <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
          <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Español</option>
          <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>Français</option>
          <option value="de" ${this.settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
        </select>
      </div>
    `;
  }

  getPrivacySettingsHTML() {
    return `
      <h3>Privacy & Security</h3>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="private-mode-setting" ${this.settings.privateMode ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Private Mode by Default
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="clear-data-setting" ${this.settings.clearDataOnExit ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Clear Data on Exit
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="block-trackers-setting" ${this.settings.blockTrackers ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Block Trackers
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="block-ads-setting" ${this.settings.blockAds ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Block Ads
        </label>
      </div>
    `;
  }

  getAppearanceSettingsHTML() {
    return `
      <h3>Appearance</h3>
      
      <div class="setting-group">
        <label for="theme-setting">Theme</label>
        <select id="theme-setting">
          <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
          <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
          <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
        </select>
      </div>
      
      <div class="setting-group">
        <label for="font-size-setting">Font Size</label>
        <select id="font-size-setting">
          <option value="small" ${this.settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
          <option value="medium" ${this.settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
          <option value="extra-large" ${this.settings.fontSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
        </select>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="bookmarks-bar-setting" ${this.settings.showBookmarksBar ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Show Bookmarks Bar
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="compact-mode-setting" ${this.settings.compactMode ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Compact Mode
        </label>
      </div>
    `;
  }

  getAdvancedSettingsHTML() {
    return `
      <h3>Advanced</h3>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="javascript-setting" ${this.settings.enableJavaScript ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Enable JavaScript
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="images-setting" ${this.settings.enableImages ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Enable Images
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="hardware-accel-setting" ${this.settings.hardwareAcceleration ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Hardware Acceleration
        </label>
      </div>
      
      <div class="setting-group">
        <label for="max-tabs-setting">Maximum Tabs</label>
        <input type="number" id="max-tabs-setting" value="${this.settings.maxTabs}" min="1" max="100">
      </div>
    `;
  }

  getDownloadsSettingsHTML() {
    return `
      <h3>Downloads</h3>
      
      <div class="setting-group">
        <label for="download-path-setting">Download Location</label>
        <div class="path-input-group">
          <input type="text" id="download-path-setting" value="${this.settings.downloadPath}" placeholder="Choose download folder">
          <button id="browse-download-path" class="browse-btn">Browse</button>
        </div>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="ask-where-to-save-setting" ${this.settings.askWhereToSave ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Always Ask Where to Save
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="auto-open-downloads-setting" ${this.settings.autoOpenDownloads ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Auto-open Downloads
        </label>
      </div>
    `;
  }

  getSecuritySettingsHTML() {
    return `
      <h3>Security</h3>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="https-only-setting" ${this.settings.enableHttpsOnly ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          HTTPS Only Mode
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="safe-browsing-setting" ${this.settings.enableSafeBrowsing ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Safe Browsing
        </label>
      </div>
      
      <div class="setting-group">
        <label class="toggle-label">
          <input type="checkbox" id="password-manager-setting" ${this.settings.enablePasswordManager ? 'checked' : ''}>
          <span class="toggle-switch"></span>
          Password Manager
        </label>
      </div>
    `;
  }

  setupSettingsModalHandlers(modal) {
    // Close button
    const closeBtn = modal.querySelector('#settings-close');
    closeBtn.addEventListener('click', () => {
      this.closeSettings();
    });

    // Overlay click to close
    const overlay = modal.querySelector('.settings-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeSettings();
      }
    });

    // Navigation
    const navItems = modal.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        this.switchSettingsSection(item.dataset.section);
      });
    });

    // Form inputs
    this.setupSettingsInputs(modal);
  }

  setupSettingsInputs(modal) {
    // General settings
    const homepageInput = modal.querySelector('#homepage-setting');
    if (homepageInput) {
      homepageInput.addEventListener('change', (e) => {
        this.setSetting('homepage', e.target.value);
      });
    }

    const searchEngineSelect = modal.querySelector('#search-engine-setting');
    if (searchEngineSelect) {
      searchEngineSelect.addEventListener('change', (e) => {
        this.setSetting('searchEngine', e.target.value);
      });
    }

    const languageSelect = modal.querySelector('#language-setting');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.setSetting('language', e.target.value);
      });
    }

    // Privacy settings
    const privateModeToggle = modal.querySelector('#private-mode-setting');
    if (privateModeToggle) {
      privateModeToggle.addEventListener('change', (e) => {
        this.setSetting('privateMode', e.target.checked);
      });
    }

    const clearDataToggle = modal.querySelector('#clear-data-setting');
    if (clearDataToggle) {
      clearDataToggle.addEventListener('change', (e) => {
        this.setSetting('clearDataOnExit', e.target.checked);
      });
    }

    const blockTrackersToggle = modal.querySelector('#block-trackers-setting');
    if (blockTrackersToggle) {
      blockTrackersToggle.addEventListener('change', (e) => {
        this.setSetting('blockTrackers', e.target.checked);
      });
    }

    const blockAdsToggle = modal.querySelector('#block-ads-setting');
    if (blockAdsToggle) {
      blockAdsToggle.addEventListener('change', (e) => {
        this.setSetting('blockAds', e.target.checked);
      });
    }

    // Appearance settings
    const themeSelect = modal.querySelector('#theme-setting');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.setSetting('theme', e.target.value);
      });
    }

    const fontSizeSelect = modal.querySelector('#font-size-setting');
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        this.setSetting('fontSize', e.target.value);
      });
    }

    const bookmarksBarToggle = modal.querySelector('#bookmarks-bar-setting');
    if (bookmarksBarToggle) {
      bookmarksBarToggle.addEventListener('change', (e) => {
        this.setSetting('showBookmarksBar', e.target.checked);
      });
    }

    const compactModeToggle = modal.querySelector('#compact-mode-setting');
    if (compactModeToggle) {
      compactModeToggle.addEventListener('change', (e) => {
        this.setSetting('compactMode', e.target.checked);
      });
    }

    // Advanced settings
    const javascriptToggle = modal.querySelector('#javascript-setting');
    if (javascriptToggle) {
      javascriptToggle.addEventListener('change', (e) => {
        this.setSetting('enableJavaScript', e.target.checked);
      });
    }

    const imagesToggle = modal.querySelector('#images-setting');
    if (imagesToggle) {
      imagesToggle.addEventListener('change', (e) => {
        this.setSetting('enableImages', e.target.checked);
      });
    }

    const hardwareAccelToggle = modal.querySelector('#hardware-accel-setting');
    if (hardwareAccelToggle) {
      hardwareAccelToggle.addEventListener('change', (e) => {
        this.setSetting('hardwareAcceleration', e.target.checked);
      });
    }

    const maxTabsInput = modal.querySelector('#max-tabs-setting');
    if (maxTabsInput) {
      maxTabsInput.addEventListener('change', (e) => {
        this.setSetting('maxTabs', parseInt(e.target.value));
      });
    }

    // Downloads settings
    const downloadPathInput = modal.querySelector('#download-path-setting');
    if (downloadPathInput) {
      downloadPathInput.addEventListener('change', (e) => {
        this.setSetting('downloadPath', e.target.value);
      });
    }

    const browseBtn = modal.querySelector('#browse-download-path');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        this.browseDownloadPath();
      });
    }

    const askWhereToSaveToggle = modal.querySelector('#ask-where-to-save-setting');
    if (askWhereToSaveToggle) {
      askWhereToSaveToggle.addEventListener('change', (e) => {
        this.setSetting('askWhereToSave', e.target.checked);
      });
    }

    const autoOpenDownloadsToggle = modal.querySelector('#auto-open-downloads-setting');
    if (autoOpenDownloadsToggle) {
      autoOpenDownloadsToggle.addEventListener('change', (e) => {
        this.setSetting('autoOpenDownloads', e.target.checked);
      });
    }

    // Security settings
    const httpsOnlyToggle = modal.querySelector('#https-only-setting');
    if (httpsOnlyToggle) {
      httpsOnlyToggle.addEventListener('change', (e) => {
        this.setSetting('enableHttpsOnly', e.target.checked);
      });
    }

    const safeBrowsingToggle = modal.querySelector('#safe-browsing-setting');
    if (safeBrowsingToggle) {
      safeBrowsingToggle.addEventListener('change', (e) => {
        this.setSetting('enableSafeBrowsing', e.target.checked);
      });
    }

    const passwordManagerToggle = modal.querySelector('#password-manager-setting');
    if (passwordManagerToggle) {
      passwordManagerToggle.addEventListener('change', (e) => {
        this.setSetting('enablePasswordManager', e.target.checked);
      });
    }
  }

  switchSettingsSection(section) {
    // Update navigation
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Update content
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(sectionEl => {
      sectionEl.classList.toggle('active', sectionEl.id === `${section}-settings`);
    });
  }

  browseDownloadPath() {
    // This would open a folder picker dialog
    // For now, just show a prompt
    const path = prompt('Enter download path:', this.settings.downloadPath);
    if (path !== null) {
      this.setSetting('downloadPath', path);
      const input = document.querySelector('#download-path-setting');
      if (input) {
        input.value = path;
      }
    }
  }

  closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }

  resetToDefaults() {
    const defaultSettings = {
      homepage: 'about:newtab',
      searchEngine: 'google',
      theme: 'light',
      language: 'en',
      privateMode: false,
      clearDataOnExit: false,
      blockTrackers: true,
      blockAds: false,
      showBookmarksBar: true,
      showStatusBar: false,
      compactMode: false,
      fontSize: 'medium',
      enableJavaScript: true,
      enableImages: true,
      enablePlugins: true,
      enableWebGL: true,
      downloadPath: '',
      askWhereToSave: true,
      autoOpenDownloads: false,
      enableHttpsOnly: false,
      enableSafeBrowsing: true,
      enablePasswordManager: true,
      hardwareAcceleration: true,
      maxTabs: 50,
      memoryLimit: 512
    };

    this.settings = { ...defaultSettings };
    this.saveSettings();
    
    // Apply all settings
    Object.keys(this.settings).forEach(key => {
      this.applySetting(key, this.settings[key]);
    });
  }
}

// Export for use in main browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}