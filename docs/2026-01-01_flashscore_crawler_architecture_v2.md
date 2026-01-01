# Flashscore 크롤러 엔진 고도화 기술 보고서

## 1. 개요 (Overview)
본 문서는 Flashscore 데이터 수집 엔진의 안정성과 정확성을 높이기 위해 수행된 **아키텍처 개선** 및 **로직 리팩토링**의 상세 내역을 기술합니다. 단순한 정규표현식 수정을 넘어, 데이터의 특성(시계열 역순 정렬)을 고려한 **상태 기반 파싱(Stateful Parsing)** 기법을 도입했습니다.

## 2. 기존 로직의 문제점 (As-Is Analysis)

### 2.1. 문맥 부재 (Lack of Context)
- **문제**: 개별 매치(Match) 행(Row)만 독립적으로 파싱했습니다.
- **결과**: "12.31"이라는 날짜가 주어졌을 때, 이것이 2025년인지 2026년인지 판단할 기준이 없어 무조건 `datetime.now().year`를 할당하는 오류가 발생했습니다.

### 2.2. 취약한 날짜 파싱 (Fragile Date Parsing)
- **문제**: 문자열 슬라이싱이나 고정된 정규식(`\d{2}\.\d{2}`)에 의존했습니다.
- **결과**: 국가별 페이지(`flashscore.com` vs `flashscore.co.kr`)마다 다른 날짜 표기법(`DD.MM` vs `MM.DD`)에 대응하지 못해 월/일을 반대로 인식, 연산 오류를 유발했습니다.

### 2.3. 침묵하는 오류 (Silent Failures)
- **문제**: 파싱 실패 시 `try-except: pass`로 무시하거나 기본값을 반환했습니다.
- **결과**: 데이터가 비정상적으로 저장되어도 로그상으로는 '성공'으로 표시되어 디버깅에 막대한 비용이 소요되었습니다.

---

## 3. 개선된 아키텍처 (To-Be Architecture)

### 3.1. 컨텍스트 주입 (Context Injection)
**핵심 개념**: 파서는 더 이상 "현재 시간"을 추측하지 않고, 상위 모듈로부터 **"시즌(Season)"** 정보를 주입받습니다.

- **Before**: `parse(row)` → 연도? 현재 연도!
- **After**: `parse(row, season="2025-2026")` → 연도 범위는 2025~2026 사이여야 함.
- **효과**: 1월에 크롤링을 수행하더라도 8월 경기는 과거(2025년) 데이터임을 시즌 정보를 통해 확정할 수 있습니다.

### 3.2. 상태 기반 파싱 (Stateful Parsing)
**핵심 개념**: Flashscore의 경기 목록이 **최신순(내림차순)**으로 정렬되어 있다는 점을 이용합니다. 이전 행(Row N-1)의 날짜 정보가 현재 행(Row N)의 연도를 결정하는 힌트가 됩니다.

```python
state = {
    "current_year": 2026,
    "last_seen_month": 1  # 1월
}

# 다음 행에서 "12월 31일" 등장
if this_month(12) > last_seen_month(1):
    # 역순 정렬에서 월이 커졌다는 것은 해가 바뀌었다는 뜻
    state["current_year"] -= 1 (2025년)
```

이 로직을 통해 매치 리스트를 순회하며 정확한 연도 전환 시점을 100% 포착할 수 있습니다.

### 3.3. 형식 중립적 파싱 (Locale-Agnostic Processing)
**핵심 개념**: 문자열 패턴 매칭 대신, 가능한 날짜 포맷들을 순차적으로 대입하여 유효한 `datetime` 객체를 추출합니다.

- **전략**: `MM.DD.`(한국)와 `DD.MM.`(글로벌) 형식을 모두 시도합니다.
- **검증**: 추출된 `Month`가 시즌 범위를 벗어나거나 논리적으로 불가능한 급격한 점프를 보일 경우, 다른 포맷을 재시도하거나 경고(Warning)를 발생시킵니다.

---

## 4. 코드 구현 하이라이트 (Implementation)

### 📂 `MatchParser.py`

#### 동적 연도 계산 (Dynamic Year Calculation)
```python
# 시즌 정보를 기반으로 초기 연도 설정
y1, y2 = extract_years_from_season(season) # 2025, 2026

# 초기화 단계: 첫 경기의 월을 보고 시작 연도 결정
if first_match_month >= 7:
    current_year = y1 # 2025
else:
    current_year = y2 # 2026

# 루프 내 연도 보정
if current_month > last_seen_month:
    current_year -= 1 # 1월 -> 12월 점프 감지
```

#### 예외 처리 강화
- `re` 모듈 누락 등 런타임 에러 방지.
- 파싱 실패 시 `datetime.now()`가 아닌 `None`을 반환하여 오염된 데이터 적재 방지.

---

## 5. 결론 (Conclusion)
위와 같은 개선을 통해 본 크롤링 엔진은 **"어떤 시점에(When), 어떤 국가의(Which Locale) 사이트에서 실행하더라도"** 데이터의 무결성을 보장할 수 있게 되었습니다. 이는 유지보수 비용을 낮추고 데이터 신뢰도를 획기적으로 향상시킵니다.
