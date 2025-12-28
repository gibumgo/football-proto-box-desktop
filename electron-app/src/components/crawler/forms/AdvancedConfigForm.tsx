import React from 'react';
import type { AdvancedOptions } from '@/types/crawler';
import { TEXTS } from '@/constants/uiTexts';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { NEON_THEME } from '@/domain/design/designTokens';

interface AdvancedConfigFormProps {
    config: AdvancedOptions;
    handlers: {
        handleHeadlessChange: (checked: boolean) => void;
        handleDebugChange: (checked: boolean) => void;
        handleTimeoutChange: (timeout: number) => void;
        handleOutputDirChange: (dir: string) => void;
    };
    disabled?: boolean;
}

export const AdvancedConfigForm: React.FC<AdvancedConfigFormProps> = ({ config, handlers, disabled }) => {
    return (
        <div style={styles.container}>
            <Checkbox
                label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.CHECKBOX_HEADLESS}
                checked={config.headless}
                onChange={handlers.handleHeadlessChange}
                disabled={disabled}
            />

            <Checkbox
                label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.CHECKBOX_DEBUG}
                checked={config.debug}
                onChange={handlers.handleDebugChange}
                disabled={disabled}
            />

            <Input
                label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.LABEL_TIMEOUT}
                type="number"
                value={config.timeout}
                onChange={(e) => handlers.handleTimeoutChange(parseInt(e.target.value))}
                disabled={disabled}
                style={styles.inputShort}
            />

            <Input
                label={TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED.LABEL_OUTPUT_DIR}
                type="text"
                value={config.outputDir}
                onChange={(e) => handlers.handleOutputDirChange(e.target.value)}
                disabled={disabled}
                fullWidth
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
    inputShort: {
        maxWidth: '100px'
    } as React.CSSProperties
};
