import { NEON_THEME } from '../../domain/design/designTokens';
import { MatchTypeFilter } from './MatchTypeFilter';
import { OddsFilter } from './OddsFilter';

interface TeamMatchFiltersProps {
    selectedMatchTypes: string[];
    onTypeChange: (types: string[]) => void;
    availableOdds: number[];
    selectedOdds: number[];
    onOddsChange: (odds: number[]) => void;
}

export function TeamMatchFilters({
    selectedMatchTypes,
    onTypeChange,
    availableOdds,
    selectedOdds,
    onOddsChange
}: TeamMatchFiltersProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: NEON_THEME.spacing.xl,
            marginBottom: NEON_THEME.spacing.lg
        }}>
            {/* 경기 종류 필터 (Top) */}
            <div>
                <div style={{
                    fontSize: NEON_THEME.typography.size.sm,
                    fontWeight: 'bold',
                    marginBottom: NEON_THEME.spacing.sm,
                    color: NEON_THEME.colors.text.primary
                }}>
                    경기 종류
                </div>
                <MatchTypeFilter
                    selectedTypes={selectedMatchTypes}
                    onTypeChange={onTypeChange}
                />
            </div>

            <hr style={{ border: `0.5px solid ${NEON_THEME.colors.border.default}`, margin: 0 }} />

            {/* 배당 필터 (Bottom) */}
            <div>
                <div style={{
                    fontSize: NEON_THEME.typography.size.sm,
                    fontWeight: 'bold',
                    marginBottom: NEON_THEME.spacing.sm,
                    color: NEON_THEME.colors.text.primary
                }}>
                    배당 선택
                </div>
                <OddsFilter
                    availableOdds={availableOdds}
                    selectedOdds={selectedOdds}
                    onOddsChange={onOddsChange}
                />
            </div>
        </div>
    );
}
