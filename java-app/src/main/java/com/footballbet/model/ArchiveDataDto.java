package com.footballbet.model;

import com.footballbet.domain.Match;
import com.footballbet.domain.RoundStats;
import java.util.List;

public class ArchiveDataDto {
    private final RoundStats stats;
    private final List<Match> matches;

    public ArchiveDataDto(RoundStats stats, List<Match> matches) {
        this.stats = stats;
        this.matches = matches;
    }

    public RoundStats getStats() {
        return stats;
    }

    public List<Match> getMatches() {
        return matches;
    }
}
