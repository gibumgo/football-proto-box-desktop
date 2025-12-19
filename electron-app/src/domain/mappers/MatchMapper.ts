import type { MatchDto } from '../../types';
import { Match } from '../models/match/Match';
import { MatchInfo } from '../models/match/MatchInfo';
import { MatchOdds } from '../models/match/MatchOdds';
import { MatchResult } from '../models/match/MatchResult';

export class MatchMapper {
    static toDomain(dto: MatchDto): Match {
        const info = new MatchInfo(
            dto.round,
            dto.matchNo,
            dto.dateTime,
            dto.league,
            dto.home,
            dto.away,
            dto.type
        );

        const odds = new MatchOdds(
            dto.winOdd,
            dto.drawOdd,
            dto.loseOdd
        );

        const result = new MatchResult(
            dto.result,
            dto.resultOdd,
            dto.score
        );

        return new Match(info, odds, result);
    }

    static toDomainList(dtos: MatchDto[]): Match[] {
        return dtos.map(this.toDomain);
    }
}
