import { useState } from 'react';
import CrawlerControlPanel from '@/components/crawler/CrawlerControlPanel';
import { NEON_THEME } from '@/domain/design/designTokens';
import { TerminalWindow } from '@/components/crawler/TerminalWindow';
import { DataManagementPanel } from '@/components/crawler/DataManagementPanel';
import { useCrawler } from '@/hooks/useCrawler';
import { ActivityBar } from '@/components/layout/ActivityBar';
import { MissionHeader } from '@/components/layout/MissionHeader';

// Hooks hoisted
import { useBetinfoForm } from '@/hooks/crawler/useBetinfoForm';
import { useFlashscoreForm } from '@/hooks/crawler/useFlashscoreForm';
import { useMappingForm } from '@/hooks/crawler/useMappingForm';
import { useAdvancedForm } from '@/hooks/crawler/useAdvancedForm';
import { TEXTS } from '@/constants/uiTexts';

export function CrawlerDashboard() {
    const { isRunning, logs, progress, outputDir, startCrawler, stopCrawler, resetProgress, updateOutputDir } = useCrawler();
    const [activeMode, setActiveMode] = useState<'betinfo' | 'flashscore' | 'mapping'>('betinfo');

    // State for dynamic terminal expansion
    const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

    // Define isDataMode
    const isDataMode = activeMode === 'mapping';

    // --- HOISTED FORM STATE ---
    // 1. Betinfo Config
    const { config: betinfoConfig, handlers: betinfoHandlers } = useBetinfoForm({
        collectionType: 'recent', recent: 5, startRound: '040', endRound: '050', rounds: '', year: new Date().getFullYear()
    });

    // 2. Flashscore Config
    const { config: flashscoreConfig, handlers: flashscoreHandlers, resetConfig: resetFlashscore } = useFlashscoreForm({
        task: 'metadata', season: '2025-2026', url: '', resume: false
    });

    // 3. Mapping Config
    const { config: mappingConfig, handlers: mappingHandlers } = useMappingForm({ task: 'leagues' });

    // 4. Advanced Settings
    const { config: advancedConfig, handlers: advancedHandlers } = useAdvancedForm({
        headless: true, debug: false, timeout: 300
    });

    // MASTER START HANDLER
    const handleMasterStart = () => {
        const commonOptions = { ...advancedConfig, outputDir: outputDir };

        if (activeMode === 'betinfo') {
            startCrawler({
                mode: 'betinfo',
                ...commonOptions,
                collectionType: betinfoConfig.collectionType as any,
                recent: betinfoConfig.recent,
                startRound: `${betinfoConfig.year}${String(betinfoConfig.startRound).padStart(3, '0')}`,
                endRound: `${betinfoConfig.year}${String(betinfoConfig.endRound).padStart(3, '0')}`,
                rounds: betinfoConfig.rounds,
                year: betinfoConfig.year,
                skipExisting: betinfoConfig.skipExisting
            });
        } else if (activeMode === 'flashscore') {
            const hasDiscovery = flashscoreConfig.country && flashscoreConfig.league;
            const hasUrl = flashscoreConfig.url;
            if (!hasDiscovery && !hasUrl) {
                alert(TEXTS.CRAWLER.CONTROL_PANEL.MSG_URL_REQUIRED);
                return;
            }
            startCrawler({
                mode: 'flashscore',
                ...commonOptions,
                task: hasDiscovery ? 'integrated' : (flashscoreConfig.task as any),
                season: flashscoreConfig.season,
                url: flashscoreConfig.url!,
                country: flashscoreConfig.country,
                league: flashscoreConfig.league,
                resume: flashscoreConfig.resume,
                fsStartRound: flashscoreConfig.fsStartRound,
                fsEndRound: flashscoreConfig.fsEndRound
            });
        } else {
            startCrawler({
                mode: 'mapping',
                ...commonOptions,
                task: mappingConfig.task as any
            });
        }
    };

    // Auto-expand terminal when running, collapse when stopped (optional, or keep manual control)
    // For "Mission Control" feel, let's expand on start.
    if (isRunning && !isTerminalExpanded) {
        setIsTerminalExpanded(true);
    }

    const handleSelectDir = async () => {
        const path = await (window.api as any).system.selectDirectory();
        if (path) updateOutputDir(path);
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: NEON_THEME.colors.bg.app,
            color: NEON_THEME.colors.text.primary,
            fontFamily: NEON_THEME.typography.fontFamily.sans,
            overflow: 'hidden'
        }}>
            {/* Zone A: Activity Bar (Left Nav) */}
            <ActivityBar
                activeMode={activeMode}
                onModeChange={(mode) => {
                    if (isRunning) return; // Prevent changing mode while running
                    setActiveMode(mode);
                    resetProgress(); // Reset request on mode change
                }}
                isRunning={isRunning}
            />

            {/* Content Column (Header + Workspace) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

                {/* Zone B: Mission Header (Top) */}
                <MissionHeader
                    isRunning={isRunning}
                    outputDir={outputDir}
                    onSelectDir={handleSelectDir}
                    logsCount={logs.length}
                    onStart={handleMasterStart}
                    onStop={stopCrawler}
                />

                {/* Zone C: Workspace (Main Split) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                    {/* C-1: Editor Area (Forms) */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: isDataMode ? NEON_THEME.spacing.sm : NEON_THEME.spacing.xl,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isDataMode ? NEON_THEME.spacing.sm : NEON_THEME.spacing.xl,
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: isDataMode ? '100%' : '1200px',
                            flex: isDataMode ? '0 0 auto' : '0 0 auto'
                        }}>
                            <CrawlerControlPanel
                                isRunning={isRunning}
                                activeMode={activeMode}
                                // Pass Hoisted Consumed Props
                                betinfoData={{ config: betinfoConfig, handlers: betinfoHandlers }}
                                flashscoreData={{ config: flashscoreConfig, handlers: flashscoreHandlers, reset: resetFlashscore }}
                                mappingData={{ config: mappingConfig, handlers: mappingHandlers }}
                                advancedData={{ config: advancedConfig, handlers: advancedHandlers }}
                            />
                        </div>

                        {/* Mapping Panel */}
                        {isDataMode && (
                            <div style={{ width: '100%', maxWidth: '100%', flex: 1, minHeight: '0', display: 'flex', flexDirection: 'column' }}>
                                <DataManagementPanel isRunning={isRunning} />
                            </div>
                        )}
                    </div>

                    {/* C-2: Terminal Panel (Global for Betinfo & Flashscore) */}
                    {!isDataMode && (
                        <div style={{
                            height: isRunning || isTerminalExpanded ? '40%' : '36px',
                            minHeight: '36px',
                            maxHeight: '80%',
                            transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: NEON_THEME.colors.bg.terminal,
                            borderTop: `1px solid ${NEON_THEME.colors.border.default}`, // Use default border color for solid feel
                            zIndex: 20
                            // Removed boxShadow to fix "floating" feel as per user feedback
                        }}>
                            <div
                                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                                style={{
                                    height: '36px',
                                    minHeight: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: `0 ${NEON_THEME.spacing.md}`,
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    userSelect: 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '12px', color: isRunning ? NEON_THEME.colors.neon.green : NEON_THEME.colors.text.secondary }}>
                                        {isRunning ? '● LIVE LOGS' : '○ TERMINAL'}
                                    </span>
                                    <span style={{ fontSize: '10px', color: NEON_THEME.colors.text.muted }}>
                                        bash-3.2$ tail -f crawl.log
                                    </span>
                                </div>
                                <div style={{ color: NEON_THEME.colors.text.muted, fontSize: '12px' }}>
                                    {isTerminalExpanded ? '▼' : '▲'}
                                </div>
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden', padding: NEON_THEME.spacing.sm }}>
                                <TerminalWindow logs={logs} progress={progress} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
