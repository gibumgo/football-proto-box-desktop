"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonRunner = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
class PythonRunner {
    process = null;
    pythonPath;
    mainScriptPath;
    constructor() {
        // Paths relative to the main process location
        this.pythonPath = 'python3'; // Assumes python3 is in PATH
        this.mainScriptPath = path_1.default.resolve(__dirname, '../../../python-crawler/main.py');
    }
    start(options, onMessage, onComplete, onError) {
        if (this.process) {
            throw new Error('Crawler process is already running');
        }
        const args = this.buildCommandArgs(options);
        console.log('[PythonRunner] Starting:', this.pythonPath, args.join(' '));
        this.process = (0, child_process_1.spawn)(this.pythonPath, args, {
            cwd: path_1.default.dirname(this.mainScriptPath),
            env: { ...process.env }
        });
        // Parse stdout for IPC messages
        this.process.stdout?.on('data', (chunk) => {
            const output = chunk.toString();
            this.parseIPCMessages(output, onMessage);
        });
        // Capture stderr for logs
        this.process.stderr?.on('data', (chunk) => {
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
    stop() {
        if (this.process) {
            console.log('[PythonRunner] Stopping process');
            this.process.kill('SIGTERM');
            this.process = null;
        }
    }
    isRunning() {
        return this.process !== null;
    }
    buildCommandArgs(options) {
        const args = [this.mainScriptPath, '--mode', options.mode];
        // 1. Common Options
        // Headless default is true in config.py, so we only need to pass --no-headless if explicitly false
        if (options.headless === false) {
            args.push('--no-headless');
        }
        else if (options.headless === true) {
            args.push('--headless');
        }
        if (options.debug)
            args.push('--debug');
        if (options.timeout)
            args.push('--timeout', options.timeout.toString());
        if (options.outputDir)
            args.push('--output-dir', options.outputDir);
        // 2. Betinfo Options
        if (options.mode === 'betinfo') {
            const opts = options;
            if (opts.year)
                args.push('--year', opts.year.toString());
            if (opts.collectionType === 'recent' && opts.recent) {
                args.push('--recent', opts.recent.toString());
            }
            else if (opts.collectionType === 'range' && opts.startRound && opts.endRound) {
                args.push('--start-round', opts.startRound);
                args.push('--end-round', opts.endRound);
            }
            else if (opts.collectionType === 'rounds' && opts.rounds) {
                args.push('--rounds', opts.rounds);
            }
        }
        // 3. Flashscore Options
        else if (options.mode === 'flashscore') {
            const opts = options;
            args.push('--task', opts.task);
            if (opts.url)
                args.push('--url', opts.url);
            if (opts.season)
                args.push('--season', opts.season);
            if (opts.resume)
                args.push('--resume');
            if (opts.checkpointInterval)
                args.push('--checkpoint-interval', opts.checkpointInterval.toString());
            if (opts.fsStartRound)
                args.push('--fs-start-round', opts.fsStartRound.toString());
            if (opts.fsEndRound)
                args.push('--fs-end-round', opts.fsEndRound.toString());
        }
        return args;
    }
    parseIPCMessages(output, onMessage) {
        const lines = output.split('\n');
        for (const line of lines) {
            if (!line.trim())
                continue;
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
                }
                catch (e) {
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
exports.PythonRunner = PythonRunner;
