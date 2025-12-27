import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    loadData: () => ipcRenderer.invoke('load-data'),

    // Crawler API
    crawler: {
        start: (options: any) => ipcRenderer.invoke('crawler:start', options),
        stop: () => ipcRenderer.invoke('crawler:stop'),
        status: () => ipcRenderer.invoke('crawler:status'),
        onMessage: (callback: (message: any) => void) => {
            const listener = (_event: any, message: any) => callback(message);
            ipcRenderer.on('crawler:message', listener);
            return () => ipcRenderer.removeListener('crawler:message', listener);
        }
    }
});

