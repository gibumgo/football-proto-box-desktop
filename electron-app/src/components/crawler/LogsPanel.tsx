import React, { useEffect, useRef } from 'react';
import { COLORS, TYPOGRAPHY, DENSITY } from '../../constants/designSystem';

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
            backgroundColor: COLORS.SURFACE,
            borderTop: `1px solid ${COLORS.BORDER}`,
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
                    backgroundColor: COLORS.HEADER,
                    borderBottom: isCollapsed ? 'none' : `1px solid ${COLORS.BORDER}`
                }}
            >
                <div style={{
                    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
                    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
                    color: COLORS.TEXT_PRIMARY,
                    fontFamily: TYPOGRAPHY.FONT_FAMILY.SANS
                }}>
                    Python CLI Output
                </div>
                <div style={{
                    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
                    color: COLORS.TEXT_SECONDARY,
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
                        backgroundColor: '#000',
                        color: COLORS.NEON_GREEN,
                        fontFamily: TYPOGRAPHY.FONT_FAMILY.MONO,
                        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
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
