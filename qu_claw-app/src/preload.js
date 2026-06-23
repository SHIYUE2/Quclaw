const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('uclaw', {
  // Existing APIs
  getGatewayStatus: () => ipcRenderer.invoke('get-gateway-status'),
  openDashboard: () => ipcRenderer.invoke('open-dashboard'),
  openConfig: () => ipcRenderer.invoke('open-config'),

  // Image analysis APIs
  analyzeImage: (base64, mimeType) =>
    ipcRenderer.invoke('analyze-image', base64, mimeType),

  getVisionConfig: () => ipcRenderer.invoke('get-vision-config'),

  selectImageFile: () => ipcRenderer.invoke('select-image-file'),
});
