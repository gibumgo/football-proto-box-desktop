import { NEON_THEME } from '../../domain/design/designTokens';
import { TEXTS } from '../../constants/uiTexts';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: TEXTS.LAYOUT.MENU.DASHBOARD },
        { id: 'leagues', label: TEXTS.LAYOUT.MENU.LEAGUES },
        { id: 'matches', label: TEXTS.LAYOUT.MENU.ANALYSIS },
        { id: 'favorites', label: TEXTS.LAYOUT.MENU.FAVORITES },
        { id: 'strategy', label: TEXTS.LAYOUT.MENU.STRATEGY },
        { id: 'odds-flow', label: TEXTS.LAYOUT.MENU.ODDS_FLOW },
        { id: 'archive', label: TEXTS.LAYOUT.MENU.ARCHIVE },
        { id: 'crawler', label: TEXTS.LAYOUT.MENU.CRAWLER },
        { id: 'tools', label: TEXTS.LAYOUT.MENU.TOOLS },
        { id: 'settings', label: TEXTS.LAYOUT.MENU.SETTINGS },
    ];

    return (
        <div style={{
            width: NEON_THEME.layout.sidebarWidth,
            height: '100%',
            backgroundColor: NEON_THEME.colors.bg.surface,
            borderRight: `1px solid ${NEON_THEME.colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo Area */}
            <div style={{
                height: NEON_THEME.layout.headerHeight,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${NEON_THEME.spacing.xl}`,
                borderBottom: `1px solid ${NEON_THEME.colors.border.default}`,
                fontWeight: NEON_THEME.typography.weight.bold,
                fontSize: NEON_THEME.typography.size.xl,
                color: NEON_THEME.colors.text.primary,
                letterSpacing: '0.05em'
            }}>
                {TEXTS.LAYOUT.LOGO}
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, paddingTop: NEON_THEME.spacing.xl }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map(item => {
                        const isActive = currentPage === item.id;
                        return (
                            <li
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    padding: `${NEON_THEME.spacing.md} ${NEON_THEME.spacing.xl}`,
                                    cursor: 'pointer',
                                    fontSize: NEON_THEME.typography.size.md,
                                    color: isActive ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.secondary,
                                    backgroundColor: isActive ? 'rgba(0, 243, 255, 0.08)' : 'transparent',
                                    fontWeight: isActive ? NEON_THEME.typography.weight.medium : NEON_THEME.typography.weight.regular,
                                    transition: NEON_THEME.effects.transition.normal,
                                    borderLeft: isActive ? `3px solid ${NEON_THEME.colors.neon.cyan}` : '3px solid transparent',
                                    boxShadow: isActive ? NEON_THEME.effects.glow.cyan : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 243, 255, 0.04)';
                                        e.currentTarget.style.color = NEON_THEME.colors.text.primary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = NEON_THEME.colors.text.secondary;
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
            <div style={{ padding: NEON_THEME.spacing.xl, fontSize: NEON_THEME.typography.size.xs, color: NEON_THEME.colors.text.secondary, opacity: 0.5 }}>
                {TEXTS.LAYOUT.VERSION}
            </div>
        </div>
    );
}
