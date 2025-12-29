package com.footballbet.dto.crawler;

public class CrawlerRequest {
    private String mode; // "betinfo" or "flashscore"
    private String startRound; // e.g., "2025040"
    private String endRound; // Optional
    private boolean headless; // Default true
    private int timeout; // Default 300

    public CrawlerRequest() {
    }

    public CrawlerRequest(String mode, String startRound, String endRound, boolean headless, int timeout) {
        this.mode = mode;
        this.startRound = startRound;
        this.endRound = endRound;
        this.headless = headless;
        this.timeout = timeout;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getStartRound() {
        return startRound;
    }

    public void setStartRound(String startRound) {
        this.startRound = startRound;
    }

    public String getEndRound() {
        return endRound;
    }

    public void setEndRound(String endRound) {
        this.endRound = endRound;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
}
