/**
 * Domain Constants
 * 비즈니스 로직에서 사용되는 상수들을 정의합니다.
 */

// 경기 결과 상수
export const MATCH_RESULT = {
    WIN: '승',
    DRAW: '무',
    LOSE: '패',
    // 영문 데이터 매핑용
    WIN_EN: 'WIN',
    DRAW_EN: 'DRAW',
    LOSE_EN: 'LOSE'
} as const;

export type MatchResultType = typeof MATCH_RESULT[keyof typeof MATCH_RESULT];

// 로그 레벨 상수
export const LOG_LEVEL = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
} as const;

// 로그 접두어
export const LOG_PREFIX = {
    SYSTEM: 'System:',
    ERROR: '[ERROR]',
    WARN: '[WARN]',
    SUCCESS: '[SUCCESS]'
} as const;
