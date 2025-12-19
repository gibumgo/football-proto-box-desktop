// 팀 통계 타입
export interface TeamStats {
    teamName: string;
    totalMatches: number;

    // 전체 통계
    overall: {
        wins: number;
        draws: number;
        losses: number;
        winRate: number;
    };

    // 홈 통계
    home: {
        wins: number;
        draws: number;
        losses: number;
        winRate: number;
    };

    // 원정 통계
    away: {
        wins: number;
        draws: number;
        losses: number;
        winRate: number;
    };

    // 득실점
    avgGoalsScored: number;
    avgGoalsConceded: number;

    // 추가 지표
    over25Rate: number;  // 오버 2.5골 발생률
    cleanSheetRate: number;  // 클린시트율

    // 최근 10경기 스트릭
    recentForm: ('W' | 'D' | 'L')[];
}
