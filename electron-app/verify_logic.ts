
import { TeamStatsLogic } from './src/domain/logic/TeamStatsLogic';
import { Match } from './src/domain/models/Match';

// Mock Match Data
const mockMatches: any[] = [
    {
        info: { home: 'Nottingham (1.0)', away: 'Chelsea' },
        result: { result: '패' },
        odds: { winOdd: 1.5, drawOdd: 3.5, loseOdd: 2.5 }
    },
    {
        info: { home: 'Man Utd', away: 'Nottingham' },
        result: { result: '승' },
        odds: { winOdd: 2.0, drawOdd: 3.0, loseOdd: 4.0 }
    },
    {
        info: { home: 'Liverpool', away: 'Arsenal' },
        result: { result: '무' },
        odds: { winOdd: 2.5, drawOdd: 3.2, loseOdd: 2.8 }
    }
];

const testNames = [
    'Nottingham (1.0)',
    'Nottingham',
    'Chelsea',
    'Man Utd (0.5)'
];

console.log('--- Testing Normalization ---');
testNames.forEach(name => {
    console.log(`"${name}" -> "${TeamStatsLogic.normalizeTeamName(name)}"`);
});

console.log('\n--- Testing Filtering ---');
const target = 'Nottingham (1.0)';
const filtered = TeamStatsLogic.filterMatchesByTeam(mockMatches as Match[], target);
console.log(`Filtering for "${target}" (Normalized: ${TeamStatsLogic.normalizeTeamName(target)})`);
console.log(`Found ${filtered.length} matches.`);
filtered.forEach(m => console.log(`- ${m.info.home} vs ${m.info.away}`));

if (filtered.length !== 2) {
    console.error('FAIL: Expected 2 matches for Nottingham');
} else {
    console.log('PASS: Correctly filtered matches regardless of handicap in name.');
}
