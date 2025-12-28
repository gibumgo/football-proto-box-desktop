"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    loadData: () => electron_1.ipcRenderer.invoke('load-data'),
    // Crawler API
    crawler: {
        start: (options) => electron_1.ipcRenderer.invoke('crawler:start', options),
        stop: () => electron_1.ipcRenderer.invoke('crawler:stop'),
        status: () => electron_1.ipcRenderer.invoke('crawler:status'),
        onMessage: (callback) => {
            const listener = (_event, message) => callback(message);
            electron_1.ipcRenderer.on('crawler:message', listener);
            return () => electron_1.ipcRenderer.removeListener('crawler:message', listener);
        }
    },
    // Utils
    openExternal: (url) => electron_1.ipcRenderer.send('open-url', url)
});
