import { useEffect, useRef } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';
import { TEXTS } from '../../constants/uiTexts';
import { LOG_PREFIX } from '@/constants/domain';

interface TerminalWindowProps {
    logs: string[];
    progress?: number;
}

export function TerminalWindow({ logs, progress = 0 }: TerminalWindowProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const styles = {
        container: {
            height: '100%',
            backgroundColor: NEON_THEME.colors.bg.terminal,
            color: NEON_THEME.colors.neon.green,
            fontFamily: NEON_THEME.typography.fontFamily.mono,
            padding: NEON_THEME.spacing.md,
            borderRadius: NEON_THEME.layout.radius.md,
            boxShadow: NEON_THEME.effects.shadow.sm,
            display: 'flex',
            flexDirection: 'column' as const,
            overflow: 'hidden',
            boxSizing: 'border-box' as const
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: NEON_THEME.spacing.sm,
            paddingBottom: NEON_THEME.spacing.xs,
            borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
            fontSize: NEON_THEME.typography.size.xs,
            color: NEON_THEME.colors.text.secondary
        },
        progressBarContainer: {
            height: '2px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginBottom: NEON_THEME.spacing.sm
        },
        progressBar: {
            height: '100%',
            backgroundColor: NEON_THEME.colors.neon.cyan,
            transition: 'width 0.3s ease-out',
            boxShadow: `0 0 5px ${NEON_THEME.colors.neon.cyan}`
        },
        linesContainer: {
            flex: 1,
            overflowY: 'auto' as const,
            paddingRight: NEON_THEME.spacing.xs,
            fontSize: NEON_THEME.typography.size.xs,
            lineHeight: 1.5
        },
        line: {
            marginBottom: '2px',
            wordBreak: 'break-all' as const
        },
        waiting: {
            color: NEON_THEME.colors.text.disabled,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: NEON_THEME.spacing.sm,
            fontStyle: 'italic'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span>{TEXTS.CRAWLER.TERMINAL.TITLE}</span>
                <span>{logs.length} {TEXTS.CRAWLER.TERMINAL.LINES}</span>
            </div>

            {/* Progress Bar */}
            {progress > 0 && (
                <div style={styles.progressBarContainer}>
                    <div style={{ ...styles.progressBar, width: `${Math.min(100, Math.max(0, progress))}%` }} />
                </div>
            )}

            <div
                ref={terminalRef}
                className="custom-scrollbar"
                style={styles.linesContainer}
            >
                {logs.length === 0 ? (
                    <div style={styles.waiting}>
                        <span>_</span>
                        {TEXTS.CRAWLER.TERMINAL.WAITING}
                    </div>
                ) : (
                    logs.map((log: string, i: number) => {
                        let color: string = NEON_THEME.colors.neon.green;
                        if (log.includes(LOG_PREFIX.ERROR)) color = NEON_THEME.colors.neon.red;
                        if (log.includes(LOG_PREFIX.WARN)) color = NEON_THEME.colors.neon.yellow;
                        if (log.includes(LOG_PREFIX.SUCCESS)) color = NEON_THEME.colors.neon.cyan;
                        if (log.includes(LOG_PREFIX.SYSTEM)) color = NEON_THEME.colors.text.secondary;

                        return (
                            <div key={i} style={{ ...styles.line, color }}>
                                <span style={{ opacity: 0.5, marginRight: '8px' }}>
                                    [{new Date().toLocaleTimeString()}]
                                </span>
                                {log}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
