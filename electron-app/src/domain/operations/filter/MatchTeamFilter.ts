import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';
import { MatchEventKey } from '../identify/MatchEventKey';

export class MatchTeamFilter {
    /**
     * 특정 팀의 경기만 필터링
     * @param matches 전체 경기 목록
     * @param teamName 팀명
     */
    static byTeam(matches: Match[], teamName: string): Match[] {
        const targetName = TeamNameNormalizer.normalize(teamName);
        return matches.filter(match => {
            const home = TeamNameNormalizer.normalize(match.info.home);
            const away = TeamNameNormalizer.normalize(match.info.away);
            return home === targetName || away === targetName;
        });
    }

    /**
     * 특정 팀의 경기만 필터링 + 중복 제거
     * (기존 filterMatchesByTeam 로직 분리)
     */
    static byTeamUnique(matches: Match[], teamName: string): Match[] {
        const filtered = this.byTeam(matches, teamName);
        const seen = new Set<string>();

        return filtered.filter(match => {
            // 중복 제거 (날짜 + 홈팀 + 원정팀 + 경기유형)
            const uniqueKey = MatchEventKey.getFilterKey(match);
            if (seen.has(uniqueKey)) return false;
            seen.add(uniqueKey);
            return true;
        });
    }
}
