import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    disabled = false
}) => {
    return (
        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: NEON_THEME.colors.text.primary,
            fontSize: NEON_THEME.typography.size.sm,
            userSelect: 'none',
            opacity: disabled ? 0.5 : 1
        }}>
            <div
                onClick={() => !disabled && onChange(!checked)}
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    border: `1px solid ${checked ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary}`,
                    backgroundColor: checked ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: NEON_THEME.colors.neon.cyan,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    boxShadow: checked ? `0 0 8px ${NEON_THEME.colors.neon.cyan}40` : 'none'
                }}>
                {checked && '✓'}
            </div>
            <span onClick={() => !disabled && onChange(!checked)}>{label}</span>
        </label>
    );
};
