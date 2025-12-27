// Crawler Types
export interface CrawlerMessage {
    type: 'STATUS' | 'PROGRESS' | 'DATA' | 'CHECKPOINT' | 'ERROR' | 'LOG';
    payload: any;
}

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
    task: 'metadata' | 'matches';
    season?: string;
    fsStartRound?: number;
    fsEndRound?: number;
    resume?: boolean;
}

export type CrawlerOptions = BetinfoOptions | FlashscoreOptions;

// Data Inventory Types
export interface DataInventory {
    totalCSV: number;
    betinfoRounds: {
        min: number;
        max: number;
        count: number;
    };
    flashscoreStats: {
        leagues: number;
        teams: number;
        matches: number;
    };
}

export interface ExecutionHistory {
    timestamp: string;
    site: 'betinfo' | 'flashscore';
    task: string;
    status: 'success' | 'failure';
    message?: string;
}
