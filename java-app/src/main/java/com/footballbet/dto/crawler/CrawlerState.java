package com.footballbet.dto.crawler;

import com.footballbet.domain.crawler.CrawlerStatus;

public class CrawlerState {
    private CrawlerStatus status;
    private int progress;
    private String lastLog;

    public CrawlerState(CrawlerStatus status, int progress, String lastLog) {
        this.status = status;
        this.progress = progress;
        this.lastLog = lastLog;
    }

    public CrawlerStatus getStatus() {
        return status;
    }

    public void setStatus(CrawlerStatus status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getLastLog() {
        return lastLog;
    }

    public void setLastLog(String lastLog) {
        this.lastLog = lastLog;
    }
}
