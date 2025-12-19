import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';

export class RateCalculator {
    /**
     * 오버 2.5골 발생률 계산
     */
    static over25(matches: Match[]): number {
        let over25Count = 0;
        let validMatches = 0;

        matches.forEach(match => {
            if (!match.result.score) return;

            const totalGoals = match.result.score.home + match.result.score.away;
            if (totalGoals >= 3) over25Count++;
            validMatches++;
        });

        return validMatches > 0 ? (over25Count / validMatches) * 100 : 0;
    }

    /**
     * 클린시트율 계산
     */
    static cleanSheet(matches: Match[], teamName: string): number {
        let cleanSheetCount = 0;
        let validMatches = 0;

        const targetName = TeamNameNormalizer.normalize(teamName);

        matches.forEach(match => {
            if (!match.result.score) return;

            const isHome = TeamNameNormalizer.normalize(match.info.home) === targetName;
            const conceded = isHome ? match.result.score.away : match.result.score.home;

            if (conceded === 0) cleanSheetCount++;
            validMatches++;
        });

        return validMatches > 0 ? (cleanSheetCount / validMatches) * 100 : 0;
    }
}
