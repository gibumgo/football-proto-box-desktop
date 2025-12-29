import React from 'react';
import type { MappingOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { NEON_THEME } from '@/domain/design/designTokens';

interface MappingConfigFormProps {
    config: Partial<MappingOptions>;
    handlers: {
        handleTaskChange: (task: 'leagues' | 'teams') => void;
    };
    disabled?: boolean;
}

export const MappingConfigForm: React.FC<MappingConfigFormProps> = ({ config, handlers, disabled }) => {
    return (
        <div style={styles.container}>
            <div style={styles.infoBox}>
                {config.task === 'leagues' ? (
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.DESC_MAP_LEAGUES}</span>
                ) : (
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.DESC_MAP_TEAMS}</span>
                )}
            </div>

            <RadioGroup
                label={TEXTS.CRAWLER.CONTROL_PANEL.FLASHSCORE.LABEL_TASK_TYPE}
                value={config.task || 'leagues'}
                onChange={(value) => handlers.handleTaskChange(value as any)}
                disabled={disabled}
                options={[
                    { label: TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.BTN_MAP_LEAGUES, value: 'leagues' },
                    { label: TEXTS.CRAWLER.CONTROL_PANEL.MAPPING.BTN_MAP_TEAMS, value: 'teams' }
                ]}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: NEON_THEME.spacing.md
    } as React.CSSProperties,
    infoBox: {
        padding: '12px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: NEON_THEME.layout.radius.sm,
        borderLeft: `2px solid ${NEON_THEME.colors.neon.cyan}`,
        fontSize: NEON_THEME.typography.size.sm,
        color: NEON_THEME.colors.text.secondary
    } as React.CSSProperties
};
