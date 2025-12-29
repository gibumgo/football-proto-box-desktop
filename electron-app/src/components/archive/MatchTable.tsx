import React from 'react';
import type { Match, BettingOdds } from '../../types/archive';
import { NEON_THEME } from '@/domain/design/designTokens';

interface MatchTableProps {
    matches: Match[];
}

export function MatchTable({ matches }: MatchTableProps) {
    const formatOdds = (odds: BettingOdds | null) => {
        if (!odds) return { win: '-', draw: '-', lose: '-' };
        return {
            win: odds.win?.toFixed(2) || '-',
            draw: odds.draw?.toFixed(2) || '-',
            lose: odds.lose?.toFixed(2) || '-'
        };
    };

    const calculateDiff = (domestic: number | null, overseas: number | null) => {
        if (domestic === null || overseas === null) return 0;
        return domestic - overseas;
    };

    const getDiffColor = (diff: number) => {
        // "절삭치는 붉은 계열 기준을 바꿔줘. 절댓감 0.1 보다 작아야 붉은 계열 색이 들어가는 거야"
        // Interpretation: If absolute difference is negligible (< 0.1), mark as Red (Warning/Bad).
        // If positive and significant, Green.
        if (Math.abs(diff) < 0.1) return NEON_THEME.colors.neon.red;
        if (diff > 0) return NEON_THEME.colors.neon.green;
        return NEON_THEME.colors.text.muted;
    };

    const formatDiff = (diff: number) => {
        if (Math.abs(diff) < 0.01) return '-';
        return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
    };

    const getResultColor = (result: string | null) => {
        switch (result) {
            case 'WIN': return NEON_THEME.colors.neon.green; // Home Win -> Green
            case 'DRAW': return NEON_THEME.colors.neon.yellow;
            case 'LOSE': return NEON_THEME.colors.neon.red;
            case 'UNDER': return '#60A5FA'; // Blue-400
            case 'OVER': return '#F87171'; // Red-400
            case 'ODD': return '#C084FC'; // Purple-400
            case 'EVEN': return '#9CA3AF'; // Gray-400
            default: return 'inherit';
        }
    };

    const formatResult = (result: string | null) => {
        switch (result) {
            case 'WIN': return '승';
            case 'DRAW': return '무';
            case 'LOSE': return '패';
            case 'UNDER': return 'U';
            case 'OVER': return 'O';
            case 'ODD': return '홀';
            case 'EVEN': return '짝';
            default: return result || '-';
        }
    };

    const getTypeStyle = (type: string) => {
        switch (type) {
            case 'MATCH':
            case 'GENERAL':
                return { bg: 'rgba(34, 211, 238, 0.1)', color: NEON_THEME.colors.neon.cyan }; // Normal
            case 'HANDICAP':
                return { bg: 'rgba(232, 121, 249, 0.15)', color: '#E879F9' }; // Magenta (Eye-catching)
            case 'UNDER_OVER':
                return { bg: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF' }; // Muted Gray
            case 'SUM':
                return { bg: 'rgba(75, 85, 99, 0.1)', color: '#4B5563' }; // Very Dim
            default:
                return { bg: 'rgba(34, 211, 238, 0.1)', color: NEON_THEME.colors.neon.cyan };
        }
    };

    const formatMatchType = (match: Match) => {
        const type = match.type;
        switch (type) {
            case 'MATCH':
            case 'GENERAL':
                return '일반';
            case 'HANDICAP':
                const hn = match.handicapNumber;
                if (hn !== undefined && hn !== null) {
                    const sign = hn > 0 ? '+' : '';
                    return `핸디캡 (${sign}${hn})`;
                }
                return '핸디캡';
            case 'UNDER_OVER': return '언오버';
            case 'SUM': return 'SUM';
            default: return type;
        }
    };

    const formatDateTime = (dateTime: string | number[] | null | undefined) => {
        if (!dateTime) return '-';

        let date: Date;

        if (Array.isArray(dateTime)) {
            const [year, month, day, hour, minute] = dateTime;
            date = new Date(year, month - 1, day, hour, minute);
        } else {
            date = new Date(dateTime.toString());
        }

        if (isNaN(date.getTime())) return dateTime.toString();

        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = days[date.getDay()];

        const pad = (n: number) => (n || 0).toString().padStart(2, '0');

        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const HH = pad(date.getHours());
        const MM = pad(date.getMinutes());

        return `${mm}/${dd} (${dayOfWeek}) ${HH}:${MM}`;
    };

    return (
        <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '2px'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                fontSize: '13px',
                textAlign: 'center'
            }}>
                <thead style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#1E1E1E',
                    zIndex: 10,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    <tr>
                        <th style={styles.th}>NO</th>
                        <th style={styles.th}>시간</th>
                        <th style={styles.th}>리그</th>
                        <th style={styles.th}>홈</th>
                        <th style={styles.th}>원정</th>
                        <th style={styles.th}>타입</th>
                        <th style={styles.th}>승 (홈)</th>
                        <th style={styles.th}>무</th>
                        <th style={styles.th}>패 (원정)</th>
                        <th style={styles.th} colSpan={3}>절삭치</th>
                        <th style={styles.th}>스코어</th>
                        <th style={styles.th}>결과</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, idx) => {
                        const dOdds = formatOdds(match.domesticOdds);
                        const winDiff = calculateDiff(match.domesticOdds?.win, match.overseasOdds?.win);
                        const drawDiff = calculateDiff(match.domesticOdds?.draw, match.overseasOdds?.draw);
                        const loseDiff = calculateDiff(match.domesticOdds?.lose, match.overseasOdds?.lose);

                        const isGeneral = match.type === 'MATCH' || match.type === 'GENERAL';

                        return (
                            <tr key={`${match.matchNo}-${idx}`} style={{
                                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                                transition: 'background-color 0.2s'
                            }}>
                                <td style={styles.td}>{match.matchNo}</td>
                                <td style={styles.td}>{formatDateTime(match.dateTime)}</td>
                                <td style={styles.td}>{match.league}</td>
                                <td style={{ ...styles.td, fontWeight: 600, color: match.result === 'WIN' ? NEON_THEME.colors.neon.green : 'inherit' }}>
                                    {match.home}
                                </td>
                                <td style={{ ...styles.td, fontWeight: 600, color: match.result === 'LOSE' ? NEON_THEME.colors.neon.green : 'inherit' }}>
                                    {match.away}
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: getTypeStyle(match.type).bg,
                                        color: getTypeStyle(match.type).color
                                    }}>
                                        {formatMatchType(match)}
                                    </span>
                                </td>

                                {/* 배당 분리 컬럼 */}
                                <td style={styles.td}>
                                    <span style={{
                                        color: (match.result === 'WIN' ||
                                            (match.type === 'UNDER_OVER' && match.result === 'UNDER') ||
                                            (match.type === 'SUM' && match.result === 'ODD'))
                                            ? NEON_THEME.colors.neon.cyan : 'inherit',
                                        fontWeight: (match.result === 'WIN' ||
                                            (match.type === 'UNDER_OVER' && match.result === 'UNDER') ||
                                            (match.type === 'SUM' && match.result === 'ODD'))
                                            ? 700 : 400
                                    }}>
                                        {dOdds.win}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{ color: match.result === 'DRAW' ? NEON_THEME.colors.neon.cyan : 'inherit', fontWeight: match.result === 'DRAW' ? 700 : 400 }}>
                                        {dOdds.draw}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        color: (match.result === 'LOSE' ||
                                            (match.type === 'UNDER_OVER' && match.result === 'OVER') ||
                                            (match.type === 'SUM' && match.result === 'EVEN'))
                                            ? NEON_THEME.colors.neon.cyan : 'inherit',
                                        fontWeight: (match.result === 'LOSE' ||
                                            (match.type === 'UNDER_OVER' && match.result === 'OVER') ||
                                            (match.type === 'SUM' && match.result === 'EVEN'))
                                            ? 700 : 400
                                    }}>
                                        {dOdds.lose}
                                    </span>
                                </td>

                                <td style={styles.td}>
                                    <span style={{ color: getDiffColor(winDiff), fontSize: '11px' }}>
                                        {isGeneral ? formatDiff(winDiff) : '-'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{ color: getDiffColor(drawDiff), fontSize: '11px' }}>
                                        {isGeneral ? formatDiff(drawDiff) : '-'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{ color: getDiffColor(loseDiff), fontSize: '11px' }}>
                                        {isGeneral ? formatDiff(loseDiff) : '-'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    {match.score ? (
                                        (match.type === 'UNDER_OVER' || match.type === 'SUM')
                                            ? (match.score.home + match.score.away)
                                            : `${match.score.home}:${match.score.away}`
                                    ) : '-'}
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        fontWeight: 800,
                                        color: getResultColor(match.result),
                                    }}>
                                        {formatResult(match.result)}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    th: {
        padding: '12px 8px',
        color: NEON_THEME.colors.text.secondary,
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        borderBottom: `1px solid ${NEON_THEME.colors.border.default}`
    } as React.CSSProperties,
    td: {
        padding: '12px 8px',
        borderBottom: `1px solid rgba(255,255,255,0.02)`,
        color: NEON_THEME.colors.text.primary,
        whiteSpace: 'nowrap'
    } as React.CSSProperties
};
