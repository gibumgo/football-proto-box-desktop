import React, { useMemo } from 'react';
import { InteractiveSelect } from '@/components/ui/InteractiveSelect';

interface SeasonSelectProps {
    value: string;
    onChange: (season: string) => void;
    disabled?: boolean;
}

export const SeasonSelect: React.FC<SeasonSelectProps> = ({ value, onChange, disabled }) => {

    const seasonOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const options = [];
        for (let i = 0; i < 15; i++) {
            const startYear = currentYear - i;
            const endYear = startYear + 1;
            const label = `${startYear}-${endYear}`;
            options.push({ label, value: label });
        }
        return options;
    }, []);

    return (
        <InteractiveSelect
            label="Season"
            value={value}
            onChange={onChange}
            options={seasonOptions}
            disabled={disabled}
            placeholder="Select Season"
            searchable={true}
            fullWidth
        />
    );
};
