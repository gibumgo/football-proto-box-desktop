import { spawn, ChildProcess } from 'child_process';
import path from 'path';

export type CrawlerMode = 'betinfo' | 'flashscore';
export type FlashscoreTask = 'metadata' | 'matches';

export interface BetinfoOptions {
    mode: 'betinfo';
    recent?: number;
    startRound?: number;
    endRound?: number;
    rounds?: number[];
    year?: number;
}

export interface FlashscoreOptions {
    mode: 'flashscore';
    task: FlashscoreTask;
    season?: string;
    fsStartRound?: number;
    fsEndRound?: number;
    resume?: boolean;
}

export type CrawlerOptions = BetinfoOptions | FlashscoreOptions;

export interface IPCMessage {
    type: 'STATUS' | 'PROGRESS' | 'DATA' | 'CHECKPOINT' | 'ERROR' | 'LOG';
    payload: any;
}

export class PythonRunner {
    private process: ChildProcess | null = null;
    private pythonPath: string;
    private mainScriptPath: string;

    constructor() {
        // Paths relative to the main process location
        this.pythonPath = 'python3'; // Assumes python3 is in PATH
        this.mainScriptPath = path.resolve(__dirname, '../../../python-crawler/main.py');
    }

    public start(
        options: CrawlerOptions,
        onMessage: (message: IPCMessage) => void,
        onComplete: (exitCode: number) => void,
        onError: (error: Error) => void
    ): void {
        if (this.process) {
            throw new Error('Crawler process is already running');
        }

        const args = this.buildCommandArgs(options);

        console.log('[PythonRunner] Starting:', this.pythonPath, args.join(' '));

        this.process = spawn(this.pythonPath, args, {
            cwd: path.dirname(this.mainScriptPath),
            env: { ...process.env }
        });

        // Parse stdout for IPC messages
        this.process.stdout?.on('data', (chunk: Buffer) => {
            const output = chunk.toString();
            this.parseIPCMessages(output, onMessage);
        });

        // Capture stderr for logs
        this.process.stderr?.on('data', (chunk: Buffer) => {
            const errorOutput = chunk.toString();
            console.error('[PythonRunner] stderr:', errorOutput);

            // Parse [LOG] messages from stderr
            const logMatch = errorOutput.match(/\[LOG\]\[(\w+)\]\s*(.+)/);
            if (logMatch) {
                onMessage({
                    type: 'LOG',
                    payload: { level: logMatch[1], message: logMatch[2] }
                });
            }
        });

        // Handle process exit
        this.process.on('close', (code) => {
            console.log('[PythonRunner] Process exited with code:', code);
            this.process = null;
            onComplete(code || 0);
        });

        // Handle process errors
        this.process.on('error', (err) => {
            console.error('[PythonRunner] Process error:', err);
            this.process = null;
            onError(err);
        });
    }

    public stop(): void {
        if (this.process) {
            console.log('[PythonRunner] Stopping process');
            this.process.kill('SIGTERM');
            this.process = null;
        }
    }

    public isRunning(): boolean {
        return this.process !== null;
    }

    private buildCommandArgs(options: CrawlerOptions): string[] {
        const args = [this.mainScriptPath, '--mode', options.mode];

        if (options.mode === 'betinfo') {
            if (options.recent !== undefined) {
                args.push('--recent', options.recent.toString());
            }
            if (options.startRound !== undefined) {
                args.push('--start-round', options.startRound.toString());
            }
            if (options.endRound !== undefined) {
                args.push('--end-round', options.endRound.toString());
            }
            if (options.rounds && options.rounds.length > 0) {
                args.push('--rounds', options.rounds.join(','));
            }
            if (options.year !== undefined) {
                args.push('--year', options.year.toString());
            }
        } else if (options.mode === 'flashscore') {
            args.push('--task', options.task);
            if (options.season) {
                args.push('--season', options.season);
            }
            if (options.fsStartRound !== undefined) {
                args.push('--fs-start-round', options.fsStartRound.toString());
            }
            if (options.fsEndRound !== undefined) {
                args.push('--fs-end-round', options.fsEndRound.toString());
            }
            if (options.resume) {
                args.push('--resume');
            }
        }

        return args;
    }

    private parseIPCMessages(output: string, onMessage: (message: IPCMessage) => void): void {
        const lines = output.split('\n');

        for (const line of lines) {
            if (!line.trim()) continue;

            // STATUS:type|value
            if (line.startsWith('IPC_STATUS:')) {
                const content = line.substring('IPC_STATUS:'.length);
                const [statusType, value] = content.split('|');
                onMessage({
                    type: 'STATUS',
                    payload: { statusType, value }
                });
            }
            // PROGRESS:50.0
            else if (line.startsWith('IPC_PROGRESS:')) {
                const percent = parseFloat(line.substring('IPC_PROGRESS:'.length));
                onMessage({
                    type: 'PROGRESS',
                    payload: { percent }
                });
            }
            // DATA:{json}
            else if (line.startsWith('IPC_DATA:')) {
                try {
                    const jsonString = line.substring('IPC_DATA:'.length);
                    const data = JSON.parse(jsonString);
                    onMessage({
                        type: 'DATA',
                        payload: data
                    });
                } catch (e) {
                    console.error('[PythonRunner] Failed to parse DATA message:', e);
                }
            }
            // CHECKPOINT:id
            else if (line.startsWith('IPC_CHECKPOINT:')) {
                const checkpointId = line.substring('IPC_CHECKPOINT:'.length);
                onMessage({
                    type: 'CHECKPOINT',
                    payload: { checkpointId }
                });
            }
            // ERROR:code|message
            else if (line.startsWith('IPC_ERROR:')) {
                const content = line.substring('IPC_ERROR:'.length);
                const [code, message] = content.split('|');
                onMessage({
                    type: 'ERROR',
                    payload: { code: parseInt(code), message }
                });
            }
        }
    }
}
