import { Match } from '../../models/match/Match';
import { ResultOddsResolver } from '../result/ResultOddsResolver';

export class MatchSorter {
    /**
     * 경기 정렬
     */
    static sort(
        matches: Match[],
        sortBy: 'date' | 'odds' | 'round',
        order: 'asc' | 'desc',
        teamName?: string
    ): Match[] {
        const sorted = [...matches];

        if (sortBy === 'date') {
            sorted.sort((a, b) => {
                const dateA = this.getDateValue(a.info.dateTime);
                const dateB = this.getDateValue(b.info.dateTime);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortBy === 'odds' && teamName) {
            sorted.sort((a, b) => {
                const oddsA = ResultOddsResolver.getResultOdds(a, teamName);
                const oddsB = ResultOddsResolver.getResultOdds(b, teamName);
                return order === 'asc' ? oddsA - oddsB : oddsB - oddsA;
            });
        } else if (sortBy === 'round') {
            sorted.sort((a, b) => {
                const roundA = this.getRoundNum(a);
                const roundB = this.getRoundNum(b);
                return order === 'asc' ? roundA - roundB : roundB - roundA;
            });
        }

        return sorted;
    }

    private static getDateValue(dateTime: string | number[]): number {
        if (Array.isArray(dateTime)) {
            const [y, m, d, h, min] = dateTime;
            return new Date(y, m - 1, d, h, min).getTime();
        }
        return new Date(dateTime).getTime();
    }

    private static getRoundNum(m: Match): number {
        const r = m.info.round?.toString().replace(/[^0-9]/g, '') || '0';
        return parseInt(r, 10);
    }
}
