import { NEON_THEME } from '../../domain/design/designTokens';

interface StatusProps {
    message?: string;
}

export function StatusUI({ status }: { status: 'idle' | 'running' | 'error' }) {
    let color: string = NEON_THEME.colors.text.muted;
    let label = '대기중';

    if (status === 'running') {
        color = NEON_THEME.colors.neon.green;
        label = '실행중';
    } else if (status === 'error') {
        color = NEON_THEME.colors.neon.red;
        label = '오류';
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: NEON_THEME.spacing.sm,
            fontSize: NEON_THEME.typography.size.sm,
            color: color,
            fontWeight: NEON_THEME.typography.weight.bold
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`
            }} />
            {label}
        </div>
    );
}

export function NoDataStatus({ message = "No matches found." }: StatusProps) {
    return (
        <div style={containerStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
            <p style={textStyle}>{message}</p>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    color: NEON_THEME.colors.text.secondary,
    fontFamily: NEON_THEME.typography.fontFamily.sans,
};

const textStyle: React.CSSProperties = {
    fontSize: NEON_THEME.typography.size.sm,
    fontWeight: NEON_THEME.typography.weight.regular,
    marginTop: '12px',
};




export const statusStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
