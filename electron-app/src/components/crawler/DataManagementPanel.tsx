import { useState, useMemo, useEffect, useRef } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';
import { useLeagueMapping } from '@/hooks/crawler/useLeagueMapping';
import { useTeamMapping } from '@/hooks/crawler/useTeamMapping';
import type { MasterTeamMappingItem } from '@/hooks/crawler/useTeamMapping';

interface DataManagementPanelProps {
    isRunning?: boolean;
}

export function DataManagementPanel({ isRunning }: DataManagementPanelProps) {
    const leagueData = useLeagueMapping();
    const teamData = useTeamMapping();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'leagues' | 'teams'>('leagues');
    const [isCompact, setIsCompact] = useState(false);

    // [Auto-Reload] Trigger reload when isRunning transitions from true -> false
    const prevIsRunning = useRef(isRunning);

    useEffect(() => {
        if (prevIsRunning.current && !isRunning) {
            console.log('Task finished, reloading data...');
            leagueData.reload();
            teamData.reload();
        }
        prevIsRunning.current = isRunning;
    }, [isRunning, leagueData, teamData]);

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
                    (m.nameKo && m.nameKo.toLowerCase().includes(lower)) ||
                    m.aliases.some(alias => alias.toLowerCase().includes(lower)) ||
                    m.id.toLowerCase().includes(lower)
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
                    m.aliases.some(alias => alias.toLowerCase().includes(lower)) ||
                    m.id.toLowerCase().includes(lower)
                );
            }
            return items;
        }
    }, [activeTab, leagueData.mappings, teamData.getTeamsByLeague, selectedLeagueId, searchTerm]);

    const stats = useMemo(() => {
        const total = tableItems.length;
        const mapped = tableItems.filter(item => item.aliases.length > 0).length;
        const totalAliases = tableItems.reduce((acc, curr) => acc + curr.aliases.length, 0);
        const percent = total > 0 ? Math.round((mapped / total) * 100) : 0;
        return { total, mapped, totalAliases, percent };
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
            height: '100%',
            position: 'relative'
        }}>
            {/* 1. Status Summary Bar */}
            <div style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                display: 'flex'
            }}>
                <div style={{
                    width: `${stats.percent}%`,
                    height: '100%',
                    backgroundColor: NEON_THEME.colors.neon.green,
                    boxShadow: `0 0 10px ${NEON_THEME.colors.neon.green}44`,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            </div>

            {/* 2. Top Navigation & Stats */}
            <div style={{
                padding: '12px 24px',
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
                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: NEON_THEME.colors.text.muted, fontWeight: 700 }}>
                        <span>TOTAL <b style={{ color: '#fff', marginLeft: '4px' }}>{stats.total}</b></span>
                        <span>MAPPED <b style={{ color: NEON_THEME.colors.neon.green, marginLeft: '4px' }}>{stats.percent}%</b></span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Zen Mode Toggle */}
                    <button
                        onClick={() => setIsCompact(!isCompact)}
                        style={{
                            backgroundColor: isCompact ? NEON_THEME.colors.neon.cyan : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isCompact ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.border.subtle}`,
                            borderRadius: '4px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isCompact ? NEON_THEME.colors.bg.app : NEON_THEME.colors.text.muted,
                            transition: 'all 0.2s'
                        }}
                        title="Focus Mode (Compact View)"
                    >
                        {isCompact ? '🧘' : '👁️'}
                    </button>

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
                                maxWidth: '180px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select League...</option>
                            {leagueData.mappings.map(lm => (
                                <option key={lm.id} value={lm.id}>{lm.nameKo || lm.name}</option>
                            ))}
                        </select>
                    )}

                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Quick Filter..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${NEON_THEME.colors.border.subtle}`,
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: '#fff',
                                fontSize: '12px',
                                minWidth: '180px'
                            }}
                        />
                        {searchTerm && <span onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5 }}>✕</span>}
                    </div>
                </div>
            </div>

            {/* 3. Data Table */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isCompact ? '12px' : '13px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: NEON_THEME.colors.bg.panel, zIndex: 1 }}>
                        <tr>
                            <th style={{ ...tableHeaderStyle, width: '40%', padding: isCompact ? '8px 24px' : '12px 24px' }}>
                                {activeTab === 'leagues' ? 'OFFICIAL LEAGUE' : 'OFFICIAL TEAM'}
                            </th>
                            <th style={{ ...tableHeaderStyle, padding: isCompact ? '8px 24px' : '12px 24px' }}>MAPPED ALIASES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableItems.map((item, idx) => {
                            const isAdding = addingToId === item.id;
                            const isMapped = item.aliases.length > 0;

                            // State-based Zebra Striping
                            const rowBg = !isMapped
                                ? 'rgba(248, 113, 113, 0.03)' // Subtle red for unmapped
                                : idx % 2 === 0
                                    ? 'rgba(255,255,255,0.01)'
                                    : 'transparent';

                            let nameDisplay = item.name;
                            let subText = `ID: ${item.id}`;
                            let flagUrl = '';
                            let logoUrl = '';

                            if (activeTab === 'teams') {
                                const teamItem = item as MasterTeamMappingItem;
                                if (teamItem.nameKo) nameDisplay = `${item.name} (${teamItem.nameKo})`;
                                if (teamItem.imageUrl) flagUrl = teamItem.imageUrl;
                            } else {
                                const leagueItem = item as any;
                                if (leagueItem.nameKo) {
                                    nameDisplay = leagueItem.nameKo;
                                    subText = `${item.name} • ${item.id}`;
                                }
                                if (leagueItem.nationFlagUrl) flagUrl = leagueItem.nationFlagUrl;
                                if (leagueItem.logoUrl) logoUrl = leagueItem.logoUrl;
                            }

                            return (
                                <tr key={item.id} style={{
                                    backgroundColor: rowBg,
                                    borderBottom: `1px solid rgba(255,255,255,0.03)`,
                                    transition: 'background-color 0.2s'
                                }}>
                                    <td style={{ padding: isCompact ? '8px 24px' : '12px 24px', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {!isCompact && (
                                                <div style={{ width: '4px', height: '24px', backgroundColor: isMapped ? NEON_THEME.colors.neon.green : NEON_THEME.colors.status.error, borderRadius: '2px' }} />
                                            )}
                                            {activeTab === 'leagues' && logoUrl && !isCompact && (
                                                <img src={logoUrl} alt="logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                            )}

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {flagUrl && (
                                                        <img src={flagUrl} alt="flag" style={{ width: '18px', height: 'auto', borderRadius: '2px' }} />
                                                    )}
                                                    <div style={{
                                                        color: isMapped ? NEON_THEME.colors.text.primary : NEON_THEME.colors.neon.red,
                                                        fontWeight: 600,
                                                        fontSize: isCompact ? '13px' : '14px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {nameDisplay}
                                                    </div>
                                                </div>
                                                {!isCompact && (
                                                    <div style={{ color: NEON_THEME.colors.text.muted, fontSize: '11px', marginTop: '2px', fontFamily: NEON_THEME.typography.fontFamily.mono }}>
                                                        {subText}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: isCompact ? '8px 24px' : '16px 24px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isCompact ? '4px' : '8px', alignItems: 'center' }}>
                                            {item.aliases.map(alias => (
                                                <div key={alias} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                                    border: `1px solid ${NEON_THEME.colors.neon.cyan}`,
                                                    borderRadius: '20px',
                                                    padding: isCompact ? '2px 8px' : '4px 10px',
                                                    fontSize: '11px',
                                                    color: NEON_THEME.colors.neon.cyan,
                                                    animation: 'fadeIn 0.3s ease'
                                                }}>
                                                    <span>{alias}</span>
                                                    <span
                                                        onClick={() => handleRemove(alias)}
                                                        style={{ cursor: 'pointer', opacity: 0.6 }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                                    >
                                                        ✕
                                                    </span>
                                                </div>
                                            ))}

                                            {isAdding ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', animation: 'fadeIn 0.2s' }}>
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
                                                            border: `1px solid ${NEON_THEME.colors.neon.cyan}`,
                                                            borderRadius: '4px',
                                                            padding: '2px 8px',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            width: '100px',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => { setAddingToId(item.id); setNewAliasInput(''); }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: isCompact ? '2px 8px' : '4px 10px',
                                                        borderRadius: '20px',
                                                        border: `1px dashed ${NEON_THEME.colors.text.muted}`,
                                                        color: NEON_THEME.colors.text.muted,
                                                        fontSize: '11px',
                                                        opacity: 0.7,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = NEON_THEME.colors.neon.cyan; e.currentTarget.style.color = NEON_THEME.colors.neon.cyan; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = NEON_THEME.colors.text.muted; e.currentTarget.style.color = NEON_THEME.colors.text.muted; }}
                                                >
                                                    + Add
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                `}
            </style>
        </div>
    );
}

const TabButton = ({ active, label, onClick, disabled }: any) => (
    <div
        onClick={!disabled ? onClick : undefined}
        style={{
            padding: '8px 4px',
            marginRight: '16px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.3 : 1,
            color: active ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.muted,
            borderBottom: active ? `2px solid ${NEON_THEME.colors.neon.cyan}` : '2px solid transparent',
            fontWeight: active ? 700 : 400,
            transition: 'all 0.2s',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }}
    >
        {label}
    </div>
);

const tableHeaderStyle = {
    padding: '12px 24px',
    textAlign: 'left' as const,
    color: NEON_THEME.colors.text.muted,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    borderBottom: `1px solid ${NEON_THEME.colors.border.subtle}`
};
