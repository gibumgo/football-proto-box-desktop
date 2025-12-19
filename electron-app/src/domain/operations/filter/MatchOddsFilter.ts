import { Match } from '../../models/match/Match';

export class MatchOddsFilter {
    /**
     * 배당 필터링
     */
    static byOdds(matches: Match[], selectedOdds: number[]): Match[] {
        if (!selectedOdds || selectedOdds.length === 0) return matches;

        const oddsSet = new Set(selectedOdds);

        return matches.filter(match => {
            const { winOdd, drawOdd, loseOdd } = match.odds;
            return (winOdd != null && oddsSet.has(winOdd)) ||
                (drawOdd != null && oddsSet.has(drawOdd)) ||
                (loseOdd != null && oddsSet.has(loseOdd));
        });
    }

    /**
     * 경기에서 등장한 모든 배당 값 추출 (중복 제거, 정렬)
     */
    static extractUniqueOdds(matches: Match[]): number[] {
        const oddsSet = new Set<number>();

        matches.forEach(match => {
            if (match.odds.winOdd != null) oddsSet.add(match.odds.winOdd);
            if (match.odds.drawOdd != null) oddsSet.add(match.odds.drawOdd);
            if (match.odds.loseOdd != null) oddsSet.add(match.odds.loseOdd);
        });

        return Array.from(oddsSet).sort((a, b) => a - b);
    }
}
