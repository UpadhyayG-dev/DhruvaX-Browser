# Spàrsh Browser API Documentation

This document describes the APIs and interfaces available in Spàrsh Browser.

## Electron APIs

### Main Process APIs

#### BrowserWindow Management

```javascript
// Create a new browser window
const window = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true
  }
});
```

#### IPC Communication

The main process exposes several IPC handlers for communication with the renderer process:

```javascript
// Navigation
ipcMain.handle('navigate', async (event, tabId, url) => {
  // Navigate to URL
});

// Tab management
ipcMain.handle('create-tab', async (event, windowId) => {
  // Create new tab
});

// Settings
ipcMain.handle('get-settings', async () => {
  // Get current settings
});

ipcMain.handle('update-settings', async (event, newSettings) => {
  // Update settings
});
```

### Renderer Process APIs

#### Electron API (Preload)

The preload script exposes a secure API to the renderer process:

```javascript
// Navigation
window.electronAPI.navigate(tabId, url);

// Tab management
window.electronAPI.createTab(windowId);

// Settings
const settings = await window.electronAPI.getSettings();
await window.electronAPI.updateSettings(newSettings);

// Event listeners
window.electronAPI.onTabCreated(callback);
window.electronAPI.onTabUpdated(callback);
```

## Browser Features API

### Downloads

```javascript
// Start download
const download = await window.electronAPI.startDownload(url, filename, windowId);

// Get downloads
const downloads = await window.electronAPI.getDownloads();

// Clear downloads
await window.electronAPI.clearDownloads();
```

### History

```javascript
// Add to history
await window.electronAPI.addToHistory(url, title, favicon);

// Get history
const history = await window.electronAPI.getHistory();

// Search history
const results = await window.electronAPI.searchHistory(query);

// Clear history
await window.electronAPI.clearHistory();
```

### Bookmarks

```javascript
// Add bookmark
const bookmark = await window.electronAPI.addBookmark(url, title, favicon);

// Remove bookmark
await window.electronAPI.removeBookmark(bookmarkId);

// Get bookmarks
const bookmarks = await window.electronAPI.getBookmarks();

// Search bookmarks
const results = await window.electronAPI.searchBookmarks(query);
```

### Search Suggestions

```javascript
// Get search suggestions
const suggestions = await window.electronAPI.getSearchSuggestions(query);
```

## Android APIs

### MainActivity

```kotlin
class MainActivity : AppCompatActivity() {
    // Open browser with URL
    private fun openBrowser(url: String) {
        val intent = Intent(this, BrowserActivity::class.java).apply {
            putExtra("url", url)
        }
        startActivity(intent)
    }
}
```

### BrowserActivity

```kotlin
class BrowserActivity : AppCompatActivity() {
    // Load URL in WebView
    private fun loadUrl(url: String) {
        webView.loadUrl(url)
    }
    
    // Navigation controls
    private fun goBack() {
        if (webView.canGoBack()) {
            webView.goBack()
        }
    }
    
    private fun goForward() {
        if (webView.canGoForward()) {
            webView.goForward()
        }
    }
}
```

### BrowserViewModel

```kotlin
class BrowserViewModel : ViewModel() {
    private val _currentUrl = MutableStateFlow("")
    val currentUrl: StateFlow<String> = _currentUrl
    
    private val _pageTitle = MutableStateFlow("")
    val pageTitle: StateFlow<String> = _pageTitle
    
    fun updateUrl(url: String) {
        _currentUrl.value = url
    }
}
```

## Shared Utilities

### URL Utilities

```javascript
import { formatUrl, getSearchUrl, extractDomain } from './shared/utils.js';

// Format URL for navigation
const url = formatUrl('google.com'); // Returns 'https://google.com'

// Get search URL
const searchUrl = getSearchUrl('sparsh browser', 'google');

// Extract domain
const domain = extractDomain('https://www.google.com/search?q=test');
```

### Storage Utilities

```javascript
import { Storage } from './shared/utils.js';

// Get data
const data = Storage.get('key', defaultValue);

// Set data
Storage.set('key', value);

// Remove data
Storage.remove('key');

// Clear all data
Storage.clear();
```

### File Utilities

```javascript
import { formatFileSize, downloadFile } from './shared/utils.js';

// Format file size
const size = formatFileSize(1024); // Returns '1 KB'

// Download file
downloadFile(url, filename);
```

## Constants

### Brand Information

```javascript
import { BRAND } from './shared/constants.js';

console.log(BRAND.NAME);        // 'Spàrsh Browser'
console.log(BRAND.VERSION);     // '1.0.0'
console.log(BRAND.WEBSITE);     // 'https://sparsh-browser.github.io'
```

### Colors

```javascript
import { COLORS } from './shared/constants.js';

console.log(COLORS.PRIMARY);    // '#2563eb'
console.log(COLORS.ACCENT);     // '#f59e0b'
```

### Search Engines

```javascript
import { SEARCH_ENGINES, SEARCH_URLS } from './shared/constants.js';

const googleUrl = SEARCH_URLS[SEARCH_ENGINES.GOOGLE];
```

## Event System

### Tab Events

```javascript
// Tab created
window.electronAPI.onTabCreated((event, tab) => {
  console.log('New tab created:', tab);
});

// Tab updated
window.electronAPI.onTabUpdated((event, tab) => {
  console.log('Tab updated:', tab);
});
```

### Download Events

```javascript
// Download started
window.electronAPI.onDownloadStarted((event, download) => {
  console.log('Download started:', download);
});

// Download completed
window.electronAPI.onDownloadCompleted((event, download) => {
  console.log('Download completed:', download);
});
```

## Error Handling

### JavaScript

```javascript
try {
  const result = await window.electronAPI.someOperation();
} catch (error) {
  console.error('Operation failed:', error);
}
```

### Kotlin

```kotlin
try {
    val result = someOperation()
} catch (e: Exception) {
    Log.e("BrowserActivity", "Operation failed", e)
}
```

## Security Considerations

### Electron Security

- Context isolation is enabled
- Node integration is disabled in renderer
- Preload scripts are used for secure API exposure
- CSP headers are implemented

### Android Security

- WebView security settings are configured
- Permissions are properly managed
- Sensitive data is stored securely
- Network security configuration is applied

## Performance Tips

### Electron

- Use efficient memory management
- Implement lazy loading
- Optimize WebView settings
- Cache resources appropriately

### Android

- Use RecyclerView for lists
- Implement proper lifecycle management
- Optimize image loading
- Prevent memory leaks

## Debugging

### Electron

```javascript
// Enable debug logging
console.log('Debug information');

// Use Chrome DevTools
// Press F12 in the application
```

### Android

```kotlin
// Use Android logging
Log.d("TAG", "Debug information")

// Use Android Studio debugger
// Set breakpoints and debug
```

## Examples

### Creating a Custom Tab

```javascript
// In renderer process
const newTab = await window.electronAPI.createTab(windowId);
await window.electronAPI.navigate(newTab.id, 'https://example.com');
```

### Adding a Bookmark

```javascript
const bookmark = await window.electronAPI.addBookmark(
  'https://example.com',
  'Example Site',
  'https://example.com/favicon.ico'
);
```

### Handling Downloads

```javascript
// Start download
const download = await window.electronAPI.startDownload(
  'https://example.com/file.pdf',
  'document.pdf',
  windowId
);

// Listen for completion
window.electronAPI.onDownloadCompleted((event, completedDownload) => {
  if (completedDownload.id === download.id) {
    console.log('Download completed!');
  }
});
```