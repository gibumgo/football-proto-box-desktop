// VS Code Dark+ 테마 색상 팔레트
export const COLORS = {
    // 배경 (VS Code 스타일)
    APP_BG: '#1e1e1e',           // VS Code 메인 배경
    SURFACE: '#252526',          // VS Code 사이드바/패널 배경
    HEADER: '#2d2d30',           // VS Code 헤더/탭 배경
    PANEL: '#1e1e1e',            // 패널 영역

    // 텍스트 (부드러운 회색 톤)
    TEXT_PRIMARY: '#d4d4d4',     // VS Code 기본 텍스트
    TEXT_SECONDARY: '#858585',   // VS Code 보조 텍스트
    TEXT_MUTED: '#6a6a6a',       // 비활성 텍스트

    // 보더
    BORDER: '#3e3e42',           // VS Code 구분선
    BORDER_SUBTLE: '#2b2b2b',    // 미묘한 구분선

    // 네온 액센트 (하이라이트용)
    NEON_BLUE: '#4fc3f7',        // 네온 블루 (주요 액센트)
    NEON_PURPLE: '#c792ea',      // 네온 퍼플 (보조 액센트)
    NEON_GREEN: '#4ade80',       // 네온 그린 (승리)
    NEON_RED: '#f87171',         // 네온 레드 (패배)
    NEON_YELLOW: '#fbbf24',      // 네온 옐로우 (무승부)
    NEON_CYAN: '#22d3ee',        // 네온 시안 (정보)

    // Signal Colors (배당 결과 강조)
    SIGNAL_WIN_BG: 'rgba(74, 222, 128, 0.12)',      // 승리 배경 (네온 그린 틴트)
    SIGNAL_DRAW_BG: 'rgba(251, 191, 36, 0.12)',     // 무승부 배경 (네온 옐로우 틴트)
    SIGNAL_LOSE_BG: 'rgba(248, 113, 113, 0.12)',    // 패배 배경 (네온 레드 틴트)
    SIGNAL_UPSET_BG: 'rgba(248, 113, 113, 0.18)',   // 정배 붕괴 (더 진한 레드)
    SIGNAL_UNDERDOG_BG: 'rgba(74, 222, 128, 0.18)', // 역배 적중 (더 진한 그린)

    // UI 요소
    BUTTON_PRIMARY: '#4fc3f7',       // 네온 블루
    BUTTON_PRIMARY_HOVER: '#29b6f6',
    BUTTON_SECONDARY: '#3e3e42',
    BUTTON_SECONDARY_HOVER: '#4e4e52',

    // 상태 색상
    SUCCESS: '#4ade80',
    WARNING: '#fbbf24',
    ERROR: '#f87171',
    INFO: '#4fc3f7',

    // 배당 히트맵 그라데이션
    HEATMAP_LOW: '#4ade80',      // 낮은 배당 (강팀) - 그린
    HEATMAP_MID: '#fbbf24',      // 중간 배당 - 옐로우
    HEATMAP_HIGH: '#f87171',     // 높은 배당 (약팀) - 레드
};

export const TYPOGRAPHY = {
    FONT_FAMILY: "'Consolas', 'Courier New', 'JetBrains Mono', monospace", // VS Code 기본 폰트
    SIZE: {
        XS: '10px',
        SM: '12px',
        MD: '13px',
        LG: '14px',
        XL: '16px',
        XXL: '20px',
        XXXL: '24px',
    },
    WEIGHT: {
        LIGHT: 300,
        REGULAR: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700,
    }
};

export const DENSITY = {
    COMPACT: {
        ROW_HEIGHT: 32,
        PADDING_X: '4px',
        PADDING_Y: '2px',
        FONT_SCALE: -2,
        ICON_SIZE: 16,
    },
    COMFORTABLE: {
        ROW_HEIGHT: 48,
        PADDING_X: '8px',
        PADDING_Y: '4px',
        FONT_SCALE: 0,
        ICON_SIZE: 20,
    }
};

// 네온 글로우 효과
export const GLOW_EFFECTS = {
    NEON_BLUE: '0 0 10px rgba(79, 195, 247, 0.5), 0 0 20px rgba(79, 195, 247, 0.3)',
    NEON_GREEN: '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)',
    NEON_RED: '0 0 10px rgba(248, 113, 113, 0.5), 0 0 20px rgba(248, 113, 113, 0.3)',
    NEON_PURPLE: '0 0 10px rgba(199, 146, 234, 0.5), 0 0 20px rgba(199, 146, 234, 0.3)',
};
