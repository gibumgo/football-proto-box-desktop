package com.footballbet.service.crawler;

import com.footballbet.common.CrawlerConstants;
import com.footballbet.domain.crawler.CrawlerStatus;
import com.footballbet.dto.crawler.CrawlerRequest;
import com.footballbet.dto.crawler.CrawlerState;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PythonCrawlerService implements CrawlerService {

    private final PythonExecutor executor;
    private final CrawlerLogParser parser;
    private CrawlerState currentState;

    public PythonCrawlerService() {
        this.executor = new PythonExecutor(CrawlerConstants.PYTHON_CMD, CrawlerConstants.SCRIPT_PATH);
        this.parser = new CrawlerLogParser();
        this.currentState = new CrawlerState(CrawlerStatus.IDLE, 0, "");
    }

    @Override
    public synchronized void startCrawler(CrawlerRequest request) {
        if (executor.isRunning()) {
            throw new IllegalStateException("Crawler is already running.");
        }

        List<String> args = buildArgs(request);
        currentState.setStatus(CrawlerStatus.RUNNING);
        currentState.setProgress(0);
        currentState.setLastLog("Starting crawler process...");

        try {
            executor.execute(
                    args,
                    this::handleOutput,
                    this::handleError,
                    this::handleExit);
        } catch (IOException e) {
            currentState.setStatus(CrawlerStatus.FAILED);
            currentState.setLastLog("Failed to start process: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public synchronized void stopCrawler() {
        if (executor.isRunning()) {
            executor.stop();
            currentState.setLastLog("Stopping crawler (user requested)...");
        }
    }

    @Override
    public CrawlerStatus getStatus() {
        return currentState.getStatus();
    }

    public CrawlerState getFullState() {
        return currentState;
    }

    private List<String> buildArgs(CrawlerRequest request) {
        List<String> args = new ArrayList<>();
        args.add(CrawlerConstants.ARG_MODE);
        args.add(request.getMode());

        if (request.getStartRound() != null && !request.getStartRound().isEmpty()) {
            args.add(CrawlerConstants.ARG_START_ROUND);
            args.add(request.getStartRound());
        }

        if (request.getEndRound() != null && !request.getEndRound().isEmpty()) {
            args.add(CrawlerConstants.ARG_END_ROUND);
            args.add(request.getEndRound());
        }

        if (request.isHeadless()) {
            args.add(CrawlerConstants.ARG_HEADLESS);
        }

        args.add(CrawlerConstants.ARG_TIMEOUT);
        args.add(String.valueOf(request.getTimeout()));

        return args;
    }

    private void handleOutput(String line) {
        parser.parseAndUpdate(line, currentState);
        System.out.println("[PYTHON] " + line);
    }

    private void handleError(String line) {
        System.err.println("[PYTHON ERR] " + line);

        if (line.startsWith(CrawlerConstants.PREFIX_ERROR)) {
            currentState.setStatus(CrawlerStatus.FAILED);
            currentState.setLastLog(line);
        }
    }

    private void handleExit() {
        System.out.println("Python process exited.");
        if (currentState.getStatus() == CrawlerStatus.RUNNING) {
            currentState.setStatus(CrawlerStatus.IDLE);
            currentState.setLastLog("Process finished.");
        }
    }
}
