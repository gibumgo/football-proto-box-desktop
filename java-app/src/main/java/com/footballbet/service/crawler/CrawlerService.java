package com.footballbet.service.crawler;

import com.footballbet.domain.crawler.CrawlerStatus;
import com.footballbet.dto.crawler.CrawlerRequest;

public interface CrawlerService {
    void startCrawler(CrawlerRequest request);

    void stopCrawler();

    CrawlerStatus getStatus();
}
