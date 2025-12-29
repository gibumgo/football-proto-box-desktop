import { NEON_THEME } from '../../../domain/design/designTokens';

interface OddCellProps {
    value: string;
    isHighlighted: boolean;
    style?: React.CSSProperties;
}

export function OddCell({ value, isHighlighted, style }: OddCellProps) {
    const highlightStyle: React.CSSProperties = isHighlighted ? {
        backgroundColor: 'rgba(74, 222, 128, 0.15)', // Green bg
        color: NEON_THEME.colors.neon.green,
        fontWeight: NEON_THEME.typography.weight.bold,
        borderRadius: NEON_THEME.layout.radius.sm
    } : {};

    return (
        <td style={{ ...style, ...highlightStyle }}>
            {value}
        </td>
    );
}
