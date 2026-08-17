const { contextBridge, ipcRenderer } = require('electron');

const WINDOW_ACTIONS = new Set(['minimize', 'maximize', 'close']);

contextBridge.exposeInMainWorld('desktopLayout', {
  windowAction(action) {
    if (!WINDOW_ACTIONS.has(action)) return;
    ipcRenderer.send('window:action', action);
  },
});
