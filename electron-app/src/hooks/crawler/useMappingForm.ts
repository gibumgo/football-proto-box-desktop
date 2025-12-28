import { useState, useCallback } from 'react';
import type { MappingOptions } from '@/types/crawler';

export function useMappingForm(initialConfig: Partial<MappingOptions>) {
    const [config, setConfig] = useState<Partial<MappingOptions>>({
        task: 'leagues',
        ...initialConfig
    });

    const updateConfig = useCallback((updates: Partial<MappingOptions>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const handleTaskChange = useCallback((task: 'leagues' | 'teams') => {
        updateConfig({ task });
    }, [updateConfig]);

    return {
        config,
        updateConfig,
        handlers: {
            handleTaskChange
        }
    };
}
