import { Match } from '../domain/models/match/Match';

import { MatchListTable } from '../components/features/MatchListTable';
import { TeamMatchFilters } from '../components/features/TeamMatchFilters';
import { NEON_THEME } from '../domain/design/designTokens';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { TeamNameNormalizer } from '../domain/operations/normalize/TeamNameNormalizer';
import { Button } from '../components/ui/Button';

export interface TeamProfileProps {
    teamName: string;
    allMatches: Match[];
    onBack: () => void;
}

export function TeamProfile({ teamName, allMatches, onBack }: TeamProfileProps) {
    // Controller Layer: Logic & State Hook
    const {
        stats,
        availableOdds,
        paginatedMatches,
        filteredMatchesLength,
        location,
        selectedOdds,
        selectedMatchTypes,
        sortBy,
        sortOrder,
        currentPage,
        totalPages,
        handleFilterChange,
        handleOddsChange,
        handleTypeChange,
        handleSort,
        setCurrentPage
    } = useTeamProfile(teamName, allMatches);

    // Helper to normalize team name for display
    const displayName = TeamNameNormalizer.normalize(teamName);

    return (
        <div style={{
            height: '100%',
            width: '100%',
            padding: NEON_THEME.spacing.xl,
            backgroundColor: NEON_THEME.colors.bg.app,
            color: NEON_THEME.colors.text.primary,
            overflowY: 'auto',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: NEON_THEME.spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: NEON_THEME.spacing.md }}>
                    <Button
                        onClick={onBack}
                        variant="default"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        ← 뒤로
                    </Button>
                    <h2 style={{ margin: 0, fontSize: NEON_THEME.typography.size.xxl, fontWeight: NEON_THEME.typography.weight.bold }}>
                        {displayName} <span style={{ fontSize: NEON_THEME.typography.size.md, color: NEON_THEME.colors.text.secondary, fontWeight: NEON_THEME.typography.weight.regular }}>분석</span>
                    </h2>
                </div>
            </div>

            {/* 1. Top: Stats Summary (Component A) */}
            <div style={{ marginBottom: NEON_THEME.spacing.xl }}>
                {/* 최근 흐름 & 통계 요약 */}
                <div style={{
                    backgroundColor: NEON_THEME.colors.bg.panel,
                    padding: NEON_THEME.spacing.lg,
                    borderRadius: NEON_THEME.layout.radius.md,
                    marginBottom: NEON_THEME.spacing.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: NEON_THEME.spacing.xl,
                    flexWrap: 'wrap',
                    border: `1px solid ${NEON_THEME.colors.border.default}`
                }}>
                    {/* Recent Form */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: NEON_THEME.spacing.md }}>
                        <div style={{
                            fontSize: NEON_THEME.typography.size.sm,
                            color: NEON_THEME.colors.text.secondary,
                            textTransform: 'uppercase',
                            fontWeight: NEON_THEME.typography.weight.medium
                        }}>
                            최근 흐름
                        </div>
                        <div style={{ display: 'flex', gap: NEON_THEME.spacing.sm }}>
                            {stats.recentForm.map((form: string, idx: number) => {
                                let bg = 'transparent';
                                let color: string = NEON_THEME.colors.text.primary;
                                if (form === 'W') { bg = 'rgba(74, 222, 128, 0.1)'; color = NEON_THEME.colors.neon.green; }
                                else if (form === 'D') { bg = 'rgba(251, 191, 36, 0.1)'; color = NEON_THEME.colors.neon.yellow; }
                                else if (form === 'L') { bg = 'rgba(248, 113, 113, 0.1)'; color = NEON_THEME.colors.neon.red; }

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: NEON_THEME.typography.weight.bold,
                                            fontSize: NEON_THEME.typography.size.xs,
                                            backgroundColor: bg,
                                            color: color,
                                            border: `1px solid ${color}`
                                        }}
                                    >
                                        {form}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '24px', backgroundColor: NEON_THEME.colors.border.default }}></div>

                    {/* Quick Stats Row */}
                    <div style={{ display: 'flex', gap: NEON_THEME.spacing.xl }}>
                        <div>
                            <span style={{ fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary }}>전체 승률</span>
                            <div style={{ fontSize: NEON_THEME.typography.size.lg, fontWeight: 'bold', color: NEON_THEME.colors.text.primary }}>{stats.overall.winRate.toFixed(1)}%</div>
                        </div>
                        <div>
                            <span style={{ fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary }}>평균 득점</span>
                            <div style={{ fontSize: NEON_THEME.typography.size.lg, fontWeight: 'bold', color: NEON_THEME.colors.neon.cyan }}>{stats.avgGoalsScored.toFixed(2)}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary }}>평균 실점</span>
                            <div style={{ fontSize: NEON_THEME.typography.size.lg, fontWeight: 'bold', color: NEON_THEME.colors.neon.red }}>{stats.avgGoalsConceded.toFixed(2)}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary }}>오버 2.5</span>
                            <div style={{ fontSize: NEON_THEME.typography.size.lg, fontWeight: 'bold', color: NEON_THEME.colors.neon.purple }}>{stats.over25Rate.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Bottom: Content Area */}
            <div style={{ display: 'flex', gap: NEON_THEME.spacing.lg, alignItems: 'flex-start' }}>

                {/* Left: Matches Table (Main Content) - Flex 1 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: NEON_THEME.spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: NEON_THEME.typography.size.lg, fontWeight: NEON_THEME.typography.weight.bold }}>경기 목록</h3>
                        <span style={{ fontSize: NEON_THEME.typography.size.sm, color: NEON_THEME.colors.text.secondary }}>총 {filteredMatchesLength ?? paginatedMatches.length}경기</span>
                    </div>

                    <MatchListTable
                        matches={paginatedMatches}
                        onSort={handleSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: NEON_THEME.spacing.sm, marginTop: NEON_THEME.spacing.lg }}>
                            <Button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                variant="default"
                                size="sm"
                            >
                                이전
                            </Button>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: NEON_THEME.colors.text.secondary,
                                fontSize: NEON_THEME.typography.size.sm,
                                padding: '0 8px'
                            }}>
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                variant="default"
                                size="sm"
                            >
                                다음
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right: Filters (Sidebar) - Fixed Width */}
                <div style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{
                        backgroundColor: NEON_THEME.colors.bg.panel,
                        padding: NEON_THEME.spacing.lg,
                        borderRadius: NEON_THEME.layout.radius.lg,
                        position: 'sticky',
                        top: NEON_THEME.spacing.lg,
                        border: `1px solid ${NEON_THEME.colors.border.default}`
                    }}>
                        <div style={{ marginBottom: NEON_THEME.spacing.lg }}>
                            <div style={{ fontSize: NEON_THEME.typography.size.sm, fontWeight: 'bold', marginBottom: NEON_THEME.spacing.sm, color: NEON_THEME.colors.text.primary }}>홈/원정 필터</div>
                            <div style={{ display: 'flex', gap: NEON_THEME.spacing.sm }}>
                                {(['all', 'home', 'away'] as const).map(loc => (
                                    <Button
                                        key={loc}
                                        onClick={() => handleFilterChange(loc)}
                                        variant={location === loc ? 'primary' : 'default'}
                                        size="sm"
                                        style={{ flex: 1 }}
                                    >
                                        {loc === 'all' ? '전체' : loc === 'home' ? '홈' : '원정'}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: `0.5px solid ${NEON_THEME.colors.border.default}`, margin: `${NEON_THEME.spacing.lg} 0` }} />

                        {/* Combined Filters */}
                        <TeamMatchFilters
                            selectedMatchTypes={selectedMatchTypes}
                            onTypeChange={handleTypeChange}
                            availableOdds={availableOdds}
                            selectedOdds={selectedOdds}
                            onOddsChange={handleOddsChange}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
