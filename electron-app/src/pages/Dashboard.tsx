import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Match } from '../domain/models/match/Match';
import { COLORS, TYPOGRAPHY } from '../domain/design/theme';
import { TEXTS } from '../constants/uiTexts';
import { SPACING, BORDER_RADIUS } from '../domain/design/tokens';

interface DashboardProps {
    data: Match[];
}

export function Dashboard({ data }: DashboardProps) {
    // Summary Statistics
    const summary = useMemo(() => {
        const total = data.length;
        if (total === 0) return { total: 0, win: 0, draw: 0, lose: 0 };

        const win = data.filter(m => m.result.result === '승').length;
        const draw = data.filter(m => m.result.result === '무').length;
        const lose = data.filter(m => m.result.result === '패').length;

        return {
            total,
            win: ((win / total) * 100).toFixed(1),
            draw: ((draw / total) * 100).toFixed(1),
            lose: ((lose / total) * 100).toFixed(1),
        };
    }, [data]);

    // League Distribution Data
    const leagueData = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(m => {
            counts[m.info.league] = (counts[m.info.league] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 leagues
    }, [data]);

    // Result Distribution Data
    const resultData = useMemo(() => {
        const counts = { 승: 0, 무: 0, 패: 0 };
        data.forEach(m => {
            if (m.result.result === '승') counts.승++;
            else if (m.result.result === '무') counts.무++;
            else if (m.result.result === '패') counts.패++;
        });
        return [
            { name: '승', value: counts.승 },
            { name: '무', value: counts.무 },
            { name: '패', value: counts.패 },
        ];
    }, [data]);

    const PIE_COLORS = [COLORS.NEON_GREEN, COLORS.NEON_YELLOW, COLORS.NEON_RED]; // Win(Green), Draw(Yellow), Lose(Red)

    return (
        <div style={{
            padding: SPACING.XL,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: COLORS.SURFACE,
            color: COLORS.TEXT_PRIMARY
        }}>
            <h2 style={{
                fontSize: TYPOGRAPHY.SIZE.XXL,
                fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                marginBottom: SPACING.XL,
                color: COLORS.TEXT_PRIMARY
            }}>
                {TEXTS.DASHBOARD.TITLE}
            </h2>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: SPACING.LG, marginBottom: SPACING.XXL }}>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_TOTAL}</h3>
                    <p style={valueStyle}>{summary.total}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_WIN_RATE}</h3>
                    <p style={{ ...valueStyle, color: COLORS.NEON_GREEN }}>{summary.win}%</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_DRAW_RATE}</h3>
                    <p style={{ ...valueStyle, color: COLORS.TEXT_SECONDARY }}>{summary.draw}%</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>{TEXTS.DASHBOARD.CARD_LOSE_RATE}</h3>
                    <p style={{ ...valueStyle, color: COLORS.NEON_RED }}>{summary.lose}%</p>
                </div>
            </div>

            {/* Charts Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: SPACING.XL, marginBottom: SPACING.XXL }}>
                {/* League Chart */}
                <div style={{ ...chartCardStyle }}>
                    <h3 style={chartTitleStyle}>{TEXTS.DASHBOARD.CHART_LEAGUE_TITLE}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leagueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.BORDER} />
                            <XAxis
                                dataKey="name"
                                stroke={COLORS.TEXT_SECONDARY}
                                tick={{ fill: COLORS.TEXT_SECONDARY, fontSize: 11 }}
                            />
                            <YAxis
                                stroke={COLORS.TEXT_SECONDARY}
                                tick={{ fill: COLORS.TEXT_SECONDARY }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: COLORS.HEADER,
                                    border: `1px solid ${COLORS.BORDER}`,
                                    borderRadius: BORDER_RADIUS.MD,
                                    color: COLORS.TEXT_PRIMARY
                                }}
                            />
                            <Bar dataKey="value" fill={COLORS.NEON_BLUE} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Result Chart */}
                <div style={{ ...chartCardStyle }}>
                    <h3 style={chartTitleStyle}>{TEXTS.DASHBOARD.CHART_RESULT_TITLE}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={resultData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {resultData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: COLORS.HEADER,
                                    border: `1px solid ${COLORS.BORDER}`,
                                    borderRadius: BORDER_RADIUS.MD,
                                    color: COLORS.TEXT_PRIMARY
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
    background: COLORS.HEADER,
    padding: SPACING.XL,
    borderRadius: BORDER_RADIUS.LG,
    border: `1px solid ${COLORS.BORDER}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: TYPOGRAPHY.SIZE.SM,
    fontWeight: TYPOGRAPHY.WEIGHT.LIGHT,
    color: COLORS.TEXT_SECONDARY,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const valueStyle: React.CSSProperties = {
    fontSize: '2.5em',
    fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    margin: `${SPACING.SM} 0 0 0`,
    fontFamily: 'monospace',
};

const chartCardStyle: React.CSSProperties = {
    background: COLORS.HEADER,
    padding: SPACING.XL,
    borderRadius: BORDER_RADIUS.LG,
    border: `1px solid ${COLORS.BORDER}`,
};

const chartTitleStyle: React.CSSProperties = {
    fontSize: TYPOGRAPHY.SIZE.LG,
    fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LG,
};
