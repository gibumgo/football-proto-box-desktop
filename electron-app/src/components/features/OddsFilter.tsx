
import { NEON_THEME } from '../../domain/design/designTokens';

interface OddsFilterProps {
    availableOdds: number[];
    selectedOdds: number[];
    onOddsChange: (odds: number[]) => void;
}

type OddsGroup = 'low' | 'mid' | 'high';

export function OddsFilter({ availableOdds, selectedOdds, onOddsChange }: OddsFilterProps) {
    // 헬퍼: 특정 배당이 어떤 그룹에 속하는지 판별
    const getGroup = (odd: number): OddsGroup => {
        if (odd < 2.0) return 'low';
        if (odd <= 3.0) return 'mid';
        return 'high';
    };

    // 헬퍼: 그룹별 배당 목록 추출
    const getOddsInGroup = (group: OddsGroup) => {
        return availableOdds.filter(odd => getGroup(odd) === group);
    };

    // 그룹 토글 핸들러
    const handleGroupToggle = (group: OddsGroup) => {
        const groupOdds = getOddsInGroup(group);
        const allSelected = groupOdds.every(odd => selectedOdds.includes(odd));

        let newSelected: number[];
        if (allSelected) {
            // 이미 다 선택되어 있으면 해당 그룹만 해제 (나머지는 유지)
            newSelected = selectedOdds.filter(odd => !groupOdds.includes(odd));
        } else {
            // 하나라도 선택 안 된 게 있으면 해당 그룹 전체 추가 (중복 방지)
            const others = selectedOdds.filter(odd => !groupOdds.includes(odd));
            newSelected = [...others, ...groupOdds];
        }
        onOddsChange(newSelected);
    };

    // 개별 칩 토글 핸들러
    const handleChipToggle = (odd: number) => {
        if (selectedOdds.includes(odd)) {
            onOddsChange(selectedOdds.filter(o => o !== odd));
        } else {
            onOddsChange([...selectedOdds, odd]);
        }
    };

    // 그룹 상태 확인 (UI 표시용)
    const isGroupActive = (group: OddsGroup) => {
        const groupOdds = getOddsInGroup(group);
        return groupOdds.length > 0 && groupOdds.every(odd => selectedOdds.includes(odd));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.md }}>
            {/* 1. 그룹 필터 (Quick Group Toggle) */}
            <div style={{ display: 'flex', gap: NEON_THEME.spacing.sm, flexWrap: 'wrap' }}>
                <GroupButton
                    label="2.0 미만"
                    active={isGroupActive('low')}
                    onClick={() => handleGroupToggle('low')}
                    color={NEON_THEME.colors.neon.green}
                />
                <GroupButton
                    label="2.0 ~ 3.0"
                    active={isGroupActive('mid')}
                    onClick={() => handleGroupToggle('mid')}
                    color={NEON_THEME.colors.neon.yellow}
                />
                <GroupButton
                    label="3.0 초과"
                    active={isGroupActive('high')}
                    onClick={() => handleGroupToggle('high')}
                    color={NEON_THEME.colors.neon.red}
                />
            </div>

            {/* 2. 스마트 칩스 (Smart Chips) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableOdds.map(odd => {
                    const isActive = selectedOdds.includes(odd);
                    const group = getGroup(odd);
                    let activeColor: string = NEON_THEME.colors.neon.cyan;
                    if (group === 'low') activeColor = NEON_THEME.colors.neon.green;
                    else if (group === 'mid') activeColor = NEON_THEME.colors.neon.yellow;
                    else activeColor = NEON_THEME.colors.neon.red;

                    return (
                        <button
                            key={odd}
                            onClick={() => handleChipToggle(odd)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: `1px solid ${isActive ? activeColor : NEON_THEME.colors.border.default}`,
                                backgroundColor: isActive ? `${activeColor}20` : 'transparent', // 20 hex alpha ~ 12%
                                color: isActive ? activeColor : NEON_THEME.colors.text.secondary,
                                cursor: 'pointer',
                                fontSize: NEON_THEME.typography.size.xs,
                                fontWeight: isActive ? NEON_THEME.typography.weight.bold : NEON_THEME.typography.weight.regular,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {odd.toFixed(2)}
                        </button>
                    );
                })}
            </div>
            {selectedOdds.length > 0 && (
                <div style={{ fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary, textAlign: 'right' }}>
                    {selectedOdds.length}개 선택됨
                </div>
            )}
        </div>
    );
}

// 내부 컴포넌트: 그룹 버튼
function GroupButton({ label, active, onClick, color }: { label: string, active: boolean, onClick: () => void, color: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: '8px',
                borderRadius: NEON_THEME.layout.radius.md,
                border: `1px solid ${active ? color : NEON_THEME.colors.border.default}`,
                backgroundColor: active ? `${color}30` : NEON_THEME.colors.bg.header,
                color: active ? color : NEON_THEME.colors.text.secondary,
                cursor: 'pointer',
                fontSize: NEON_THEME.typography.size.sm,
                fontWeight: NEON_THEME.typography.weight.bold,
                transition: 'all 0.2s ease'
            }}
        >
            {label}
        </button>
    );
}
