const { app, BrowserWindow } = require('electron');
const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'docs', 'assets');
const entryFile = path.join(rootDir, 'src', 'renderer', 'index.html');

const shots = [
  ['app-bg', 'surface-elevation-00-app-background.png'],
  ['app-chrome', 'surface-elevation-01-navigation-chrome.png'],
  ['content-shell', 'surface-elevation-02-content-shell.png'],
  ['content-surfaces', 'surface-elevation-03-content-surfaces.png'],
  ['modal-overlay', 'surface-elevation-04-modal-overlay.png'],
];

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureSurface(win, surfaceTarget, fileName) {
  await win.webContents.executeJavaScript(`
    (() => {
      const button = document.querySelector('button[data-surface-target="${surfaceTarget}"]');
      if (!button) {
        throw new Error('Missing surface target: ${surfaceTarget}');
      }
      button.click();

      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.remove('sidebar--expanded');
      sidebar?.querySelectorAll('button, [tabindex]').forEach((element) => element.blur?.());
      document.activeElement?.blur?.();
      document.body.focus?.();

      return {
        level: document.querySelector('.main-view')?.dataset.surfaceLevel,
        sidebarExpanded: sidebar?.classList.contains('sidebar--expanded'),
      };
    })();
  `);

  await wait(180);
  const image = await win.capturePage();
  await fs.writeFile(path.join(outputDir, fileName), image.toPNG());
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

  for (const [surfaceTarget, fileName] of shots) {
    await captureSurface(win, surfaceTarget, fileName);
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
