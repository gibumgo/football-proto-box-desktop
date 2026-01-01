import React, { useState } from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';
import { TEXTS } from '@/constants/uiTexts';

// Sub-Forms
import { BetinfoConfigForm } from './forms/BetinfoConfigForm';
import { FlashscoreConfigForm } from './forms/FlashscoreConfigForm';
import { MappingConfigForm } from './forms/MappingConfigForm';
import { ActiveJobCard } from './ActiveJobCard';
import { AdvancedConfigForm } from './forms/AdvancedConfigForm';

interface CrawlerControlPanelProps {
    isRunning: boolean;
    activeMode: 'betinfo' | 'flashscore' | 'mapping';
    // Hoisted Data Props
    betinfoData: { config: any, handlers: any };
    flashscoreData: { config: any, handlers: any, reset: any };
    mappingData: { config: any, handlers: any };
    advancedData: { config: any, handlers: any };
}

const CrawlerControlPanel: React.FC<CrawlerControlPanelProps> = ({
    isRunning,
    activeMode,
    betinfoData,
    flashscoreData,
    mappingData,
    advancedData
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: NEON_THEME.spacing.lg
        }}>
            {/* Main Config Form Area */}
            <div style={{
                display: 'flex',
                gap: NEON_THEME.spacing.md,
                minHeight: '200px'
            }}>
                {activeMode === 'betinfo' && (
                    <BetinfoConfigForm
                        config={betinfoData.config}
                        handlers={betinfoData.handlers}
                        disabled={isRunning}
                    />
                )}
                {activeMode === 'flashscore' && (
                    isRunning ? (
                        <ActiveJobCard
                            taskType={flashscoreData.config.task || 'CRAWLING'}
                            targetName={flashscoreData.config.league ? `${flashscoreData.config.country} - ${flashscoreData.config.league}` : (flashscoreData.config.url || 'Manual URL')}
                            onStop={() => { }} // Stop is handled globally via Header
                        />
                    ) : (
                        <FlashscoreConfigForm
                            config={flashscoreData.config}
                            handlers={flashscoreData.handlers}
                            disabled={isRunning}
                        />
                    )
                )}
                {activeMode === 'mapping' && (
                    <MappingConfigForm
                        config={mappingData.config}
                        handlers={mappingData.handlers}
                        disabled={isRunning}
                    />
                )}
            </div>

            {/* Advanced Settings Accordion */}
            <div style={{
                borderTop: `1px solid ${NEON_THEME.colors.border.default}`,
                paddingTop: NEON_THEME.spacing.sm
            }}>
                <button
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        color: NEON_THEME.colors.text.secondary,
                        cursor: 'pointer',
                        padding: `${NEON_THEME.spacing.xs} 0`,
                        fontSize: NEON_THEME.typography.size.sm,
                        fontWeight: NEON_THEME.typography.weight.medium,
                        outline: 'none'
                    }}
                >
                    <span>{TEXTS.CRAWLER.CONTROL_PANEL.ADVANCED_SETTINGS}</span>
                    <span style={{
                        fontSize: '10px',
                        transform: isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: isAdvancedOpen ? NEON_THEME.colors.neon.cyan : 'inherit'
                    }}>▼</span>
                </button>

                {isAdvancedOpen && (
                    <div style={{ marginTop: NEON_THEME.spacing.md, animation: 'fadeIn 0.2s ease' }}>
                        <AdvancedConfigForm
                            config={advancedData.config}
                            handlers={advancedData.handlers}
                            disabled={isRunning}
                        />
                    </div>
                )}
            </div>

            <style>
                {`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}
            </style>
        </div>
    );
};

export default CrawlerControlPanel;
