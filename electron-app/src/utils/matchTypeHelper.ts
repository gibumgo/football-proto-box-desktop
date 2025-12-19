
/**
 * 경기 결과 및 타입을 처리하는 헬퍼 함수들
 */

export const MatchTypeConstants = {
    COLORS: {
        HANDICAP: '#A78BFA', // Neon Purple-ish
        UNDER_OVER: '#FB923C', // Orange
        GENERAL: '#9CA3AF', // Grey
        DEFAULT: '#9CA3AF'
    },
    TEXT: {
        HANDICAP: '핸디캡',
        UNDER_OVER: 'U/O',
        GENERAL: '일반',
        SUM: 'SUM'
    }
} as const;

export const MatchTypeHelper = {
    /**
     * 경기 결과 코드를 한국어로 변환
     */
    translateResult(result: string): string {
        const r = result?.toUpperCase();
        if (r === 'WIN' || r === '승' || r === 'W') return '승';
        if (r === 'DRAW' || r === '무' || r === 'D') return '무';
        if (r === 'LOSE' || r === '패' || r === 'L') return '패';
        // 언더오버/홀짝 등 추가 대응
        if (r === 'UNDER' || r === '언더' || r.includes('UNDER')) return '언더';
        if (r === 'OVER' || r === '오버' || r.includes('OVER')) return '오버';
        return result || '-';
    },

    /**
     * 경기 종류 파싱 (타입과 기준점 분리)
     * 예: "핸디캡(-1.0)" -> type: "핸디캡", value: "-1.0"
     */
    parseMatchType(typeStr: string): { mainType: string; subValue: string; color: string } {
        if (!typeStr) return { mainType: MatchTypeConstants.TEXT.GENERAL, subValue: '', color: MatchTypeConstants.COLORS.DEFAULT };

        // Normalize string
        const upperType = typeStr.toUpperCase();

        let mainType: string = MatchTypeConstants.TEXT.GENERAL;
        let subValue = '';
        let color: string = MatchTypeConstants.COLORS.DEFAULT;

        if (upperType.includes('HANDICAP') || typeStr.includes('핸디캡')) {
            mainType = MatchTypeConstants.TEXT.HANDICAP;
            const match = typeStr.match(/\((.*?)\)/);
            if (match) subValue = match[1];
            color = MatchTypeConstants.COLORS.HANDICAP;
        } else if (upperType.includes('UNDER') || upperType.includes('OVER') || typeStr.includes('언더') || typeStr.includes('오버') || upperType.includes('U/O')) {
            mainType = MatchTypeConstants.TEXT.UNDER_OVER;
            const match = typeStr.match(/\((.*?)\)/);
            if (match) subValue = match[1];
            color = MatchTypeConstants.COLORS.UNDER_OVER; // Orange
        } else if (upperType.includes('GENERAL') || typeStr.includes('일반')) {
            mainType = MatchTypeConstants.TEXT.GENERAL;
            color = MatchTypeConstants.COLORS.GENERAL;
        } else {
            // Fallback for other types but check if it's English
            if (upperType === 'SUM') mainType = MatchTypeConstants.TEXT.SUM;
            else mainType = typeStr;
        }

        return { mainType, subValue, color };
    }
};
