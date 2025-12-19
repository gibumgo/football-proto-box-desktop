import { COLORS, TYPOGRAPHY } from '../domain/design/theme';
import { MATCH_COLUMNS, TEXTS } from '../constants';
import { Match } from '../domain/models/match/Match';

export interface MatchesProps {
    data: Match[];
    loading: boolean;
    onReload: () => void;
    onTeamSelect: (teamName: string) => void;
    signalMode: boolean;
    density: 'compact' | 'comfortable';
}

export function Matches({ data, loading, onReload, onTeamSelect, signalMode }: MatchesProps) {
    console.log('Matches 렌더링 - 데이터:', data.length);

    return (
        <div style={{
            height: '100%',
            width: '100%',
            padding: '20px',
            backgroundColor: COLORS.SURFACE,
            color: COLORS.TEXT_PRIMARY,
            overflow: 'auto',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${COLORS.BORDER}`
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: TYPOGRAPHY.SIZE.XXL,
                    fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                    color: COLORS.TEXT_PRIMARY
                }}>
                    {TEXTS.MATCHES_TITLE}
                </h2>
                <button
                    onClick={onReload}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: COLORS.NEON_BLUE,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                        fontSize: TYPOGRAPHY.SIZE.MD,
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? TEXTS.LOADING : TEXTS.RELOAD_DATA}
                </button>
            </div>

            {/* Simple Table */}
            <div style={{
                backgroundColor: COLORS.HEADER,
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: TYPOGRAPHY.SIZE.SM
                }}>
                    <thead>
                        <tr style={{ backgroundColor: COLORS.HEADER }}>
                            <th style={headerStyle}>{MATCH_COLUMNS.ROUND}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.MATCH_NO}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.DATE_TIME}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.LEAGUE}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.HOME}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.SCORE}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.AWAY}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.WIN_ODD}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.DRAW_ODD}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.LOSE_ODD}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.RESULT}</th>
                            <th style={headerStyle}>{MATCH_COLUMNS.RESULT_ODD}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={12} style={{
                                    padding: '40px',
                                    textAlign: 'center',
                                    color: COLORS.TEXT_SECONDARY
                                }}>
                                    경기 데이터가 없습니다
                                </td>
                            </tr>
                        ) : (
                            data.map((match, idx) => {
                                const result = match.result.result;
                                let resultColor = COLORS.TEXT_SECONDARY;
                                let resultBg = 'transparent';

                                if (result === '승' || result === 'WIN') {
                                    resultColor = COLORS.NEON_GREEN;
                                    resultBg = 'rgba(74, 222, 128, 0.15)';
                                } else if (result === '무' || result === 'DRAW') {
                                    resultColor = COLORS.NEON_YELLOW;
                                    resultBg = 'rgba(251, 191, 36, 0.15)';
                                } else if (result === '패' || result === 'LOSE') {
                                    resultColor = COLORS.NEON_RED;
                                    resultBg = 'rgba(248, 113, 113, 0.15)';
                                }

                                return (
                                    <tr key={idx} style={{
                                        borderBottom: `1px solid ${COLORS.BORDER}`,
                                        backgroundColor: signalMode && idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                    }}>
                                        <td style={{ ...cellStyle, color: COLORS.NEON_BLUE, fontWeight: TYPOGRAPHY.WEIGHT.BOLD }}>
                                            {match.info.round}
                                        </td>
                                        <td style={cellStyle}>{match.info.matchNo}</td>
                                        <td style={{ ...cellStyle, fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY }}>
                                            {match.info.formattedDate}
                                        </td>
                                        <td style={{ ...cellStyle, fontSize: TYPOGRAPHY.SIZE.XS }}>{match.info.league}</td>
                                        <td
                                            style={{ ...cellStyle, cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => {
                                                // alert(`Click Home: ${match.info.home}`);
                                                console.log(`Click Home: ${match.info.home}`);
                                                onTeamSelect(match.info.home);
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.NEON_BLUE}
                                            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_PRIMARY}
                                        >
                                            {match.info.home}
                                        </td>
                                        <td style={{ ...cellStyle, fontFamily: 'monospace' }}>{match.result.formattedScore}</td>
                                        <td
                                            style={{ ...cellStyle, cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => {
                                                // alert(`Click Away: ${match.info.away}`);
                                                console.log(`Click Away: ${match.info.away}`);
                                                onTeamSelect(match.info.away);
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.NEON_BLUE}
                                            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_PRIMARY}
                                        >
                                            {match.info.away}
                                        </td>
                                        <td style={cellStyle}>{match.odds.winOdd?.toFixed(2)}</td>
                                        <td style={{ ...cellStyle, opacity: 0.8 }}>{match.odds.drawOdd?.toFixed(2)}</td>
                                        <td style={cellStyle}>{match.odds.loseOdd?.toFixed(2)}</td>
                                        <td style={cellStyle}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                backgroundColor: resultBg,
                                                color: resultColor,
                                                fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                                                fontSize: TYPOGRAPHY.SIZE.SM,
                                                boxShadow: `0 0 8px ${resultColor}40`
                                            }}>
                                                {result}
                                            </span>
                                        </td>
                                        <td style={{ ...cellStyle, color: COLORS.NEON_CYAN, fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD }}>
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

const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
    fontSize: TYPOGRAPHY.SIZE.XS,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `2px solid ${COLORS.BORDER}`
};

const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY
};
