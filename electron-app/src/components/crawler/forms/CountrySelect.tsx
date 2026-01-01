import React, { useEffect } from 'react';
import { InteractiveSelect } from '@/components/ui/InteractiveSelect';
import { useFlashscoreDiscovery } from '@/hooks/crawler/useFlashscoreDiscovery';

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, disabled }) => {
    const { countries, isLoadingCountries, discoverCountries, error } = useFlashscoreDiscovery();

    useEffect(() => {
        discoverCountries();
    }, [discoverCountries]);

    const options = countries.map(c => ({
        label: c.name,
        value: c.slug
    }));

    return (
        <InteractiveSelect
            label="Country / Region"
            value={value}
            onChange={(val) => onChange(val)}
            disabled={disabled || isLoadingCountries}
            placeholder={isLoadingCountries ? 'Loading...' : (error ? 'Error loading' : 'Select Country')}
            searchable={true}
            options={options}
            fullWidth
        />
    );
};
