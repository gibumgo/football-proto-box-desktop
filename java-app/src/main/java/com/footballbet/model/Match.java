package com.footballbet.model;

import java.time.LocalDateTime;
import java.util.Optional;

public class Match {
    private final int round;
    private final int matchNo;
    private final LocalDateTime dateTime;
    private final String league;
    private final String home;
    private final String away;
    private final MatchType type;
    private final Optional<Double> winOdd;
    private final Optional<Double> drawOdd;
    private final Optional<Double> loseOdd;
    private final Optional<Score> score;
    private final Optional<Result> result;
    private final Optional<Double> resultOdd;

    public Match(int round, int matchNo, LocalDateTime dateTime, String league, String home, String away,
            MatchType type, Double winOdd, Double drawOdd, Double loseOdd,
            Score score, Result result, Double resultOdd) {
        this.round = round;
        this.matchNo = matchNo;
        this.dateTime = dateTime;
        this.league = league;
        this.home = home;
        this.away = away;
        this.type = type;
        this.winOdd = Optional.ofNullable(winOdd);
        this.drawOdd = Optional.ofNullable(drawOdd);
        this.loseOdd = Optional.ofNullable(loseOdd);
        this.score = Optional.ofNullable(score);
        this.result = Optional.ofNullable(result);
        this.resultOdd = Optional.ofNullable(resultOdd);
    }

    // Getters
    public int getRound() {
        return round;
    }

    public int getMatchNo() {
        return matchNo;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public String getLeague() {
        return league;
    }

    public String getHome() {
        return home;
    }

    public String getAway() {
        return away;
    }

    public MatchType getType() {
        return type;
    }

    public Double getWinOdd() {
        return winOdd.orElse(null);
    }

    public Double getDrawOdd() {
        return drawOdd.orElse(null);
    }

    public Double getLoseOdd() {
        return loseOdd.orElse(null);
    }

    public Score getScore() {
        return score.orElse(null);
    }

    public Result getResult() {
        return result.orElse(null);
    }

    public Double getResultOdd() {
        return resultOdd.orElse(null);
    }
}
