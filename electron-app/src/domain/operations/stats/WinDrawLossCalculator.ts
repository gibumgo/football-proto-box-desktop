import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';
import { TeamMatchResult } from '../result/TeamMatchResult';

export class WinDrawLossCalculator {
    /**
     * 승무패 통계 계산
     */
    static calculate(matches: Match[], teamName: string) {
        let wins = 0;
        let draws = 0;
        let losses = 0;

        const targetName = TeamNameNormalizer.normalize(teamName);

        matches.forEach(match => {
            const result = TeamMatchResult.getResult(match, targetName);
            if (result === 'W') wins++;
            else if (result === 'D') draws++;
            else if (result === 'L') losses++;
        });

        const winRate = matches.length > 0 ? (wins / matches.length) * 100 : 0;

        return { wins, draws, losses, winRate };
    }
}
