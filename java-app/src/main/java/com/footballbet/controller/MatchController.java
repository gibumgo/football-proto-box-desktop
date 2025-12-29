package com.footballbet.controller;

import com.footballbet.domain.Match;
import com.footballbet.service.MatchService;
import com.footballbet.view.ConsoleView;
import java.io.File;
import java.util.List;

public class MatchController {
    private final MatchService matchService;
    private final ConsoleView view;

    public MatchController() {
        this.matchService = new MatchService();
        this.view = new ConsoleView();
    }

    public void run(String[] args) {
        String path = "../data";
        if (args.length >= 1) {
            path = args[0];
        }

        File fileOrDir = new File(path);
        if (!fileOrDir.exists()) {
            System.err.println("Path not found: " + path);
            System.exit(1);
        }

        try {
            List<Match> allMatches = matchService.loadMatches(path);
            view.displayMatches(allMatches);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
