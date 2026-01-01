import React, { useEffect } from 'react';
import { InteractiveSelect } from '@/components/ui/InteractiveSelect';
import { useFlashscoreDiscovery } from '@/hooks/crawler/useFlashscoreDiscovery';

interface LeagueSelectProps {
    countrySlug: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const LeagueSelect: React.FC<LeagueSelectProps> = ({ countrySlug, value, onChange, disabled }) => {
    const { leagues, isLoadingLeagues, discoverLeagues, error } = useFlashscoreDiscovery();

    useEffect(() => {
        if (countrySlug) {
            discoverLeagues(countrySlug);
        }
    }, [countrySlug, discoverLeagues]);

    const options = leagues.map(l => ({
        label: l.name,
        value: l.slug
    }));

    return (
        <InteractiveSelect
            label="League"
            value={value}
            onChange={(val) => onChange(val)}
            disabled={disabled || !countrySlug || isLoadingLeagues}
            placeholder={isLoadingLeagues ? 'Loading...' : (error ? 'Error loading' : (leagues.length === 0 && countrySlug ? 'No leagues found' : 'Select League'))}
            searchable={true}
            options={options}
            fullWidth
        />
    );
};
