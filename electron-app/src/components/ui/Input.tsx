import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | boolean;
    fullWidth?: boolean;
    transparent?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = false,
    transparent = false,
    style,
    ...props
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            width: fullWidth ? '100%' : 'auto',
            flex: fullWidth ? 1 : 'unset'
        }}>
            {label && (
                <label style={{
                    fontSize: '11px',
                    color: NEON_THEME.colors.text.secondary,
                    fontWeight: NEON_THEME.typography.weight.bold,
                    letterSpacing: '0.5px',
                    marginBottom: '2px'
                }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    padding: '8px 12px',
                    backgroundColor: transparent ? 'transparent' : NEON_THEME.colors.bg.app,
                    border: transparent ? 'none' : `1px solid ${error ? NEON_THEME.colors.neon.red : NEON_THEME.colors.border.default}`,
                    borderRadius: NEON_THEME.layout.radius.sm,
                    color: NEON_THEME.colors.text.primary,
                    fontSize: NEON_THEME.typography.size.sm,
                    fontFamily: NEON_THEME.typography.fontFamily.mono,
                    outline: 'none',
                    width: '100%',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    boxShadow: error ? `0 0 5px ${NEON_THEME.colors.neon.red}40` : 'none',
                    ...style
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = NEON_THEME.colors.neon.cyan;
                    e.currentTarget.style.boxShadow = `0 0 8px ${NEON_THEME.colors.neon.cyan}30`;
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? NEON_THEME.colors.neon.red : NEON_THEME.colors.border.default;
                    e.currentTarget.style.boxShadow = error ? `0 0 5px ${NEON_THEME.colors.neon.red}40` : 'none';
                }}
                {...props}
            />
            {error && (
                <span style={{
                    fontSize: '10px',
                    color: NEON_THEME.colors.neon.red,
                    marginTop: '-2px'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};
