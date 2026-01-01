import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface Option {
    label: string;
    value: string;
}

interface InteractiveSelectProps {
    label?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    searchable?: boolean;
}

export const InteractiveSelect: React.FC<InteractiveSelectProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Select...",
    disabled = false,
    fullWidth = false,
    searchable = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(''); // Reset search on close
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = useMemo(() => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div
            ref={containerRef}
            style={{
                ...styles.container,
                width: fullWidth ? '100%' : 'auto',
                flex: fullWidth ? 1 : 'unset',
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'auto'
            }}
        >
            {label && (
                <label style={{
                    ...styles.label,
                    color: isOpen ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary,
                    textShadow: isOpen ? NEON_THEME.effects.glow.cyan : 'none'
                }}>
                    {label}
                </label>
            )}

            {/* Trigger Box */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={{
                    ...styles.trigger,
                    border: `1px solid ${isOpen ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.border.default}`,
                    boxShadow: isOpen ? NEON_THEME.effects.glow.cyan : 'none',
                }}
            >
                <span style={styles.valueText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                {/* Arrow Icon */}
                <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        opacity: 0.7
                    }}
                >
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke={NEON_THEME.colors.text.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={styles.dropdown}>
                    {/* Search Input */}
                    {searchable && (
                        <div style={styles.searchContainer}>
                            <input
                                ref={inputRef}
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                style={styles.searchInput}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Options List */}
                    <div style={styles.optionsList}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    style={{
                                        ...styles.optionItem,
                                        backgroundColor: opt.value === value ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                                        borderLeft: opt.value === value ? `2px solid ${NEON_THEME.colors.neon.cyan}` : '2px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (opt.value !== value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (opt.value !== value) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div style={styles.noResults}>
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-4px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        position: 'relative',
    } as React.CSSProperties,
    label: {
        fontSize: NEON_THEME.typography.size.sm,
        fontWeight: NEON_THEME.typography.weight.medium,
        marginLeft: '2px',
        transition: NEON_THEME.effects.transition.fast,
    } as React.CSSProperties,
    trigger: {
        padding: '10px 14px',
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
        borderRadius: NEON_THEME.layout.radius.md,
        color: NEON_THEME.colors.text.primary,
        fontSize: NEON_THEME.typography.size.md,
        fontFamily: NEON_THEME.typography.fontFamily.sans,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
    } as React.CSSProperties,
    valueText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: 'inherit'
    } as React.CSSProperties,
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        border: `1px solid ${NEON_THEME.colors.border.subtle}`,
        borderRadius: NEON_THEME.layout.radius.md,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: NEON_THEME.layout.zIndex.overlay,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out forwards',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column'
    } as React.CSSProperties,
    searchContainer: {
        padding: '8px',
        borderBottom: `1px solid ${NEON_THEME.colors.border.subtle}`
    } as React.CSSProperties,
    searchInput: {
        width: '100%',
        padding: '6px 8px',
        borderRadius: NEON_THEME.layout.radius.sm,
        border: 'none',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: NEON_THEME.colors.text.primary,
        fontSize: '13px',
        outline: 'none'
    } as React.CSSProperties,
    optionsList: {
        overflowY: 'auto',
        maxHeight: '250px'
    } as React.CSSProperties,
    optionItem: {
        padding: '10px 14px',
        fontSize: '13px',
        color: NEON_THEME.colors.text.primary,
        cursor: 'pointer',
        transition: 'background-color 0.1s',
    } as React.CSSProperties,
    noResults: {
        padding: '12px',
        textAlign: 'center',
        color: NEON_THEME.colors.text.muted,
        fontSize: '12px'
    } as React.CSSProperties
};
