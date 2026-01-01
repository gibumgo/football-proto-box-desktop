import React, { useState, useEffect } from 'react';
import type { FlashscoreOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { NEON_THEME } from '@/domain/design/designTokens';

// Components
import { FlashscoreDiscoveryWizard } from '../FlashscoreDiscoveryWizard';
import { SeasonSelect } from './SeasonSelect';

interface FlashscoreConfigFormProps {
    config: Partial<FlashscoreOptions>;
    handlers: {
        handleUrlChange: (url: string) => void;
        handleTaskChange: (task: string) => void;
        handleSeasonChange: (season: string) => void;
        handleCountryChange: (country: string) => void;
        handleLeagueChange: (league: string) => void;
        handleStartRoundChange: (round: number) => void;
        handleEndRoundChange: (round: number) => void;
        handleResumeChange: (resume: boolean) => void;
    };
    disabled?: boolean;
}

export const FlashscoreConfigForm: React.FC<FlashscoreConfigFormProps> = ({ config, handlers, disabled }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Auto-select integrated task when country/league are present
    useEffect(() => {
        if (config.country && config.league && config.task !== 'integrated' && !config.task) {
            handlers.handleTaskChange('integrated');
        }
    }, [config.country, config.league, config.task, handlers]);

    const taskOptions = [
        { id: 'integrated', label: 'FULL SEASON', icon: '🚀', desc: 'Integrated metadata & results' },
        { id: 'metadata', label: 'TEAMS ONLY', icon: '📋', desc: 'Teams & League metadata' },
        { id: 'matches', label: 'MATCHES ONLY', icon: '🏟️', desc: 'Match results & stats' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.lg }}>

            {/* 1. Discovery Wizard Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.md }}>
                <FlashscoreDiscoveryWizard
                    selectedCountry={config.country || ''}
                    selectedLeague={config.league || ''}
                    onSelectCountry={handlers.handleCountryChange}
                    onSelectLeague={handlers.handleLeagueChange}
                    disabled={disabled}
                />
            </div>

            {/* 2. Mode & Context Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.md }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: NEON_THEME.colors.text.muted, letterSpacing: '1px' }}>COLLECTION MODE</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: NEON_THEME.spacing.md }}>
                    {taskOptions.map(opt => {
                        const isSelected = config.task === opt.id;
                        const isRecommended = opt.id === 'integrated';
                        return (
                            <div
                                key={opt.id}
                                onClick={() => !disabled && handlers.handleTaskChange(opt.id)}
                                style={{
                                    padding: '16px 12px',
                                    backgroundColor: isSelected ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                    border: `1px solid ${isSelected ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.border.subtle}`,
                                    borderRadius: NEON_THEME.layout.radius.lg,
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow: isSelected ? `0 0 15px rgba(34, 211, 238, 0.15)` : 'none'
                                }}
                            >
                                {isRecommended && !isSelected && <div style={{ position: 'absolute', top: '-10px', fontSize: '10px', backgroundColor: NEON_THEME.colors.neon.green, color: 'black', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>BEST</div>}
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{opt.icon}</div>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.primary, marginBottom: '4px' }}>{opt.label}</div>
                                <div style={{ fontSize: '10px', color: NEON_THEME.colors.text.muted, lineHeight: '1.2' }}>{opt.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Season & Quick Settings Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: NEON_THEME.spacing.md,
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: NEON_THEME.layout.radius.lg,
                border: `1px solid ${NEON_THEME.colors.border.subtle}`
            }}>
                <SeasonSelect
                    value={config.season || `2024-2025`}
                    onChange={handlers.handleSeasonChange}
                    disabled={disabled || !config.league}
                />
                <div style={{ display: 'flex', gap: NEON_THEME.spacing.md, justifyContent: 'flex-end', paddingTop: '16px' }}>
                    <Checkbox
                        label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.CHECKBOX_RESUME}
                        checked={!!config.resume}
                        onChange={(checked) => handlers.handleResumeChange(checked)}
                        disabled={disabled || !config.league}
                    />
                </div>
            </div>

            {/* 4. Advanced Toggle & Section */}
            <div style={{ borderTop: `1px solid ${NEON_THEME.colors.border.subtle}`, paddingTop: NEON_THEME.spacing.md }}>
                <div
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                        fontSize: '11px',
                        color: NEON_THEME.colors.text.muted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = NEON_THEME.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = NEON_THEME.colors.text.muted}
                >
                    <span style={{ transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
                    {showAdvanced ? 'HIDE MANUAL OVERRIDES' : 'SHOW MANUAL OVERRIDES (URL / ROUNDS)'}
                </div>

                {showAdvanced && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.md, marginTop: NEON_THEME.spacing.md }}>
                        <Input
                            label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TARGET_URL}
                            type="text"
                            value={config.url}
                            onChange={(e) => handlers.handleUrlChange(e.target.value)}
                            disabled={disabled || (!!config.country && !!config.league)}
                            placeholder="Enter specific team/league URL..."
                            fullWidth
                            style={{ opacity: (config.country && config.league) ? 0.4 : 1 }}
                        />

                        <div style={{ display: 'flex', gap: NEON_THEME.spacing.md }}>
                            <Input
                                label="START ROUND"
                                type="number"
                                min={1}
                                max={38}
                                value={config.fsStartRound || ''}
                                onChange={(e) => handlers.handleStartRoundChange(parseInt(e.target.value))}
                                disabled={disabled}
                                placeholder="Auto"
                                fullWidth
                            />
                            <Input
                                label="END ROUND"
                                type="number"
                                min={1}
                                max={38}
                                value={config.fsEndRound || ''}
                                onChange={(e) => handlers.handleEndRoundChange(parseInt(e.target.value))}
                                disabled={disabled}
                                placeholder="Auto"
                                fullWidth
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
