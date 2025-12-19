import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';

interface StatusProps {
    message?: string;
}

export function LoadingStatus({ message = "Loading data..." }: StatusProps) {
    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            <p style={textStyle}>{message}</p>
        </div>
    );
}

export function ErrorStatus({ message = "Error loading data." }: StatusProps) {
    return (
        <div style={containerStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ ...textStyle, color: COLORS.TEXT_PRIMARY }}>{message}</p>
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
    color: COLORS.TEXT_SECONDARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY,
};

const textStyle: React.CSSProperties = {
    fontSize: TYPOGRAPHY.SIZE.SM,
    fontWeight: TYPOGRAPHY.WEIGHT.LIGHT,
    marginTop: '12px',
};

const spinnerStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    border: `3px solid ${COLORS.BORDER}`,
    borderTop: `3px solid ${COLORS.TEXT_PRIMARY}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

// Add keyframes to global CSS or styled component
export const statusStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
