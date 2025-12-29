package com.footballbet.domain;

public class BettingOdds {
    private final Double win;
    private final Double draw;
    private final Double lose;

    public BettingOdds(Double win, Double draw, Double lose) {
        this.win = win;
        this.draw = draw;
        this.lose = lose;
    }

    public Double getWin() {
        return win;
    }

    public Double getDraw() {
        return draw;
    }

    public Double getLose() {
        return lose;
    }

    public double getWinDifferential(BettingOdds other) {
        if (other == null || this.win == null || other.win == null)
            return 0.0;
        return this.win - other.win;
    }

    public double getDrawDifferential(BettingOdds other) {
        if (other == null || this.draw == null || other.draw == null)
            return 0.0;
        return this.draw - other.draw;
    }

    public double getLoseDifferential(BettingOdds other) {
        if (other == null || this.lose == null || other.lose == null)
            return 0.0;
        return this.lose - other.lose;
    }

    @Override
    public String toString() {
        return String.format("Odds[W:%.2f, D:%.2f, L:%.2f]", win, draw, lose);
    }
}
