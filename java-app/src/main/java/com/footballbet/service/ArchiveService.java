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

        RoundStats stats = new RoundStats(roundSequence);
        for (Match match : matches) {
            stats.addMatch(match);
        }

        return new ArchiveDataDto(stats, matches);
    }
}
