import { Match } from '../../domain/models/match/Match';
import { NEON_THEME } from '../../domain/design/designTokens';
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

export function MatchListTable({ matches, onSort, isLoading }: MatchListTableProps) {
    if (isLoading) {
        return <div style={{ padding: NEON_THEME.spacing.xl, textAlign: 'center', color: NEON_THEME.colors.text.secondary }}>로딩 중...</div>;
    }

    if (matches.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: NEON_THEME.colors.text.secondary, backgroundColor: NEON_THEME.colors.bg.header, borderRadius: NEON_THEME.layout.radius.lg }}>
                경기 데이터가 없습니다
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: NEON_THEME.colors.bg.header, borderRadius: NEON_THEME.layout.radius.lg, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: NEON_THEME.typography.size.sm }}>
                <SortableHeader
                    onSort={(key) => onSort?.(key as 'date' | 'odds' | 'round')}
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
