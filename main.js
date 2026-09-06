const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.opus', '.wma']);

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 860,
    minHeight: 600,
    backgroundColor: '#17151f',
    title: 'Sonaris',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

async function walkAudioFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkAudioFiles(absolute));
      continue;
    }
    if (AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push({
        name: path.basename(entry.name, path.extname(entry.name)),
        filename: entry.name,
        path: absolute
      });
    }
  }
  return files;
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));

  ipcMain.handle('select-music-folder', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Choisir un dossier musical',
      properties: ['openDirectory']
    });
    if (result.canceled || !result.filePaths[0]) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('scan-music-folder', async (_event, directory) => {
    if (typeof directory !== 'string' || !directory) return [];
    try {
      const files = await walkAudioFiles(directory);
      return files.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    } catch {
      return [];
    }
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
