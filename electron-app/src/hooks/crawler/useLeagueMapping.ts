import { useState, useEffect, useCallback, useMemo } from 'react';

export interface MasterMappingItem {
    id: string;               // Canonical ID
    name: string;             // Canonical Name (from CSV - Default English)
    nameKo?: string;          // Korean Name
    nation?: string;          // Nation English
    nationKo?: string;        // Nation Korean
    logoUrl?: string;         // League Logo
    nationFlagUrl?: string;   // Nation Flag
    aliases: string[];        // List of Aliases (Mapped Keys)
}

interface MasterLeague {
    id: string;
    name: string;
    nameKo?: string;
    nation?: string;
    nationKo?: string;
    logoUrl?: string;
    nationFlagUrl?: string;
}

interface AliasEntry {
    aliases: string[];
}

export function useLeagueMapping() {
    const [rawAliasesData, setRawAliasesData] = useState<Record<string, AliasEntry>>({});
    const [masterLeagues, setMasterLeagues] = useState<MasterLeague[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const aliasResult = await (window as any).api.data.readFile('data/aliases/league_aliases.json');
            const masterResult = await (window as any).api.data.readFile('data/master/leagues.csv');

            let aliasesData: Record<string, AliasEntry> = {};
            let masters: MasterLeague[] = [];

            if (aliasResult.success && aliasResult.data) {
                aliasesData = aliasResult.data;
            }

            if (masterResult.success && typeof masterResult.data === 'string') {
                const lines = masterResult.data.split('\n');
                masters = lines.slice(1).map((line: string) => {
                    const cols = line.split(',');
                    if (cols.length < 2) return null;

                    return {
                        id: cols[0]?.trim(),
                        nation: cols[1]?.trim(),
                        nationKo: cols[2]?.trim(),
                        name: cols[3]?.trim().replace(/"/g, ''),
                        nameKo: cols[4]?.trim().replace(/"/g, ''),
                        logoUrl: cols[5]?.trim(),
                        nationFlagUrl: cols[6]?.trim(),
                    };
                }).filter((item: any) => item && item.id) as MasterLeague[];
            }

            setRawAliasesData(aliasesData);
            setMasterLeagues(masters);

        } catch (e: any) {
            setError(e.message || 'Failed to load league data');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const groupedMappings = useMemo(() => {
        const mappedIds = Object.keys(rawAliasesData);

        const uiItems: MasterMappingItem[] = mappedIds.map(id => {
            const master = masterLeagues.find(m => m.id === id);
            return {
                id: id,
                name: master ? master.name : id,
                nameKo: master ? master.nameKo : '',
                nation: master?.nation,
                nationKo: master?.nationKo,
                logoUrl: master?.logoUrl,
                nationFlagUrl: master?.nationFlagUrl,
                aliases: rawAliasesData[id]?.aliases?.sort() || []
            };
        });

        uiItems.sort((a, b) => {
            const nameA = a.nameKo || a.name || a.id;
            const nameB = b.nameKo || b.name || b.id;
            return nameA.localeCompare(nameB);
        });

        return uiItems;
    }, [rawAliasesData, masterLeagues]);


    const saveToDisk = async (newData: Record<string, AliasEntry>) => {
        try {
            const result = await (window as any).api.data.writeFile('data/aliases/league_aliases.json', newData);
            if (!result.success) throw new Error(result.error);

            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to save');
            return false;
        }
    };

    const addAlias = async (masterId: string, newAlias: string) => {
        const aliasTrimmed = newAlias.trim();
        if (!aliasTrimmed) return;

        const nextData = { ...rawAliasesData };

        if (!nextData[masterId]) {
            nextData[masterId] = { aliases: [] };
        }

        if (nextData[masterId].aliases.includes(aliasTrimmed)) {
            return;
        }

        Object.keys(nextData).forEach(id => {
            if (id !== masterId && nextData[id].aliases.includes(aliasTrimmed)) {
                nextData[id] = {
                    ...nextData[id],
                    aliases: nextData[id].aliases.filter(a => a !== aliasTrimmed)
                };
            }
        });

        nextData[masterId] = {
            ...nextData[masterId],
            aliases: [...nextData[masterId].aliases, aliasTrimmed]
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        mappings: groupedMappings,
        masterLeagues,
        isLoading,
        error,
        addAlias,
        removeAlias,
        reload: loadData
    };
}
