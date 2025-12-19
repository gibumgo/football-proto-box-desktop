import { Match } from '../../models/match/Match';
import { TeamNameNormalizer } from '../normalize/TeamNameNormalizer';

export class MatchEventKey {
    /**
     * 경기 고유 키 생성 (날짜 + 홈팀 + 원정팀)
     * 날짜는 T 이전까지만 사용 (연-월-일)
     */
    static getEventKey(match: Match): string {
        const home = TeamNameNormalizer.normalize(match.info.home);
        const away = TeamNameNormalizer.normalize(match.info.away);
        const dateKey = typeof match.info.dateTime === 'string'
            ? match.info.dateTime.split('T')[0]
            : String(match.info.dateTime);

        return `${dateKey}_${home}_${away}`;
    }

    /**
     * 필터링용 중복 제거 키 (타입 포함)
     * 예: 2025-01-01_Home_Away_GENERAL
     */
    static getFilterKey(match: Match): string {
        const baseKey = this.getEventKey(match);
        return `${baseKey}_${match.info.type}`;
    }

    /**
     * 고유 이벤트(경기) 추출
     * - 중복된 경기가 있을 경우 'GENERAL' 또는 '일반' 타입 우선
     */
    static uniqueEvents(matches: Match[]): Match[] {
        const uniqueEventsMap = new Map<string, Match>();

        matches.forEach(match => {
            const eventKey = this.getEventKey(match);

            if (uniqueEventsMap.has(eventKey)) {
                if (match.info.type === 'GENERAL' || match.info.type === '일반') {
                    uniqueEventsMap.set(eventKey, match);
                }
            } else {
                uniqueEventsMap.set(eventKey, match);
            }
        });

        return Array.from(uniqueEventsMap.values());
    }
}
