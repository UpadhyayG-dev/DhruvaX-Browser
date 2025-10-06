import { app, BrowserWindow, session, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0d0f14',
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#151922', symbolColor: '#dfe7ff' },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../web/dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  session.defaultSession.on('will-download', (event, item) => {
    // Forward to renderer for UI bookkeeping
    mainWindow.webContents.send('download-started', item.getURL());
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
