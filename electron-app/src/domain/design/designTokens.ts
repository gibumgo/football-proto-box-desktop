export const NEON_THEME = {
    colors: {
        // Backgrounds
        bg: {
            app: '#050505',      // Deep Void
            panel: '#0A0F14',    // Darker Navy
            header: '#0D1117',   // GitHub Dark Dimmed
            surface: '#161B22',  // Added for Sidebar/Panels (GitHub Dark Default)
            terminal: '#000000', // Pure Black for Terminal
        },
        // Neon Accents
        neon: {
            cyan: '#00F3FF',
            green: '#00FF9D',
            red: '#FF2E2E',
            purple: '#BC13FE',
            yellow: '#FBBF24',
        },
        // Standard Text
        text: {
            primary: '#E5E7EB',
            secondary: '#9CA3AF',
            muted: '#4B5563',
            disabled: '#6B7280', // Gray 500
            inverse: '#000000',
        },
        // Status
        status: {
            success: '#00FF9D', // Neon Green
            warning: '#FBBF24', // Neon Yellow
            error: '#FF2E2E',   // Neon Red
            info: '#00F3FF',    // Neon Cyan
        },
        // Borders
        border: {
            default: '#1F2937',             // Subtle Gray
            active: 'rgba(0, 243, 255, 0.5)', // Glowing Cyan
            subtle: 'rgba(255, 255, 255, 0.1)',
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
