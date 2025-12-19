import { Match } from '../../models/match/Match';

export class MatchResultValidator {
    /**
     * 유효한 경기 결과가 있는지 확인
     */
    static hasResult(match: Match): boolean {
        const result = match.result.result;
        if (!result) return false;
        const validResults = ['승', '무', '패', 'WIN', 'DRAW', 'LOSE', 'W', 'D', 'L'];
        return validResults.includes(result);
    }

    /**
     * 결과가 있는 경기만 필터링
     */
    static onlyFinished(matches: Match[]): Match[] {
        return matches.filter(m => this.hasResult(m));
    }
}
