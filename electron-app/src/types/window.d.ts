import type { CrawlerMessage, BetinfoOptions, FlashscoreOptions } from './crawler';

declare global {
    interface Window {
        api: {
            loadData: () => Promise<any[]>;
            crawler: {
                start: (options: BetinfoOptions | FlashscoreOptions) => Promise<{ success: boolean }>;
                stop: () => Promise<{ success: boolean }>;
                status: () => Promise<{ isRunning: boolean }>;
                onMessage: (callback: (message: CrawlerMessage) => void) => () => void;
            };
        };
    }
}

export { };
