import React, { useEffect, useRef } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

const DENSITY = {
    COMPACT: { padding: NEON_THEME.spacing.sm }
};

interface LogsPanelProps {
    logs: string[];
    isCollapsed: boolean;
    onToggle: () => void;
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, isCollapsed, onToggle }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current && !isCollapsed) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs, isCollapsed]);

    return (
        <div style={{
            backgroundColor: NEON_THEME.colors.bg.surface,
            borderTop: `1px solid ${NEON_THEME.colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            height: isCollapsed ? 'auto' : '300px',
            transition: 'height 0.3s ease'
        }}>
            {/* Header */}
            <div
                onClick={onToggle}
                style={{
                    padding: DENSITY.COMPACT.padding,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: NEON_THEME.colors.bg.header,
                    borderBottom: isCollapsed ? 'none' : `1px solid ${NEON_THEME.colors.border.default}`
                }}
            >
                <div style={{
                    fontSize: NEON_THEME.typography.size.md,
                    fontWeight: NEON_THEME.typography.weight.bold,
                    color: NEON_THEME.colors.text.primary,
                    fontFamily: NEON_THEME.typography.fontFamily.sans
                }}>
                    Python CLI Output
                </div>
                <div style={{
                    fontSize: NEON_THEME.typography.size.lg,
                    color: NEON_THEME.colors.text.secondary,
                    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 0.3s ease'
                }}>
                    ▼
                </div>
            </div>

            {/* Logs Content */}
            {!isCollapsed && (
                <div
                    ref={logContainerRef}
                    style={{
                        flex: 1,
                        padding: DENSITY.COMPACT.padding,
                        backgroundColor: NEON_THEME.colors.bg.terminal,
                        color: NEON_THEME.colors.neon.green,
                        fontFamily: NEON_THEME.typography.fontFamily.mono,
                        fontSize: NEON_THEME.typography.size.sm,
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                    }}
                >
                    {logs.length === 0 ? (
                        <div style={{ opacity: 0.5 }}>로그가 없습니다. 크롤러를 시작하면 여기에 출력됩니다.</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} style={{ marginBottom: '2px' }}>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default LogsPanel;
