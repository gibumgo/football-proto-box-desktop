package com.footballbet.domain;

import java.util.ArrayList;
import java.util.List;

public class RoundStats {
    private final int round;
    private int totalMatches;
    private int finishedMatches;

    // Domestic Odds Stats
    private int favoriteWinCount;
    private int underdogWinCount;
    private int drawCount;
    private int reverseCount; // 정배인데 짐 (역배가 이김)

    private final List<Match> matches = new ArrayList<>();

    public RoundStats(int round) {
        this.round = round;
    }

    public void addMatch(Match match) {
        this.matches.add(match);

        MatchType type = match.getType();
        if (type == MatchType.GENERAL || type == MatchType.HANDICAP) {
            this.totalMatches++;

            Result result = match.getResult();
            if (result != null) {
                this.finishedMatches++;

                BettingOdds odds = match.getDomesticOdds();
                if (odds != null) {
                    analyzeResult(odds, result);
                }
            }
        }
    }

    private void analyzeResult(BettingOdds odds, Result result) {
        if (!isValidOdds(odds)) {
            return;
        }

        boolean isHomeFavorite = isHomeFavorite(odds);
        boolean isAwayFavorite = isAwayFavorite(odds);

        if (result == Result.WIN) {
            updateWinStats(isHomeFavorite);
            return;
        }

        if (result == Result.LOSE) {
            updateWinStats(isAwayFavorite);
            return;
        }

        if (result == Result.DRAW) {
            drawCount++;
        }
    }

    private boolean isValidOdds(BettingOdds odds) {
        return odds.getWin() != null && odds.getDraw() != null && odds.getLose() != null;
    }

    private boolean isHomeFavorite(BettingOdds odds) {
        Double win = odds.getWin();
        Double draw = odds.getDraw();
        Double lose = odds.getLose();
        return win < draw && win < lose;
    }

    private boolean isAwayFavorite(BettingOdds odds) {
        Double win = odds.getWin();
        Double draw = odds.getDraw();
        Double lose = odds.getLose();
        return lose < win && lose < draw;
    }

    private void updateWinStats(boolean isFavorite) {
        if (isFavorite) {
            favoriteWinCount++;
        } else {
            underdogWinCount++;
        }
    }

    public int getRound() {
        return round;
    }

    public int getTotalMatches() {
        return totalMatches;
    }

    public int getFinishedMatches() {
        return finishedMatches;
    }

    public int getFavoriteWinCount() {
        return favoriteWinCount;
    }

    public int getUnderdogWinCount() {
        return underdogWinCount;
    }

    public int getDrawCount() {
        return drawCount;
    }

    public List<Match> getMatches() {
        return new ArrayList<>(matches);
    }
}
