import { TYPOGRAPHY } from '../../../domain/design/theme';

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
            borderRadius: '4px',
            backgroundColor: backgroundColor,
            color: textColor,
            fontSize: '11px',
            fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
            whiteSpace: 'nowrap'
        }}>
            {text}
        </span>
    );
}
