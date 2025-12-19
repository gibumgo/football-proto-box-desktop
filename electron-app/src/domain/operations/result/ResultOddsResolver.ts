import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';
import { TeamMatchResult } from './TeamMatchResult';

export class ResultOddsResolver {
    /**
     * 결과 배당 추출 (정렬용)
     */
    static getResultOdds(match: Match, teamName: string): number {
        const targetName = TeamNameNormalizer.normalize(teamName);
        const result = TeamMatchResult.getResult(match, targetName);
        const isHome = TeamNameNormalizer.normalize(match.info.home) === targetName;

        if (result === 'W') {
            return isHome ? (match.odds.winOdd || 0) : (match.odds.loseOdd || 0);
        } else if (result === 'D') {
            return match.odds.drawOdd || 0;
        } else {
            return isHome ? (match.odds.loseOdd || 0) : (match.odds.winOdd || 0);
        }
    }
}
