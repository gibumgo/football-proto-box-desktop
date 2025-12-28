import { useState, useCallback } from 'react';
import type { BetinfoOptions } from '@/types/crawler';

export function useBetinfoForm(initialConfig: Partial<BetinfoOptions>) {
    const [config, setConfig] = useState<Partial<BetinfoOptions>>({
        collectionType: 'recent',
        recent: 5,
        startRound: '040',
        endRound: '050',
        rounds: '',
        year: new Date().getFullYear(),
        ...initialConfig
    });

    const updateConfig = useCallback((updates: Partial<BetinfoOptions>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const handleYearChange = useCallback((year: number) => {
        updateConfig({ year });
    }, [updateConfig]);

    const handleCollectionTypeChange = useCallback((type: 'recent' | 'range' | 'rounds') => {
        updateConfig({ collectionType: type });
    }, [updateConfig]);

    const handleRecentCountChange = useCallback((count: number) => {
        updateConfig({ recent: count });
    }, [updateConfig]);

    const handleStartRoundChange = useCallback((round: string) => {
        // 숫자만 입력 허용
        const sanitized = round.replace(/[^0-9]/g, '');
        updateConfig({ startRound: sanitized });
    }, [updateConfig]);

    const handleEndRoundChange = useCallback((round: string) => {
        // 숫자만 입력 허용
        const sanitized = round.replace(/[^0-9]/g, '');
        updateConfig({ endRound: sanitized });
    }, [updateConfig]);

    return {
        config,
        updateConfig,
        handlers: {
            handleYearChange,
            handleCollectionTypeChange,
            handleRecentCountChange,
            handleStartRoundChange,
            handleEndRoundChange
        }
    };
}
