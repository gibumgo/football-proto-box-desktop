
import type { RoundStats } from '../../types/archive';
import { NEON_THEME } from '@/domain/design/designTokens';

interface RoundReviewStatsProps {
    stats?: RoundStats;
}

export function RoundReviewStats({ stats }: RoundReviewStatsProps) {
    if (!stats) return null;

    const total = stats.finishedMatches || 1;
    const favRate = ((stats.favoriteWinCount / total) * 100).toFixed(1);
    const underRate = ((stats.underdogWinCount / total) * 100).toFixed(1);
    const drawRate = ((stats.drawCount / total) * 100).toFixed(1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{
                margin: 0,
                fontSize: '14px',
                color: NEON_THEME.colors.text.secondary,
                borderLeft: `3px solid ${NEON_THEME.colors.neon.cyan}`,
                paddingLeft: '10px',
                letterSpacing: '1px'
            }}>
                ROUND REVIEW
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <StatRow label="Favorites (정배)" value={stats.favoriteWinCount} rate={favRate} color={NEON_THEME.colors.neon.green} />
                <StatRow label="Underdogs (역배)" value={stats.underdogWinCount} rate={underRate} color={NEON_THEME.colors.neon.red} />
                <StatRow label="Draw (무승부)" value={stats.drawCount} rate={drawRate} color={NEON_THEME.colors.neon.yellow} />
            </div>

            {/* Visual Progress Bar */}
            <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                display: 'flex',
                overflow: 'hidden',
                marginTop: '10px'
            }}>
                <div style={{ width: `${favRate}%`, backgroundColor: NEON_THEME.colors.neon.green }} />
                <div style={{ width: `${underRate}%`, backgroundColor: NEON_THEME.colors.neon.red }} />
                <div style={{ width: `${drawRate}%`, backgroundColor: NEON_THEME.colors.neon.yellow }} />
            </div>
        </div>
    );
}

function StatRow({ label, value, rate, color }: { label: string, value: number, rate: string, color: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: NEON_THEME.colors.text.muted }}>{label}</span>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: color }}>{value} <span style={{ fontSize: '10px' }}>hits</span></div>
                <div style={{ fontSize: '11px', color: NEON_THEME.colors.text.disabled }}>{rate}%</div>
            </div>
        </div>
    );
}
