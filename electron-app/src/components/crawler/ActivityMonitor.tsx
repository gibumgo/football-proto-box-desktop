import { NEON_THEME } from '../../domain/design/designTokens';

interface ActivityMonitorProps {
    isActive?: boolean;
}

export const ActivityMonitor = ({ isActive = false }: ActivityMonitorProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: NEON_THEME.layout.radius.lg,
            overflow: 'hidden',
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            backgroundColor: NEON_THEME.colors.bg.panel,
            height: '100%'
        }}>
            <div style={{
                padding: NEON_THEME.spacing.sm,
                backgroundColor: NEON_THEME.colors.bg.header,
                borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{
                    fontSize: '11px',
                    fontWeight: NEON_THEME.typography.weight.bold,
                    color: NEON_THEME.colors.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Activity Monitor
                </span>
                <span style={{ fontSize: '10px', color: isActive ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.muted }}>
                    {isActive ? 'LIVE' : 'IDLE'}
                </span>
            </div>

            <div style={{
                flex: 1,
                padding: NEON_THEME.spacing.md,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '8px'
            }}>
                {/* Mock Graph Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '4px' }}>
                    {[30, 45, 60, 40, 75, 50, 80, 95, 70, 60, 85, 90, 65, 55, 70, 80, 100, 90, 75, 60].map((h, i) => (
                        <div key={i} style={{
                            flex: 1,
                            height: `${h}%`,
                            backgroundColor: isActive ? `rgba(0, 243, 255, ${i > 15 ? 0.8 : 0.2})` : 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '2px 2px 0 0',
                            transition: 'height 0.3s ease'
                        }} />
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: NEON_THEME.colors.text.muted }}>
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>Now</span>
                </div>
            </div>
        </div>
    );
};
