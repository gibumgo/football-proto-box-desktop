import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/designSystem';

interface DataInventoryCardProps {
    title: string;
    children: React.ReactNode;
}

const DataInventoryCard: React.FC<DataInventoryCardProps> = ({ title, children }) => {
    return (
        <div style={{
            backgroundColor: COLORS.SURFACE,
            borderRadius: '6px',
            border: `1px solid ${COLORS.BORDER}`,
            padding: SPACING.MD,
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.MD,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
            <h3 style={{
                margin: 0,
                fontSize: TYPOGRAPHY.FONT_SIZE.SM,
                fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
                color: COLORS.TEXT_PRIMARY,
                borderBottom: `1px solid ${COLORS.BORDER}`,
                paddingBottom: SPACING.XS,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.SM }}>
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
            case 'success': return COLORS.NEON_GREEN;
            case 'warning': return 'orange';
            case 'error': return COLORS.NEON_RED;
            default: return 'transparent';
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: TYPOGRAPHY.FONT_SIZE.SM
        }}>
            <span style={{ color: COLORS.TEXT_SECONDARY }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
                    fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO
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
