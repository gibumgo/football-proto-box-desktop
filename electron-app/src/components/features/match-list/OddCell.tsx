import { COLORS, TYPOGRAPHY } from '../../../domain/design/theme';

interface OddCellProps {
    value: string;
    isHighlighted: boolean;
    style?: React.CSSProperties;
}

export function OddCell({ value, isHighlighted, style }: OddCellProps) {
    const highlightStyle: React.CSSProperties = isHighlighted ? {
        backgroundColor: 'rgba(74, 222, 128, 0.15)', // Green bg
        color: COLORS.NEON_GREEN,
        fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
        borderRadius: '4px'
    } : {};

    return (
        <td style={{ ...style, ...highlightStyle }}>
            {value}
        </td>
    );
}
