import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { PythonRunner, type CrawlerOptions } from './pythonRunner';

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
ipcMain.handle('crawler:start', async (_event, options: Crawler Options) => {
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
