import React from 'react';
import type { BetinfoOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { NEON_THEME } from '@/domain/design/designTokens';

interface BetinfoConfigFormProps {
    config: Partial<BetinfoOptions>;
    // Handlers mapped from the Hook
    handlers: {
        handleYearChange: (year: number) => void;
        handleCollectionTypeChange: (type: 'recent' | 'range' | 'rounds') => void;
        handleRecentCountChange: (count: number) => void;
        handleStartRoundChange: (round: string) => void;
        handleEndRoundChange: (round: string) => void;
        handleSkipExistingChange: (skip: boolean) => void;
    };
    disabled?: boolean;
}

export const BetinfoConfigForm: React.FC<BetinfoConfigFormProps> = ({ config, handlers, disabled }) => {
    const isRangeMode = config.collectionType === 'range';
    const isError = isRangeMode && parseInt(config.startRound || '0') > parseInt(config.endRound || '0');

    return (
        <div style={styles.container}>
            {/* Global Session Context: Year Banner */}
            <div style={{
                backgroundColor: 'rgba(34, 211, 238, 0.05)',
                borderLeft: `3px solid ${NEON_THEME.colors.neon.cyan}`,
                padding: '12px 16px',
                borderRadius: '0 8px 8px 0',
                marginBottom: NEON_THEME.spacing.sm,
            }}>
                <div style={{ fontSize: '11px', color: NEON_THEME.colors.text.muted, marginBottom: '4px', fontWeight: 600 }}>CRAWLING SEASON</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                        type="number"
                        value={config.year}
                        onChange={(e) => handlers.handleYearChange(parseInt(e.target.value))}
                        disabled={disabled}
                        transparent
                        style={{
                            fontSize: '20px',
                            fontWeight: 800,
                            color: NEON_THEME.colors.neon.cyan,
                            width: '100px',
                            padding: 0,
                            letterSpacing: '1px'
                        }}
                    />
                    <span style={{ fontSize: '14px', color: NEON_THEME.colors.text.muted }}>YEAR</span>
                </div>
            </div>

            {/* Segmented Control for Collection Type */}
            <div style={styles.formGroup}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: NEON_THEME.colors.text.muted, marginBottom: '8px' }}>
                    {TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_COLLECTION_TYPE}
                </div>
                <div style={{
                    display: 'flex',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '2px',
                    border: `1px solid ${NEON_THEME.colors.border.subtle}`
                }}>
                    {['recent', 'range'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handlers.handleCollectionTypeChange(mode as any)}
                            disabled={disabled}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                backgroundColor: config.collectionType === mode ? NEON_THEME.colors.neon.cyan : 'transparent',
                                color: config.collectionType === mode ? NEON_THEME.colors.bg.app : NEON_THEME.colors.text.secondary
                            }}
                        >
                            {mode === 'recent' ? TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RECENT : TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RANGE}
                        </button>
                    ))}
                </div>
            </div>

            {config.collectionType === 'recent' ? (
                <div style={styles.formGroup}>
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_RECENT_COUNT}
                        type="number"
                        value={config.recent}
                        onChange={(e) => handlers.handleRecentCountChange(parseInt(e.target.value))}
                        disabled={disabled}
                        fullWidth
                    />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.sm }}>
                    <div style={styles.row}>
                        <Input
                            label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_START_ROUND}
                            type="text"
                            maxLength={3}
                            value={config.startRound}
                            onChange={(e) => handlers.handleStartRoundChange(e.target.value)}
                            disabled={disabled}
                            placeholder="001"
                            fullWidth
                            error={isError}
                            style={isError ? { boxShadow: `0 0 10px ${NEON_THEME.colors.status.error}44` } : {}}
                        />
                        <div style={{ alignSelf: 'flex-end', paddingBottom: '12px', opacity: 0.5 }}>→</div>
                        <Input
                            label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_END_ROUND}
                            type="text"
                            maxLength={3}
                            value={config.endRound}
                            onChange={(e) => handlers.handleEndRoundChange(e.target.value)}
                            disabled={disabled}
                            placeholder="050"
                            fullWidth
                        />
                    </div>

                    {/* Visual Timeline Bar */}
                    <div style={{
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '2px',
                        position: 'relative',
                        marginTop: '4px',
                        overflow: 'hidden'
                    }}>
                        {!isError && config.startRound && config.endRound && (
                            <div style={{
                                position: 'absolute',
                                left: `${Math.min(100, (parseInt(config.startRound) / 550) * 100)}%`,
                                width: `${Math.max(2, ((parseInt(config.endRound) - parseInt(config.startRound)) / 550) * 100)}%`,
                                height: '100%',
                                backgroundColor: NEON_THEME.colors.neon.cyan,
                                boxShadow: `0 0 8px ${NEON_THEME.colors.neon.cyan}88`
                            }} />
                        )}
                    </div>
                    <div style={{ fontSize: '10px', color: NEON_THEME.colors.text.muted, textAlign: 'center' }}>
                        Visual Range Representation (001 - 550+)
                    </div>
                </div>
            )}

            <div style={{ ...styles.formGroup, marginTop: '8px' }}>
                <Checkbox
                    label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_SKIP_EXISTING}
                    checked={config.skipExisting || false}
                    onChange={handlers.handleSkipExistingChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: NEON_THEME.spacing.lg,
        padding: NEON_THEME.spacing.xs
    } as React.CSSProperties,
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    } as React.CSSProperties,
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: NEON_THEME.spacing.sm
    } as React.CSSProperties
};
