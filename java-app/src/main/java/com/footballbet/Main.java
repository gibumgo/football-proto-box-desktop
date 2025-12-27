package com.footballbet;

import com.footballbet.controller.MatchController;

public class Main {
    public static void main(String[] args) {
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
}
