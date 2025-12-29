import { useState } from 'react';
import { NEON_THEME } from '../../domain/design/designTokens';

// Mock Data Type
export interface MappingItem {
    id: string;
    source: string;
    target: string;
    status: 'mapped' | 'unmapped' | 'auto';
}

export function DataManagementPanel() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'aliases' | 'master'>('dashboard');

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: NEON_THEME.colors.bg.panel,
            borderRadius: '16px',
            border: `1px solid ${NEON_THEME.colors.border.default}`,
            overflow: 'hidden',
            height: '100%'
        }}>
            {/* Header Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: `1px solid ${NEON_THEME.colors.border.subtle}`,
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}>
                {['dashboard', 'aliases', 'master'].map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            padding: '12px 24px',
                            cursor: 'pointer',
                            color: activeTab === tab ? NEON_THEME.colors.neon.cyan : NEON_THEME.colors.text.muted,
                            borderBottom: activeTab === tab ? `2px solid ${NEON_THEME.colors.neon.cyan}` : 'none',
                            fontWeight: activeTab === tab ? 600 : 400,
                            textTransform: 'capitalize',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab === 'aliases' ? 'Mapping Manager' : tab}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                {activeTab === 'dashboard' && (
                    <div style={{ textAlign: 'center', color: NEON_THEME.colors.text.secondary }}>
                        <h3>📊 Data Dashboard</h3>
                        <p>Overview of mapped teams, leagues, and coverage.</p>
                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            border: `1px dashed ${NEON_THEME.colors.border.subtle}`,
                            borderRadius: '8px'
                        }}>
                            Data Visualization Placeholder
                        </div>
                    </div>
                )}

                {activeTab === 'aliases' && (
                    <div style={{ color: NEON_THEME.colors.text.secondary }}>
                        <h3>🔗 Mapping Manager</h3>
                        <p>Edit team and league aliases directly.</p>
                        {/* Table Placeholder */}
                        <div style={{
                            marginTop: '16px',
                            backgroundColor: '#000',
                            padding: '16px',
                            borderRadius: '8px',
                            fontFamily: 'monospace'
                        }}>
                            // JSON Editor / Table will go here
                            <br />
                            {`{ "Man Utd": "Manchester United" }`}
                        </div>
                    </div>
                )}

                {activeTab === 'master' && (
                    <div style={{ color: NEON_THEME.colors.text.secondary }}>
                        <h3>📚 Master Data</h3>
                        <p>Read-only view of master CSV files.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
