package com.footballbet.util;

import com.footballbet.model.Score;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
// Unused import removed

public class ParseUtil {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yy.MM.dd (E) HH:mm",
            Locale.KOREAN);

    public static LocalDateTime parseDateTime(String text) {
        if (text == null || text.isBlank())
            return null;
        try {
            return LocalDateTime.parse(text, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            // Log warning?
            return null;
        }
    }

    public static Double parseDouble(String text) {
        if (text == null || text.isBlank() || text.equals("-"))
            return null;
        try {
            return Double.parseDouble(text);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Integer parseInt(String text) {
        if (text == null || text.isBlank())
            return 0;
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public static Score parseScore(String text) {
        if (text == null || text.isBlank())
            return null;
        try {
            return Score.parse(text);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
