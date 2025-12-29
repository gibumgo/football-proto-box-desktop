package com.footballbet.domain;

public record Score(int home, int away) {
    public static Score parse(String scoreStr) {
        if (scoreStr == null) {
            throw new IllegalArgumentException("Invalid score format: " + scoreStr);
        }

        if (!scoreStr.contains(":")) {
            // Handle single number (e.g. "3" for total score)
            try {
                int val = Integer.parseInt(scoreStr.trim());
                return new Score(val, 0);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid score number: " + scoreStr);
            }
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
