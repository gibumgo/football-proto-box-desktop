package com.footballbet.repository;

import com.footballbet.domain.Match;
import java.util.List;
import java.util.Optional;

public interface MatchRepository {
    List<Match> findAll();

    Optional<Match> findByRoundAndMatchNo(int round, int matchNo);

    void saveAll(List<Match> matches);
}
