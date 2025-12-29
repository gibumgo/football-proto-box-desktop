import { useMemo } from 'react';
import type { Match } from '@/domain/models/match/Match';
import { MATCH_RESULT } from '@/constants/domain';

export function useMatchStats(data: Match[]) {
    // Summary Statistics
    const summary = useMemo(() => {
        const total = data.length;
        if (total === 0) return { total: 0, win: '0.0', draw: '0.0', lose: '0.0' };

        const win = data.filter(m => m.result.result === MATCH_RESULT.WIN).length;
        const draw = data.filter(m => m.result.result === MATCH_RESULT.DRAW).length;
        const lose = data.filter(m => m.result.result === MATCH_RESULT.LOSE).length;

        return {
            total,
            win: ((win / total) * 100).toFixed(1),
            draw: ((draw / total) * 100).toFixed(1),
            lose: ((lose / total) * 100).toFixed(1),
        };
    }, [data]);

    // League Distribution Data
    const leagueData = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(m => {
            counts[m.info.league] = (counts[m.info.league] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 leagues
    }, [data]);

    // Result Distribution Data
    const resultData = useMemo(() => {
        const counts = { [MATCH_RESULT.WIN]: 0, [MATCH_RESULT.DRAW]: 0, [MATCH_RESULT.LOSE]: 0 };
        data.forEach(m => {
            if (m.result.result === MATCH_RESULT.WIN) counts[MATCH_RESULT.WIN]++;
            else if (m.result.result === MATCH_RESULT.DRAW) counts[MATCH_RESULT.DRAW]++;
            else if (m.result.result === MATCH_RESULT.LOSE) counts[MATCH_RESULT.LOSE]++;
        });
        return [
            { name: MATCH_RESULT.WIN, value: counts[MATCH_RESULT.WIN] },
            { name: MATCH_RESULT.DRAW, value: counts[MATCH_RESULT.DRAW] },
            { name: MATCH_RESULT.LOSE, value: counts[MATCH_RESULT.LOSE] },
        ];
    }, [data]);

    return {
        summary,
        leagueData,
        resultData
    };
}
