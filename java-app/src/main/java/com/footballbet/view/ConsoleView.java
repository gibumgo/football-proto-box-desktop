package com.footballbet.view;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.footballbet.model.Match;
import java.util.List;

public class ConsoleView {
    private final ObjectMapper mapper;

    public ConsoleView() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new Jdk8Module());
        this.mapper.registerModule(new JavaTimeModule());
    }

    public void displayMatches(List<Match> matches) {
        try {
            String json = mapper.writeValueAsString(matches);
            System.out.println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
