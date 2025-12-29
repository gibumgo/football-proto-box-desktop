import { useState, useMemo } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';
import { useLeagueMapping } from '@/hooks/crawler/useLeagueMapping';
import { useTeamMapping } from '@/hooks/crawler/useTeamMapping';
import type { MasterTeamMappingItem } from '@/hooks/crawler/useTeamMapping';

export function DataManagementPanel() {
    const leagueData = useLeagueMapping();
    const teamData = useTeamMapping();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'leagues' | 'teams'>('leagues');

    const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
    const [addingToId, setAddingToId] = useState<string | null>(null);
    const [newAliasInput, setNewAliasInput] = useState('');

    const isLoading = activeTab === 'leagues' ? leagueData.isLoading : teamData.isLoading;
    const error = activeTab === 'leagues' ? leagueData.error : teamData.error;

    const handleAddSubmit = async (masterId: string) => {
        if (!newAliasInput.trim()) return;

        if (activeTab === 'leagues') {
            await leagueData.addAlias(masterId, newAliasInput);
        } else {
            await teamData.addAlias(masterId, newAliasInput);
        }
        setAddingToId(null);
        setNewAliasInput('');
    };

    const handleRemove = async (alias: string) => {
        if (confirm(`Delete alias map "${alias}"?`)) {
            if (activeTab === 'leagues') {
                await leagueData.removeAlias(alias);
            } else {
                await teamData.removeAlias(alias);
            }
        }
    };

    const tableItems = useMemo(() => {
        if (activeTab === 'leagues') {
            let items = leagueData.mappings;
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                items = items.filter(m =>
                    m.name.toLowerCase().includes(lower) ||
                    m.aliases.some(alias => alias.toLowerCase().includes(lower))
                );
            }
            return items;
        } else {
            if (!selectedLeagueId) return [];

            let items = teamData.getTeamsByLeague(selectedLeagueId);
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                items = items.filter(m =>
                    m.name.toLowerCase().includes(lower) ||
                    (m.nameKo && m.nameKo.toLowerCase().includes(lower)) ||
                    m.aliases.some(alias => alias.toLowerCase().includes(lower))
                );
            }
            return items;
        }
    }, [activeTab, leagueData.mappings, teamData.getTeamsByLeague, selectedLeagueId, searchTerm]);

    const stats = useMemo(() => {
        const totalMasters = tableItems.length;
        const totalAliases = tableItems.reduce((acc, curr) => acc + curr.aliases.length, 0);
        return { totalMasters, totalAliases };
    }, [tableItems]);

    if (isLoading && tableItems.length === 0 && !selectedLeagueId) {
        return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Loading data...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: '40px', color: NEON_THEME.colors.neon.purple, textAlign: 'center' }}>
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}>Reload</button>
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: NEON_THEME.colors.bg.panel,
            borderRadius: '16px',
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            overflow: 'hidden',
            height: '100%'
        }}>
            <div style={{
                padding: '16px 24px',
                borderBottom: `1px solid ${NEON_THEME.colors.border.subtle}`,
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <TabButton
                            active={activeTab === 'leagues'}
                            onClick={() => { setActiveTab('leagues'); setSearchTerm(''); }}
                            label="Leagues"
                        />
                        <TabButton
                            active={activeTab === 'teams'}
                            onClick={() => { setActiveTab('teams'); setSearchTerm(''); }}
                            label="Teams"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: NEON_THEME.colors.text.muted }}>
                        <span>Count: <b style={{ color: '#fff' }}>{stats.totalMasters}</b></span>
                        <span>Aliases: <b style={{ color: NEON_THEME.colors.neon.cyan }}>{stats.totalAliases}</b></span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {activeTab === 'teams' && (
                        <select
                            value={selectedLeagueId}
                            onChange={(e) => setSelectedLeagueId(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: '#fff',
                                fontSize: '12px',
                                maxWidth: '200px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select a League...</option>
                            {leagueData.mappings.map(lm => (
                                <option key={lm.id} value={lm.id}>{lm.name}</option>
                            ))}
                        </select>
                    )}

                    <input
                        type="text"
                        placeholder={activeTab === 'leagues' ? "Search Leagues..." : "Search Teams..."}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: '#fff',
                            fontSize: '12px',
                            minWidth: '200px'
                        }}
                    />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#0a0a0a', zIndex: 1 }}>
                        <tr>
                            <th style={{ ...tableHeaderStyle, width: '40%' }}>
                                {activeTab === 'leagues' ? 'OFFICIAL LEAGUE NAME' : 'OFFICIAL TEAM NAME'}
                            </th>
                            <th style={tableHeaderStyle}>MAPPED ALIASES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableItems.map((item, idx) => {
                            const isAdding = addingToId === item.id;
                            const rowBg = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';

                            let nameDisplay = item.name;
                            let subText = `ID: ${item.id}`;
                            let flagUrl = '';
                            let logoUrl = '';

                            if (activeTab === 'teams') {
                                const teamItem = item as MasterTeamMappingItem;
                                if (teamItem.nameKo) {
                                    nameDisplay = `${item.name} (${teamItem.nameKo})`;
                                }
                                if (teamItem.imageUrl) flagUrl = teamItem.imageUrl;
                            } else {
                                const leagueItem = item as any;
                                if (leagueItem.nameKo) {
                                    nameDisplay = leagueItem.nameKo;
                                    subText = `${item.name} • ID: ${item.id}`;
                                }
                                if (leagueItem.nationFlagUrl) flagUrl = leagueItem.nationFlagUrl;
                                if (leagueItem.logoUrl) logoUrl = leagueItem.logoUrl;
                            }

                            return (
                                <tr key={item.id} style={{ backgroundColor: rowBg, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                                    <td style={{ padding: '12px 24px', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {activeTab === 'leagues' && logoUrl && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', minWidth: '24px' }}>
                                                    <img src={logoUrl} alt="logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                                </div>
                                            )}

                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {flagUrl && (
                                                        <img src={flagUrl} alt="flag" style={{ width: '20px', height: 'auto', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                                                    )}
                                                    <div style={{ color: NEON_THEME.colors.text.primary, fontWeight: 600, fontSize: '14px' }}>
                                                        {nameDisplay}
                                                    </div>
                                                </div>
                                                <div style={{ color: NEON_THEME.colors.text.muted, fontSize: '11px', marginTop: '4px', fontFamily: NEON_THEME.typography.fontFamily.mono }}>
                                                    {subText}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                            {item.aliases.map(alias => (
                                                <div key={alias} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                                                    border: `1px solid ${NEON_THEME.colors.neon.green}`,
                                                    borderRadius: '20px',
                                                    padding: '4px 10px',
                                                    fontSize: '12px',
                                                    color: NEON_THEME.colors.neon.green
                                                }}>
                                                    <span>{alias}</span>
                                                    <span
                                                        onClick={() => handleRemove(alias)}
                                                        style={{ cursor: 'pointer', opacity: 0.6, fontWeight: 'bold' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                                    >
                                                        ×
                                                    </span>
                                                </div>
                                            ))}

                                            {isAdding ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="New Alias"
                                                        value={newAliasInput}
                                                        onChange={(e) => setNewAliasInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleAddSubmit(item.id);
                                                            if (e.key === 'Escape') { setAddingToId(null); setNewAliasInput(''); }
                                                        }}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid #fff',
                                                            borderRadius: '4px',
                                                            padding: '4px 8px',
                                                            color: '#fff',
                                                            fontSize: '12px',
                                                            width: '120px'
                                                        }}
                                                    />
                                                    <button onClick={() => handleAddSubmit(item.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>OK</button>
                                                    <button onClick={() => { setAddingToId(null); setNewAliasInput(''); }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#888' }}>X</button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => { setAddingToId(item.id); setNewAliasInput(''); }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        border: `1px dashed ${NEON_THEME.colors.text.muted}`,
                                                        color: NEON_THEME.colors.text.muted,
                                                        fontSize: '11px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        opacity: 0.7,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = NEON_THEME.colors.text.muted; e.currentTarget.style.color = NEON_THEME.colors.text.muted; }}
                                                >
                                                    + Add Alias
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {tableItems.length === 0 && (
                            <tr>
                                <td colSpan={2} style={{ padding: '40px', textAlign: 'center', color: NEON_THEME.colors.text.muted }}>
                                    {activeTab === 'teams' && !selectedLeagueId
                                        ? "Please select a league to manage teams."
                                        : "No mappings found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const TabButton = ({ active, label, onClick, disabled }: any) => (
    <div
        onClick={!disabled ? onClick : undefined}
        style={{
            padding: '8px 16px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.3 : 1,
            color: active ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.muted,
            borderBottom: active ? `2px solid ${NEON_THEME.colors.neon.cyan}` : '2px solid transparent',
            fontWeight: active ? 600 : 400,
            transition: 'all 0.2s',
            fontSize: '13px'
        }}
    >
        {label}
    </div>
);

const tableHeaderStyle = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    color: NEON_THEME.colors.text.muted,
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.5px'
};
