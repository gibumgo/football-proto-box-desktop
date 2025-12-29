import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { PythonRunner } from './pythonRunner';
import type { CrawlerOptions } from '../types/crawler';

let mainWindow: BrowserWindow | null = null;
let pythonRunner: PythonRunner | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('load-data', async () => {
    return new Promise((resolve, reject) => {
        const jarPath = path.resolve(__dirname, '../../../java-app/build/libs/football-bet-parser-1.0.0-SNAPSHOT.jar');
        const dataDir = path.resolve(__dirname, '../../../data');

        console.log('Spawning Java process:', jarPath, dataDir);

        const javaProcess = spawn('java', ['-jar', jarPath, dataDir]);

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
                } catch (e) {
                    reject('Failed to parse JSON: ' + e);
                }
            } else {
                reject(`Java process exited with code ${code}: ${error}`);
            }
        });
    });
});

// Python Crawler IPC Handlers
ipcMain.handle('crawler:start', async (_event, options: CrawlerOptions) => {
    if (!pythonRunner) {
        pythonRunner = new PythonRunner();
    }

    if (pythonRunner.isRunning()) {
        throw new Error('Crawler is already running');
    }

    return new Promise((resolve, reject) => {
        pythonRunner!.start(
            options,
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
                } else {
                    reject(new Error(`Crawler exited with code ${exitCode}`));
                }
            },
            // onError
            (error) => {
                reject(error);
            }
        );
    });
});

ipcMain.handle('crawler:stop', async () => {
    if (pythonRunner) {
        pythonRunner.stop();
    }
    return { success: true };
});

ipcMain.handle('crawler:status', async () => {
    const isRunning = pythonRunner ? pythonRunner.isRunning() : false;
    return { isRunning };
});
ipcMain.on('open-url', (_event, url: string) => {
    shell.openExternal(url);
});

import fs from 'fs';

// Project Root (football-proto-box-desktop)
// __dirname is electron-app/dist/main or similar. We need to go up to the project root.
// Assuming structure: /project/electron-app/dist/main -> ../../../
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// System Utilities
ipcMain.handle('system:select-directory', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

ipcMain.handle('system:open-path', async (_event, targetPath: string) => {
    try {
        let absolutePath = targetPath;
        if (!path.isAbsolute(targetPath)) {
            absolutePath = path.resolve(PROJECT_ROOT, targetPath);
        }

        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }

        await shell.openPath(absolutePath);
        return { success: true };
    } catch (e) {
        return { success: false, error: e };
    }
});

ipcMain.handle('system:resolve-path', async (_event, targetPath: string) => {
    try {
        if (path.isAbsolute(targetPath)) {
            return targetPath;
        }
        return path.resolve(PROJECT_ROOT, targetPath);
    } catch (e) {
        console.error('Failed to resolve path:', e);
        return targetPath;
    }
});

// Data Management IPC Handlers
ipcMain.handle('data:read-file', async (_event, filePath: string) => {
    try {
        let absolutePath = filePath;
        if (!path.isAbsolute(filePath)) {
            absolutePath = path.resolve(PROJECT_ROOT, filePath);
        }

        if (!fs.existsSync(absolutePath)) {
            return { success: false, error: 'File not found' };
        }

        const content = fs.readFileSync(absolutePath, 'utf8');

        // Auto-parse JSON
        if (absolutePath.endsWith('.json')) {
            try {
                return { success: true, data: JSON.parse(content) };
            } catch (e) {
                return { success: false, error: 'Failed to parse JSON', raw: content };
            }
        }

        return { success: true, data: content };
    } catch (e) {
        return { success: false, error: e };
    }
});

ipcMain.handle('data:write-file', async (_event, filePath: string, content: string | object) => {
    try {
        let absolutePath = filePath;
        if (!path.isAbsolute(filePath)) {
            absolutePath = path.resolve(PROJECT_ROOT, filePath);
        }

        // Ensure directory exists
        const dir = path.dirname(absolutePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const dataToWrite = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
        fs.writeFileSync(absolutePath, dataToWrite, 'utf8');
        return { success: true };
    } catch (e) {
        return { success: false, error: e };
    }
});

ipcMain.handle('data:list-directory', async (_event, dirPath: string) => {
    try {
        let absolutePath = dirPath;
        if (!path.isAbsolute(dirPath)) {
            absolutePath = path.resolve(PROJECT_ROOT, dirPath);
        }

        if (!fs.existsSync(absolutePath)) {
            return { success: true, files: [] }; // Return empty if dir doesn't exist yet
        }

        const files = fs.readdirSync(absolutePath).map(file => {
            const stats = fs.statSync(path.join(absolutePath, file));
            return {
                name: file,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                mtime: stats.mtime
            };
        });

        return { success: true, files };
    } catch (e) {
        return { success: false, error: e };
    }
});
