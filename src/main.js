const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

// Electron soll die native Monitor-Skalierung verwenden. Eine erzwungene 2x-
// Skalierung macht die komplette UI auf manchen Setups deutlich zu groß.
app.commandLine.appendSwitch('high-dpi-support', '1');

const WINDOW_ACTIONS = new Set(['minimize', 'maximize', 'close']);
const LOW_DPI_ZOOM_FACTOR = 0.9;

function zoomFactorForWindow(win) {
  const display = screen.getDisplayMatching(win.getBounds());
  return display.scaleFactor <= 1.25 ? LOW_DPI_ZOOM_FACTOR : 1;
}

function applyDisplayZoom(win) {
  win.webContents.setZoomFactor(zoomFactorForWindow(win));
}

function handleWindowAction(event, action) {
  if (!WINDOW_ACTIONS.has(action)) return;

  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  if (action === 'minimize') {
    win.minimize();
    return;
  }

  if (action === 'maximize') {
    if (win.isMaximized()) {
      win.unmaximize();
      return;
    }
    win.maximize();
    return;
  }

  win.close();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1728,
    height: 1117,
    backgroundColor: '#f5f8fa',
    hasShadow: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: -100, y: -100 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.webContents.on('did-finish-load', () => applyDisplayZoom(win));
  win.on('move', () => applyDisplayZoom(win));
  win.on('resize', () => applyDisplayZoom(win));
}

app.whenReady().then(() => {
  ipcMain.on('window:action', handleWindowAction);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
