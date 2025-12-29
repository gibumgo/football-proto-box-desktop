package com.footballbet.common;

public class CrawlerConstants {
    public static final String PYTHON_CMD = "python3";
    public static final String SCRIPT_PATH = "python-crawler/main.py";

    public static final String PREFIX_STATUS_START = "STATUS:START";
    public static final String PREFIX_STATUS_COMPLETE = "STATUS:COMPLETE";
    public static final String PREFIX_PROGRESS = "PROGRESS:";
    public static final String PREFIX_ERROR = "ERROR:";
    public static final String PREFIX_DATA = "DATA:";

    // Command Line Arguments
    public static final String ARG_MODE = "--mode";
    public static final String ARG_START_ROUND = "--start-round";
    public static final String ARG_END_ROUND = "--end-round";
    public static final String ARG_HEADLESS = "--headless";
    public static final String ARG_TIMEOUT = "--timeout";

    public static final int DEFAULT_TIMEOUT = 300;

    public static final String DIR_DATA = "data";
    public static final String DIR_DATA_MASTER = DIR_DATA + "/master";
    public static final String DIR_DATA_ALIASES = DIR_DATA + "/aliases";
    public static final String DIR_DATA_CRAWLED_FLASHSCORE = DIR_DATA + "/crawled/flashscore";
    public static final String DIR_DATA_CRAWLED_BETINFO = DIR_DATA + "/crawled/betinfo";

    private CrawlerConstants() {
    }
}
