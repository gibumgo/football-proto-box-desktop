import { useState, useEffect, useCallback } from 'react';
import type { CrawlerMessage, BetinfoOptions, FlashscoreOptions, MappingOptions } from '../types/crawler';

export function useCrawler() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    // [Persistence] Load from localStorage or use default
    const [outputDir, setOutputDir] = useState(() => {
        return localStorage.getItem('crawler_output_dir') || './data';
    });

    const updateOutputDir = useCallback((path: string) => {
        setOutputDir(path);
        localStorage.setItem('crawler_output_dir', path);
    }, []);

    useEffect(() => {
        if (!window.api || !window.api.crawler) {
            console.warn('API not available');
            return;
        }

        // [Path Resolution] Resolve relative path './data' to absolute path
        const resolveInitialPath = async () => {
            const currentPath = localStorage.getItem('crawler_output_dir') || './data';
            if (currentPath.startsWith('.')) {
                try {
                    const absolutePath = await (window.api as any).system.resolvePath(currentPath);
                    setOutputDir(absolutePath);
                    // Do not save resolved absolute path back to storage immediately
                    // to keep the concept of relative default if user clears storage?
                    // Actually, let's update it to absolute so UI is consistent.
                    // setOutputDir handles the state.
                } catch (e) {
                    console.error('Failed to resolve path:', e);
                }
            }
        };
        resolveInitialPath();

        const unsubscribe = window.api.crawler.onMessage((message: CrawlerMessage) => {
            switch (message.type) {
                case 'STATUS':
                    setLogs(prev => [...prev, `[STATUS] ${message.payload.statusType}: ${message.payload.value}`]);
                    break;
                case 'PROGRESS':
                    setProgress(message.payload.percent);
                    break;
                case 'DATA':
                    setLogs(prev => [...prev, `[SUCCESS] Saved ${Object.keys(message.payload).length} items`]);
                    break;
                case 'LOG':
                    setLogs(prev => [...prev, `[${message.payload.level}] ${message.payload.message}`]);
                    break;
                case 'ERROR':
                    setLogs(prev => [...prev, `[ERROR ${message.payload.code}] ${message.payload.message}`]);
                    setIsRunning(false);
                    break;
                case 'CHECKPOINT':
                    setLogs(prev => [...prev, `[CHECKPOINT] ${message.payload.checkpointId}`]);
                    break;
            }
        });

        window.api.crawler.status().then(({ isRunning }) => {
            setIsRunning(isRunning);
        }).catch(err => {
            console.error('Failed to get status:', err);
        });

        return unsubscribe;
    }, []);

    const startCrawler = useCallback(async (options: BetinfoOptions | FlashscoreOptions | MappingOptions) => {
        try {
            if (!window.api) throw new Error('API not available');
            setLogs([]);
            setProgress(0);
            setIsRunning(true);
            setLogs(prev => [...prev, `System: Starting crawler (${options.mode})...`]);

            await window.api.crawler.start(options);

            setIsRunning(false);
            setLogs(prev => [...prev, 'System: Crawler finished successfully.']);
        } catch (error) {
            console.error('Failed to start crawler:', error);
            setIsRunning(false);
            setLogs(prev => [...prev, `[ERROR] Failed to start or interrupted: ${error}`]);
        }
    }, []);

    const stopCrawler = useCallback(async () => {
        try {
            if (!window.api) throw new Error('API not available');
            await window.api.crawler.stop();
            // isRunning will be set to false by the startCrawler's catch block or by explicit call
            setIsRunning(false);
            setLogs(prev => [...prev, 'System: Crawler stopped by user.']);
        } catch (error) {
            console.error('Failed to stop crawler:', error);
            setLogs(prev => [...prev, `[ERROR] Failed to stop: ${error}`]);
        }
    }, []);

    return {
        isRunning,
        logs,
        progress,
        outputDir,
        startCrawler,
        stopCrawler,
        updateOutputDir
    };
}
