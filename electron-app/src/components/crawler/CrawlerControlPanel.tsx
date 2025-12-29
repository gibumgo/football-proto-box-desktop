import React, { useState } from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';
import { TEXTS } from '@/constants/uiTexts';
import type { BetinfoOptions, FlashscoreOptions, MappingOptions } from '@/types/crawler';
import { Button } from '@/components/ui/Button';

// Refactored Sub-Forms
import { BetinfoConfigForm } from './forms/BetinfoConfigForm';
import { FlashscoreConfigForm } from './forms/FlashscoreConfigForm';
import { MappingConfigForm } from './forms/MappingConfigForm';
import { AdvancedConfigForm } from './forms/AdvancedConfigForm';

// Custom Hooks (WTC Style)
import { useBetinfoForm } from '@/hooks/crawler/useBetinfoForm';
import { useFlashscoreForm } from '@/hooks/crawler/useFlashscoreForm';
import { useMappingForm } from '@/hooks/crawler/useMappingForm';
import { useAdvancedForm } from '@/hooks/crawler/useAdvancedForm';

interface CrawlerControlPanelProps {
    onStart: (options: BetinfoOptions | FlashscoreOptions | MappingOptions) => void;
    onStop: () => void;
    isRunning: boolean;
}

const CrawlerControlPanel: React.FC<CrawlerControlPanelProps> = ({ onStart, onStop, isRunning }) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [site, setSite] = useState<'betinfo' | 'flashscore' | 'mapping'>('betinfo');

    // 1. Betinfo Config (New Hook Pattern)
    const {
        config: betinfoConfig,
        handlers: betinfoHandlers
    } = useBetinfoForm({
        collectionType: 'recent',
        recent: 5,
        startRound: '040',
        endRound: '050',
        rounds: '',
        year: new Date().getFullYear()
    });

    // 2. Flashscore Config (New Hook Pattern)
    const {
        config: flashscoreConfig,
        handlers: flashscoreHandlers
    } = useFlashscoreForm({
        task: 'metadata',
        season: '2025-2026',
        url: '',
        resume: false
    });

    // 3. Mapping Config (New Hook Pattern)
    const {
        config: mappingConfig,
        handlers: mappingHandlers
    } = useMappingForm({
        task: 'leagues'
    });

    // 4. Advanced Settings
    const {
        config: advancedConfig,
        handlers: advancedHandlers
    } = useAdvancedForm({
        headless: true,
        debug: false,
        timeout: 300,
        outputDir: './data'
    });

    const handleStart = () => {
        if (site === 'betinfo') {
            onStart({
                mode: 'betinfo',
                ...advancedConfig,
                collectionType: betinfoConfig.collectionType as any,
                recent: betinfoConfig.recent,
                startRound: `${betinfoConfig.year}${String(betinfoConfig.startRound).padStart(3, '0')}`,
                endRound: `${betinfoConfig.year}${String(betinfoConfig.endRound).padStart(3, '0')}`,
                rounds: betinfoConfig.rounds,
                year: betinfoConfig.year
            });
        } else if (site === 'flashscore') {
            if (!flashscoreConfig.url) {
                // TODO: Replace with Neon Toast/Alert
                alert(TEXTS.CRAWLER.CONTROL_PANEL.MSG_URL_REQUIRED);
                return;
            }
            onStart({
                mode: 'flashscore',
                ...advancedConfig,
                task: flashscoreConfig.task as any,
                season: flashscoreConfig.season,
                url: flashscoreConfig.url!,
                resume: flashscoreConfig.resume,
                fsStartRound: flashscoreConfig.fsStartRound,
                fsEndRound: flashscoreConfig.fsEndRound
            });
        } else {
            onStart({
                mode: 'mapping',
                ...advancedConfig,
                task: mappingConfig.task as any
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: NEON_THEME.spacing.lg
        }}>
            {/* Site Selector - Chrome Style Tabs */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                padding: `0 ${NEON_THEME.spacing.sm}`,
                borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                marginBottom: NEON_THEME.spacing.sm,
                gap: '4px',
                width: '100%' // Ensure full width
            }}>
                {[
                    { label: TEXTS.CRAWLER.SITE_BETINFO, value: 'betinfo' },
                    { label: TEXTS.CRAWLER.SITE_FLASHSCORE, value: 'flashscore' },
                    { label: TEXTS.CRAWLER.SITE_MAPPING, value: 'mapping' }
                ].map((tab) => {
                    const isActive = site === tab.value;
                    return (
                        <div
                            key={tab.value}
                            onClick={() => !isRunning && setSite(tab.value as any)}
                            style={{
                                flex: 1, // Distribute space equally
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: `${NEON_THEME.spacing.sm} 4px`, // Reduced side padding
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                                cursor: isRunning ? 'not-allowed' : 'pointer',
                                opacity: isRunning && !isActive ? 0.5 : 1,
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                minWidth: 0, // Allow flex items to shrink below content size
                                textAlign: 'center',
                                userSelect: 'none',
                                color: isActive ? NEON_THEME.colors.text.primary : NEON_THEME.colors.text.muted,
                                border: isActive ? `1px solid ${NEON_THEME.colors.border.subtle}` : '1px solid transparent',
                                borderBottom: 'none',
                                marginBottom: '-1px', // Merge with bottom border
                                zIndex: isActive ? 1 : 0,
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive && !isRunning) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{
                                fontSize: '12px',
                                fontWeight: isActive ? 600 : 400,
                                letterSpacing: '0.5px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%'
                            }}>
                                {tab.label}
                            </span>
                            {/* Active Tab Indicator/Line */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-1px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    backgroundColor: NEON_THEME.colors.neon.cyan, // Highlight color
                                    borderRadius: '2px 2px 0 0'
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Main Config Form Area */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: NEON_THEME.spacing.md,
                minHeight: '200px' // Prevent layout shift
            }}>
                {site === 'betinfo' && (
                    <BetinfoConfigForm
                        config={betinfoConfig}
                        handlers={betinfoHandlers}
                        disabled={isRunning}
                    />
                )}
                {site === 'flashscore' && (
                    <FlashscoreConfigForm
                        config={flashscoreConfig}
                        handlers={flashscoreHandlers}
                        disabled={isRunning}
                    />
                )}
                {site === 'mapping' && (
                    <MappingConfigForm
                        config={mappingConfig}
                        handlers={mappingHandlers}
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
                            config={advancedConfig}
                            handlers={advancedHandlers}
                            disabled={isRunning}
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: NEON_THEME.spacing.sm, marginTop: NEON_THEME.spacing.xs }}>
                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleStart}
                    disabled={isRunning}
                    style={{ height: '40px', fontSize: '14px' }}
                >
                    {TEXTS.CRAWLER.CONTROL_PANEL.BTN_START}
                </Button>
                <Button
                    variant="danger"
                    fullWidth
                    onClick={onStop}
                    disabled={!isRunning}
                    style={{ height: '40px', fontSize: '14px' }}
                >
                    {TEXTS.CRAWLER.CONTROL_PANEL.BTN_STOP}
                </Button>
            </div>

            <style>
                {`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}
            </style>
        </div>
    );
};

export default CrawlerControlPanel;
