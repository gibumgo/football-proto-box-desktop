package com.footballbet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.footballbet.model.ArchiveDataDto;
import com.footballbet.service.ArchiveService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class ArchiveController implements HttpHandler {
    private final ArchiveService archiveService;
    private final ObjectMapper objectMapper;

    public ArchiveController() {
        this.archiveService = new ArchiveService();
        this.objectMapper = new ObjectMapper()
                .registerModule(new Jdk8Module())
                .registerModule(new JavaTimeModule())
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Enable CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String path = exchange.getRequestURI().getPath();
        try {
            if (path.equals("/api/archive") || path.startsWith("/api/archive/")) {
                handleGetArchive(exchange);
            } else {
                sendResponse(exchange, 404, "{\"error\": \"Not Found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\": \"Internal Server Error: " + e.getMessage() + "\"}");
        }
    }

    private void handleGetArchive(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        int round = -1;

        if (query != null && query.contains("round=")) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                if (pair.startsWith("round=")) {
                    round = Integer.parseInt(pair.substring(6));
                    break;
                }
            }
        }

        if (round == -1) {
            sendResponse(exchange, 400, "{\"error\": \"Missing round parameter\"}");
            return;
        }

        ArchiveDataDto data = archiveService.getRoundData(round);
        String json = objectMapper.writeValueAsString(data);
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

    public void run(String[] args) {
        if (args.length < 2) {
            System.err.println("Usage: archive <roundSequence>");
            System.exit(1);
        }

        try {
            int round = Integer.parseInt(args[1]);
            ArchiveDataDto data = archiveService.getRoundData(round);
            String json = objectMapper.writeValueAsString(data);
            System.out.println(json);
        } catch (Exception e) {
            System.err.println("Error processing archive request: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
