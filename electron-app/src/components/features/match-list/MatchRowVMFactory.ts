import { Match } from '../../../domain/models/match/Match';
import { COLORS } from '../../../domain/design/theme';
import { MatchTypeHelper, MatchTypeConstants } from '../../../utils/matchTypeHelper';

export interface MatchRowViewModel {
    matchNo: string;
    roundNum: string;
    formattedDate: string;
    league: string;

    // Type Info
    mainType: string;
    subValue: string | null;
    typeColor: string;

    // Teams
    homeName: string;
    awayName: string;

    // Styling flags
    isWin: boolean;
    isLose: boolean;
    isDraw: boolean; // Just in case, though isWin/isLose handles main bolding

    // Result Badge
    resultColor: string;
    resultBg: string;
    displayResult: string;

    // Score
    displayScore: string;

    // Odds
    winOdd: string;
    drawOdd: string;
    loseOdd: string;

    // Odds Highlighting (Background color triggers)
    highlightWinOdd: boolean;
    highlightDrawOdd: boolean;
    highlightLoseOdd: boolean;
}

export class MatchRowVMFactory {
    static create(match: Match): MatchRowViewModel {
        const { mainType, subValue, color: typeColor } = MatchTypeHelper.parseMatchType(match.info.type);
        const result = MatchTypeHelper.translateResult(match.result.result || '');

        // 1. 회차 추출
        const roundNum = match.info.round?.toString().replace(/[^0-9]/g, '') || '-';

        // 2. 기본 승/무/패 불리언 계산 (홈팀 기준 텍스트)
        const isWin = result === '승';
        const isLose = result === '패';
        const isDraw = result === '무';

        // 3. 배당 하이라이트 & 결과 색상 결정
        let resultColor = COLORS.TEXT_PRIMARY;
        let resultBg = 'transparent';

        let highlightWinOdd = false;
        let highlightDrawOdd = false;
        let highlightLoseOdd = false;

        // U/O 혹은 일반/핸디캡에 따른 하이라이트 위치 결정
        if (mainType === MatchTypeConstants.TEXT.UNDER_OVER) {
            // 언더 = Home Win Pos, 오버 = Away Win Pos
            highlightWinOdd = result === '언더';
            highlightLoseOdd = result === '오버';

            // 색상: Theme 규칙 (승리=Green, 패배=Red)
            // 언더(홈 승리 위치) -> Green
            // 오버(원정 승리 위치) -> Red
            if (result === '언더') {
                resultColor = COLORS.NEON_GREEN;
                resultBg = COLORS.SIGNAL_WIN_BG;
            } else if (result === '오버') {
                resultColor = COLORS.NEON_RED;
                resultBg = COLORS.SIGNAL_LOSE_BG;
            }
        } else {
            // 일반, 핸디캡, 스페셜 등
            highlightWinOdd = result === '승' || result === '홀';
            highlightLoseOdd = result === '패' || result === '짝';
            highlightDrawOdd = result === '무';

            if (highlightWinOdd) {
                resultColor = COLORS.NEON_GREEN;
                resultBg = COLORS.SIGNAL_WIN_BG;
            } else if (highlightLoseOdd) {
                resultColor = COLORS.NEON_RED;
                resultBg = COLORS.SIGNAL_LOSE_BG;
            } else if (highlightDrawOdd) {
                resultColor = COLORS.NEON_YELLOW;
                resultBg = COLORS.SIGNAL_DRAW_BG;
            }
        }

        // 4. 스코어 및 결과 텍스트 포맷팅
        let displayScore = match.result.formattedScore;
        let displayResult = result;

        if (match.result.score) {
            const { home, away } = match.result.score;
            const sum = home + away;

            if (mainType === MatchTypeConstants.TEXT.UNDER_OVER) {
                displayScore = `${sum} (${home}:${away})`;
                const uoShort = result === '언더' ? 'U' : result === '오버' ? 'O' : result;
                displayResult = `${uoShort} (${sum})`;
            } else if (mainType === MatchTypeConstants.TEXT.SUM) {
                const isOdd = sum % 2 !== 0;
                displayScore = `${isOdd ? '홀' : '짝'} (${sum})`;
            }
        }

        return {
            matchNo: match.info.matchNo.toString(),
            roundNum,
            formattedDate: match.info.formattedDate,
            league: match.info.league,
            mainType,
            subValue: subValue || null,
            typeColor,
            homeName: match.info.home,
            awayName: match.info.away,
            isWin,
            isLose,
            isDraw,
            resultColor,
            resultBg,
            displayResult,
            displayScore,
            winOdd: match.odds.winOdd?.toFixed(2) || '-',
            drawOdd: match.odds.drawOdd?.toFixed(2) || '-',
            loseOdd: match.odds.loseOdd?.toFixed(2) || '-',
            highlightWinOdd,
            highlightDrawOdd,
            highlightLoseOdd
        };
    }
}
