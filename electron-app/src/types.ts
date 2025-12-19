export interface ScoreDto {
    home: number;
    away: number;
}

export interface MatchDto {
    round: number;
    matchNo: number;
    dateTime: string; // ISO string or array from Java
    league: string;
    home: string;
    away: string;
    type: string;
    winOdd?: number;
    drawOdd?: number;
    loseOdd?: number;
    score?: ScoreDto;
    result?: string;
    resultOdd?: number;
}


