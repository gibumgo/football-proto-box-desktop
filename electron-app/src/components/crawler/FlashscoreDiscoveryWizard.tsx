import React, { useState, useMemo, useEffect } from 'react';
import { useFlashscoreDiscovery } from '@/hooks/crawler/useFlashscoreDiscovery';
import { NEON_THEME } from '@/domain/design/designTokens';
import { Input } from '@/components/ui/Input';

interface FlashscoreDiscoveryWizardProps {
    selectedCountry: string;
    selectedLeague: string;
    onSelectCountry: (slug: string) => void;
    onSelectLeague: (slug: string) => void;
    disabled?: boolean;
}

export const FlashscoreDiscoveryWizard: React.FC<FlashscoreDiscoveryWizardProps> = ({
    selectedCountry,
    selectedLeague,
    onSelectCountry,
    onSelectLeague,
    disabled
}) => {
    const {
        countries,
        leagues,
        isLoadingCountries,
        isLoadingLeagues,
        discoverCountries,
        discoverLeagues
    } = useFlashscoreDiscovery();

    const [searchTerm, setSearchTerm] = useState('');

    // Load countries on mount
    useEffect(() => {
        discoverCountries();
    }, [discoverCountries]);

    // Load leagues when country changes
    useEffect(() => {
        if (selectedCountry) {
            discoverLeagues(selectedCountry);
        }
    }, [selectedCountry, discoverLeagues]);

    // Filtered countries based on search
    const filteredCountries = useMemo(() => {
        if (!searchTerm) return countries;
        const lowerSearch = searchTerm.toLowerCase();
        return countries.filter(c =>
            c.name.toLowerCase().includes(lowerSearch) ||
            c.slug.toLowerCase().includes(lowerSearch)
        );
    }, [countries, searchTerm]);

    const activeCountryName = useMemo(() => {
        return countries.find(c => c.slug === selectedCountry)?.name || selectedCountry;
    }, [countries, selectedCountry]);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)',
            gap: NEON_THEME.spacing.md,
            width: '100%',
            height: '320px', // Fixed height to prevent layout shift
            backgroundColor: NEON_THEME.colors.bg.panel,
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            borderRadius: NEON_THEME.layout.radius.md,
            padding: '12px',
            overflow: 'hidden'
        }}>
            {/* Left Column: Countries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', overflow: 'hidden' }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: NEON_THEME.colors.text.muted,
                    paddingLeft: '4px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    letterSpacing: '1px'
                }}>
                    EXPLORE COUNTRIES
                </div>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                    <Input
                        placeholder="Search country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={disabled}
                        fullWidth
                        style={{
                            backgroundColor: NEON_THEME.colors.bg.app,
                            borderColor: NEON_THEME.colors.border.subtle,
                            fontSize: '13px',
                            padding: '6px 12px',
                            height: '32px'
                        }}
                    />
                    {searchTerm && (
                        <div
                            onClick={() => setSearchTerm('')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5, fontSize: '12px' }}
                        >✕</div>
                    )}
                </div>

                {/* Country List */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    {isLoadingCountries ? (
                        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '12px', animation: 'pulse 1.5s infinite' }}>Fetching database...</div>
                    ) : filteredCountries.length === 0 ? (
                        <div style={{ padding: '40px 10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕵️</div>
                            <div style={{ fontSize: '12px', color: NEON_THEME.colors.text.muted, marginBottom: '12px' }}>No matches found</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                            {filteredCountries.map(country => {
                                const isSelected = selectedCountry === country.slug;
                                return (
                                    <div
                                        key={country.slug}
                                        onClick={() => !disabled && onSelectCountry(country.slug)}
                                        style={{
                                            padding: '6px 10px',
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            borderRadius: NEON_THEME.layout.radius.sm,
                                            backgroundColor: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                                            color: isSelected ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary,
                                            fontSize: '13px',
                                            fontWeight: isSelected ? 700 : 400,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.1s'
                                        }}
                                        title={country.name}
                                    >
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{country.name}</span>
                                        {isSelected && <span>{'>'}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Leagues */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '8px',
                border: selectedCountry ? `1px solid ${NEON_THEME.colors.border.subtle}` : `1px dashed rgba(255,255,255,0.05)`
            }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: NEON_THEME.colors.text.muted,
                    paddingLeft: '4px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    letterSpacing: '1px',
                    justifyContent: 'space-between'
                }}>
                    <span>{selectedCountry ? `LEAGUES: ${activeCountryName?.toUpperCase()}` : 'SELECT COUNTRY'}</span>
                    {selectedLeague && (
                        <div style={{
                            backgroundColor: NEON_THEME.colors.neon.green,
                            color: 'black',
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 900,
                            animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>READY</div>
                    )}
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    {!selectedCountry ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.2, fontSize: '11px' }}>
                            Select a country from the left to explore leagues
                        </div>
                    ) : isLoadingLeagues ? (
                        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>Loading leagues...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {leagues.map(league => {
                                const isSelected = selectedLeague === league.slug;
                                return (
                                    <div
                                        key={league.slug}
                                        onClick={() => !disabled && onSelectLeague(league.slug)}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            borderRadius: NEON_THEME.layout.radius.sm,
                                            backgroundColor: isSelected ? NEON_THEME.colors.neon.cyan : 'transparent',
                                            color: isSelected ? NEON_THEME.colors.bg.app : NEON_THEME.colors.text.primary,
                                            fontSize: '13px',
                                            fontWeight: isSelected ? 700 : 400,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {league.name}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                @keyframes pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0.3; }
                }
                `}
            </style>
        </div>
    );
};
