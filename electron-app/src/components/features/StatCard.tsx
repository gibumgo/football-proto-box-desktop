import { NEON_THEME } from '../../domain/design/designTokens';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: React.ReactNode;
}

export function StatCard({ title, value, subValue, icon }: StatCardProps) {
    return (
        <div style={{
            backgroundColor: NEON_THEME.colors.bg.panel,
            padding: NEON_THEME.spacing.lg,
            borderRadius: NEON_THEME.layout.radius.md,
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            gap: NEON_THEME.spacing.xs,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: NEON_THEME.colors.text.secondary,
                fontSize: NEON_THEME.typography.size.sm
            }}>
                <span>{title}</span>
                {icon && <span style={{ opacity: 0.7 }}>{icon}</span>}
            </div>
            <div style={{
                fontSize: NEON_THEME.typography.size.xl,
                fontWeight: NEON_THEME.typography.weight.bold,
                color: NEON_THEME.colors.text.primary
            }}>
                {value}
            </div>
            {subValue && (
                <div style={{
                    fontSize: NEON_THEME.typography.size.xs,
                    color: NEON_THEME.colors.text.muted
                }}>
                    {subValue}
                </div>
            )}
        </div>
    );
}
