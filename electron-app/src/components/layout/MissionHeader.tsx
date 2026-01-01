import React from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';
import { Button } from '@/components/ui/Button';
import { TEXTS } from '@/constants/uiTexts';

interface MissionHeaderProps {
    isRunning: boolean;
    outputDir: string;
    onSelectDir: () => void;
    logsCount: number;
    onStart: () => void;
    onStop: () => void;
    disabled?: boolean;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
    isRunning,
    outputDir,
    onSelectDir,
    logsCount,
    onStart,
    onStop,
    disabled = false
}) => {
    return (
        <div style={{
            height: '56px', // Increased slightly to accommodate buttons
            backgroundColor: NEON_THEME.colors.bg.app,
            borderBottom: `1px solid ${NEON_THEME.colors.border.subtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${NEON_THEME.spacing.lg}`,
            boxSizing: 'border-box'
        }}>
            {/* Left: System Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: NEON_THEME.spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isRunning ? NEON_THEME.colors.status.success : NEON_THEME.colors.text.muted,
                        boxShadow: isRunning ? `0 0 8px ${NEON_THEME.colors.status.success}` : 'none',
                        transition: 'all 0.3s ease'
                    }} />
                    <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: isRunning ? NEON_THEME.colors.text.primary : NEON_THEME.colors.text.secondary
                    }}>
                        {isRunning ? 'MISSION ACTIVE' : 'SYSTEM IDLE'}
                    </span>
                </div>
            </div>

            {/* Right: Controls & Storage */}
            <div style={{ display: 'flex', alignItems: 'center', gap: NEON_THEME.spacing.xl }}>

                {/* Action Buttons (Mini) */}
                <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
                    {!isRunning ? (
                        <Button
                            variant="primary"
                            onClick={onStart}
                            disabled={disabled}
                            style={{
                                height: '32px',
                                fontSize: '12px',
                                padding: '0 24px',
                                minWidth: '100px',
                                fontWeight: 700
                            }}
                        >
                            ▷ {TEXTS.CRAWLER.CONTROL_PANEL.BTN_START}
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            onClick={onStop}
                            style={{
                                height: '32px',
                                fontSize: '12px',
                                padding: '0 24px',
                                minWidth: '100px',
                                fontWeight: 700
                            }}
                        >
                            {TEXTS.CRAWLER.CONTROL_PANEL.BTN_STOP}
                        </Button>
                    )}
                </div>

                {/* Metrics Mini-Summary */}
                <div style={{ display: 'flex', gap: NEON_THEME.spacing.lg, fontSize: '11px', color: NEON_THEME.colors.text.secondary }}>
                    <span>LOGS: <strong style={{ color: NEON_THEME.colors.text.primary }}>{logsCount}</strong></span>
                </div>

                {/* Storage Control */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: NEON_THEME.spacing.sm,
                    fontSize: '11px',
                    borderLeft: `1px solid ${NEON_THEME.colors.border.subtle}`,
                    paddingLeft: NEON_THEME.spacing.md
                }}>
                    <div
                        onClick={!isRunning ? onSelectDir : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: NEON_THEME.colors.neon.cyan,
                            cursor: isRunning ? 'default' : 'pointer',
                            border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                            transition: 'all 0.2s',
                        }}
                        title={outputDir}
                    >
                        <span style={{ fontFamily: NEON_THEME.typography.fontFamily.mono }}>.../{outputDir.split('/').pop()}</span>
                        <span style={{ opacity: 0.5 }}>📂</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
