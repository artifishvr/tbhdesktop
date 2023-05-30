const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  tbh: (arg1, arg2) => {
    ipcRenderer.send('tbh');
  },
});