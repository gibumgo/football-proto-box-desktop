package com.footballbet;

import com.footballbet.controller.MatchController;

public class Main {
    public static void main(String[] args) {
        if (isArchiveMode(args)) {
            new com.footballbet.controller.ArchiveController().run(args);
            return;
        }
        new MatchController().run(args);
    }

    private static boolean isArchiveMode(String[] args) {
        return args.length > 0 && "archive".equals(args[0]);
    }
}
