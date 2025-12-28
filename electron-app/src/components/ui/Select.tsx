import React from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    fullWidth = false,
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
                    fontSize: NEON_THEME.typography.size.sm,
                    color: NEON_THEME.colors.text.secondary,
                    fontWeight: NEON_THEME.typography.weight.medium,
                    marginLeft: '2px'
                }}>
                    {label}
                </label>
            )}
            <select
                style={{
                    padding: '8px 12px',
                    backgroundColor: NEON_THEME.colors.bg.app,
                    border: `1px solid ${NEON_THEME.colors.border.default}`,
                    borderRadius: NEON_THEME.layout.radius.sm,
                    color: NEON_THEME.colors.text.primary,
                    fontSize: NEON_THEME.typography.size.sm,
                    fontFamily: NEON_THEME.typography.fontFamily.sans,
                    outline: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `linear-gradient(45deg, transparent 50%, ${NEON_THEME.colors.text.secondary} 50%), linear-gradient(135deg, ${NEON_THEME.colors.text.secondary} 50%, transparent 50%)`,
                    backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
                    backgroundSize: '5px 5px, 5px 5px',
                    backgroundRepeat: 'no-repeat',
                    ...style
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = NEON_THEME.colors.neon.cyan;
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = NEON_THEME.colors.border.default;
                }}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
