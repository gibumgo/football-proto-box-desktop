import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    loadData: () => ipcRenderer.invoke('load-data'),
    crawler: {
        start: (options: any) => ipcRenderer.invoke('crawler:start', options),
        stop: () => ipcRenderer.invoke('crawler:stop'),
        status: () => ipcRenderer.invoke('crawler:status'),
        discover: (type: string, param?: string) => ipcRenderer.invoke('crawler:discover', type, param),
        onMessage: (callback: (message: any) => void) => {
            const listener = (_event: any, message: any) => callback(message);
            ipcRenderer.on('crawler:message', listener);
            return () => ipcRenderer.removeListener('crawler:message', listener);
        }
    },
    openExternal: (url: string) => ipcRenderer.send('open-url', url),
    system: {
        selectDirectory: () => ipcRenderer.invoke('system:select-directory'),
        openPath: (path: string) => ipcRenderer.invoke('system:open-path', path),
        resolvePath: (path: string) => ipcRenderer.invoke('system:resolve-path', path)
    },
    data: {
        readFile: (path: string) => ipcRenderer.invoke('data:read-file', path),
        writeFile: (path: string, content: any) => ipcRenderer.invoke('data:write-file', path, content),
        listDirectory: (path: string) => ipcRenderer.invoke('data:list-directory', path)
    },
    archive: {
        getAvailableRounds: () => ipcRenderer.invoke('archive:list-rounds'),
        getRoundData: (round: number) => ipcRenderer.invoke('archive:get-data', round)
    }
});

