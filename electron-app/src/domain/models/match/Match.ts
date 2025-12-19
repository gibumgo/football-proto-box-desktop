import { MatchInfo } from './MatchInfo';
import { MatchOdds } from './MatchOdds';
import { MatchResult } from './MatchResult';

export class Match {
    public readonly info: MatchInfo;
    public readonly odds: MatchOdds;
    public readonly result: MatchResult;

    constructor(
        info: MatchInfo,
        odds: MatchOdds,
        result: MatchResult
    ) {
        this.info = info;
        this.odds = odds;
        this.result = result;
    }

    static create(info: MatchInfo, odds: MatchOdds, result: MatchResult): Match {
        return new Match(info, odds, result);
    }
}
