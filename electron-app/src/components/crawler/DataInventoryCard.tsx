import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface DataInventoryCardProps {
    title: string;
    children: React.ReactNode;
}

const DataInventoryCard: React.FC<DataInventoryCardProps> = ({ title, children }) => {
    return (
        <div style={{
            backgroundColor: NEON_THEME.colors.bg.surface,
            borderRadius: NEON_THEME.layout.radius.md,
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            padding: NEON_THEME.spacing.md,
            display: 'flex',
            flexDirection: 'column',
            gap: NEON_THEME.spacing.md,
            boxShadow: NEON_THEME.effects.shadow.sm
        }}>
            <h3 style={{
                margin: 0,
                fontSize: NEON_THEME.typography.size.sm,
                fontWeight: NEON_THEME.typography.weight.bold,
                color: NEON_THEME.colors.text.primary,
                borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                paddingBottom: NEON_THEME.spacing.xs,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: NEON_THEME.spacing.sm }}>
                {children}
            </div>
        </div>
    );
};

interface DataRowProps {
    label: string;
    value: string;
    status?: 'success' | 'warning' | 'error' | 'neutral';
}

export const DataRow: React.FC<DataRowProps> = ({ label, value, status = 'neutral' }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'success': return NEON_THEME.colors.status.success;
            case 'warning': return NEON_THEME.colors.status.warning;
            case 'error': return NEON_THEME.colors.status.error;
            default: return 'transparent';
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: NEON_THEME.typography.size.sm
        }}>
            <span style={{ color: NEON_THEME.colors.text.secondary }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    color: NEON_THEME.colors.text.primary,
                    fontWeight: NEON_THEME.typography.weight.medium,
                    fontFamily: NEON_THEME.typography.fontFamily.mono
                }}>
                    {value}
                </span>
                {status !== 'neutral' && (
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(),
                        boxShadow: `0 0 4px ${getStatusColor()}`
                    }} />
                )}
            </div>
        </div>
    );
};

export default DataInventoryCard;
