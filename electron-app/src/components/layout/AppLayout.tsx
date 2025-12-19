import type { ReactNode } from 'react';
import { COLORS } from '../../domain/design/theme';

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
            backgroundColor: COLORS.APP_BG,
            color: COLORS.TEXT_PRIMARY,
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
