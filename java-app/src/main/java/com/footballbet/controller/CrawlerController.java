package com.footballbet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.footballbet.dto.crawler.CrawlerRequest;
import com.footballbet.service.crawler.PythonCrawlerService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class CrawlerController implements HttpHandler {

    private final PythonCrawlerService crawlerService;
    private final ObjectMapper objectMapper;

    public CrawlerController() {
        this.crawlerService = new PythonCrawlerService();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Enable CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if (path.endsWith("/start") && method.equalsIgnoreCase("POST")) {
                handleStart(exchange);
            } else if (path.endsWith("/stop") && method.equalsIgnoreCase("POST")) {
                handleStop(exchange);
            } else if (path.endsWith("/status") && method.equalsIgnoreCase("GET")) {
                handleStatus(exchange);
            } else {
                sendResponse(exchange, 404, "Not Found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Internal Server Error: " + e.getMessage());
        }
    }

    private void handleStart(HttpExchange exchange) throws IOException {
        CrawlerRequest request = objectMapper.readValue(exchange.getRequestBody(), CrawlerRequest.class);
        crawlerService.startCrawler(request);
        sendResponse(exchange, 200, "{\"message\": " + "\"Crawler started\"}");
    }

    private void handleStop(HttpExchange exchange) throws IOException {
        crawlerService.stopCrawler();
        sendResponse(exchange, 200, "{\"message\": " + "\"Crawler stopped\"}");
    }

    private void handleStatus(HttpExchange exchange) throws IOException {
        String json = objectMapper.writeValueAsString(crawlerService.getFullState());
        sendResponse(exchange, 200, json);
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
