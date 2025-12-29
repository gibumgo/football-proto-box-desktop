import React from 'react';
import { useArchive } from '@/hooks/useArchive';
import { NEON_THEME } from '@/domain/design/designTokens';
import { RoundReviewStats } from '@/components/archive/RoundReviewStats';
import { MatchTable } from '@/components/archive/MatchTable';
import { MetricCard } from '@/components/crawler/MetricCard';

export function ArchiveDashboard() {
    const { availableRounds, selectedRound, data, loading, error, changeRound } = useArchive();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: NEON_THEME.colors.bg.app,
            padding: '24px',
            gap: '24px',
            color: NEON_THEME.colors.text.primary,
            fontFamily: NEON_THEME.typography.fontFamily.sans,
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: NEON_THEME.colors.bg.panel,
                borderRadius: '16px',
                border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                boxShadow: NEON_THEME.effects.shadow.md
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: NEON_THEME.colors.text.primary,
                        textTransform: 'uppercase'
                    }}>
                        Archive Dashboard
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: NEON_THEME.colors.text.secondary }}>Select Round:</span>
                        <select
                            value={selectedRound || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeRound(Number(e.target.value))}
                            style={{
                                backgroundColor: NEON_THEME.colors.bg.surface,
                                color: NEON_THEME.colors.text.primary,
                                border: `1px solid ${NEON_THEME.colors.border.default}`,
                                borderRadius: '44px',
                                padding: '4px 12px',
                                fontSize: '14px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {availableRounds.map(round => (
                                <option key={round} value={round}>Round {round}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {error && (
                        <div style={{
                            fontSize: '12px',
                            color: NEON_THEME.colors.status.error,
                            padding: '4px 12px',
                            backgroundColor: 'rgba(248, 113, 113, 0.1)',
                            borderRadius: '4px',
                            border: `1px solid ${NEON_THEME.colors.status.error}`
                        }}>
                            Error: {error}
                        </div>
                    )}

                    {loading && (
                        <div style={{
                            fontSize: '12px',
                            color: NEON_THEME.colors.status.warning,
                            animation: 'pulse 1.5s infinite'
                        }}>
                            LOADING DATA...
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div style={{
                display: 'flex',
                flex: 1,
                gap: '24px',
                overflow: 'hidden'
            }}>
                {/* Main Table Panel */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: NEON_THEME.colors.bg.panel,
                    borderRadius: '16px',
                    border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                    overflow: 'hidden'
                }}>
                    <MatchTable matches={data?.matches || []} />
                </div>

                {/* Right Stats Panel */}
                <div style={{
                    width: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{
                        padding: '20px',
                        backgroundColor: NEON_THEME.colors.bg.panel,
                        borderRadius: '16px',
                        border: `1px solid ${NEON_THEME.colors.border.default}`,
                        boxShadow: NEON_THEME.effects.shadow.md
                    }}>
                        <RoundReviewStats stats={data?.stats} />
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <MetricCard
                            title="Total Matches"
                            value={data?.stats?.totalMatches?.toString() || '0'}
                            unit="games"
                            accent="cyan"
                        />
                        <MetricCard
                            title="Finished"
                            value={data?.stats?.finishedMatches?.toString() || '0'}
                            unit="games"
                            accent="green"
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

export default ArchiveDashboard;
