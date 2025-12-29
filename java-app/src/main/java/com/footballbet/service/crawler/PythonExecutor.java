package com.footballbet.service.crawler;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class PythonExecutor {

    private Process process;
    private Thread outputThread;
    private Thread errorThread;
    private final String pythonPath;
    private final String scriptPath;

    public PythonExecutor(String pythonPath, String scriptPath) {
        this.pythonPath = pythonPath;
        this.scriptPath = scriptPath;
    }

    public synchronized void execute(List<String> args, Consumer<String> onOutput, Consumer<String> onError,
            Runnable onExit) throws IOException {
        if (process != null && process.isAlive()) {
            throw new IllegalStateException("Process is already running");
        }

        List<String> command = new ArrayList<>();
        command.add(pythonPath);
        command.add(scriptPath);
        command.addAll(args);

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(new File(System.getProperty("user.dir")));

        process = pb.start();

        outputThread = new Thread(
                () -> readStream(new BufferedReader(new InputStreamReader(process.getInputStream())), onOutput));
        errorThread = new Thread(
                () -> readStream(new BufferedReader(new InputStreamReader(process.getErrorStream())), onError));

        outputThread.start();
        errorThread.start();

        new Thread(() -> {
            try {
                int exitCode = process.waitFor();
                System.out.println("Process exited with code: " + exitCode);
                if (onExit != null) {
                    onExit.run();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    public synchronized void stop() {
        if (process != null && process.isAlive()) {
            process.destroy();
            try {
                Thread.sleep(1000);
                if (process.isAlive()) {
                    process.destroyForcibly();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public boolean isRunning() {
        return process != null && process.isAlive();
    }

    private void readStream(BufferedReader reader, Consumer<String> consumer) {
        String line;
        try {
            while ((line = reader.readLine()) != null) {
                if (consumer != null) {
                    consumer.accept(line);
                }
            }
        } catch (IOException e) {
        }
    }
}
