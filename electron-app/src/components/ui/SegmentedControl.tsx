import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SegmentedControlProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '4px',
            borderRadius: NEON_THEME.layout.radius.md,
            border: `1px solid ${NEON_THEME.colors.border.subtle}`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
            gap: '2px'
        }}>
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => !disabled && !option.disabled && onChange(option.value)}
                        disabled={disabled || option.disabled}
                        style={{
                            flex: 1,
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: NEON_THEME.layout.radius.sm,
                            backgroundColor: isSelected ? NEON_THEME.colors.bg.panel : 'transparent',
                            color: isSelected ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.muted,
                            fontSize: '11px', // Unified font size
                            fontWeight: isSelected ? NEON_THEME.typography.weight.bold : NEON_THEME.typography.weight.medium,
                            cursor: (disabled || option.disabled) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            opacity: (disabled || option.disabled) ? 0.5 : 1
                        }}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
