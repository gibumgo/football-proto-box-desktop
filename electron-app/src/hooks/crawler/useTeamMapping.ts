import { useState, useEffect, useCallback } from 'react';

export interface MasterTeamMappingItem {
    id: string;               // Canonical ID
    name: string;             // Canonical Name (English)
    nameKo?: string;          // Korean Name (if available)
    aliases: string[];        // Mapped Aliases
    leagueId?: string;        // Associated League ID (for context)
    imageUrl?: string;        // Team Logo URL
}

interface MasterTeam {
    id: string;
    name: string;
    nameKo: string;
    imageUrl?: string;
    nation?: string;
}

interface LeagueTeamRelation {
    leagueId: string;
    teamId: string;
    season?: string;
}

interface AliasEntry {
    aliases: string[];
}

export function useTeamMapping() {
    const [masterTeams, setMasterTeams] = useState<Record<string, MasterTeam>>({});
    const [leagueTeams, setLeagueTeams] = useState<LeagueTeamRelation[]>([]);

    const [rawAliasesData, setRawAliasesData] = useState<Record<string, AliasEntry>>({});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [teamsResult, relResult, aliasesResult] = await Promise.all([
                (window as any).api.data.readFile('data/master/teams.csv'),
                (window as any).api.data.readFile('data/master/league_teams.csv'),
                (window as any).api.data.readFile('data/aliases/team_aliases.json')
            ]);

            const teamsMap: Record<string, MasterTeam> = {};
            if (teamsResult.success && typeof teamsResult.data === 'string') {
                const lines = teamsResult.data.split('\n');
                lines.slice(1).forEach((line: string) => {
                    const cols = line.split(',');
                    if (cols.length < 2) return;
                    const id = cols[0]?.trim();
                    if (!id) return;

                    teamsMap[id] = {
                        id,
                        name: cols[1]?.trim().replace(/"/g, '') || '',
                        nameKo: cols[2]?.trim().replace(/"/g, '') || '',
                        imageUrl: cols[3]?.trim(),
                        nation: cols[4]?.trim()
                    };
                });
            }

            const relations: LeagueTeamRelation[] = [];
            if (relResult.success && typeof relResult.data === 'string') {
                const lines = relResult.data.split('\n');
                lines.slice(1).forEach((line: string) => {
                    const cols = line.split(',');
                    if (cols.length < 2) return;
                    relations.push({
                        leagueId: cols[0]?.trim(),
                        teamId: cols[1]?.trim(),
                        season: cols[2]?.trim()
                    });
                });
            }

            let aliasesData: Record<string, AliasEntry> = {};
            if (aliasesResult.success && aliasesResult.data) {
                aliasesData = aliasesResult.data;
            }

            setMasterTeams(teamsMap);
            setLeagueTeams(relations);
            setRawAliasesData(aliasesData);

        } catch (e: any) {
            setError(e.message || 'Failed to load team data');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveToDisk = async (newData: Record<string, AliasEntry>) => {
        try {
            const result = await (window as any).api.data.writeFile('data/aliases/team_aliases.json', newData);
            if (!result.success) throw new Error(result.error);

            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to save team aliases');
            return false;
        }
    };

    const addAlias = async (teamId: string, newAlias: string) => {
        const aliasTrimmed = newAlias.trim();
        if (!aliasTrimmed) return;

        const nextData = { ...rawAliasesData };

        if (!nextData[teamId]) {
            nextData[teamId] = { aliases: [] };
        }

        if (nextData[teamId].aliases.includes(aliasTrimmed)) {
            return;
        }

        Object.keys(nextData).forEach(id => {
            if (id !== teamId && nextData[id].aliases.includes(aliasTrimmed)) {
                nextData[id] = {
                    ...nextData[id],
                    aliases: nextData[id].aliases.filter(a => a !== aliasTrimmed)
                };
            }
        });

        nextData[teamId] = {
            ...nextData[teamId],
            aliases: [...nextData[teamId].aliases, aliasTrimmed]
        };

        setRawAliasesData(nextData);

        await saveToDisk(nextData);
    };

    const removeAlias = async (aliasToRemove: string) => {
        const nextData = { ...rawAliasesData };

        let foundId: string | null = null;
        Object.entries(nextData).forEach(([id, entry]) => {
            if (entry.aliases.includes(aliasToRemove)) {
                foundId = id;
            }
        });

        if (foundId) {
            nextData[foundId!] = {
                ...nextData[foundId!],
                aliases: nextData[foundId!].aliases.filter(a => a !== aliasToRemove)
            };

            if (nextData[foundId!].aliases.length === 0) {
                delete nextData[foundId!];
            }

            setRawAliasesData(nextData);

            await saveToDisk(nextData);
        }
    };

    const getTeamsByLeague = useCallback((leagueId: string): MasterTeamMappingItem[] => {
        const teamIds = Array.from(new Set(
            leagueTeams
                .filter(r => r.leagueId === leagueId)
                .map(r => r.teamId)
        ));

        const items: MasterTeamMappingItem[] = teamIds.map(tid => {
            const master = masterTeams[tid];
            const aliasEntry = rawAliasesData[tid];

            return {
                id: tid,
                name: master ? master.name : `Unknown Team (${tid})`,
                nameKo: master ? master.nameKo : '',
                imageUrl: master ? master.imageUrl : undefined,
                aliases: aliasEntry ? aliasEntry.aliases.sort() : [],
                leagueId
            };
        });

        return items.sort((a, b) => a.name.localeCompare(b.name));
    }, [masterTeams, leagueTeams, rawAliasesData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        isLoading,
        error,
        getTeamsByLeague,
        addAlias,
        removeAlias,
        reload: loadData
    };
}
