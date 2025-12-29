export const NEON_THEME = {
    colors: {
        // Backgrounds
        bg: {
            app: '#121212',      // Soft Dark Gray (Eye comfort)
            panel: '#1E1E1E',    // Slightly lighter gray for contrast
            header: '#1A1A1A',   // Matching Soft Dark
            surface: '#252525',  // Cards/Modals
            terminal: '#000000', // Keep Pure Black for Terminal
        },
        // Pastel Accents (Formerly Neon)
        neon: {
            cyan: '#22D3EE',    // Cyan 400 (Pastel)
            green: '#4ADE80',   // Green 400 (Pastel)
            red: '#F87171',     // Red 400 (Pastel)
            purple: '#C084FC',  // Purple 400 (Pastel)
            yellow: '#FACC15',  // Yellow 400 (Pastel)
        },
        // Standard Text
        text: {
            primary: '#E2E8F0',  // Slate 200 (Softer White)
            secondary: '#94A3B8', // Slate 400
            muted: '#64748B',    // Slate 500
            disabled: '#475569', // Slate 600
            inverse: '#000000',
        },
        // Status
        status: {
            success: '#4ADE80', // Pastel Green
            warning: '#FACC15', // Pastel Yellow
            error: '#F87171',   // Pastel Red
            info: '#22D3EE',    // Pastel Cyan
        },
        // Borders
        border: {
            default: '#2D2D2D',             // Softer Border
            active: 'rgba(34, 211, 238, 0.4)', // Pastel Cyan Glow
            subtle: 'rgba(255, 255, 255, 0.05)',
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
    },
    typography: {
        fontFamily: {
            sans: '"Exo 2", "Inter", sans-serif',
            mono: '"JetBrains Mono", "Fira Code", monospace',
        },
        size: {
            xs: '11px',
            sm: '12px',
            md: '14px',
            lg: '16px',
            xl: '20px',
            xxl: '24px',
        },
        weight: {
            light: 300,
            regular: 400,
            medium: 500,
            bold: 700,
        }
    },
    layout: {
        headerHeight: '54px',
        sidebarWidth: '240px', // Added
        radius: {
            xs: '2px', // Sharp
            sm: '4px',
            md: '6px',
            lg: '8px',
            full: '9999px',
        },
        zIndex: {
            content: 1,
            sidebar: 90,
            header: 100,
            overlay: 900,
            modal: 1000,
            tooltip: 1100,
        }
    },
    effects: {
        glass: {
            background: 'rgba(10, 15, 20, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        glow: {
            cyan: '0 0 10px rgba(0, 243, 255, 0.3)',
            green: '0 0 10px rgba(0, 255, 157, 0.3)',
            red: '0 0 10px rgba(255, 46, 46, 0.3)',
            // Legacy Glow Effects
            neonBlue: '0 0 10px rgba(79, 195, 247, 0.5), 0 0 20px rgba(79, 195, 247, 0.3)',
            neonGreen: '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)',
            neonRed: '0 0 10px rgba(248, 113, 113, 0.5), 0 0 20px rgba(248, 113, 113, 0.3)',
            neonPurple: '0 0 10px rgba(199, 146, 234, 0.5), 0 0 20px rgba(199, 146, 234, 0.3)',
        },
        shadow: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
            md: '0 2px 8px rgba(0, 0, 0, 0.1)',
            lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
        transition: {
            fast: '0.15s ease',
            normal: '0.2s ease',
            slow: '0.3s ease',
        }
    },
    // Domain Specific Colors (Merged from Legacy)
    domain: {
        signal: {
            winBg: 'rgba(74, 222, 128, 0.12)',
            drawBg: 'rgba(251, 191, 36, 0.12)',
            loseBg: 'rgba(248, 113, 113, 0.12)',
            upsetBg: 'rgba(248, 113, 113, 0.18)',
            underdogBg: 'rgba(74, 222, 128, 0.18)',
        },
        heatmap: {
            low: '#4ade80',  // Green
            mid: '#fbbf24',  // Yellow
            high: '#f87171', // Red
        }
    }
} as const;
