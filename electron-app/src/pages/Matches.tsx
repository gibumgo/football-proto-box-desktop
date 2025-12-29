import { NEON_THEME } from '../domain/design/designTokens';
import { TEXTS } from '../constants/uiTexts';
import { Match } from '../domain/models/match/Match';
import { Button } from '../components/ui/Button';

export interface MatchesProps {
    data: Match[];
    loading: boolean;
    onReload: () => void;
    onTeamSelect: (teamName: string) => void;
    signalMode: boolean;
    density: 'compact' | 'comfortable';
}

const styles = {
    container: {
        height: '100%',
        width: '100%',
        padding: NEON_THEME.spacing.xl,
        backgroundColor: NEON_THEME.colors.bg.app,
        color: NEON_THEME.colors.text.primary,
        overflow: 'auto',
        boxSizing: 'border-box' as const
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: NEON_THEME.spacing.xl,
        paddingBottom: NEON_THEME.spacing.lg,
        borderBottom: `1px solid ${NEON_THEME.colors.border.default}`
    },
    title: {
        margin: 0,
        fontSize: NEON_THEME.typography.size.xxl,
        fontWeight: NEON_THEME.typography.weight.bold,
        color: NEON_THEME.colors.text.primary
    },
    tableContainer: {
        backgroundColor: NEON_THEME.colors.bg.panel,
        borderRadius: NEON_THEME.layout.radius.lg,
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: NEON_THEME.typography.size.sm
    },
    theadRow: {
        backgroundColor: NEON_THEME.colors.bg.header
    },
    th: {
        padding: '12px 16px',
        textAlign: 'center' as const,
        color: NEON_THEME.colors.text.secondary,
        fontWeight: NEON_THEME.typography.weight.medium,
        fontSize: NEON_THEME.typography.size.xs,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        borderBottom: `2px solid ${NEON_THEME.colors.border.default}`
    },
    noDataTd: {
        padding: '40px',
        textAlign: 'center' as const,
        color: NEON_THEME.colors.text.secondary
    },
    td: {
        padding: '12px 16px',
        textAlign: 'center' as const,
        color: NEON_THEME.colors.text.primary
    },
    link: {
        cursor: 'pointer',
        textDecoration: 'underline'
    },
    score: {
        fontFamily: NEON_THEME.typography.fontFamily.mono
    },
    teamName: {
        transition: 'color 0.2s ease'
    },
    resultBadge: (bgColor: string, color: string) => ({
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: NEON_THEME.layout.radius.xs,
        backgroundColor: bgColor,
        color: color,
        fontWeight: NEON_THEME.typography.weight.bold,
        fontSize: NEON_THEME.typography.size.sm,
        boxShadow: `0 0 8px ${color}40`
    }),
    odds: {
        win: { color: NEON_THEME.colors.text.primary },
        draw: { opacity: 0.8 },
        lose: { color: NEON_THEME.colors.text.primary },
        result: { color: NEON_THEME.colors.neon.cyan, fontWeight: NEON_THEME.typography.weight.medium }
    }
};

export function Matches({ data, loading, onReload, onTeamSelect, signalMode }: MatchesProps) {
    console.log('Matches 렌더링 - 데이터:', data.length);


    const getResultColor = (result: string) => {
        switch (result) {
            case 'W': return NEON_THEME.colors.status.success;
            case 'D': return NEON_THEME.colors.status.warning;
            case 'L': return NEON_THEME.colors.status.error;
            default: return NEON_THEME.colors.text.primary;
        }
    };

    const getResultBg = (result: string) => {
        switch (result) {
            case 'W': return `${NEON_THEME.colors.status.success}30`;
            case 'D': return `${NEON_THEME.colors.status.warning}30`;
            case 'L': return `${NEON_THEME.colors.status.error}30`;
            default: return `${NEON_THEME.colors.bg.panel}30`;
        }
    };

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <h2 style={styles.title}>
                    {TEXTS.MATCHES.TITLE}
                </h2>
                <Button
                    onClick={onReload}
                    disabled={loading}
                    variant="primary"
                >
                    {loading ? TEXTS.MATCHES.LOADING : TEXTS.MATCHES.RELOAD}
                </Button>
            </div>


            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.ROUND}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.MATCH_NO}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.DATE}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.LEAGUE}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.HOME}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.SCORE}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.AWAY}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.WIN}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.DRAW}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.LOSE}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.RESULT}</th>
                            <th style={styles.th}>{TEXTS.MATCHES.COLUMNS.ODD}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={12} style={styles.noDataTd}>
                                    {TEXTS.MATCHES.NO_DATA}
                                </td>
                            </tr>
                        ) : (
                            data.map((match, idx) => {
                                const result = match.result.result || '';
                                const resultColor = getResultColor(result);
                                const resultBg = getResultBg(result);

                                return (
                                    <tr key={idx} style={{
                                        borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                                        backgroundColor: signalMode && idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                    }}>
                                        <td style={{ ...styles.td, color: NEON_THEME.colors.neon.cyan, fontWeight: NEON_THEME.typography.weight.bold }}>
                                            {match.info.round}
                                        </td>
                                        <td style={styles.td}>{match.info.matchNo}</td>
                                        <td style={{ ...styles.td, fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary }}>
                                            {match.info.formattedDate}
                                        </td>
                                        <td style={{ ...styles.td, fontSize: NEON_THEME.typography.size.xs }}>{match.info.league}</td>
                                        <td
                                            style={{ ...styles.td, ...styles.link }}
                                            onClick={() => {
                                                console.log(`Click Home: ${match.info.home}`);
                                                onTeamSelect(match.info.home);
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = NEON_THEME.colors.neon.cyan}
                                            onMouseLeave={(e) => e.currentTarget.style.color = NEON_THEME.colors.text.primary}
                                        >
                                            {match.info.home}
                                        </td>
                                        <td style={{ ...styles.td, ...styles.score }}>{match.result.formattedScore}</td>
                                        <td
                                            style={{ ...styles.td, ...styles.link }}
                                            onClick={() => {
                                                console.log(`Click Away: ${match.info.away}`);
                                                onTeamSelect(match.info.away);
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = NEON_THEME.colors.neon.cyan}
                                            onMouseLeave={(e) => e.currentTarget.style.color = NEON_THEME.colors.text.primary}
                                        >
                                            {match.info.away}
                                        </td>
                                        <td style={styles.td}>{match.odds.winOdd?.toFixed(2)}</td>
                                        <td style={{ ...styles.td, ...styles.odds.draw }}>{match.odds.drawOdd?.toFixed(2)}</td>
                                        <td style={styles.td}>{match.odds.loseOdd?.toFixed(2)}</td>
                                        <td style={styles.td}>
                                            <span style={styles.resultBadge(resultBg, resultColor)}>
                                                {result}
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.odds.result }}>
                                            {match.result.resultOdd?.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
