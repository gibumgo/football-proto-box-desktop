import { MATCH_RESULT } from '@/constants/domain';
import { NEON_THEME } from '@/domain/design/designTokens';

/**
 * 경기 결과에 따른 텍스트 색상을 반환합니다.
 */
export function getResultColor(result: string): string {
    if (result === MATCH_RESULT.WIN || result === MATCH_RESULT.WIN_EN) return NEON_THEME.colors.neon.green;
    if (result === MATCH_RESULT.DRAW || result === MATCH_RESULT.DRAW_EN) return NEON_THEME.colors.neon.yellow;
    if (result === MATCH_RESULT.LOSE || result === MATCH_RESULT.LOSE_EN) return NEON_THEME.colors.neon.red;
    return NEON_THEME.colors.text.secondary;
}

/**
 * 경기 결과에 따른 배경색(투명도 포함)을 반환합니다.
 */
export function getResultBg(result: string): string {
    if (result === MATCH_RESULT.WIN || result === MATCH_RESULT.WIN_EN) return 'rgba(74, 222, 128, 0.15)';
    if (result === MATCH_RESULT.DRAW || result === MATCH_RESULT.DRAW_EN) return 'rgba(251, 191, 36, 0.15)';
    if (result === MATCH_RESULT.LOSE || result === MATCH_RESULT.LOSE_EN) return 'rgba(248, 113, 113, 0.15)';
    return 'transparent';
}
