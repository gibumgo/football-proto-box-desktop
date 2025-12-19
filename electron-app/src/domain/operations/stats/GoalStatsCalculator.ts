import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';

export class GoalStatsCalculator {
    /**
     * 평균 득점/실점 계산
     */
    static calculate(matches: Match[], teamName: string) {
        let totalScored = 0;
        let totalConceded = 0;
        let validMatches = 0;

        const targetName = TeamNameNormalizer.normalize(teamName);

        matches.forEach(match => {
            if (!match.result.score) return;

            const isHome = TeamNameNormalizer.normalize(match.info.home) === targetName;
            const scored = isHome ? match.result.score.home : match.result.score.away;
            const conceded = isHome ? match.result.score.away : match.result.score.home;

            totalScored += scored;
            totalConceded += conceded;
            validMatches++;
        });

        return {
            avgGoalsScored: validMatches > 0 ? totalScored / validMatches : 0,
            avgGoalsConceded: validMatches > 0 ? totalConceded / validMatches : 0
        };
    }
}
