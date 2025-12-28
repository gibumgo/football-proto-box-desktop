import React from 'react';
import type { BetinfoOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
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
    };
    disabled?: boolean;
}

export const BetinfoConfigForm: React.FC<BetinfoConfigFormProps> = ({ config, handlers, disabled }) => {
    return (
        <div style={styles.container}>
            <div style={styles.formGroup}>
                <Input
                    label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_YEAR}
                    type="number"
                    value={config.year}
                    onChange={(e) => handlers.handleYearChange(parseInt(e.target.value))}
                    disabled={disabled}
                    fullWidth
                />
            </div>

            <div style={styles.formGroup}>
                <RadioGroup
                    label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_COLLECTION_TYPE}
                    value={config.collectionType || 'recent'}
                    onChange={(value) => handlers.handleCollectionTypeChange(value as any)}
                    disabled={disabled}
                    direction="column" // Better for narrow sidebar
                    options={[
                        { label: TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RECENT, value: 'recent' },
                        { label: TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.TYPE_RANGE, value: 'range' }
                    ]}
                />
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
                <div style={styles.row}>
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_START_ROUND}
                        type="text"
                        maxLength={3}
                        value={config.startRound}
                        onChange={(e) => handlers.handleStartRoundChange(e.target.value)}
                        disabled={disabled}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.PLACEHOLDER_START_ROUND}
                        fullWidth
                    />
                    <Input
                        label={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.LABEL_END_ROUND}
                        type="text"
                        maxLength={3}
                        value={config.endRound}
                        onChange={(e) => handlers.handleEndRoundChange(e.target.value)}
                        disabled={disabled}
                        placeholder={TEXTS.CRAWLER.CONTROL_PANEL.BETINFO.PLACEHOLDER_END_ROUND}
                        fullWidth
                    />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: NEON_THEME.spacing.md
    } as React.CSSProperties,
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    } as React.CSSProperties,
    row: {
        display: 'flex',
        gap: NEON_THEME.spacing.md
    } as React.CSSProperties
};
