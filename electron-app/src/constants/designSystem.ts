// VS Code Dark+ Design System

// Core Colors
export const COLORS = {
    // Background
    APP_BG: '#1E1E1E',
    SURFACE: '#252526',
    PANEL: '#2D2D2D',
    HEADER: '#323233',

    // Borders
    BORDER: '#3C3C3C',
    BORDER_HOVER: '#007ACC',

    // Text
    TEXT_PRIMARY: '#CCCCCC',
    TEXT_SECONDARY: '#9D9D9D',
    TEXT_MUTED: '#6A6A6A',

    // Accent Colors (Neon)
    NEON_BLUE: '#007ACC',
    NEON_CYAN: '#4EC9B0',
    NEON_GREEN: '#89D185',
    NEON_YELLOW: '#D4A72C',
    NEON_RED: '#F14C4C',

    // Signal States
    SIGNAL_WIN_BG: 'rgba(137, 209, 133, 0.1)',
    SIGNAL_LOSE_BG: 'rgba(241, 76, 76, 0.1)',
    SIGNAL_INFO_BG: 'rgba(0, 122, 204, 0.1)',
} as const;

// Typography
export const TYPOGRAPHY = {
    FONT_FAMILY: {
        SANS: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        MONO: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
    },
    FONT_SIZE: {
        XS: '11px',
        SM: '12px',
        MD: '13px',
        LG: '14px',
        XL: '16px',
        XXL: '20px',
    },
    FONT_WEIGHT: {
        NORMAL: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700,
    }
} as const;

// Spacing & Density
export const SPACING = {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '24px',
    XXL: '32px',
} as const;

export const DENSITY = {
    COMPACT: {
        padding: SPACING.SM,
        gap: SPACING.XS,
    },
    COMFORTABLE: {
        padding: SPACING.MD,
        gap: SPACING.SM,
    },
    SPACIOUS: {
        padding: SPACING.LG,
        gap: SPACING.MD,
    }
} as const;

// Glow Effects
export const GLOW_EFFECTS = {
    NEON_BLUE: `0 0 10px ${COLORS.NEON_BLUE}40, 0 0 20px ${COLORS.NEON_BLUE}20`,
    NEON_CYAN: `0 0 10px ${COLORS.NEON_CYAN}40, 0 0 20px ${COLORS.NEON_CYAN}20`,
    NEON_GREEN: `0 0 10px ${COLORS.NEON_GREEN}40, 0 0 20px ${COLORS.NEON_GREEN}20`,
} as const;

// Layout
export const LAYOUT = {
    MAX_WIDTH: '1440px',
    SIDEBAR_WIDTH: '48px',
    MAIN_CANVAS_WIDTH: '70%',
    LOGS_PANEL_WIDTH: '30%',
} as const;
