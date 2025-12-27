import React, { useEffect, useState } from 'react';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/designSystem';
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
            backgroundColor: COLORS.HEADER,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            padding: `${SPACING.MD} ${SPACING.XL}`,
            display: 'flex',
            gap: SPACING.XXL,
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
            fontSize: TYPOGRAPHY.FONT_SIZE.SM,
            color: COLORS.TEXT_SECONDARY,
            fontFamily: TYPOGRAPHY.FONT_FAMILY.SANS
        }}>
            {label}
        </div>
        <div style={{
            fontSize: TYPOGRAPHY.FONT_SIZE.LG,
            color: COLORS.NEON_CYAN,
            fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO,
            fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD
        }}>
            {value}
        </div>
        {subValue && (
            <div style={{
                fontSize: TYPOGRAPHY.FONT_SIZE.XS,
                color: COLORS.TEXT_MUTED,
                fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO
            }}>
                {subValue}
            </div>
        )}
    </div>
);

export default GlobalStatusBar;
