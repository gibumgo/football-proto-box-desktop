// Crawler Types matching Python CLI arguments

export interface CommonOptions {
    headless?: boolean;
    debug?: boolean;
    timeout?: number;
    outputDir?: string;
}

export interface BetinfoOptions extends CommonOptions {
    mode: 'betinfo';
    collectionType: 'recent' | 'range' | 'rounds'; // UI helper state
    year?: number;
    recent?: number;
    startRound?: string; // Changed to string to match CLI
    endRound?: string;   // Changed to string to match CLI
    rounds?: string;     // Comma separated string
}

export interface FlashscoreOptions extends CommonOptions {
    mode: 'flashscore';
    task: 'metadata' | 'matches';
    url: string;         // Required for metadata and matches
    season?: string;
    fsStartRound?: number;
    fsEndRound?: number;
    checkpointInterval?: number;
    resume?: boolean;
}

export interface MappingOptions extends CommonOptions {
    mode: 'mapping';
    task: 'leagues' | 'teams';
}

export type CrawlerOptions = BetinfoOptions | FlashscoreOptions | MappingOptions;

export interface CrawlerMessage {
    type: 'STATUS' | 'PROGRESS' | 'DATA' | 'CHECKPOINT' | 'ERROR' | 'LOG';
    payload: any;
}

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
