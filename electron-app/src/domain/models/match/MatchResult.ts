export interface Score {
    home: number;
    away: number;
}

export class MatchResult {
    public readonly result?: string;
    public readonly resultOdd?: number;
    public readonly score?: Score;

    constructor(
        result?: string,
        resultOdd?: number,
        score?: Score
    ) {
        this.result = result;
        this.resultOdd = resultOdd;
        this.score = score;
    }

    get isFinished(): boolean {
        return !!this.result;
    }

    get formattedScore(): string {
        if (this.score && typeof this.score === 'object' && 'home' in this.score && 'away' in this.score) {
            return `${this.score.home}:${this.score.away}`;
        }
        return '';
    }
}
