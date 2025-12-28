import type { ReactNode } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

interface AppLayoutProps {
    sidebar: ReactNode;
    topbar: ReactNode;
    children: ReactNode;
}

export function AppLayout({ sidebar, topbar, children }: AppLayoutProps) {
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: NEON_THEME.colors.bg.app,
            color: NEON_THEME.colors.text.primary,
            overflow: 'hidden'
        }}>
            {/* Sidebar Area */}
            <aside style={{ flexShrink: 0 }}>
                {sidebar}
            </aside>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Topbar Area */}
                <header style={{ flexShrink: 0 }}>
                    {topbar}
                </header>

                {/* Content Area */}
                <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
