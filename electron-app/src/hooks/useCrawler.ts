import { useState, useEffect, useCallback } from 'react';
import type { CrawlerMessage, BetinfoOptions, FlashscoreOptions, MappingOptions } from '../types/crawler';

export function useCrawler() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 브라우저 환경 등 api가 없을 경우 예외 처리
        if (!window.api || !window.api.crawler) {
            console.warn('API not available');
            return;
        }

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
        startCrawler,
        stopCrawler
    };
}
