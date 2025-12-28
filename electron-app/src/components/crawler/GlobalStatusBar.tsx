import React, { useEffect, useState } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';
import type { DataInventory } from '../../types/crawler';

const GlobalStatusBar: React.FC = () => {
    const [inventory, setInventory] = useState<DataInventory>({
        totalCSV: 0,
        betinfoRounds: { min: 0, max: 0, count: 0 },
        flashscoreStats: { leagues: 0, teams: 0, matches: 0 }
    });

    useEffect(() => {
        // TODO: Fetch data inventory from data scanning
        // For now, mock data
        setInventory({
            totalCSV: 42,
            betinfoRounds: { min: 1, max: 25, count: 25 },
            flashscoreStats: { leagues: 8, teams: 160, matches: 1240 }
        });
    }, []);

    return (
        <div style={{
            backgroundColor: NEON_THEME.colors.bg.header,
            borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
            padding: `${NEON_THEME.spacing.md} ${NEON_THEME.spacing.xl}`,
            display: 'flex',
            gap: NEON_THEME.spacing.xxl,
            alignItems: 'center'
        }}>
            <StatItem label="Total CSV" value={inventory.totalCSV} />
            <StatItem
                label="Betinfo Rounds"
                value={`${inventory.betinfoRounds.min} ~ ${inventory.betinfoRounds.max}`}
                subValue={`${inventory.betinfoRounds.count}회차`}
            />
            <StatItem label="Leagues" value={inventory.flashscoreStats.leagues} />
            <StatItem label="Teams" value={inventory.flashscoreStats.teams} />
            <StatItem label="Matches" value={inventory.flashscoreStats.matches} />
        </div>
    );
};

interface StatItemProps {
    label: string;
    value: string | number;
    subValue?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, subValue }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{
            fontSize: NEON_THEME.typography.size.sm,
            color: NEON_THEME.colors.text.secondary,
            fontFamily: NEON_THEME.typography.fontFamily.sans
        }}>
            {label}
        </div>
        <div style={{
            fontSize: NEON_THEME.typography.size.lg,
            color: NEON_THEME.colors.neon.cyan,
            fontFamily: NEON_THEME.typography.fontFamily.mono,
            fontWeight: NEON_THEME.typography.weight.bold
        }}>
            {value}
        </div>
        {subValue && (
            <div style={{
                fontSize: NEON_THEME.typography.size.xs,
                color: NEON_THEME.colors.text.muted,
                fontFamily: NEON_THEME.typography.fontFamily.mono
            }}>
                {subValue}
            </div>
        )}
    </div>
);

export default GlobalStatusBar;
