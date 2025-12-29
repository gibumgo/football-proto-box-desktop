package com.footballbet.service;

import com.footballbet.domain.Match;
import com.footballbet.domain.RoundStats;
import com.footballbet.model.ArchiveDataDto;
import com.footballbet.util.CsvLoader;
import java.io.File;
import java.util.List;

public class ArchiveService {
    private final CsvLoader csvLoader = new CsvLoader();
    // Default relative path for dev environment. Can be overridden or determined
    // dynamically.
    private static final String DEFAULT_BASE_PATH = "../data/crawled/betinfo";
    private static final String FALLBACK_BASE_PATH = "data/crawled/betinfo";
    private static final String FILE_NAME_PATTERN = "betinfo_proto_rate_%d.csv";

    public ArchiveDataDto getRoundData(int roundSequence) {
        String filename = String.format(FILE_NAME_PATTERN, roundSequence);
        // Try default path
        File file = new File(DEFAULT_BASE_PATH, filename);

        if (!file.exists()) {
            // Try absolute path fallback or check current dir
            file = new File(FALLBACK_BASE_PATH, filename);
        }

        if (!file.exists()) {
            throw new IllegalArgumentException(
                    "Data file not found for round " + roundSequence + " at " + file.getAbsolutePath());
        }

        List<Match> matches = csvLoader.load(file.getAbsolutePath());

        java.util.Map<String, Match> generalMatches = new java.util.HashMap<>();
        for (Match m : matches) {
            if (m.getType() == com.footballbet.domain.MatchType.GENERAL) {
                String key = m.getHome() + "_" + m.getAway();
                generalMatches.put(key, m);
            }
        }

        for (Match match : matches) {
            if (match.getType() == com.footballbet.domain.MatchType.HANDICAP) {
                String key = match.getHome() + "_" + match.getAway();
                Match generalMatch = generalMatches.get(key);

                if (generalMatch != null) {
                    com.footballbet.domain.Score hScore = match.getScore();
                    com.footballbet.domain.Score gScore = generalMatch.getScore();

                    if (hScore != null && gScore != null) {
                        double diff = hScore.home() - gScore.home();
                        match.setHandicapNumber(diff);
                    }
                }
            }
        }

        RoundStats stats = new RoundStats(roundSequence);
        for (Match match : matches) {
            stats.addMatch(match);
        }

        return new ArchiveDataDto(stats, matches);
    }
}
