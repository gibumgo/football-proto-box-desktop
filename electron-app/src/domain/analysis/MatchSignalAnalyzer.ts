import { Match } from '../models/match/Match';
/**
 * Determines if a match is an "Upset" (Favorite lost).
 * A match is considered an upset if the favorite team (lowest win odd) lost.
 * This is a simplified logic for the MVP.
 */
export function isUpset(match: Match): boolean {
    if (!match.result.isFinished || !match.odds.hasOdds) return false;

    const { winOdd, loseOdd } = match.odds;
    const result = match.result.result;

    if (winOdd === undefined || loseOdd === undefined) return false;

    // Determine favorite 
    // Assuming 'winOdd' is Home Win, 'loseOdd' is Away Win (based on standard notation, though naming might be confusing)
    // Let's assume typical: winOdd = Home, drawOdd, loseOdd = Away.

    // Case 1: Home was Favorite (WinOdd < LoseOdd) but Lost (Result = '패' or 'LOSE')
    if (winOdd < loseOdd && (result === '패' || result === 'LOSE')) {
        return true;
    }

    // Case 2: Away was Favorite (LoseOdd < WinOdd) but Lost (Result = '승' or 'WIN')
    if (loseOdd < winOdd && (result === '승' || result === 'WIN')) {
        return true;
    }

    return false;
}

/**
 * Determines if a match is an "Underdog Win".
 * A match is an underdog win if the team with higher odds won.
 */
export function isUnderdogWin(match: Match): boolean {
    if (!match.result.isFinished || !match.odds.hasOdds) return false;

    const { winOdd, loseOdd } = match.odds;
    const result = match.result.result;

    if (winOdd === undefined || loseOdd === undefined) return false;

    // Case 1: Home was Underdog (WinOdd > LoseOdd) and Won
    if (winOdd > loseOdd && (result === '승' || result === 'WIN')) {
        return true;
    }

    // Case 2: Away was Underdog (LoseOdd > WinOdd) and Won
    if (loseOdd > winOdd && (result === '패' || result === 'LOSE')) {
        return true;
    }

    return false;
}
