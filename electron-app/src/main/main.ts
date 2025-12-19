import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;

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
        // Path to JAR file
        // In dev, it's relative to project root. In prod, it might be different.
        // For now, assume dev environment structure or adjust path.
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
