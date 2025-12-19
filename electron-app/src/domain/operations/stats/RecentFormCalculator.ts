import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';
import { TeamMatchResult } from '../result/TeamMatchResult';

export class RecentFormCalculator {
    /**
     * 최근 경기 스트릭 계산
     */
    static calculate(matches: Match[], teamName: string): ('W' | 'D' | 'L')[] {
        const targetName = TeamNameNormalizer.normalize(teamName);
        return matches.map(match => TeamMatchResult.getResult(match, targetName));
    }
}
