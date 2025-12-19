export class MatchInfo {
    public readonly round: number;
    public readonly matchNo: number;
    public readonly dateTime: string | number[];
    public readonly league: string;
    public readonly home: string;
    public readonly away: string;
    public readonly type: string;

    constructor(
        round: number,
        matchNo: number,
        dateTime: string | number[],
        league: string,
        home: string,
        away: string,
        type: string
    ) {
        this.round = round;
        this.matchNo = matchNo;
        this.dateTime = dateTime;
        this.league = league;
        this.home = home;
        this.away = away;
        this.type = type;
    }

    get fullMatchName(): string {
        return `${this.home} vs ${this.away}`;
    }

    get formattedDate(): string {
        if (Array.isArray(this.dateTime)) {
            const [y, m, d, h, min] = this.dateTime;
            return `${y}.${m}.${d} ${h}:${min.toString().padStart(2, '0')}`;
        }
        return this.dateTime;
    }
}
