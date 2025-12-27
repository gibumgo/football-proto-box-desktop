export const TEXTS = {
    // Layout & Navigation
    LAYOUT: {
        LOGO: 'PROTO BOX',
        VERSION: 'v0.1.0 Alpha',
        MENU: {
            DASHBOARD: 'Dashboard',
            ANALYSIS: 'Analysis',
            CRAWLER: 'Crawler Manager',
            TOOLS: 'Tools',
            SETTINGS: 'Settings'
        },
        WIP: '🚧 Work in Progress'
    },

    // Crawler Dashboard
    CRAWLER: {
        TITLE: 'Crawler Manager',
        SECTION_CONFIG: 'Configuration',

        // Use Korean/English mix as they appear in UI
        LABEL_SITE: 'Target Site',
        LABEL_START_ROUND: 'Start Round / Date',
        LABEL_END_ROUND: 'End Round (Opt)',
        CHECKBOX_HEADLESS: 'Run in Headless Mode',

        BTN_START: 'START CRAWLING',
        BTN_STOP: 'STOP',

        STATUS_LABEL: 'Status:',
        LOG_EMPTY: 'System Ready. Waiting for commands...',

        // Options
        SITE_BETINFO: 'Betinfo (Proto)',
        SITE_FLASHSCORE: 'Flashscore'
    },

    // Matches Page
    MATCHES: {
        TITLE: 'Analysis', // Matches Table Title
        NO_DATA: '경기 데이터가 없습니다',
        RELOAD: 'Reload Data', // Assuming implicit button label
        LOADING: 'Loading...', // Assuming implicit
        COLUMNS: {
            ROUND: 'ROUND',
            MATCH_NO: 'NO',
            DATE: 'DATE/TIME',
            LEAGUE: 'LEAGUE',
            HOME: 'HOME',
            SCORE: 'SCORE',
            AWAY: 'AWAY',
            WIN: 'WIN',
            DRAW: 'DRAW',
            LOSE: 'LOSE',
            RESULT: 'RESULT',
            ODD: 'ODD'
        }
    },

    // Dashboard Statistics Page
    DASHBOARD: {
        TITLE: '📊 Dashboard',

        // Cards
        CARD_TOTAL: '전체 경기',
        CARD_WIN_RATE: '승률',
        CARD_DRAW_RATE: '무승부율',
        CARD_LOSE_RATE: '패율',

        // Charts
        CHART_LEAGUE_TITLE: '리그별 분포',
        CHART_RESULT_TITLE: '결과 분포',

        // Tooltip/Labels if needed
        LABEL_WIN: '승',
        LABEL_DRAW: '무',
        LABEL_LOSE: '패'
    },

    // App System Messages
    SYSTEM: {
        NO_API_WARNING: 'window.api가 없습니다. 목 데이터를 사용합니다.',
        DATA_LOAD_ERROR: 'Failed to load data:'
    }
} as const;
