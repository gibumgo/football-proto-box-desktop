import { useState, useEffect, useCallback } from 'react';
import DataInventoryCard, { DataRow } from '../components/crawler/DataInventoryCard';
import CrawlerControlPanel from '../components/crawler/CrawlerControlPanel';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/designSystem';
import type { CrawlerMessage, BetinfoOptions, FlashscoreOptions, MappingOptions } from '../types/crawler';

export function CrawlerDashboard() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    // Handle IPC messages from Python
    useEffect(() => {
        const unsubscribe = window.api.crawler.onMessage((message: CrawlerMessage) => {
            switch (message.type) {
                case 'STATUS':
                    setLogs(prev => [...prev, `[STATUS] ${message.payload.statusType}: ${message.payload.value}`]);
                    break;

                case 'PROGRESS':
                    setProgress(message.payload.percent);
                    break;

                case 'DATA':
                    setLogs(prev => [...prev, `[DATA] Saved ${Object.keys(message.payload).length} items`]);
                    break;

                case 'LOG':
                    setLogs(prev => [...prev, `[${message.payload.level}] ${message.payload.message}`]);
                    break;

                case 'ERROR':
                    setLogs(prev => [...prev, `[ERROR ${message.payload.code}] ${message.payload.message}`]);
                    setIsRunning(false);
                    break;

                case 'CHECKPOINT':
                    setLogs(prev => [...prev, `[CHECKPOINT] ${message.payload.checkpointId}`]);
                    break;
            }
        });

        // Check initial status
        window.api.crawler.status().then(({ isRunning }) => {
            setIsRunning(isRunning);
        });

        return unsubscribe;
    }, []);

    const handleStart = useCallback(async (options: BetinfoOptions | FlashscoreOptions | MappingOptions) => {
        try {
            setLogs([]);
            setProgress(0);

            await window.api.crawler.start(options);
            setIsRunning(true);
            setLogs(prev => [...prev, `System: Starting crawler (${options.mode})...`]);
        } catch (error) {
            console.error('Failed to start crawler:', error);
            setLogs(prev => [...prev, `[ERROR] Failed to start: ${error}`]);
        }
    }, []);

    const handleStop = useCallback(async () => {
        try {
            await window.api.crawler.stop();
            setIsRunning(false);
            setLogs(prev => [...prev, 'System: Crawler stopped.']);
        } catch (error) {
            console.error('Failed to stop crawler:', error);
            setLogs(prev => [...prev, `[ERROR] Failed to stop: ${error}`]);
        }
    }, []);

    return (
        <div style={{
            backgroundColor: COLORS.APP_BG,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: COLORS.HEADER,
                borderBottom: `1px solid ${COLORS.BORDER}`,
                padding: `${SPACING.MD} ${SPACING.LG}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                height: '48px',
                boxSizing: 'border-box'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
                    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
                    color: COLORS.TEXT_PRIMARY,
                    fontFamily: TYPOGRAPHY.FONT_FAMILY.SANS,
                    letterSpacing: '-0.5px'
                }}>
                    Crawler Manager
                </h1>
                <div style={{
                    display: 'flex',
                    gap: SPACING.SM,
                    alignItems: 'center',
                    fontSize: '11px',
                    backgroundColor: '#000',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.BORDER}`
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isRunning ? COLORS.NEON_GREEN : COLORS.TEXT_SECONDARY,
                        boxShadow: isRunning ? `0 0 5px ${COLORS.NEON_GREEN}` : 'none'
                    }} />
                    <span style={{ color: COLORS.TEXT_SECONDARY }}>
                        {isRunning ? 'RUNNING' : 'IDLE'}
                    </span>
                </div>
            </div>

            {/* Main Layout */}
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
            }}>
                {/* Left Column - Control Panel */}
                <div style={{
                    flex: '0 0 320px',
                    maxWidth: '360px',
                    backgroundColor: COLORS.SURFACE,
                    borderRight: `1px solid ${COLORS.BORDER}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: SPACING.LG, display: 'flex', flexDirection: 'column', gap: SPACING.XL }}>

                        {/* 1. Crawler Execution */}
                        <Section title="EXECUTION">
                            <CrawlerControlPanel
                                onStart={handleStart}
                                onStop={handleStop}
                                isRunning={isRunning}
                            />
                        </Section>

                        {/* 2. Dashboard Stats (Simplified) */}
                        <Section title="OVERVIEW">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <SummaryItem label="Last Run" value="Today, 05:30" />
                                <SummaryItem label="Total Matches" value="1,240" />
                                <SummaryItem label="Coverage" value="Betinfo (25), Flashscore (8)" />
                            </div>
                        </Section>

                        {/* 3. Settings Links */}
                        <div style={{ marginTop: 'auto', paddingTop: SPACING.LG }}>
                            <div style={{
                                fontSize: '11px',
                                color: COLORS.TEXT_SECONDARY,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                padding: '12px',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '6px'
                            }}>
                                <span style={{ color: COLORS.NEON_BLUE, fontWeight: 'bold' }}>DATA STORAGE</span>
                                <code style={{ fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO, fontSize: '10px' }}>./data</code>
                                <div style={{ height: '8px' }} />
                                <div>Football Proto Box v1.0.0</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Data & Logs */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#0d1117' // Darker bg for content area
                }}>
                    {/* Top: Data Cards */}
                    <div style={{
                        flex: '1',
                        overflowY: 'auto',
                        padding: SPACING.LG
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: SPACING.MD,
                            marginBottom: SPACING.LG
                        }}>
                            <DataInventoryCard title="Betinfo Data">
                                <DataRow label="Rounds" value="1 ~ 25" status="success" />
                                <DataRow label="Total" value="25 Files" />
                            </DataInventoryCard>

                            <DataInventoryCard title="Flashscore Data">
                                <DataRow label="Leagues" value="8" status="success" />
                                <DataRow label="Teams" value="160" />
                            </DataInventoryCard>

                            <DataInventoryCard title="System">
                                <DataRow label="Python" value="3.9.6" />
                                <DataRow label="Selenium" value="Ready" status="success" />
                            </DataInventoryCard>
                        </div>
                    </div>

                    {/* Bottom: Progress & Logs */}
                    <div style={{
                        flexShrink: 0,
                        borderTop: `1px solid ${COLORS.BORDER}`,
                        backgroundColor: COLORS.SURFACE
                    }}>
                        {/* Progress Bar (Conditional) */}
                        {isRunning && (
                            <div style={{
                                height: '4px',
                                width: '100%',
                                backgroundColor: COLORS.APP_BG,
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    backgroundColor: COLORS.NEON_BLUE,
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        )}

                        {/* Logs Window */}
                        <div style={{
                            height: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                padding: '8px 16px',
                                borderBottom: `1px solid ${COLORS.BORDER}`,
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: COLORS.TEXT_SECONDARY,
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: COLORS.HEADER
                            }}>
                                <span>TERMINAL OUTPUT</span>
                                <span style={{ fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO }}>{logs.length} lines</span>
                            </div>
                            <div style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#000',
                                color: '#abb2bf',
                                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                overflowY: 'auto'
                            }}>
                                {logs.length === 0 ? (
                                    <div style={{ opacity: 0.3 }}>Waiting for tasks...</div>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} style={{
                                            color: log.includes('[ERROR]') ? COLORS.NEON_RED :
                                                log.includes('[STATUS]') ? COLORS.NEON_CYAN :
                                                    'inherit',
                                            paddingLeft: log.startsWith('  ') ? '16px' : '0'
                                        }}>
                                            {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Minimal Helpers
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 'bold',
            color: COLORS.TEXT_SECONDARY,
            letterSpacing: '1px'
        }}>
            {title}
        </h3>
        {children}
    </div>
);

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        padding: '4px 0',
        borderBottom: `1px dashed ${COLORS.BORDER}`
    }}>
        <span style={{ color: COLORS.TEXT_SECONDARY }}>{label}</span>
        <span style={{ color: COLORS.TEXT_PRIMARY }}>{value}</span>
    </div>
);
