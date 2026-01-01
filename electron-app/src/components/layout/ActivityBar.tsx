import React from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';
import { TEXTS } from '@/constants/uiTexts';

interface ActivityBarProps {
    activeMode: 'betinfo' | 'flashscore' | 'mapping';
    onModeChange: (mode: 'betinfo' | 'flashscore' | 'mapping') => void;
    isRunning: boolean;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activeMode, onModeChange, isRunning }) => {
    const tabs = [
        { id: 'betinfo', label: 'B', tooltip: TEXTS.CRAWLER.SITE_BETINFO, color: NEON_THEME.colors.neon.cyan },
        { id: 'flashscore', label: 'F', tooltip: TEXTS.CRAWLER.SITE_FLASHSCORE, color: NEON_THEME.colors.neon.green },
        { id: 'mapping', label: 'M', tooltip: TEXTS.CRAWLER.SITE_MAPPING, color: NEON_THEME.colors.neon.purple }
    ];

    return (
        <div style={{
            width: '64px',
            backgroundColor: NEON_THEME.colors.bg.panel,
            borderRight: `1px solid ${NEON_THEME.colors.border.subtle}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: NEON_THEME.spacing.md,
            gap: NEON_THEME.spacing.md,
            zIndex: 10
        }}>
            {tabs.map((tab) => {
                const isActive = activeMode === tab.id;
                return (
                    <div
                        key={tab.id}
                        onClick={() => !isRunning && onModeChange(tab.id as any)}
                        title={tab.tooltip} // Tooltip for accessibility
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            borderLeft: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                            color: isActive ? tab.color : NEON_THEME.colors.text.muted,
                            fontSize: '18px',
                            fontWeight: 700,
                            transition: 'all 0.2s ease',
                            opacity: isRunning && !isActive ? 0.4 : 1
                        }}
                    >
                        {tab.label}
                    </div>
                );
            })}
        </div>
    );
};
