import { useState, useCallback } from 'react';
import type { AdvancedOptions } from '@/types/crawler';

export function useAdvancedForm(initialConfig: Partial<AdvancedOptions>) {
    const [config, setConfig] = useState<AdvancedOptions>({
        headless: true,
        debug: false,
        timeout: 300,
        outputDir: './data',
        ...initialConfig
    });

    const updateConfig = useCallback((updates: Partial<AdvancedOptions>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const handleHeadlessChange = useCallback((headless: boolean) => {
        updateConfig({ headless });
    }, [updateConfig]);

    const handleDebugChange = useCallback((debug: boolean) => {
        updateConfig({ debug });
    }, [updateConfig]);

    const handleTimeoutChange = useCallback((timeout: number) => {
        updateConfig({ timeout });
    }, [updateConfig]);

    const handleOutputDirChange = useCallback((outputDir: string) => {
        updateConfig({ outputDir });
    }, [updateConfig]);

    return {
        config,
        updateConfig,
        handlers: {
            handleHeadlessChange,
            handleDebugChange,
            handleTimeoutChange,
            handleOutputDirChange
        }
    };
}
