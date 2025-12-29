import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface RadioGroupProps {
    label?: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    direction?: 'row' | 'column';
    disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    options,
    value,
    onChange,
    direction = 'row',
    disabled = false
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            <div style={{ display: 'flex', flexDirection: direction, gap: NEON_THEME.spacing.lg }}>
                {options.map((option) => (
                    <RadioButton
                        key={option.value}
                        label={option.label}
                        checked={value === option.value}
                        onClick={() => onChange(option.value)}
                        disabled={disabled || option.disabled}
                    />
                ))}
            </div>
        </div>
    );
};

interface RadioButtonProps {
    label: string;
    checked: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, checked, onClick, disabled }) => (
    <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: checked ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.primary,
        fontSize: NEON_THEME.typography.size.sm,
        userSelect: 'none',
        opacity: disabled ? 0.5 : (checked ? 1 : 0.6)
    }}>
        <div
            onClick={!disabled ? onClick : undefined}
            style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: `1px solid ${checked ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: checked ? `0 0 8px ${NEON_THEME.colors.neon.cyan}40` : 'none',
                transition: 'all 0.2s'
            }}>
            {checked && <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: NEON_THEME.colors.neon.cyan
            }} />}
        </div>
        <span onClick={!disabled ? onClick : undefined}>{label}</span>
    </label>
);
