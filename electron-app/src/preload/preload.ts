import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    loadData: () => ipcRenderer.invoke('load-data'),
});
