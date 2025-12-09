const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setBrightness: (value) => ipcRenderer.invoke('set-brightness', value),
  setVolume: (value) => ipcRenderer.invoke('set-volume', value),
  getVolume: () => ipcRenderer.invoke('get-volume'),
  getBrightness: () => ipcRenderer.invoke('get-brightness'),
  openPowerShell: () => ipcRenderer.invoke('open-powershell'),
});
