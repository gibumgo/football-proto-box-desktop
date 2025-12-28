import { useState, useCallback } from 'react';
import type { FlashscoreOptions } from '../../types/crawler';

export function useFlashscoreForm(initialConfig: Partial<FlashscoreOptions>) {
    const [config, setConfig] = useState<Partial<FlashscoreOptions>>(initialConfig);

    const updateConfig = useCallback((updates: Partial<FlashscoreOptions>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const handleUrlChange = useCallback((url: string) => {
        const updates: Partial<FlashscoreOptions> = { url };

        // Smart Season Detection Logic
        // Extracts year from URL like "...-2024-2025/..." -> "24-25"
        const seasonMatch = url.match(/-(\d{2})(\d{2})-(\d{2})(\d{2})\//);
        if (seasonMatch) {
            updates.season = `${seasonMatch[2]}-${seasonMatch[4]}`;
        }

        updateConfig(updates);
    }, [updateConfig]);

    const handleTaskChange = useCallback((task: string) => {
        updateConfig({ task: task as FlashscoreOptions['task'] });
    }, [updateConfig]);

    const handleSeasonChange = useCallback((season: string) => {
        updateConfig({ season });
    }, [updateConfig]);

    const handleStartRoundChange = useCallback((round: number) => {
        updateConfig({ fsStartRound: round });
    }, [updateConfig]);

    const handleEndRoundChange = useCallback((round: number) => {
        updateConfig({ fsEndRound: round });
    }, [updateConfig]);

    const handleResumeChange = useCallback((resume: boolean) => {
        updateConfig({ resume });
    }, [updateConfig]);

    return {
        config,
        updateConfig,
        handlers: {
            handleUrlChange,
            handleTaskChange,
            handleSeasonChange,
            handleStartRoundChange,
            handleEndRoundChange,
            handleResumeChange
        }
    };
}
