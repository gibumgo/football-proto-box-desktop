export interface BettingOdds {
    win: number | null;
    draw: number | null;
    lose: number | null;
}

export interface Score {
    home: number;
    away: number;
}

export type MatchResult = 'WIN' | 'DRAW' | 'LOSE' | 'UNDER' | 'OVER' | 'ODD' | 'EVEN' | 'UNKNOWN';
export type MatchType = 'MATCH' | 'HANDICAP' | 'UNDER_OVER' | 'GENERAL' | 'SUM';

export interface Match {
    round: number;
    matchNo: number;
    dateTime: string | number[];
    league: string;
    home: string;
    away: string;
    type: MatchType;
    domesticOdds: BettingOdds;
    overseasOdds: BettingOdds;
    score: Score | null;
    result: MatchResult | null;
    resultOdd: number | null;
    // Client-side computed fields (via Java or mapping)
    winCutoff?: number;
    drawCutoff?: number;
    loseCutoff?: number;
    handicapNumber?: number;
}

export interface RoundStats {
    round: number;
    totalMatches: number;
    finishedMatches: number;
    favoriteWinCount: number;
    underdogWinCount: number;
    drawCount: number;
}

export interface ArchiveData {
    stats: RoundStats;
    matches: Match[];
}
