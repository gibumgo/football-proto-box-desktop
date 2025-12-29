package com.footballbet.service;

import com.footballbet.domain.Match;
import com.footballbet.util.CsvLoader;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MatchService {
    private final CsvLoader csvLoader;

    public MatchService() {
        this.csvLoader = new CsvLoader();
    }

    public List<Match> loadMatches(String path) {
        File fileOrDir = new File(path);
        List<Match> allMatches = new ArrayList<>();

        if (fileOrDir.isDirectory()) {
            File[] files = fileOrDir.listFiles(
                    (dir, name) -> name.startsWith("betinfo_proto_round_") && name.toLowerCase().endsWith(".csv"));
            if (files != null) {
                for (File csvFile : files) {
                    allMatches.addAll(csvLoader.load(csvFile.getAbsolutePath()));
                }
            }
        } else {
            allMatches.addAll(csvLoader.load(fileOrDir.getAbsolutePath()));
        }

        return allMatches;
    }
}
