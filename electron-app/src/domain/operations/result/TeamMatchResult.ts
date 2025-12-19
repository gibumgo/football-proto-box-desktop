import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';

export class TeamMatchResult {
    /**
     * 해당 팀의 경기 결과 반환 (W/D/L)
     */
    static getResult(match: Match, teamName: string): 'W' | 'D' | 'L' {
        const result = match.result.result;
        if (!result) return 'L'; // 결과 없으면 기본 패배 처리 (안전장치)

        const targetName = TeamNameNormalizer.normalize(teamName);
        const isHome = TeamNameNormalizer.normalize(match.info.home) === targetName;

        if (result === '승' || result === 'WIN') {
            return isHome ? 'W' : 'L';
        } else if (result === '무' || result === 'DRAW') {
            return 'D';
        } else {
            return isHome ? 'L' : 'W';
        }
    }
}
