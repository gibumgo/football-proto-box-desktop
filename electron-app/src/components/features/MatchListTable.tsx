import { Match } from '../../domain/models/match/Match';
import { COLORS, TYPOGRAPHY } from '../../domain/design/theme';
import { MatchRowVMFactory } from './match-list/MatchRowVMFactory';
import { MatchListRow } from './match-list/MatchListRow';
import { SortableHeader } from './match-list/SortableHeader';

interface MatchListTableProps {
    matches: Match[];
    onSort?: (column: 'date' | 'odds' | 'round') => void;
    sortBy?: 'date' | 'odds' | 'round';
    sortOrder?: 'asc' | 'desc';
    isLoading?: boolean;
}

export function MatchListTable({ matches, onSort, sortBy, sortOrder, isLoading }: MatchListTableProps) {
    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center', color: COLORS.TEXT_SECONDARY }}>로딩 중...</div>;
    }

    if (matches.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: COLORS.TEXT_SECONDARY, backgroundColor: COLORS.HEADER, borderRadius: '8px' }}>
                경기 데이터가 없습니다
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: COLORS.HEADER, borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: TYPOGRAPHY.SIZE.SM }}>
                <SortableHeader
                    onSort={onSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
                <tbody>
                    {matches.map((match, idx) => {
                        const vm = MatchRowVMFactory.create(match);
                        return <MatchListRow key={`${match.info.matchNo}-${idx}`} vm={vm} />;
                    })}
                </tbody>
            </table>
        </div>
    );
}
