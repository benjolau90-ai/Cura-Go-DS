// Generalisierte Variante von capture-surface-screenshots.js: statt fest
// verdrahteter Surface-Elevation-Stufen nimmt dieses Skript eine Liste von
// "Shots" entgegen (View wechseln, optional Setup-JS ausführen z.B. Hover/
// Focus simulieren, optional auf ein Element zuschneiden statt ganzes
// Fenster). Für neue Screenshots einfach unten in `shots` einen Eintrag
// hinzufügen – kein neues Skript pro Component nötig.
//
// Ausführen (auf dem Mac, nicht in der Sandbox – Electron braucht ein
// echtes Display/GPU-fähiges System):
//   npm run capture:components
// oder direkt:
//   node_modules/.bin/electron scripts/capture-component-screenshots.js

const { app, BrowserWindow } = require('electron');
const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'docs', 'assets');
const entryFile = path.join(rootDir, 'src', 'renderer', 'index.html');

const shots = [
  {
    fileName: 'component-tooltip-icon-button.png',
    view: 'components',
    // Fokussiert den IconButton-Trigger echt (nicht simuliert) – das feuert
    // dieselben focus-Listener wie ein Tastatur-Nutzer, initTooltips() zeigt
    // den Tooltip nach SHOW_DELAY_MS ganz regulär.
    setup: `
      document.querySelector('[data-tooltip="Weitere Optionen"]')?.focus();
    `,
    waitMs: 700, // > SHOW_DELAY_MS (450ms) aus js/ui/tooltip.js
    selector: '.components-section:last-of-type',
  },
];

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function switchView(win, view) {
  await win.webContents.executeJavaScript(`
    (() => {
      const button = document.querySelector('[data-view="${view}"]');
      if (!button) throw new Error('Missing view: ${view}');
      button.click();
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.remove('sidebar--expanded');
    })();
  `);
}

async function getSelectorRect(win, selector) {
  return win.webContents.executeJavaScript(`
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
    })();
  `);
}

async function captureShot(win, shot) {
  await switchView(win, shot.view);
  await wait(200);

  if (shot.setup) {
    await win.webContents.executeJavaScript(`(() => { ${shot.setup} })();`);
  }

  await wait(shot.waitMs ?? 180);

  let rect = null;
  if (shot.selector) {
    rect = await getSelectorRect(win, shot.selector);
    if (!rect) {
      throw new Error(`Selector not found for screenshot "${shot.fileName}": ${shot.selector}`);
    }
  }

  const image = rect ? await win.capturePage(rect) : await win.capturePage();
  await fs.writeFile(path.join(outputDir, shot.fileName), image.toPNG());
  console.log(`Saved ${shot.fileName}${rect ? ` (cropped to ${shot.selector})` : ''}`);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const win = new BrowserWindow({
    width: 1427,
    height: 969,
    show: false,
    backgroundColor: '#f5f6fa',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(rootDir, 'src', 'preload.js'),
    },
  });

  await win.loadFile(entryFile);
  await wait(250);

  for (const shot of shots) {
    await captureShot(win, shot);
  }

  win.close();
}

app.whenReady()
  .then(main)
  .then(() => app.quit())
  .catch((error) => {
    console.error(error);
    app.exit(1);
  });
