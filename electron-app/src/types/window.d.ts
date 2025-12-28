import type { CrawlerMessage, BetinfoOptions, FlashscoreOptions, MappingOptions } from './crawler';

declare global {
    interface Window {
        api: {
            loadData: () => Promise<any[]>;
            crawler: {
                start: (options: BetinfoOptions | FlashscoreOptions | MappingOptions) => Promise<{ success: boolean }>;
                stop: () => Promise<{ success: boolean }>;
                status: () => Promise<{ isRunning: boolean }>;
                onMessage: (callback: (message: CrawlerMessage) => void) => () => void;
            };
        };
    }
}

export { };
