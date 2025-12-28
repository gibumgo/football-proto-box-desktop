import React, { useState } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'default';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    icon,
    style,
    disabled,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Theme Mapping (Can be extracted to a hook or utility later for real theme switching)
    let color: string = NEON_THEME.colors.text.primary;
    let borderColor: string = NEON_THEME.colors.border.default;
    let glowColor: string = 'transparent';
    let bgHover: string = 'rgba(255,255,255,0.05)';

    if (variant === 'primary') {
        color = NEON_THEME.colors.neon.cyan;
        borderColor = NEON_THEME.colors.neon.cyan;
        glowColor = NEON_THEME.effects.glow.cyan;
        bgHover = 'rgba(0, 243, 255, 0.1)';
    } else if (variant === 'danger') {
        color = NEON_THEME.colors.neon.red;
        borderColor = NEON_THEME.colors.neon.red;
        glowColor = NEON_THEME.effects.glow.red;
        bgHover = 'rgba(255, 46, 46, 0.1)';
    }

    const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px';
    const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px';

    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            disabled={disabled}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: fullWidth ? '100%' : 'auto',
                padding,
                fontSize,
                fontWeight: NEON_THEME.typography.weight.bold,
                fontFamily: NEON_THEME.typography.fontFamily.sans,
                color: disabled ? NEON_THEME.colors.text.muted : color,
                backgroundColor: disabled ? 'transparent' : (isHovered ? bgHover : 'transparent'),
                border: `1px solid ${disabled ? NEON_THEME.colors.border.default : borderColor}`,
                borderRadius: NEON_THEME.layout.radius.sm,
                cursor: disabled ? 'not-allowed' : 'pointer',
                boxShadow: (isHovered && !disabled) ? glowColor : 'none',
                transform: isActive && !disabled ? 'translateY(1px)' : 'none',
                transition: 'all 0.1s ease',
                outline: 'none',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                ...style
            }}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
};
