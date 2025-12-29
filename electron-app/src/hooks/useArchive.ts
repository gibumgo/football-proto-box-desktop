import { useState, useEffect, useCallback } from 'react';
import type { ArchiveData } from '../types/archive';

export function useArchive() {
    const [availableRounds, setAvailableRounds] = useState<number[]>([]);
    const [selectedRound, setSelectedRound] = useState<number | null>(null);
    const [data, setData] = useState<ArchiveData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch available rounds on mount
    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const result = await window.api.archive.getAvailableRounds();
                if (result.success) {
                    setAvailableRounds(result.rounds);
                    if (result.rounds.length > 0) {
                        setSelectedRound(result.rounds[0]);
                    }
                } else {
                    setError('Failed to fetch rounds: ' + result.error);
                }
            } catch (err) {
                setError('Error fetching rounds: ' + err);
            }
        };

        fetchRounds();
    }, []);

    // Fetch data when selected round changes
    const fetchArchiveData = useCallback(async (round: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await window.api.archive.getRoundData(round);
            if (result && result.stats) {
                setData(result);
            } else {
                setError('No data found for selective round');
            }
        } catch (err) {
            setError('Error loading archive data: ' + err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedRound !== null) {
            fetchArchiveData(selectedRound);
        }
    }, [selectedRound, fetchArchiveData]);

    const changeRound = (round: number) => {
        setSelectedRound(round);
    };

    return {
        availableRounds,
        selectedRound,
        data,
        loading,
        error,
        changeRound,
        refresh: () => selectedRound && fetchArchiveData(selectedRound)
    };
}
