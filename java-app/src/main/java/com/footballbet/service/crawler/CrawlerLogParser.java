package com.footballbet.service.crawler;

import com.footballbet.common.CrawlerConstants;
import com.footballbet.domain.crawler.CrawlerStatus;
import com.footballbet.dto.crawler.CrawlerState;

public class CrawlerLogParser {

    public boolean parseAndUpdate(String line, CrawlerState currentState) {
        if (line == null || line.isEmpty())
            return false;

        if (line.startsWith(CrawlerConstants.PREFIX_STATUS_START)) {
            currentState.setStatus(CrawlerStatus.RUNNING);
            return true;
        }

        if (line.startsWith(CrawlerConstants.PREFIX_STATUS_COMPLETE)) {
            currentState.setStatus(CrawlerStatus.COMPLETED);
            currentState.setProgress(100);
            return true;
        }

        if (line.startsWith(CrawlerConstants.PREFIX_PROGRESS)) {
            try {
                String val = line.split(":")[1];
                currentState.setProgress(Integer.parseInt(val.trim()));
            } catch (Exception e) {
            }
            return true;
        }

        if (line.startsWith(CrawlerConstants.PREFIX_ERROR)) {
            currentState.setStatus(CrawlerStatus.FAILED);
            currentState.setStatus(CrawlerStatus.FAILED);
            currentState.setLastLog(line);
            return true;
        }

        currentState.setLastLog(line);
        return false;
    }
}
