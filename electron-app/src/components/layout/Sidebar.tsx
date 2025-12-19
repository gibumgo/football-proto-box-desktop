import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';
import { LAYOUT } from '../../domain/design/layout';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'matches', label: 'Analysis' },
        { id: 'tools', label: 'Tools' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <div style={{
            width: LAYOUT.SIDEBAR_WIDTH,
            height: '100%',
            backgroundColor: COLORS.SURFACE,
            borderRight: `1px solid ${COLORS.BORDER}`,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo Area */}
            <div style={{
                height: LAYOUT.TOPBAR_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                borderBottom: `1px solid ${COLORS.BORDER}`,
                fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                fontSize: TYPOGRAPHY.SIZE.XL,
                color: COLORS.TEXT_PRIMARY,
                letterSpacing: '0.05em'
            }}>
                PROTO BOX
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, paddingTop: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map(item => {
                        const isActive = currentPage === item.id;
                        return (
                            <li
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    padding: '12px 24px',
                                    cursor: 'pointer',
                                    fontSize: TYPOGRAPHY.SIZE.MD,
                                    color: isActive ? COLORS.NEON_BLUE : COLORS.TEXT_SECONDARY,
                                    backgroundColor: isActive ? 'rgba(79, 195, 247, 0.08)' : 'transparent',
                                    fontWeight: isActive ? TYPOGRAPHY.WEIGHT.MEDIUM : TYPOGRAPHY.WEIGHT.REGULAR,
                                    transition: 'all 0.2s ease',
                                    borderLeft: isActive ? `3px solid ${COLORS.NEON_BLUE}` : '3px solid transparent',
                                    boxShadow: isActive ? '0 0 10px rgba(79, 195, 247, 0.2)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(79, 195, 247, 0.04)';
                                        e.currentTarget.style.color = COLORS.TEXT_PRIMARY;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = COLORS.TEXT_SECONDARY;
                                    }
                                }}
                            >
                                {item.label}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Version Text */}
            <div style={{ padding: '20px', fontSize: TYPOGRAPHY.SIZE.XS, color: COLORS.TEXT_SECONDARY, opacity: 0.5 }}>
                v0.1.0 Alpha
            </div>
        </div>
    );
}
