import { NEON_THEME } from '../../../domain/design/designTokens';
import type { MatchRowViewModel } from './MatchRowVMFactory';
import { OddCell } from './OddCell';
import { ResultBadge } from './ResultBadge';

interface MatchListRowProps {
    vm: MatchRowViewModel;
}

const cellStyle: React.CSSProperties = {
    padding: '12px 6px',
    textAlign: 'center',
    color: NEON_THEME.colors.text.primary
};

export function MatchListRow({ vm }: MatchListRowProps) {
    return (
        <tr style={{ borderBottom: `1px solid ${NEON_THEME.colors.border.default}` }}>
            <td style={{ ...cellStyle, color: NEON_THEME.colors.text.secondary }}>{vm.roundNum}</td>
            <td style={{ ...cellStyle, color: NEON_THEME.colors.text.secondary, fontSize: NEON_THEME.typography.size.xs }}>
                {vm.formattedDate}
            </td>
            <td style={{ ...cellStyle, color: NEON_THEME.colors.text.secondary }}>{vm.league}</td>
            <td style={cellStyle}>
                <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: NEON_THEME.layout.radius.sm,
                    backgroundColor: `${vm.typeColor}20`,
                    color: vm.typeColor,
                    fontSize: '11px',
                    fontWeight: NEON_THEME.typography.weight.bold,
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
                fontWeight: vm.isWin ? NEON_THEME.typography.weight.bold : NEON_THEME.typography.weight.medium,
                color: vm.isWin ? NEON_THEME.colors.neon.green : NEON_THEME.colors.text.primary
            }}>
                {vm.homeName}
            </td>
            <td style={{
                ...cellStyle,
                fontWeight: vm.isLose ? NEON_THEME.typography.weight.bold : NEON_THEME.typography.weight.medium,
                color: vm.isLose ? NEON_THEME.colors.neon.red : NEON_THEME.colors.text.primary
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
            <td style={{ ...cellStyle, fontFamily: NEON_THEME.typography.fontFamily.mono, fontWeight: NEON_THEME.typography.weight.bold, fontSize: '13px' }}>
                {vm.displayScore}
            </td>
        </tr>
    );
}
