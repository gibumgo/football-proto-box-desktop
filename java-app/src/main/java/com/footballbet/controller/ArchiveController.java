package com.footballbet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.footballbet.model.ArchiveDataDto;
import com.footballbet.service.ArchiveService;

public class ArchiveController {
    private final ArchiveService archiveService;
    private final ObjectMapper objectMapper;

    public ArchiveController() {
        this.archiveService = new ArchiveService();
        this.objectMapper = new ObjectMapper()
                .registerModule(new Jdk8Module())
                .registerModule(new JavaTimeModule())
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
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
