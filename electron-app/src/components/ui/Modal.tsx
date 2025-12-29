import React, { useEffect } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: NEON_THEME.layout.zIndex.modal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease'
        }}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: NEON_THEME.colors.bg.panel,
                    border: `1px solid ${NEON_THEME.colors.border.active}`,
                    boxShadow: NEON_THEME.effects.glow.cyan,
                    borderRadius: NEON_THEME.layout.radius.md,
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'scaleIn 0.2s ease',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: NEON_THEME.spacing.lg,
                    borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{
                        margin: 0,
                        color: NEON_THEME.colors.neon.cyan,
                        fontSize: NEON_THEME.typography.size.md,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>{title || 'Panel'}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: NEON_THEME.colors.text.secondary,
                            cursor: 'pointer',
                            fontSize: '20px'
                        }}
                    >×</button>
                </div>

                {/* Body */}
                <div style={{
                    padding: NEON_THEME.spacing.xl,
                    overflowY: 'auto'
                }}>
                    {children}
                </div>
            </div>

            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}
            </style>
        </div>
    );
}
