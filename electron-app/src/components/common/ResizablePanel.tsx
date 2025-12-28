import React, { useState, useCallback, useEffect } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface ResizablePanelProps {
    children: React.ReactNode;
    initialHeight?: number;
    minHeight?: number;
    maxHeight?: number | string;
    onResize?: (height: number) => void;
    direction?: 'vertical' | 'horizontal'; // Currently implementing vertical (bottom panel mostly)
}

export function ResizablePanel({
    children,
    initialHeight = 300,
    minHeight = 150,
    maxHeight = '60vh',
    onResize
}: ResizablePanelProps) {
    const [height, setHeight] = useState(initialHeight);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        // Calculate new height based on mouse position from bottom
        // Since this panel is usually at bottom, we check distance from bottom or relative movement
        // Actually, cleaner way if panel is at bottom: 
        // New Height = window.innerHeight - e.clientY
        // But this depends on layout. Let's assume standard resize handle usage.

        // Simpler approach for bottom panel:
        // Delta Y. If moving up, height increases.
        const newHeight = window.innerHeight - e.clientY;

        if (newHeight >= minHeight) {
            // Check max height if number
            if (typeof maxHeight === 'number' && newHeight > maxHeight) return;

            setHeight(newHeight);
            if (onResize) onResize(newHeight);
        }
    }, [isDragging, minHeight, maxHeight, onResize]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: height,
            minHeight,
            maxHeight,
            flexShrink: 0,
            position: 'relative'
        }}>
            {/* Resize Handle */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    height: '4px',
                    width: '100%',
                    cursor: 'ns-resize',
                    backgroundColor: isDragging ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.border.default,
                    transition: 'background-color 0.2s, box-shadow 0.2s',
                    zIndex: 10,
                    boxShadow: isDragging ? NEON_THEME.effects.glow.cyan : 'none'
                }}
            />
            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}
