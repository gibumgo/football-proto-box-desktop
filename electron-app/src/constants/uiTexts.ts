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

        TERMINAL: {
            TITLE: 'Live Execution Log',
            LINES: 'Lines',
            WAITING: '_ Waiting for tasks...',
        },

        // Options
        SITE_BETINFO: 'Betinfo (Proto)',
        SITE_FLASHSCORE: 'Flashscore',
        SITE_MAPPING: 'Mapping Tools',

        CONTROL_PANEL: {
            ADVANCED_SETTINGS: '고급 설정',
            BTN_START: '크롤링 시작',
            BTN_RUNNING: '실행 중...',
            BTN_STOP: '중지',
            MSG_URL_REQUIRED: 'URL을 입력해주세요.',

            MAPPING: {
                BTN_MAP_LEAGUES: '리그 매핑 (Map Leagues)',
                BTN_MAP_TEAMS: '팀 매핑 (Map Teams)',
                DESC_MAP_LEAGUES: 'Flashscore와 Betinfo의 리그명을 매핑합니다.',
                DESC_MAP_TEAMS: 'Flashscore와 Betinfo의 팀명을 매핑합니다.',
                LABEL_DESCRIPTION: '기능 설명'
            },

            BETINFO: {
                LABEL_COLLECTION_TYPE: '수집 범위',
                TYPE_RECENT: '최신 회차',
                TYPE_RANGE: '구간 지정',
                LABEL_RECENT_COUNT: '수집할 회차 수',
                LABEL_START_ROUND: '시작 회차',
                PLACEHOLDER_START_ROUND: '040',
                LABEL_END_ROUND: '종료 회차',
                PLACEHOLDER_END_ROUND: '050',
                LABEL_YEAR: '대상 연도',
                LABEL_SKIP_EXISTING: '기존 파일 존재 시 수집 건너뛰기'
            },

            FLASHSCORE: {
                LABEL_TASK_TYPE: '작업 유형',
                TYPE_METADATA: '팀 정보 (Metdata/Standings)',
                TYPE_MATCHES: '경기 결과 (Results)',
                LABEL_TARGET_URL: '타겟 URL (Flashscore.co.kr)',
                PLACEHOLDER_TARGET_URL: 'https://www.flashscore.co.kr/...',
                GUIDE_METADATA_TITLE: '[팀 정보 가이드]',
                GUIDE_METADATA_DESC: '순위(Standings) 페이지 URL을 입력하세요.',
                GUIDE_METADATA_EX: '예: .../premier-league/standings/',
                GUIDE_MATCHES_TITLE: '[경기 결과 가이드]',
                GUIDE_MATCHES_DESC: '결과(Results) 페이지 URL을 입력하세요.',
                GUIDE_MATCHES_EX: '예: .../premier-league/results/',
                LABEL_SEASON: '시즌 (예: 24-25)',
                LABEL_START_ROUND: '시작 라운드',
                PLACEHOLDER_START_ROUND: '1',
                LABEL_END_ROUND: '종료 라운드',
                PLACEHOLDER_END_ROUND: '38',
                CHECKBOX_RESUME: '중단된 지점부터 이어하기 (Resume)'
            },

            ADVANCED: {
                CHECKBOX_HEADLESS: '헤드리스 모드 (브라우저 숨김)',
                CHECKBOX_DEBUG: '디버그 로그 출력',
                LABEL_TIMEOUT: '타임아웃 (초)',
                LABEL_OUTPUT_DIR: '데이터 저장 경로'
            }
        }
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
        },
        HEADERS: {
            ROUND: '회차',
            MATCH_NO: '번호',
            DATE: '경기 일시',
            LEAGUE: '리그',
            TYPE: '경기 종류',
            HOME: '홈팀',
            AWAY: '원정팀',
            WIN: '승',
            DRAW: '무',
            LOSE: '패',
            RESULT: '결과',
            SCORE: '스코어',
            WIN_ODD: '승 배당',
            DRAW_ODD: '무 배당',
            LOSE_ODD: '패 배당',
            RESULT_ODD: '결과 배당'
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
