package com.footballbet;

import com.footballbet.controller.MatchController;

public class Main {
    public static void main(String[] args) {
        if (isArchiveMode(args)) {
            new com.footballbet.controller.ArchiveController().run(args);
            return;
        }

        if (args.length > 0 && args[0].equals("--cli")) {
            new MatchController().run(args);
        } else {
            try {
                new com.footballbet.api.SimpleApiServer().start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static boolean isArchiveMode(String[] args) {
        return args.length > 0 && "archive".equals(args[0]);
    }
}
