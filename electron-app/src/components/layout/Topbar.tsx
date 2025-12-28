import { NEON_THEME } from '../../domain/design/designTokens';

interface TopbarProps {
    matchCount: number;
    signalMode: boolean;
    onToggleSignal: () => void;
    currentDensity: 'compact' | 'comfortable';
    onToggleDensity: () => void;
}

export function Topbar({ matchCount, signalMode, onToggleSignal, currentDensity, onToggleDensity }: TopbarProps) {
    return (
        <div style={{
            height: NEON_THEME.layout.headerHeight,
            backgroundColor: NEON_THEME.colors.bg.header,
            borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${NEON_THEME.spacing.xl}`,
        }}>
            {/* Left: Stat Bar */}
            <div style={{ display: 'flex', gap: NEON_THEME.spacing.xl, alignItems: 'center' }}>
                <div style={statItemStyle}>
                    <span style={labelStyle}>DATE</span>
                    <span style={valueStyle}>{new Date().toLocaleDateString()}</span>
                </div>
                <div style={statItemStyle}>
                    <span style={labelStyle}>MATCHES</span>
                    <span style={valueStyle}>{matchCount}</span>
                </div>
            </div>

            {/* Center: Filters (Placeholder) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {/* Search Mockup */}
                <input
                    type="text"
                    placeholder="🔎 Search Team..."
                    style={{
                        background: NEON_THEME.colors.bg.app,
                        border: `1px solid ${NEON_THEME.colors.border.default}`,
                        borderRadius: NEON_THEME.layout.radius.md,
                        padding: `${NEON_THEME.spacing.sm} ${NEON_THEME.spacing.md}`,
                        color: NEON_THEME.colors.text.primary,
                        width: '300px',
                        fontSize: NEON_THEME.typography.size.sm
                    }}
                />
            </div>

            {/* Right: View Controls */}
            <div style={{ display: 'flex', gap: NEON_THEME.spacing.md, alignItems: 'center' }}>
                <button
                    onClick={onToggleDensity}
                    style={{ ...buttonStyle, opacity: currentDensity === 'compact' ? 1 : 0.7 }}
                >
                    {currentDensity === 'compact' ? 'Compact' : 'Comfortable'}
                </button>

                <div style={{ width: '1px', height: '16px', background: NEON_THEME.colors.border.default }}></div>

                <div
                    onClick={onToggleSignal}
                    style={{
                        ...toggleContainerStyle,
                        borderColor: signalMode ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.border.default,
                        boxShadow: signalMode ? NEON_THEME.effects.glow.cyan : 'none'
                    }}
                >
                    <span style={{
                        ...toggleTextStyle,
                        color: signalMode ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary
                    }}>Signal</span>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: signalMode ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary,
                        boxShadow: signalMode ? `0 0 8px ${NEON_THEME.colors.neon.cyan}` : 'none',
                        transition: 'all 0.3s'
                    }}></div>
                </div>
            </div>
        </div>
    );
}

const statItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    color: NEON_THEME.colors.text.secondary,
    fontWeight: NEON_THEME.typography.weight.bold,
    letterSpacing: '0.05em',
};

const valueStyle: React.CSSProperties = {
    fontSize: NEON_THEME.typography.size.sm,
    color: NEON_THEME.colors.text.primary,
    fontWeight: NEON_THEME.typography.weight.medium,
};

const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: NEON_THEME.colors.text.primary,
    fontSize: NEON_THEME.typography.size.sm,
    cursor: 'pointer',
    padding: '6px 10px',
};

const toggleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '20px',
    border: `1px solid transparent`,
    transition: 'all 0.2s',
    background: NEON_THEME.colors.bg.surface
};

const toggleTextStyle: React.CSSProperties = {
    fontSize: NEON_THEME.typography.size.sm,
    fontWeight: NEON_THEME.typography.weight.medium,
};
