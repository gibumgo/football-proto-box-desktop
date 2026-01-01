# Flashscore 통합 수집(Integrated) 기능 리팩토링 보고서

본 보고서는 Flashscore 크롤러의 통합 수집 모드에서 발생한 실행 오류 및 데이터 미저장 문제를 해결하기 위해 진행된 주요 리팩토링 과정을 기록합니다.

---

## 1. 발견된 문제점 (Problem Context)

### 🚨 ValueError 발생
- **현상**: `integrated` 작업 모드 실행 시 `VALUE_ERROR: Country and League must be specified...` 발생.
- **원인**: Electron 앱(`PythonRunner.ts`)에서 명령어를 생성할 때 `--country` 인자는 포함했으나, **`--league` 인자를 누락**하여 백엔드 컨트롤러의 유효성 검사를 통과하지 못함.

### 😶 침묵하는 수집 실패 및 연도 역산 오류 (Silent Failure & Year Drift)
- **현상 1**: 인자 누락 해결 후 실행 로그에는 `COMPLETE`가 뜨지만 데이터는 저장되지 않음.
- **현상 2**: 데이터가 수집되더라도 2026 -> 2021년 등으로 과도하게 연도가 차감되는 '연도 점핑(Year Jumping)' 현상 발생.
- **원인**: 
    - `FlashscoreService`의 `_sanitize_filename` 로직 오류로 인한 침묵하는 수집 실패.
    - **치명적 파싱 오류 (Root Cause)**: `flashscore.co.kr`의 날짜 포맷이 유럽식(`DD.MM.`)임에도 불구하고 `MM.DD.`로 오인하여 파싱함.
    - 이로 인해 매달 `01일(1월) -> 31일(31월?)`과 같이 날짜(Day)가 변경될 때마다 이를 '월(Month)'의 급격한 변화로 인식하여, 연도를 잘못 차감하는(Sawtooth Pattern) 버그가 발생함.
    - 브라우저가 빈 페이지를 반환했으나, 크롤러는 이를 '정상'으로 간주.

---

## 2. 해결 및 리팩토링 과정 (Solution & Refactoring)

### 🛠 Phase 1: 명령어 생성 로직 정합성 확보
- **대상**: `electron-app/src/main/pythonRunner.ts`
- **변경**: `FlashscoreOptions` 인터페이스의 `league` 필드가 파이썬 CLI의 `--league` 인자로 정확히 매핑되도록 처리 로직 추가.

### 🌍 Phase 2: URL 무결성 및 지능형 연도 추론 도입
- **대상**: `python-crawler/src/application/services/flashscore_service.py`, `match_parser.py`
- **리팩토링**:
    - **슬러그 보존**: Discovery 데이터를 활용해 정확한 URL 경로(`/soccer/england/premier-league`) 접속 보장.
    - **날짜 형식 중립성**: 정규표현식에 의존하던 연도 감산 로직을 폐기하고, **실제 파싱된 `datetime` 객체의 월 데이터**를 기준으로 점프(Jan -> Dec)를 감지하도록 개선.
    - **시즌 컨텍스트**: 시즌 정보(예: 2025-2026)를 기반으로 첫 경기의 연도를 지능적으로 자동 선택.

### 📊 Phase 3: 투명한 진행 보고 (Observability)
- **대상**: `FlashscoreService.py`, `match_parser.py`
- **개선**: `IPCMessenger`를 사용하여 UI 터미널에 실시간 수집 단계를 상세 보고.
    - `📍 Target Path`: 접속 경로 확인.
    - `🔍 Parsing...` & `📈 Found N matches`: 실제 데이터 수집량 실시간 확인.
    - `📅 Year jump!`: 연도 감산 발생 시 로그를 남겨 디버깅 투명성 확보.

---

## 3. 리팩토링 결과 요약

| 항목 | 리팩토링 전 | 리팩토링 후 |
| :--- | :--- | :--- |
| **인자 전달** | `--league` 누락 | 모든 필수 인자(`country`, `league`) 전달 |
| **접속 경로** | `.../england/premier_league` (오류) | `.../england/premier-league` (정확) |
| **에러 핸들링** | 빈 결과 시 '성공' 로그 출력 (기만적) | 데이터 부재 시 경고 로그 및 원인 출력 |
| **가시성** | 단순 시작/종료 로그만 출력 | 단계별 진행 상황 및 타겟 URL 노출 |

---

## 4. 향후 권장 사항
- **UI 레벨 검증**: 국가/리그 선택 전에는 실행 버튼이 비활성화되도록 디자인 가이드 준수.
- **예외 처리 강화**: 브라우저 로딩 실패 시 단순 타임아웃 대기보다는 명시적인 `ERROR` 상태를 반환하도록 `FlashscorePage.ts` 고도화 필요.

---
**작성일**: 2026년 1월 1일  
**상태**: 리팩토링 및 검증 완료
