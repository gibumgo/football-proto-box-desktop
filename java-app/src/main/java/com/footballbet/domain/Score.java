package com.footballbet.domain;

public record Score(int home, int away) {
    public static Score parse(String scoreStr) {
        if (scoreStr == null || !scoreStr.contains(":")) {
            throw new IllegalArgumentException("Invalid score format: " + scoreStr);
        }
        String[] parts = scoreStr.split(":");
        try {
            int home = Integer.parseInt(parts[0].trim());
            int away = Integer.parseInt(parts[1].trim());
            return new Score(home, away);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid score numbers: " + scoreStr);
        }
    }

    @Override
    public String toString() {
        return home + " : " + away;
    }
}
