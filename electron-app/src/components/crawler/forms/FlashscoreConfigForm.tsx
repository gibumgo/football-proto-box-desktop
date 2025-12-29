import React from 'react';
import type { FlashscoreOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { NEON_THEME } from '@/domain/design/designTokens';

interface FlashscoreConfigFormProps {
    config: Partial<FlashscoreOptions>;
    // Handlers mapped from the Hook
    handlers: {
        handleUrlChange: (url: string) => void;
        handleTaskChange: (task: string) => void;
        handleSeasonChange: (season: string) => void;
        handleStartRoundChange: (round: number) => void;
        handleEndRoundChange: (round: number) => void;
        handleResumeChange: (resume: boolean) => void;
    };
    disabled?: boolean;
}

export const FlashscoreConfigForm: React.FC<FlashscoreConfigFormProps> = ({ config, handlers, disabled }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.md }}>
            <Select
                label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TASK_TYPE}
                value={config.task}
                onChange={(e) => handlers.handleTaskChange(e.target.value)}
                disabled={disabled}
                options={[
                    { label: TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.TYPE_METADATA, value: 'metadata' },
                    { label: TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.TYPE_MATCHES, value: 'matches' }
                ]}
                fullWidth
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Input
                    label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TARGET_URL}
                    type="text"
                    value={config.url}
                    onChange={(e) => handlers.handleUrlChange(e.target.value)}
                    disabled={disabled}
                    placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_TARGET_URL}
                    fullWidth
                />
                <div style={{
                    fontSize: '11px',
                    color: NEON_THEME.colors.text.secondary,
                    lineHeight: '1.4',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '8px',
                    borderRadius: NEON_THEME.layout.radius.sm,
                    borderLeft: `2px solid ${NEON_THEME.colors.neon.cyan}`
                }}>
                    {config.task === 'metadata' ? (
                        <>
                            <strong style={{ color: NEON_THEME.colors.neon.cyan }}>{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_TITLE}</strong><br />
                            {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_DESC}<br />
                            {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_METADATA_EX}
                        </>
                    ) : (
                        <>
                            <strong style={{ color: NEON_THEME.colors.neon.cyan }}>{TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_TITLE}</strong><br />
                            {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_DESC}<br />
                            {TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.GUIDE_MATCHES_EX}
                        </>
                    )}
                </div>
            </div>

            {config.task === 'matches' ? (
                <div style={{ display: 'flex', gap: NEON_THEME.spacing.md }}>
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_SEASON}
                        type="text"
                        value={config.season}
                        onChange={(e) => handlers.handleSeasonChange(e.target.value)}
                        disabled={disabled}
                        fullWidth
                    />
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_START_ROUND}
                        type="number"
                        min={1}
                        max={38}
                        value={config.fsStartRound || ''}
                        onChange={(e) => handlers.handleStartRoundChange(parseInt(e.target.value))}
                        disabled={disabled}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_START_ROUND}
                        fullWidth
                    />
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_END_ROUND}
                        type="number"
                        min={1}
                        max={38}
                        value={config.fsEndRound || ''}
                        onChange={(e) => handlers.handleEndRoundChange(parseInt(e.target.value))}
                        disabled={disabled}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.PLACEHOLDER_END_ROUND}
                        fullWidth
                    />
                </div>
            ) : (
                <Input
                    label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_SEASON}
                    type="text"
                    value={config.season}
                    onChange={(e) => handlers.handleSeasonChange(e.target.value)}
                    disabled={disabled}
                />
            )}

            <Checkbox
                label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.CHECKBOX_RESUME}
                checked={!!config.resume}
                onChange={(checked) => handlers.handleResumeChange(checked)}
                disabled={disabled}
            />
        </div>
    );
};
