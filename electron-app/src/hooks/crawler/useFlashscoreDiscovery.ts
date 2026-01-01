import { useState, useCallback } from 'react';
import type { FlashscoreCountry, FlashscoreLeague } from '@/types/crawler';

interface UseFlashscoreDiscoveryReturn {
    countries: FlashscoreCountry[];
    leagues: FlashscoreLeague[];
    isLoadingCountries: boolean;
    isLoadingLeagues: boolean;
    error: string | null;
    discoverCountries: () => Promise<void>;
    discoverLeagues: (countrySlug: string) => Promise<void>;
}

export function useFlashscoreDiscovery(): UseFlashscoreDiscoveryReturn {
    const [countries, setCountries] = useState<FlashscoreCountry[]>([]);
    const [leagues, setLeagues] = useState<FlashscoreLeague[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const discoverCountries = useCallback(async () => {
        setIsLoadingCountries(true);
        setError(null);
        try {
            const result = await window.api.crawler.discover('countries');
            if (result.success && result.data) {
                setCountries(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch countries');
            }
        } catch (err: any) {
            setError(err.message || 'Error fetching countries');
            setCountries([]);
        } finally {
            setIsLoadingCountries(false);
        }
    }, []);

    const discoverLeagues = useCallback(async (countrySlug: string) => {
        if (!countrySlug) {
            setLeagues([]);
            return;
        }

        setIsLoadingLeagues(true);
        setLeagues([]); // [FIX] Clear previous leagues immediately to prevent mixing data
        setError(null);
        try {
            const result = await window.api.crawler.discover('leagues', countrySlug);
            if (result.success && result.data) {
                setLeagues(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch leagues');
            }
        } catch (err: any) {
            if (err.message && err.message.includes('No leagues found')) {
                setLeagues([]);
            } else {
                setError(err.message || 'Error fetching leagues');
                setLeagues([]);
            }
        } finally {
            setIsLoadingLeagues(false);
        }
    }, []);

    return {
        countries,
        leagues,
        isLoadingCountries,
        isLoadingLeagues,
        error,
        discoverCountries,
        discoverLeagues
    };
}
