package com.footballbet.util;

import com.footballbet.model.Match;
import com.footballbet.model.MatchType;
import com.footballbet.model.Result;
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
    public List<Match> load(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath);
                PushbackInputStream pbis = new PushbackInputStream(fis, 3);
                Reader reader = new InputStreamReader(pbis, StandardCharsets.UTF_8)) {

            // Skip BOM if present
            byte[] bom = new byte[3];
            int n = pbis.read(bom, 0, 3);
            if (n != -1) {
                if (n == 3 && bom[0] == (byte) 0xEF && bom[1] == (byte) 0xBB && bom[2] == (byte) 0xBF) {
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
        return new Match(
                ParseUtil.parseInt(dto.round),
                ParseUtil.parseInt(dto.matchNo),
                ParseUtil.parseDateTime(dto.dateTime),
                dto.league,
                dto.home,
                dto.away,
                MatchType.from(dto.type),
                ParseUtil.parseDouble(dto.winOdd),
                ParseUtil.parseDouble(dto.drawOdd),
                ParseUtil.parseDouble(dto.loseOdd),
                ParseUtil.parseScore(dto.score),
                Result.from(dto.result),
                ParseUtil.parseDouble(dto.resultOdd));
    }
}
