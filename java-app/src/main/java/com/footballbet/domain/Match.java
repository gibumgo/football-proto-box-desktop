package com.footballbet.domain;

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

    // Odds encapsulated
    private final BettingOdds domesticOdds;
    private final BettingOdds overseasOdds;

    private final Optional<Score> score;
    private final Optional<Result> result;
    private final Optional<Double> resultOdd;

    // Mutable field for post-processing
    private final Double handicapNumber;

    public Match(int round, int matchNo, LocalDateTime dateTime, String league, String home, String away,
            MatchType type, BettingOdds domesticOdds, BettingOdds overseasOdds,
            Score score, Result result, Double resultOdd, Double handicapNumber) {
        this.round = round;
        this.matchNo = matchNo;
        this.dateTime = dateTime;
        this.league = league;
        this.home = home;
        this.away = away;
        this.type = type;
        this.domesticOdds = domesticOdds;
        this.overseasOdds = overseasOdds;
        this.score = Optional.ofNullable(score);
        this.result = Optional.ofNullable(result);
        this.resultOdd = Optional.ofNullable(resultOdd);
        this.handicapNumber = handicapNumber;
    }

    // Basic Getters
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

    // Legacy Support & Convenience (Domestic Defaults)
    public Double getWinOdd() {
        return domesticOdds != null ? domesticOdds.getWin() : null;
    }

    public Double getDrawOdd() {
        return domesticOdds != null ? domesticOdds.getDraw() : null;
    }

    public Double getLoseOdd() {
        return domesticOdds != null ? domesticOdds.getLose() : null;
    }

    // Accessors for Odds objects
    public BettingOdds getDomesticOdds() {
        return domesticOdds;
    }

    public BettingOdds getOverseasOdds() {
        return overseasOdds;
    }

    // Logic: Cutoffs
    public double getWinCutoff() {
        return domesticOdds != null ? domesticOdds.getWinDifferential(overseasOdds) : 0.0;
    }

    public double getDrawCutoff() {
        return domesticOdds != null ? domesticOdds.getDrawDifferential(overseasOdds) : 0.0;
    }

    public double getLoseCutoff() {
        return domesticOdds != null ? domesticOdds.getLoseDifferential(overseasOdds) : 0.0;
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

    public Double getHandicapNumber() {
        return handicapNumber;
    }

}
