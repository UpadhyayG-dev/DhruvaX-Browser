const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  navigate: (tabId, url) => ipcRenderer.invoke('navigate', tabId, url),
  createTab: (windowId) => ipcRenderer.invoke('create-tab', windowId),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  
  // Event listeners
  onTabCreated: (callback) => ipcRenderer.on('tab-created', callback),
  onTabUpdated: (callback) => ipcRenderer.on('tab-updated', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});