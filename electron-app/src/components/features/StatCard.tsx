
import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';

interface StatCardProps {
    title: string;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
}

export function StatCard({ title, wins, draws, losses, winRate }: StatCardProps) {
    return (
        <div style={{
            backgroundColor: COLORS.PANEL,
            padding: '16px',
            borderRadius: '6px',
            border: `1px solid ${COLORS.BORDER}`
        }}>
            <div style={{
                fontSize: TYPOGRAPHY.SIZE.XS,
                color: COLORS.TEXT_SECONDARY,
                marginBottom: '8px',
                textTransform: 'uppercase'
            }}>
                {title}
            </div>
            <div style={{
                fontSize: TYPOGRAPHY.SIZE.SM,
                color: COLORS.TEXT_PRIMARY,
                marginBottom: '4px'
            }}>
                {wins}승 {draws}무 {losses}패
            </div>
            <div style={{
                fontSize: TYPOGRAPHY.SIZE.XL,
                fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                color: COLORS.NEON_BLUE
            }}>
                승률 {winRate.toFixed(1)}%
            </div>
        </div>
    );
}
