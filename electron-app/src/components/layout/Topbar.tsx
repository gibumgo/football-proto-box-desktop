import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';
import { LAYOUT } from '../../domain/design/layout';

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
            height: LAYOUT.TOPBAR_HEIGHT,
            backgroundColor: COLORS.HEADER,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
        }}>
            {/* Left: Stat Bar */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
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
                        background: COLORS.APP_BG,
                        border: `1px solid ${COLORS.BORDER}`,
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: COLORS.TEXT_PRIMARY,
                        width: '300px',
                        fontSize: TYPOGRAPHY.SIZE.SM
                    }}
                />
            </div>

            {/* Right: View Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                    onClick={onToggleDensity}
                    style={{ ...buttonStyle, opacity: currentDensity === 'compact' ? 1 : 0.7 }}
                >
                    {currentDensity === 'compact' ? 'Compact' : 'Comfortable'}
                </button>

                <div style={{ width: '1px', height: '16px', background: COLORS.BORDER }}></div>

                <div
                    onClick={onToggleSignal}
                    style={{
                        ...toggleContainerStyle,
                        borderColor: signalMode ? COLORS.NEON_BLUE : COLORS.BORDER,
                        boxShadow: signalMode ? '0 0 10px rgba(79, 195, 247, 0.5), 0 0 20px rgba(79, 195, 247, 0.3)' : 'none'
                    }}
                >
                    <span style={{
                        ...toggleTextStyle,
                        color: signalMode ? COLORS.NEON_BLUE : COLORS.TEXT_SECONDARY
                    }}>Signal</span>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: signalMode ? COLORS.NEON_BLUE : COLORS.TEXT_SECONDARY,
                        boxShadow: signalMode ? '0 0 8px rgba(79, 195, 247, 0.8)' : 'none',
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
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
    letterSpacing: '0.05em',
};

const valueStyle: React.CSSProperties = {
    fontSize: TYPOGRAPHY.SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
};

const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.SIZE.SM,
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
    background: COLORS.SURFACE
};

const toggleTextStyle: React.CSSProperties = {
    fontSize: TYPOGRAPHY.SIZE.SM,
    fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
};
