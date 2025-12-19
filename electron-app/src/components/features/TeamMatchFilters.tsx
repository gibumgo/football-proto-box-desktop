
import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';
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
            gap: '24px', // Increased gap between sections
            marginBottom: '16px'
            // Removed internal padding/bg to blend with sidebar or keep it? 
            // The sidebar in TeamProfile has padding. 
            // If I keep bg here, it looks nested. 
            // User put TeamMatchFilters inside the sidebar div which has padding.
            // So I should remove bg/padding here to avoid double boxing if cleaner.
            // But checking TeamProfile: it has `padding: '16px'`, `backgroundColor: COLORS.PANEL`.
            // And TeamMatchFilters was ALSO having `backgroundColor: COLORS.PANEL`.
            // That might be why it looked "awkward" (nested panels).
            // I will remove the container style here and just return the sections.
        }}>
            {/* 경기 종류 필터 (Top) */}
            <div>
                <div style={{
                    fontSize: TYPOGRAPHY.SIZE.SM,
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: COLORS.TEXT_PRIMARY
                }}>
                    경기 종류
                </div>
                <MatchTypeFilter
                    selectedTypes={selectedMatchTypes}
                    onTypeChange={onTypeChange}
                />
            </div>

            <hr style={{ border: `0.5px solid ${COLORS.BORDER}`, margin: 0 }} />

            {/* 배당 필터 (Bottom) */}
            <div>
                <div style={{
                    fontSize: TYPOGRAPHY.SIZE.SM,
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: COLORS.TEXT_PRIMARY
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
