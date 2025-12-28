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
// Python Crawler IPC Handlers
electron_1.ipcMain.handle('crawler:start', async (_event, options) => {
    if (!pythonRunner) {
        pythonRunner = new pythonRunner_1.PythonRunner();
    }
    if (pythonRunner.isRunning()) {
        throw new Error('Crawler is already running');
    }
    return new Promise((resolve, reject) => {
        pythonRunner.start(options, 
        // onMessage: forward to renderer
        (message) => {
            if (mainWindow) {
                mainWindow.webContents.send('crawler:message', message);
            }
        }, 
        // onComplete
        (exitCode) => {
            if (exitCode === 0) {
                resolve({ success: true });
            }
            else {
                reject(new Error(`Crawler exited with code ${exitCode}`));
            }
        }, 
        // onError
        (error) => {
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
