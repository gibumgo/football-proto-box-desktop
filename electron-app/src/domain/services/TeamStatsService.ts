import { Match } from '../models/match/Match';
import type { TeamStats } from '../models/stats/TeamStats';
import { TeamNameNormalizer } from '../operations/normalize/TeamNameNormalizer';
import { MatchResultValidator } from '../operations/result/MatchResultValidator';
import { MatchEventKey } from '../operations/identify/MatchEventKey';
import { MatchSorter } from '../operations/sort/MatchSorter';
import { WinDrawLossCalculator } from '../operations/stats/WinDrawLossCalculator';
import { MatchLocationFilter } from '../operations/filter/MatchLocationFilter';
import { GoalStatsCalculator } from '../operations/stats/GoalStatsCalculator';
import { RateCalculator } from '../operations/stats/RateCalculator';
import { RecentFormCalculator } from '../operations/stats/RecentFormCalculator';

export class TeamStatsService {
    /**
     * 팀 통계 계산
     * **주의**: 결과가 없는 경기는 통계 계산에서 제외합니다.
     */
    static calculate(matches: Match[], teamName: string): TeamStats {
        const normalizedName = TeamNameNormalizer.normalize(teamName);

        // 1. 결과가 있는 경기만 필터링
        const finishedMatchesWithResults = MatchResultValidator.onlyFinished(matches);

        // 2. 고유 이벤트(경기) 추출
        // 통계 계산을 위해 중복된 경기(핸디캡, 언오버 등)를 제거
        const uniqueMatches = MatchEventKey.uniqueEvents(finishedMatchesWithResults);
        const totalMatches = uniqueMatches.length;

        if (totalMatches === 0) {
            return this.getEmptyStats(normalizedName);
        }

        // 3. 최근 10경기 (일시 내림차순)
        const recentMatches = MatchSorter.sort(uniqueMatches, 'date', 'desc').slice(0, 10);

        // 4. 전체 통계
        const overall = WinDrawLossCalculator.calculate(uniqueMatches, normalizedName);

        // 5. 홈 통계
        const homeMatches = MatchLocationFilter.byLocation(uniqueMatches, normalizedName, 'home');
        const home = WinDrawLossCalculator.calculate(homeMatches, normalizedName);

        // 6. 원정 통계
        const awayMatches = MatchLocationFilter.byLocation(uniqueMatches, normalizedName, 'away');
        const away = WinDrawLossCalculator.calculate(awayMatches, normalizedName);

        // 7. 득실점
        const { avgGoalsScored, avgGoalsConceded } = GoalStatsCalculator.calculate(uniqueMatches, normalizedName);

        // 8. 오버 2.5골 발생률
        const over25Rate = RateCalculator.over25(uniqueMatches);

        // 9. 클린시트율
        const cleanSheetRate = RateCalculator.cleanSheet(uniqueMatches, normalizedName);

        // 10. 최근 10경기 스트릭
        const recentForm = RecentFormCalculator.calculate(recentMatches, normalizedName);

        return {
            teamName: normalizedName,
            totalMatches,
            overall,
            home,
            away,
            avgGoalsScored,
            avgGoalsConceded,
            over25Rate,
            cleanSheetRate,
            recentForm
        };
    }

    private static getEmptyStats(teamName: string): TeamStats {
        const emptyRecord = { wins: 0, draws: 0, losses: 0, winRate: 0 };
        return {
            teamName,
            totalMatches: 0,
            overall: emptyRecord,
            home: emptyRecord,
            away: emptyRecord,
            avgGoalsScored: 0,
            avgGoalsConceded: 0,
            over25Rate: 0,
            cleanSheetRate: 0,
            recentForm: []
        };
    }
}
