import { useState, useRef, useEffect } from 'react';
import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';

interface Option {
    label: string;
    value: string | number;
}

interface SelectProps {
    value: string | number | null;
    onChange: (value: any) => void;
    options: Option[];
    placeholder?: string;
    width?: string;
}

export function Select({ value, onChange, options, placeholder = '선택해주세요', width = '200px' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string | number) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width,
                fontFamily: TYPOGRAPHY.FONT_FAMILY
            }}
        >
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 16px',
                    backgroundColor: COLORS.PANEL,
                    border: `1px solid ${isOpen ? COLORS.NEON_BLUE : COLORS.BORDER}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: selectedOption ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY,
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? `0 0 8px ${COLORS.NEON_BLUE}40` : 'none',
                    fontSize: TYPOGRAPHY.SIZE.SM,
                    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    fontSize: '10px',
                    color: COLORS.TEXT_SECONDARY
                }}>
                    ▼
                </span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    backgroundColor: COLORS.SURFACE,
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: '6px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <div
                                key={String(option.value)}
                                onClick={() => handleSelect(option.value)}
                                style={{
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'rgba(79, 195, 247, 0.1)' : 'transparent',
                                    color: isSelected ? COLORS.NEON_BLUE : COLORS.TEXT_PRIMARY,
                                    fontSize: TYPOGRAPHY.SIZE.SM,
                                    borderBottom: `1px solid ${COLORS.BORDER}40`,
                                    transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {option.label}
                            </div>
                        );
                    })}
                    {options.length === 0 && (
                        <div style={{ padding: '12px', textAlign: 'center', color: COLORS.TEXT_SECONDARY, fontSize: TYPOGRAPHY.SIZE.SM }}>
                            데이터 없음
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
