export const CRAWLER_CONFIG = {
    // Defaults from python-crawler/config.py
    DEFAULT_TIMEOUT: 300,
    DEFAULT_HEADLESS: true,

    // Paths (Reference only for UI display if needed)
    PATHS: {
        DATA: 'data',
        MASTER: 'data/master',
        CRAWLED_FLASHSCORE: 'data/crawled/flashscore',
        CRAWLED_BETINFO: 'data/crawled/betinfo'
    }
} as const;
