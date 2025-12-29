"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const pythonRunner_1 = require("./pythonRunner");
let mainWindow = null;
let pythonRunner = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        resizable: true,
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../../dist/index.html'));
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.handle('load-data', async () => {
    return new Promise((resolve, reject) => {
        const jarPath = path_1.default.resolve(__dirname, '../../../java-app/build/libs/football-bet-parser-1.0.0-SNAPSHOT.jar');
        const dataDir = path_1.default.resolve(__dirname, '../../../data');
        console.log('Spawning Java process:', jarPath, dataDir);
        const javaProcess = (0, child_process_1.spawn)('java', ['-jar', jarPath, dataDir]);
        let data = '';
        let error = '';
        javaProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });
        javaProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
            console.error('Java Error:', chunk.toString());
        });
        javaProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                }
                catch (e) {
                    reject('Failed to parse JSON: ' + e);
                }
            }
            else {
                reject(`Java process exited with code ${code}: ${error}`);
            }
        });
    });
});
electron_1.ipcMain.handle('crawler:start', async (_event, options) => {
    if (!pythonRunner) {
        pythonRunner = new pythonRunner_1.PythonRunner();
    }
    if (pythonRunner.isRunning()) {
        throw new Error('Crawler is already running');
    }
    return new Promise((resolve, reject) => {
        pythonRunner.start(options, (message) => {
            if (mainWindow) {
                mainWindow.webContents.send('crawler:message', message);
            }
        }, (exitCode) => {
            if (exitCode === 0) {
                resolve({ success: true });
            }
            else {
                reject(new Error(`Crawler exited with code ${exitCode}`));
            }
        }, (error) => {
            reject(error);
        });
    });
});
electron_1.ipcMain.handle('crawler:stop', async () => {
    if (pythonRunner) {
        pythonRunner.stop();
    }
    return { success: true };
});
electron_1.ipcMain.handle('crawler:status', async () => {
    const isRunning = pythonRunner ? pythonRunner.isRunning() : false;
    return { isRunning };
});
electron_1.ipcMain.on('open-url', (_event, url) => {
    electron_1.shell.openExternal(url);
});
const fs_1 = __importDefault(require("fs"));
const PROJECT_ROOT = path_1.default.resolve(__dirname, '../../..');
const DATA_ROOT = path_1.default.join(PROJECT_ROOT, 'data');
electron_1.ipcMain.handle('system:select-directory', async () => {
    if (!mainWindow)
        return null;
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});
electron_1.ipcMain.handle('system:open-path', async (_event, targetPath) => {
    try {
        let absolutePath = targetPath;
        if (!path_1.default.isAbsolute(targetPath)) {
            absolutePath = path_1.default.resolve(PROJECT_ROOT, targetPath);
        }
        if (!fs_1.default.existsSync(absolutePath)) {
            fs_1.default.mkdirSync(absolutePath, { recursive: true });
        }
        await electron_1.shell.openPath(absolutePath);
        return { success: true };
    }
    catch (e) {
        return { success: false, error: e };
    }
});
electron_1.ipcMain.handle('system:resolve-path', async (_event, targetPath) => {
    try {
        if (path_1.default.isAbsolute(targetPath)) {
            return targetPath;
        }
        return path_1.default.resolve(PROJECT_ROOT, targetPath);
    }
    catch (e) {
        console.error('Failed to resolve path:', e);
        return targetPath;
    }
});
electron_1.ipcMain.handle('data:read-file', async (_event, filePath) => {
    try {
        let absolutePath = filePath;
        if (!path_1.default.isAbsolute(filePath)) {
            if (filePath.startsWith('data/')) {
                const relativePath = filePath.substring(5);
                absolutePath = path_1.default.join(DATA_ROOT, relativePath);
            }
            else {
                absolutePath = path_1.default.join(DATA_ROOT, filePath);
            }
        }
        if (!fs_1.default.existsSync(absolutePath)) {
            console.warn(`[data:read-file] File not found: ${absolutePath}`);
            return { success: false, error: 'File not found' };
        }
        const content = fs_1.default.readFileSync(absolutePath, 'utf8');
        if (absolutePath.endsWith('.json')) {
            try {
                return { success: true, data: JSON.parse(content) };
            }
            catch (e) {
                return { success: false, error: 'Failed to parse JSON', raw: content };
            }
        }
        return { success: true, data: content };
    }
    catch (e) {
        return { success: false, error: e };
    }
});
electron_1.ipcMain.handle('data:write-file', async (_event, filePath, content) => {
    try {
        let absolutePath = filePath;
        if (!path_1.default.isAbsolute(filePath)) {
            if (filePath.startsWith('data/')) {
                const relativePath = filePath.substring(5);
                absolutePath = path_1.default.join(DATA_ROOT, relativePath);
            }
            else {
                absolutePath = path_1.default.join(DATA_ROOT, filePath);
            }
        }
        const dir = path_1.default.dirname(absolutePath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        const dataToWrite = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
        fs_1.default.writeFileSync(absolutePath, dataToWrite, 'utf8');
        return { success: true };
    }
    catch (e) {
        return { success: false, error: e };
    }
});
electron_1.ipcMain.handle('data:list-directory', async (_event, dirPath) => {
    try {
        let absolutePath = dirPath;
        if (!path_1.default.isAbsolute(dirPath)) {
            if (dirPath.startsWith('data/')) {
                absolutePath = path_1.default.join(DATA_ROOT, dirPath.substring(5));
            }
            else {
                absolutePath = path_1.default.join(DATA_ROOT, dirPath);
            }
        }
        if (!fs_1.default.existsSync(absolutePath)) {
            return { success: true, files: [] };
        }
        const files = fs_1.default.readdirSync(absolutePath).map(file => {
            const stats = fs_1.default.statSync(path_1.default.join(absolutePath, file));
            return {
                name: file,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                mtime: stats.mtime
            };
        });
        return { success: true, files };
    }
    catch (e) {
        return { success: false, error: e };
    }
});
