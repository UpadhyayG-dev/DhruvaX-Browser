// Spàrsh Browser Constants

export const BRAND = {
  NAME: 'Spàrsh Browser',
  VERSION: '1.0.0',
  DESCRIPTION: 'A free, open-source web browser inspired by Comet Browser',
  WEBSITE: 'https://sparsh-browser.github.io',
  REPOSITORY: 'https://github.com/sparsh-browser/sparsh-browser'
};

export const COLORS = {
  PRIMARY: '#2563eb',
  PRIMARY_HOVER: '#1d4ed8',
  SECONDARY: '#64748b',
  ACCENT: '#f59e0b',
  BACKGROUND: '#ffffff',
  SURFACE: '#f8fafc',
  BORDER: '#e2e8f0',
  TEXT_PRIMARY: '#1e293b',
  TEXT_SECONDARY: '#64748b',
  TEXT_MUTED: '#94a3b8',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444'
};

export const DARK_COLORS = {
  BACKGROUND: '#0f172a',
  SURFACE: '#1e293b',
  BORDER: '#334155',
  TEXT_PRIMARY: '#f1f5f9',
  TEXT_SECONDARY: '#cbd5e1'
};

export const SEARCH_ENGINES = {
  GOOGLE: 'google',
  BING: 'bing',
  DUCKDUCKGO: 'duckduckgo',
  YAHOO: 'yahoo'
};

export const SEARCH_URLS = {
  [SEARCH_ENGINES.GOOGLE]: 'https://www.google.com/search?q=',
  [SEARCH_ENGINES.BING]: 'https://www.bing.com/search?q=',
  [SEARCH_ENGINES.DUCKDUCKGO]: 'https://duckduckgo.com/?q=',
  [SEARCH_ENGINES.YAHOO]: 'https://search.yahoo.com/search?p='
};

export const SHORTCUTS = [
  { name: 'Gmail', icon: '📧', url: 'https://mail.google.com' },
  { name: 'YouTube', icon: '📺', url: 'https://www.youtube.com' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  { name: 'Facebook', icon: '📘', url: 'https://www.facebook.com' },
  { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
  { name: 'Reddit', icon: '🤖', url: 'https://www.reddit.com' },
  { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com' },
  { name: 'Instagram', icon: '📷', url: 'https://www.instagram.com' }
];

export const DEFAULT_SETTINGS = {
  theme: 'light',
  defaultSearchEngine: SEARCH_ENGINES.GOOGLE,
  homepage: 'https://www.google.com',
  privateMode: false,
  enableJavaScript: true,
  enableCookies: true,
  enableImages: true,
  enablePlugins: true,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  zoomLevel: 100,
  downloadPath: '',
  autoDownload: false,
  showBookmarksBar: true,
  showStatusBar: true,
  showAddressBar: true,
  showTabBar: true
};

export const KEYBOARD_SHORTCUTS = {
  NEW_TAB: 'Ctrl+T',
  CLOSE_TAB: 'Ctrl+W',
  FOCUS_ADDRESS: 'Ctrl+L',
  RELOAD: 'Ctrl+R',
  NEW_WINDOW: 'Ctrl+N',
  PRIVATE_WINDOW: 'Ctrl+Shift+N',
  FIND: 'Ctrl+F',
  BOOKMARKS: 'Ctrl+Shift+O',
  HISTORY: 'Ctrl+H',
  DOWNLOADS: 'Ctrl+J',
  SETTINGS: 'Ctrl+,',
  DEV_TOOLS: 'F12'
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350
};

export const TAB_CONFIG = {
  MIN_WIDTH: 200,
  MAX_WIDTH: 240,
  HEIGHT: 36,
  CLOSE_BUTTON_WIDTH: 20
};

export const ADDRESS_BAR_CONFIG = {
  HEIGHT: 40,
  BORDER_RADIUS: 8,
  PADDING: 12
};