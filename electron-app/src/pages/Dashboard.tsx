import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Match } from '../domain/models/match/Match';
import { NEON_THEME } from '../domain/design/designTokens';
import { TEXTS } from '../constants/uiTexts';
import { useMatchStats } from '@/hooks/useMatchStats';

interface DashboardProps {
    data: Match[];
}

export function Dashboard({ data }: DashboardProps) {
    const { summary, leagueData, resultData } = useMatchStats(data);

    const PIE_COLORS = [NEON_THEME.colors.neon.green, NEON_THEME.colors.neon.yellow, NEON_THEME.colors.neon.red];

    return (
        <div style={{
            padding: NEON_THEME.spacing.xl,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: NEON_THEME.colors.bg.app,
            color: NEON_THEME.colors.text.primary,
            boxSizing: 'border-box'
        }}>
            <h2 style={{
                fontSize: NEON_THEME.typography.size.xxl,
                fontWeight: NEON_THEME.typography.weight.bold,
                marginBottom: NEON_THEME.spacing.xl,
                color: NEON_THEME.colors.text.primary
            }}>
                {TEXTS.DASHBOARD.TITLE}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: NEON_THEME.spacing.lg, marginBottom: NEON_THEME.spacing.xxl }}>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_TOTAL}</h3>
                    <p style={valueStyle}>{summary.total}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_WIN_RATE}</h3>
                    <p style={{ ...valueStyle, color: NEON_THEME.colors.neon.green }}>{summary.win}%</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_DRAW_RATE}</h3>
                    <p style={{ ...valueStyle, color: NEON_THEME.colors.text.secondary }}>{summary.draw}%</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_LOSE_RATE}</h3>
                    <p style={{ ...valueStyle, color: NEON_THEME.colors.neon.red }}>{summary.lose}%</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: NEON_THEME.spacing.xl, marginBottom: NEON_THEME.spacing.xxl }}>
                <div style={{ ...chartCardStyle }}>
                    <h3 style={chartTitleStyle}>{TEXTS.DASHBOARD.CHART_LEAGUE_TITLE}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leagueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={NEON_THEME.colors.border.default} />
                            <XAxis
                                dataKey="name"
                                stroke={NEON_THEME.colors.text.secondary}
                                tick={{ fill: NEON_THEME.colors.text.secondary, fontSize: 11 }}
                            />
                            <YAxis
                                stroke={NEON_THEME.colors.text.secondary}
                                tick={{ fill: NEON_THEME.colors.text.secondary }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: NEON_THEME.colors.bg.panel,
                                    border: `1px solid ${NEON_THEME.colors.border.default} `,
                                    borderRadius: NEON_THEME.layout.radius.md,
                                    color: NEON_THEME.colors.text.primary
                                }}
                            />
                            <Bar dataKey="value" fill={NEON_THEME.colors.neon.cyan} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ ...chartCardStyle }}>
                    <h3 style={chartTitleStyle}>{TEXTS.DASHBOARD.CHART_RESULT_TITLE}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={resultData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}% `}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {resultData.map((_, index) => (
                                    <Cell key={`cell - ${index} `} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: NEON_THEME.colors.bg.panel,
                                    border: `1px solid ${NEON_THEME.colors.border.default} `,
                                    borderRadius: NEON_THEME.layout.radius.md,
                                    color: NEON_THEME.colors.text.primary
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    background: NEON_THEME.colors.bg.panel,
    padding: NEON_THEME.spacing.xl,
    borderRadius: NEON_THEME.layout.radius.lg,
    border: `1px solid ${NEON_THEME.colors.border.default} `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: NEON_THEME.typography.size.sm,
    fontWeight: NEON_THEME.typography.weight.light,
    color: NEON_THEME.colors.text.secondary,
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
};

const valueStyle: React.CSSProperties = {
    fontSize: '2.5em',
    fontWeight: NEON_THEME.typography.weight.bold,
    color: NEON_THEME.colors.text.primary,
    margin: `${NEON_THEME.spacing.sm} 0 0 0`,
    fontFamily: NEON_THEME.typography.fontFamily.mono,
};

const chartCardStyle: React.CSSProperties = {
    background: NEON_THEME.colors.bg.panel,
    padding: NEON_THEME.spacing.xl,
    borderRadius: NEON_THEME.layout.radius.lg,
    border: `1px solid ${NEON_THEME.colors.border.default} `,
};

const chartTitleStyle: React.CSSProperties = {
    fontSize: NEON_THEME.typography.size.lg,
    fontWeight: NEON_THEME.typography.weight.medium,
    color: NEON_THEME.colors.text.primary,
    marginBottom: NEON_THEME.spacing.lg,
};
