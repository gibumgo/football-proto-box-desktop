
interface CrawlerRequest {
    mode: 'betinfo' | 'flashscore';
    startRound?: string;
    endRound?: string;
    headless: boolean;
    timeout: number;
}

interface CrawlerState {
    status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    progress: number;
    lastLog: string;
}

const API_BASE = 'http://localhost:8080/api/crawler';

export const crawlerApi = {
    start: async (request: CrawlerRequest): Promise<void> => {
        const response = await fetch(`${API_BASE}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to start crawler');
    },

    stop: async (): Promise<void> => {
        const response = await fetch(`${API_BASE}/stop`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to stop crawler');
    },

    getStatus: async (): Promise<CrawlerState> => {
        const response = await fetch(`${API_BASE}/status`);
        if (!response.ok) throw new Error('Failed to get status');
        return response.json();
    }
};
