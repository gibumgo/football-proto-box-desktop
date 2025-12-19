import { COLORS, TYPOGRAPHY } from '../../../domain/design/theme';
import type { MatchRowViewModel } from './MatchRowVMFactory';
import { OddCell } from './OddCell';
import { ResultBadge } from './ResultBadge';

interface MatchListRowProps {
    vm: MatchRowViewModel;
}

const cellStyle: React.CSSProperties = {
    padding: '12px 6px',
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY
};

export function MatchListRow({ vm }: MatchListRowProps) {
    return (
        <tr style={{ borderBottom: `1px solid ${COLORS.BORDER}` }}>
            <td style={{ ...cellStyle, color: COLORS.TEXT_SECONDARY }}>{vm.roundNum}</td>
            <td style={{ ...cellStyle, color: COLORS.TEXT_SECONDARY, fontSize: TYPOGRAPHY.SIZE.XS }}>
                {vm.formattedDate}
            </td>
            <td style={{ ...cellStyle, color: COLORS.TEXT_SECONDARY }}>{vm.league}</td>
            <td style={cellStyle}>
                <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: `${vm.typeColor}20`,
                    color: vm.typeColor,
                    fontSize: '11px',
                    fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
                    whiteSpace: 'nowrap',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    verticalAlign: 'middle'
                }}>
                    {vm.mainType} {vm.subValue && <span style={{ opacity: 0.8, marginLeft: '2px' }}>{vm.subValue}</span>}
                </span>
            </td>
            <td style={{
                ...cellStyle,
                fontWeight: vm.isWin ? TYPOGRAPHY.WEIGHT.BOLD : TYPOGRAPHY.WEIGHT.REGULAR,
                color: vm.isWin ? COLORS.NEON_GREEN : COLORS.TEXT_PRIMARY
            }}>
                {vm.homeName}
            </td>
            <td style={{
                ...cellStyle,
                fontWeight: vm.isLose ? TYPOGRAPHY.WEIGHT.BOLD : TYPOGRAPHY.WEIGHT.REGULAR,
                color: vm.isLose ? COLORS.NEON_RED : COLORS.TEXT_PRIMARY
            }}>
                {vm.awayName}
            </td>

            {/* 승/무/패 배당 */}
            <OddCell value={vm.winOdd} isHighlighted={vm.highlightWinOdd} style={cellStyle} />
            <OddCell value={vm.drawOdd} isHighlighted={vm.highlightDrawOdd} style={cellStyle} />
            <OddCell value={vm.loseOdd} isHighlighted={vm.highlightLoseOdd} style={cellStyle} />

            {/* 결과 */}
            <td style={cellStyle}>
                <ResultBadge
                    text={vm.displayResult}
                    textColor={vm.resultColor}
                    backgroundColor={vm.resultBg}
                />
            </td>

            {/* 스코어 */}
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontWeight: TYPOGRAPHY.WEIGHT.BOLD, fontSize: '13px' }}>
                {vm.displayScore}
            </td>
        </tr>
    );
}
