import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('sparsh', {
  onDownload: (handler) => {
    const listener = (_event, url) => handler(url);
    ipcRenderer.on('download-started', listener);
    return () => ipcRenderer.removeListener('download-started', listener);
  }
});
