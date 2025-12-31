package com.footballbet.model;

import com.opencsv.bean.CsvBindByName;
// Lombok removed

public class MatchDto {
    @CsvBindByName(column = "회차")
    public String round;

    @CsvBindByName(column = "경기번호")
    public String matchNo;

    @CsvBindByName(column = "날짜 및 시간")
    public String dateTime;

    @CsvBindByName(column = "리그명")
    public String league;

    @CsvBindByName(column = "홈")
    public String home;

    @CsvBindByName(column = "원정")
    public String away;

    @CsvBindByName(column = "유형")
    public String type;

    @CsvBindByName(column = "승(국내)")
    public String winOdd;

    @CsvBindByName(column = "무(국내)")
    public String drawOdd;

    @CsvBindByName(column = "패(국내)")
    public String loseOdd;

    @CsvBindByName(column = "승(해외)")
    public String winOddOverseas;

    @CsvBindByName(column = "무(해외)")
    public String drawOddOverseas;

    @CsvBindByName(column = "패(해외)")
    public String loseOddOverseas;

    @CsvBindByName(column = "스코어")
    public String score;

    @CsvBindByName(column = "경기 결과")
    public String result;

    @CsvBindByName(column = "결과 배당")
    public String resultOdd;

    @CsvBindByName(column = "핸디캡")
    public String handicapValue;
}
