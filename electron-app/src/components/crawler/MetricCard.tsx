import { NEON_THEME } from '@/domain/design/designTokens';

interface MetricCardProps {
    title: string;
    value: string;
    unit: string;
    accent: 'cyan' | 'green' | 'red' | 'yellow';
}

export function MetricCard({ title, value, unit, accent }: MetricCardProps) {
    const accentColor = getAccentColor(accent);

    return (
        <div style={styles.card}>
            <div style={styles.title}>{title}</div>
            <div style={styles.valueContainer}>
                <span style={{ ...styles.value, color: accentColor }}>{value}</span>
                <span style={styles.unit}>{unit}</span>
            </div>


            <div style={{
                ...styles.corner,
                borderTopColor: accentColor,
                borderRightColor: accentColor
            }} />
        </div>
    );
}


function getAccentColor(accent: MetricCardProps['accent']): string {
    switch (accent) {
        case 'cyan': return NEON_THEME.colors.neon.cyan;
        case 'green': return NEON_THEME.colors.neon.green;
        case 'red': return NEON_THEME.colors.neon.red;
        case 'yellow': return NEON_THEME.colors.neon.yellow;
        default: return NEON_THEME.colors.text.primary;
    }
}

const styles = {
    card: {
        backgroundColor: NEON_THEME.colors.bg.surface,
        border: `1px solid ${NEON_THEME.colors.border.default}`,
        borderRadius: NEON_THEME.layout.radius.sm,
        padding: NEON_THEME.spacing.md,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
    } as React.CSSProperties,
    title: {
        fontSize: '11px',
        color: NEON_THEME.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '1px'
    } as React.CSSProperties,
    valueContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px'
    } as React.CSSProperties,
    value: {
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: NEON_THEME.typography.fontFamily.mono
    } as React.CSSProperties,
    unit: {
        fontSize: '11px',
        color: NEON_THEME.colors.text.muted
    } as React.CSSProperties,
    corner: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '8px',
        height: '8px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        opacity: 0.5
    } as React.CSSProperties
};
