import React from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';
import { Button } from '@/components/ui/Button';

interface ActiveJobCardProps {
    taskType: string;
    targetName: string; // e.g., "Premier League (England)"
    onStop?: () => void;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ taskType, targetName, onStop }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: 'rgba(30, 30, 30, 0.6)',
            borderRadius: NEON_THEME.layout.radius.lg,
            border: `1px solid ${NEON_THEME.colors.neon.cyan}`,
            boxShadow: `0 0 20px rgba(34, 211, 238, 0.1)`,
            animation: 'fadeIn 0.5s ease-out',
            height: '100%',
            minHeight: '300px'
        }}>
            {/* Pulsing Orb */}
            <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                marginBottom: '24px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: '50%',
                    backgroundColor: NEON_THEME.colors.neon.cyan,
                    opacity: 0.2,
                    animation: 'pulse 2s infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '20px', left: '20px', right: '20px', bottom: '20px',
                    borderRadius: '50%',
                    backgroundColor: NEON_THEME.colors.neon.cyan,
                    boxShadow: `0 0 20px ${NEON_THEME.colors.neon.cyan}`
                }} />
            </div>

            <h3 style={{
                color: NEON_THEME.colors.text.primary,
                fontSize: '18px',
                marginBottom: '8px',
                fontWeight: 600
            }}>
                Crawler is Running
            </h3>

            <div style={{
                color: NEON_THEME.colors.neon.cyan,
                fontSize: '14px',
                marginBottom: '4px'
            }}>
                {taskType.toUpperCase()} MODE
            </div>

            <div style={{
                color: NEON_THEME.colors.text.secondary,
                fontSize: '13px',
                marginBottom: '32px'
            }}>
                Target: {targetName}
            </div>

            {onStop && (
                <Button
                    variant="danger"
                    onClick={onStop}
                    style={{ minWidth: '120px' }}
                >
                    STOP CRAWLING
                </Button>
            )}

            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.2; }
                        50% { transform: scale(1.5); opacity: 0.1; }
                        100% { transform: scale(1); opacity: 0.2; }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};
