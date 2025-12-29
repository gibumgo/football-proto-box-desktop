import { NEON_THEME } from '../../domain/design/designTokens';
import { MatchTypeConstants } from '../../utils/matchTypeHelper';

interface MatchTypeFilterProps {
    selectedTypes: string[];
    onTypeChange: (types: string[]) => void;
}

export function MatchTypeFilter({ selectedTypes, onTypeChange }: MatchTypeFilterProps) {

    // 필터 옵션 정의
    const options = [
        { label: MatchTypeConstants.TEXT.GENERAL, value: 'GENERAL' },
        { label: MatchTypeConstants.TEXT.HANDICAP, value: 'HANDICAP' },
        { label: MatchTypeConstants.TEXT.UNDER_OVER, value: 'UNDER_OVER' } // U/O
    ];

    const handleToggle = (value: string) => {
        if (selectedTypes.includes(value)) {
            // 이미 선택된 경우 제거
            onTypeChange(selectedTypes.filter(t => t !== value));
        } else {
            // 선택되지 않은 경우 추가
            onTypeChange([...selectedTypes, value]);
        }
    };

    return (
        <div style={{ display: 'flex', gap: NEON_THEME.spacing.sm, flexWrap: 'wrap' }}>
            {options.map(option => {
                const isActive = selectedTypes.includes(option.value);

                // Active 색상 결정 (일반=Green, 핸디캡=Purple, U/O=Orange based on constants/theme)
                // 하지만 UI 통일성을 위해 OddsFilter와 유사하게 처리하거나,
                // MatchTypeHelper의 색상 상수를 활용

                let activeColor: string = NEON_THEME.colors.text.secondary;
                // if (option.value === 'GENERAL') activeColor = MatchTypeConstants.COLORS.GENERAL; // Grey
                // else if (option.value === 'HANDICAP') activeColor = MatchTypeConstants.COLORS.HANDICAP; // Purple
                // else if (option.value === 'UNDER_OVER') activeColor = MatchTypeConstants.COLORS.UNDER_OVER; // Orange

                // 사용자 요청: "배당 셀렉터와 UI 디자인 동일" -> OddsFilter 스타일 차용
                // OddsFilter는 선택 시 네온 컬러 사용.
                // 여기서는 Type별 고유 컬러를 네온으로 사용.

                // 가시성을 위해 Theme.ts의 네온 컬러 매핑
                if (option.value === 'GENERAL') activeColor = NEON_THEME.colors.text.primary; // 일반은 기본 텍스트 색
                else if (option.value === 'HANDICAP') activeColor = NEON_THEME.colors.neon.purple;
                else if (option.value === 'UNDER_OVER') activeColor = '#FB923C'; // Orange is not in Theme NEON, using custom from constant or similar

                return (
                    <button
                        key={option.value}
                        onClick={() => handleToggle(option.value)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            border: `1px solid ${isActive ? activeColor : NEON_THEME.colors.border.default}`,
                            backgroundColor: isActive ? `${activeColor}20` : 'transparent',
                            color: isActive ? activeColor : NEON_THEME.colors.text.secondary,
                            cursor: 'pointer',
                            fontSize: NEON_THEME.typography.size.xs,
                            fontWeight: isActive ? NEON_THEME.typography.weight.bold : NEON_THEME.typography.weight.regular,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        {/* 체크 아이콘 (선택 시) */}
                        {isActive && <span>✓</span>}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
