const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sonaris', {
  selectMusicFolder: () => ipcRenderer.invoke('select-music-folder'),
  scanMusicFolder: (directory) => ipcRenderer.invoke('scan-music-folder', directory)
});
