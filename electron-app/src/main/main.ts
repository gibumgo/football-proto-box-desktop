import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { PythonRunner } from './pythonRunner';
import type { CrawlerOptions } from '../types/crawler';

let mainWindow: BrowserWindow | null = null;
let pythonRunner: PythonRunner | null = null;

// PROJECT_ROOT 및 DATA_ROOT 설정
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const DATA_ROOT = path.join(PROJECT_ROOT, 'data');

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

// 데이터 로드 (메인 대시보드)
ipcMain.handle('load-data', async () => {
    return new Promise((resolve, reject) => {
        const jarPath = path.resolve(PROJECT_ROOT, 'java-app/build/libs/football-bet-parser-1.0.0-SNAPSHOT.jar');

        console.log('Spawning Java process:', jarPath, DATA_ROOT);

        const javaProcess = spawn('java', ['-jar', jarPath, DATA_ROOT]);

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

// 아카이브 데이터 조회
ipcMain.handle('archive:get-data', async (_event: IpcMainInvokeEvent, round: number) => {
    return new Promise((resolve, reject) => {
        const jarPath = path.resolve(PROJECT_ROOT, 'java-app/build/libs/football-bet-parser-1.0.0-SNAPSHOT.jar');

        console.log('Spawning Java archive process for round:', round);

        const javaProcess = spawn('java', ['-jar', jarPath, 'archive', round.toString()]);

        let data = '';
        let error = '';

        javaProcess.stdout.on('data', (chunk: Buffer) => {
            data += chunk.toString();
        });

        javaProcess.stderr.on('data', (chunk: Buffer) => {
            error += chunk.toString();
        });

        javaProcess.on('close', (code: number) => {
            if (code === 0) {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    reject('Failed to parse JSON: ' + e);
                }
            } else {
                reject(`Java archive process exited with code ${code}: ${error}`);
            }
        });
    });
});

// 회차 목록 조회
ipcMain.handle('archive:list-rounds', async () => {
    try {
        const betinfoDir = path.join(DATA_ROOT, 'crawled/betinfo');
        if (!fs.existsSync(betinfoDir)) {
            return { success: true, rounds: [] };
        }

        const files = fs.readdirSync(betinfoDir);
        const rounds = files
            .map(file => {
                const match = file.match(/betinfo_proto_rate_(\d+)\.csv/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((round): round is number => round !== null)
            .sort((a, b) => b - a);

        return { success: true, rounds };
    } catch (e) {
        return { success: false, error: e };
    }
});

// 크롤러 제어
ipcMain.handle('crawler:start', async (_event: IpcMainInvokeEvent, options: CrawlerOptions) => {
    if (!pythonRunner) {
        pythonRunner = new PythonRunner();
    }

    if (pythonRunner.isRunning()) {
        throw new Error('Crawler is already running');
    }

    return new Promise((resolve, reject) => {
        pythonRunner!.start(
            options,
            (message) => {
                if (mainWindow) {
                    mainWindow.webContents.send('crawler:message', message);
                }
            },
            (exitCode) => {
                if (exitCode === 0) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`Crawler exited with code ${exitCode}`));
                }
            },
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

ipcMain.on('open-url', (_event: any, url: string) => {
    shell.openExternal(url);
});

// 시스템 및 데이터 유틸리티
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

ipcMain.handle('system:open-path', async (_event: IpcMainInvokeEvent, targetPath: string) => {
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

ipcMain.handle('system:resolve-path', async (_event: IpcMainInvokeEvent, targetPath: string) => {
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

ipcMain.handle('data:read-file', async (_event: IpcMainInvokeEvent, filePath: string) => {
    try {
        let absolutePath = filePath;

        if (!path.isAbsolute(filePath)) {
            if (filePath.startsWith('data/')) {
                const relativePath = filePath.substring(5);
                absolutePath = path.join(DATA_ROOT, relativePath);
            } else {
                absolutePath = path.join(DATA_ROOT, filePath);
            }
        }

        if (!fs.existsSync(absolutePath)) {
            return { success: false, error: 'File not found' };
        }

        const content = fs.readFileSync(absolutePath, 'utf8');
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

ipcMain.handle('data:write-file', async (_event: IpcMainInvokeEvent, filePath: string, content: string | object) => {
    try {
        let absolutePath = filePath;

        if (!path.isAbsolute(filePath)) {
            if (filePath.startsWith('data/')) {
                const relativePath = filePath.substring(5);
                absolutePath = path.join(DATA_ROOT, relativePath);
            } else {
                absolutePath = path.join(DATA_ROOT, filePath);
            }
        }

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

ipcMain.handle('data:list-directory', async (_event: IpcMainInvokeEvent, dirPath: string) => {
    try {
        let absolutePath = dirPath;
        if (!path.isAbsolute(dirPath)) {
            if (dirPath.startsWith('data/')) {
                absolutePath = path.join(DATA_ROOT, dirPath.substring(5));
            } else {
                absolutePath = path.join(DATA_ROOT, dirPath);
            }
        }

        if (!fs.existsSync(absolutePath)) {
            return { success: true, files: [] };
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
