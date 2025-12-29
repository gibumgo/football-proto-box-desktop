package com.footballbet.util;

import com.footballbet.domain.Score;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
// Unused import removed

public class ParseUtil {
    // Adjusted pattern to match CSV: "12/05 (금)17:35" -> "MM/dd (E)HH:mm"
    // Since year is missing, we will prepend current year during parsing
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd (E)HH:mm",
            Locale.KOREAN);

    public static LocalDateTime parseDateTime(String text) {
        if (text == null || text.isBlank())
            return null;
        try {
            // Prepend current year (or configure logic). For now use current year.
            int year = java.time.Year.now().getValue();
            String fullText = year + "/" + text.trim();
            return LocalDateTime.parse(fullText, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            // Fallback or log?
            // If data spans year boundary (e.g. Dec to Jan), this simple logic might fail
            // logic-wise (but parse ok).
            // Given match round sequence, year should be consistent.
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
