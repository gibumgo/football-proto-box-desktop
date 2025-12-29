package com.footballbet.domain;

public enum Result {
    WIN("승"),
    DRAW("무"),
    LOSE("패"),
    UNDER("U"),
    OVER("O"),
    ODD("홀"),
    EVEN("짝"),
    UNKNOWN("알수없음");

    private final String description;

    Result(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public static Result from(String text) {
        if (text == null)
            return UNKNOWN;

        // Handle full-width characters
        if (text.equals("Ｕ"))
            return UNDER;
        if (text.equals("Ｏ"))
            return OVER;

        for (Result result : values()) {
            if (result.description.equals(text) || result.name().equalsIgnoreCase(text)) {
                return result;
            }
        }
        return UNKNOWN;
    }
}
