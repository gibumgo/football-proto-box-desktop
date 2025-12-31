package com.footballbet.util;

import com.footballbet.domain.Match;
import com.footballbet.domain.MatchType;
import com.footballbet.domain.Result;
import com.footballbet.model.MatchDto;
import com.opencsv.bean.CsvToBeanBuilder;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.PushbackInputStream;
import java.io.Reader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CsvLoader {
    private static final int BOM_SIZE = 3;
    private static final byte BOM_BYTE_1 = (byte) 0xEF;
    private static final byte BOM_BYTE_2 = (byte) 0xBB;
    private static final byte BOM_BYTE_3 = (byte) 0xBF;

    public List<Match> load(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath);
                PushbackInputStream pbis = new PushbackInputStream(fis, BOM_SIZE);
                Reader reader = new InputStreamReader(pbis, StandardCharsets.UTF_8)) {

            // Skip BOM if present
            byte[] bom = new byte[BOM_SIZE];
            int n = pbis.read(bom, 0, BOM_SIZE);
            if (n != -1) {
                if (n == BOM_SIZE && bom[0] == BOM_BYTE_1 && bom[1] == BOM_BYTE_2 && bom[2] == BOM_BYTE_3) {
                    // It's a BOM, do nothing (already read)
                } else {
                    // Not a BOM, push back
                    pbis.unread(bom, 0, n);
                }
            }

            List<MatchDto> dtos = new CsvToBeanBuilder<MatchDto>(reader)
                    .withType(MatchDto.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build()
                    .parse();

            return dtos.stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private Match toDomain(MatchDto dto) {
        com.footballbet.domain.BettingOdds domestic = new com.footballbet.domain.BettingOdds(
                ParseUtil.parseDouble(dto.winOdd),
                ParseUtil.parseDouble(dto.drawOdd),
                ParseUtil.parseDouble(dto.loseOdd));
        com.footballbet.domain.BettingOdds overseas = new com.footballbet.domain.BettingOdds(
                ParseUtil.parseDouble(dto.winOddOverseas),
                ParseUtil.parseDouble(dto.drawOddOverseas),
                ParseUtil.parseDouble(dto.loseOddOverseas));

        return new Match(
                ParseUtil.parseInt(dto.round),
                ParseUtil.parseInt(dto.matchNo),
                ParseUtil.parseDateTime(dto.dateTime),
                dto.league,
                dto.home,
                dto.away,
                MatchType.from(dto.type),
                domestic,
                overseas,
                ParseUtil.parseScore(dto.score),
                Result.from(dto.result),
                ParseUtil.parseDouble(dto.resultOdd),
                ParseUtil.parseDouble(dto.handicapValue));
    }
}
