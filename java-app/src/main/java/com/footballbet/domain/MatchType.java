package com.footballbet.domain;

public enum MatchType {
    GENERAL("일반"),
    HANDICAP("핸디캡"),
    UNDER_OVER("언더오버"),
    SUM("홀짝"),
    UNKNOWN("알수없음");

    private final String description;

    MatchType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public static MatchType from(String text) {
        if (text == null)
            return UNKNOWN;
        for (MatchType type : values()) {
            if (type.description.equals(text) || type.name().equalsIgnoreCase(text)) {
                return type;
            }
        }
        return UNKNOWN;
    }
}
