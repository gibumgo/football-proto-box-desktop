export class MatchOdds {
    public readonly winOdd?: number;
    public readonly drawOdd?: number;
    public readonly loseOdd?: number;

    constructor(
        winOdd?: number,
        drawOdd?: number,
        loseOdd?: number
    ) {
        this.winOdd = winOdd;
        this.drawOdd = drawOdd;
        this.loseOdd = loseOdd;
    }

    get hasOdds(): boolean {
        return this.winOdd !== undefined && this.loseOdd !== undefined;
    }
}
