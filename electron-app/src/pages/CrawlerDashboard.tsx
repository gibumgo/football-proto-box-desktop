import { useState, useEffect, useRef } from 'react';
import { COLORS, TYPOGRAPHY } from '../domain/design/theme';
import { crawlerApi } from '../api/crawlerApi';
import { CRAWLER_CONFIG } from '../constants/crawlerConstants';
import { TEXTS } from '../constants/uiTexts';

interface CrawlerConfig {
    site: 'betinfo' | 'flashscore';
    startRound: string;
    endRound: string;
    headless: boolean;
    timeout: number;
}

export function CrawlerDashboard() {
    const [config, setConfig] = useState<CrawlerConfig>({
        site: 'betinfo',
        startRound: '2025040',
        endRound: '',
        headless: CRAWLER_CONFIG.DEFAULT_HEADLESS,
        timeout: CRAWLER_CONFIG.DEFAULT_TIMEOUT
    });

    const [status, setStatus] = useState<any>({ status: 'IDLE', progress: 0, lastLog: '' });
    const [logs, setLogs] = useState<string[]>([]);
    const [polling, setPolling] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const checkStatus = async () => {
            try {
                const currentStatus = await crawlerApi.getStatus();
                setStatus(currentStatus);
                if (currentStatus.status === 'RUNNING') {
                    setPolling(true);
                } else if (currentStatus.status !== 'IDLE') {
                    setPolling(false);
                }

                if (currentStatus.lastLog && logs[logs.length - 1] !== currentStatus.lastLog) {
                    setLogs(prev => [...prev, currentStatus.lastLog]);
                }
            } catch (e) {
                console.error("Failed to poll status", e);
            }
        };

        checkStatus();

        let interval: any;
        if (polling) {
            interval = setInterval(checkStatus, 1000);
        }
        return () => clearInterval(interval);
    }, [polling]);


    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleStart = async () => {
        try {
            setLogs([]);
            await crawlerApi.start({
                ...config,
                mode: config.site
            });
            setPolling(true);
        } catch (e) {
            alert('Failed to start crawler: ' + e);
        }
    };

    const handleStop = async () => {
        try {
            await crawlerApi.stop();
            setPolling(false);
        } catch (e) {
            alert('Failed to stop crawler: ' + e);
        }
    };

    const isRunning = status.status === 'RUNNING';

    return (
        <div style={{ padding: '24px', color: COLORS.TEXT_PRIMARY }}>
            <h1 style={{ fontSize: TYPOGRAPHY.SIZE.XXL, marginBottom: '24px' }}>{TEXTS.CRAWLER.TITLE}</h1>

            <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{
                    flex: 1,
                    backgroundColor: COLORS.SURFACE,
                    padding: '24px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.BORDER}`
                }}>
                    <h2 style={{ fontSize: TYPOGRAPHY.SIZE.LG, marginBottom: '16px' }}>{TEXTS.CRAWLER.SECTION_CONFIG}</h2>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: COLORS.TEXT_SECONDARY }}>{TEXTS.CRAWLER.LABEL_SITE}</label>
                        <select
                            value={config.site}
                            onChange={e => setConfig({ ...config, site: e.target.value as any })}
                            style={{
                                width: '100%', padding: '8px',
                                backgroundColor: COLORS.APP_BG, border: `1px solid ${COLORS.BORDER}`, color: COLORS.TEXT_PRIMARY
                            }}
                            disabled={isRunning}
                        >
                            <option value="betinfo">{TEXTS.CRAWLER.SITE_BETINFO}</option>
                            <option value="flashscore">{TEXTS.CRAWLER.SITE_FLASHSCORE}</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: COLORS.TEXT_SECONDARY }}>{TEXTS.CRAWLER.LABEL_START_ROUND}</label>
                            <input
                                type="text"
                                value={config.startRound}
                                onChange={e => setConfig({ ...config, startRound: e.target.value })}
                                style={{
                                    width: '100%', padding: '8px',
                                    backgroundColor: COLORS.APP_BG, border: `1px solid ${COLORS.BORDER}`, color: COLORS.TEXT_PRIMARY
                                }}
                                disabled={isRunning}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: COLORS.TEXT_SECONDARY }}>{TEXTS.CRAWLER.LABEL_END_ROUND}</label>
                            <input
                                type="text"
                                value={config.endRound}
                                onChange={e => setConfig({ ...config, endRound: e.target.value })}
                                style={{
                                    width: '100%', padding: '8px',
                                    backgroundColor: COLORS.APP_BG, border: `1px solid ${COLORS.BORDER}`, color: COLORS.TEXT_PRIMARY
                                }}
                                disabled={isRunning}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={config.headless}
                                onChange={e => setConfig({ ...config, headless: e.target.checked })}
                                disabled={isRunning}
                                style={{ marginRight: '8px' }}
                            />
                            {TEXTS.CRAWLER.CHECKBOX_HEADLESS}
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            style={{
                                flex: 1, padding: '12px',
                                backgroundColor: isRunning ? COLORS.SURFACE : COLORS.NEON_BLUE,
                                color: isRunning ? COLORS.TEXT_SECONDARY : '#000',
                                border: 'none', borderRadius: '4px', cursor: isRunning ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {TEXTS.CRAWLER.BTN_START}
                        </button>
                        <button
                            onClick={handleStop}
                            disabled={!isRunning}
                            style={{
                                flex: 1, padding: '12px',
                                backgroundColor: !isRunning ? COLORS.SURFACE : COLORS.NEON_RED,
                                color: !isRunning ? COLORS.TEXT_SECONDARY : '#fff',
                                border: 'none', borderRadius: '4px', cursor: !isRunning ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {TEXTS.CRAWLER.BTN_STOP}
                        </button>
                    </div>
                </div>
                <div style={{
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{
                        backgroundColor: COLORS.SURFACE,
                        padding: '16px',
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.BORDER}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>{TEXTS.CRAWLER.STATUS_LABEL} <strong style={{ color: isRunning ? COLORS.NEON_BLUE : COLORS.TEXT_PRIMARY }}>{status.status}</strong></span>
                            <span>{status.progress}%</span>
                        </div>
                        <div style={{
                            width: '100%', height: '8px', backgroundColor: COLORS.APP_BG, borderRadius: '4px', overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${status.progress}%`, height: '100%',
                                backgroundColor: status.status === 'FAILED' ? COLORS.NEON_RED : COLORS.NEON_BLUE,
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>

                    <div ref={logContainerRef} style={{
                        flex: 1,
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        padding: '16px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        overflowY: 'auto',
                        color: '#4CAF50',
                        border: `1px solid ${COLORS.BORDER}`,
                        minHeight: '300px'
                    }}>
                        {logs.length === 0 ? <div style={{ opacity: 0.5 }}>{TEXTS.CRAWLER.LOG_EMPTY}</div> :
                            logs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
