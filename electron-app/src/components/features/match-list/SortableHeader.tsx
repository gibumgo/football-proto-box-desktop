import { NEON_THEME } from '../../../domain/design/designTokens';
import { TEXTS } from '../../../constants/uiTexts';

interface SortableHeaderProps {
    onSort: (key: string) => void;
}

const styles = {
    th: {
        padding: '12px 16px',
        textAlign: 'center' as const,
        color: NEON_THEME.colors.text.secondary,
        fontWeight: NEON_THEME.typography.weight.medium,
        fontSize: NEON_THEME.typography.size.xs,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        borderBottom: `2px solid ${NEON_THEME.colors.border.default}`,
        cursor: 'pointer',
        userSelect: 'none' as const,
        transition: 'color 0.2s'
    }
};

export const SortableHeader = ({ onSort }: SortableHeaderProps) => {
    return (
        <thead>
            <tr style={{ backgroundColor: NEON_THEME.colors.bg.header }}>
                <th style={styles.th} onClick={() => onSort('round')}>{TEXTS.MATCHES.HEADERS.ROUND}</th>
                <th style={styles.th} onClick={() => onSort('match_no')}>{TEXTS.MATCHES.HEADERS.MATCH_NO}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.DATE}</th>
                <th style={styles.th} onClick={() => onSort('league')}>{TEXTS.MATCHES.HEADERS.LEAGUE}</th>
                <th style={styles.th} onClick={() => onSort('home_team')}>{TEXTS.MATCHES.HEADERS.HOME}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.SCORE}</th>
                <th style={styles.th} onClick={() => onSort('away_team')}>{TEXTS.MATCHES.HEADERS.AWAY}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.WIN_ODD}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.DRAW_ODD}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.LOSE_ODD}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.RESULT}</th>
                <th style={styles.th}>{TEXTS.MATCHES.HEADERS.RESULT_ODD}</th>
            </tr>
        </thead>
    );
};
