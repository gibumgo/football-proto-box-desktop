import { COLORS, TYPOGRAPHY } from '../../../domain/design/theme';

interface SortableHeaderProps {
    onSort?: (column: 'date' | 'odds' | 'round') => void;
    sortBy?: 'date' | 'odds' | 'round';
    sortOrder?: 'asc' | 'desc';
}

const headerStyle: React.CSSProperties = {
    padding: '12px 6px',
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
    fontSize: TYPOGRAPHY.SIZE.XS,
    whiteSpace: 'nowrap'
};

export function SortableHeader({ onSort, sortBy, sortOrder }: SortableHeaderProps) {
    return (
        <thead>
            <tr style={{ backgroundColor: COLORS.HEADER, borderBottom: `2px solid ${COLORS.BORDER}` }}>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => onSort?.('round')}>
                    회차 {sortBy === 'round' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => onSort?.('date')}>
                    경기 일시 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={headerStyle}>리그</th>
                <th style={headerStyle}>경기 종류</th>
                <th style={headerStyle}>홈팀</th>
                <th style={headerStyle}>원정팀</th>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => onSort?.('odds')}>
                    승
                </th>
                <th style={headerStyle}>무</th>
                <th style={headerStyle}>패</th>
                <th style={headerStyle}>결과</th>
                <th style={headerStyle}>스코어</th>
            </tr>
        </thead>
    );
}
