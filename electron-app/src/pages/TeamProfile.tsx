import { Match } from '../domain/models/match/Match';

import { MatchListTable } from '../components/features/MatchListTable';
import { TeamMatchFilters } from '../components/features/TeamMatchFilters';
import { COLORS, TYPOGRAPHY } from '../domain/design/theme';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { TeamNameNormalizer } from '../domain/operations/normalize/TeamNameNormalizer';

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
            padding: '20px',
            backgroundColor: COLORS.SURFACE,
            color: COLORS.TEXT_PRIMARY,
            overflowY: 'auto',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: COLORS.TEXT_SECONDARY,
                            cursor: 'pointer',
                            fontSize: TYPOGRAPHY.SIZE.LG
                        }}
                    >
                        ← 뒤로
                    </button>
                    <h2 style={{ margin: 0, fontSize: TYPOGRAPHY.SIZE.XXL, fontWeight: TYPOGRAPHY.WEIGHT.BOLD }}>
                        {displayName} <span style={{ fontSize: TYPOGRAPHY.SIZE.MD, color: COLORS.TEXT_SECONDARY, fontWeight: TYPOGRAPHY.WEIGHT.REGULAR }}>분석</span>
                    </h2>
                </div>
            </div>

            {/* 1. Top: Stats Summary (Component A) */}
            <div style={{ marginBottom: '24px' }}>
                {/* 최근 흐름 & 통계 요약 */}
                <div style={{
                    backgroundColor: COLORS.PANEL,
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap'
                }}>
                    {/* Recent Form */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            fontSize: TYPOGRAPHY.SIZE.SM,
                            color: COLORS.TEXT_SECONDARY,
                            textTransform: 'uppercase',
                            fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD
                        }}>
                            최근 흐름
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {stats.recentForm.map((form: string, idx: number) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                                        fontSize: TYPOGRAPHY.SIZE.XS,
                                        backgroundColor: form === 'W' ? `${COLORS.NEON_GREEN}20` : form === 'D' ? `${COLORS.NEON_YELLOW}20` : `${COLORS.NEON_RED}20`,
                                        color: form === 'W' ? COLORS.NEON_GREEN : form === 'D' ? COLORS.NEON_YELLOW : COLORS.NEON_RED,
                                        border: `1px solid ${form === 'W' ? COLORS.NEON_GREEN : form === 'D' ? COLORS.NEON_YELLOW : COLORS.NEON_RED}`
                                    }}
                                >
                                    {form}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '24px', backgroundColor: COLORS.BORDER }}></div>

                    {/* Quick Stats Row */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                            <span style={{ fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY }}>전체 승률</span>
                            <div style={{ fontSize: TYPOGRAPHY.SIZE.LG, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY }}>{stats.overall.winRate.toFixed(1)}%</div>
                        </div>
                        <div>
                            <span style={{ fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY }}>평균 득점</span>
                            <div style={{ fontSize: TYPOGRAPHY.SIZE.LG, fontWeight: 'bold', color: COLORS.NEON_CYAN }}>{stats.avgGoalsScored.toFixed(2)}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY }}>평균 실점</span>
                            <div style={{ fontSize: TYPOGRAPHY.SIZE.LG, fontWeight: 'bold', color: COLORS.NEON_RED }}>{stats.avgGoalsConceded.toFixed(2)}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY }}>오버 2.5</span>
                            <div style={{ fontSize: TYPOGRAPHY.SIZE.LG, fontWeight: 'bold', color: COLORS.NEON_PURPLE }}>{stats.over25Rate.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Bottom: Content Area */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                {/* Left: Matches Table (Main Content) - Flex 1 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: TYPOGRAPHY.SIZE.LG, fontWeight: TYPOGRAPHY.WEIGHT.BOLD }}>경기 목록</h3>
                        <span style={{ fontSize: TYPOGRAPHY.SIZE.SM, color: COLORS.TEXT_SECONDARY }}>총 {filteredMatchesLength ?? paginatedMatches.length}경기</span> {/* Ideally use filtered count */}
                    </div>

                    <MatchListTable
                        matches={paginatedMatches}
                        onSort={handleSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    border: `1px solid ${COLORS.BORDER}`,
                                    backgroundColor: 'transparent',
                                    color: currentPage === 1 ? COLORS.TEXT_MUTED : COLORS.TEXT_PRIMARY,
                                    cursor: currentPage === 1 ? 'default' : 'pointer'
                                }}
                            >
                                이전
                            </button>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: COLORS.TEXT_SECONDARY,
                                fontSize: TYPOGRAPHY.SIZE.SM
                            }}>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    border: `1px solid ${COLORS.BORDER}`,
                                    backgroundColor: 'transparent',
                                    color: currentPage === totalPages ? COLORS.TEXT_MUTED : COLORS.TEXT_PRIMARY,
                                    cursor: currentPage === totalPages ? 'default' : 'pointer'
                                }}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Filters (Sidebar) - Fixed Width */}
                <div style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{
                        backgroundColor: COLORS.PANEL,
                        padding: '16px',
                        borderRadius: '8px',
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: TYPOGRAPHY.SIZE.SM, fontWeight: 'bold', marginBottom: '8px', color: COLORS.TEXT_PRIMARY }}>홈/원정 필터</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {(['all', 'home', 'away'] as const).map(loc => (
                                    <button
                                        key={loc}
                                        onClick={() => handleFilterChange(loc)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: location === loc ? COLORS.BUTTON_PRIMARY : COLORS.BUTTON_SECONDARY,
                                            color: location === loc ? '#000' : COLORS.TEXT_PRIMARY,
                                            fontWeight: location === loc ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            fontSize: TYPOGRAPHY.SIZE.XS
                                        }}
                                    >
                                        {loc === 'all' ? '전체' : loc === 'home' ? '홈' : '원정'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: `0.5px solid ${COLORS.BORDER}`, margin: '16px 0' }} />

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
