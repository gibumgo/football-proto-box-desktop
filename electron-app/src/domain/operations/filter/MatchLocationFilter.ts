import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';

export class MatchLocationFilter {
    /**
     * 홈/원정 필터링
     */
    static byLocation(
        matches: Match[],
        teamName: string,
        location: 'all' | 'home' | 'away'
    ): Match[] {
        if (location === 'all') return matches;

        const targetName = TeamNameNormalizer.normalize(teamName);

        if (location === 'home') {
            return matches.filter(match =>
                TeamNameNormalizer.normalize(match.info.home) === targetName
            );
        }
        return matches.filter(match =>
            TeamNameNormalizer.normalize(match.info.away) === targetName
        );
    }
}
