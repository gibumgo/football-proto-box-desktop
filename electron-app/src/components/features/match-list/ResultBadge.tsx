import { NEON_THEME } from '../../../domain/design/designTokens';

interface ResultBadgeProps {
    text: string;
    textColor: string;
    backgroundColor: string;
}

export function ResultBadge({ text, textColor, backgroundColor }: ResultBadgeProps) {
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: NEON_THEME.layout.radius.sm,
            backgroundColor: backgroundColor,
            color: textColor,
            fontSize: '11px',
            fontWeight: NEON_THEME.typography.weight.bold,
            whiteSpace: 'nowrap'
        }}>
            {text}
        </span>
    );
}
