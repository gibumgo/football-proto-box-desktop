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
            openExternal: (url: string) => void;
            system: {
                selectDirectory: () => Promise<string | null>;
                openPath: (path: string) => Promise<{ success: boolean; error?: any }>;
                resolvePath: (path: string) => Promise<string>;
            };
            data: {
                readFile: (path: string) => Promise<{ success: boolean; data?: any; error?: any }>;
                writeFile: (path: string, content: any) => Promise<{ success: boolean; error?: any }>;
                listDirectory: (path: string) => Promise<{ success: boolean; files?: any[]; error?: any }>;
            };
            archive: {
                getAvailableRounds: () => Promise<{ success: boolean; rounds: number[]; error?: any }>;
                getRoundData: (round: number) => Promise<any>;
            };
        };
    }
}

export { };
