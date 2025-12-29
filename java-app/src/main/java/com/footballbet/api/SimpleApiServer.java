package com.footballbet.api;

import com.footballbet.controller.CrawlerController;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class SimpleApiServer {

    private HttpServer server;
    private static final int PORT = 8080;

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/crawler", new CrawlerController());
        server.createContext("/api/archive", new com.footballbet.controller.ArchiveController());
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();
        System.out.println("Server started on port " + PORT);
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }
}
