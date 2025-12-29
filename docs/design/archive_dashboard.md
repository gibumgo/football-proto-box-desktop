# 아카이브 대시보드 (Archive Dashboard) 설계서

## 1. 개요 (Overview)
**Archive Dashboard**는 과거 회차 및 시즌의 경기 데이터를 조회하고 복기(Review)하는 공간입니다. 사용자는 특정 회차를 선택하여 해당 회차의 경기 결과, 배당 흐름, 그리고 "정배/역배" 통계를 분석할 수 있습니다.

## 2. UI 레이아웃 (Layout)

화면은 크게 상단 헤더(컨트롤), 우측 패널(통계), 중앙 메인 패널(데이터)로 구성됩니다.

### 2.1 상단 헤더 (Header Control)
*   **회차 선택기 (Round Selector)**
    *   **형태**: 검색 가능한 콤보박스 (Searchable Selector) 또는 Autocomplete Input.
    *   **기능**: 사용자가 회차 번호(예: 140, 141)를 입력하거나 목록에서 선택.
    *   **데이터 소스**: `/data/crawled/betinfo` 디렉토리 내의 파일명(`betinfo_proto_rate_{YYYY}{RRR}.csv`)에서 회차 정보를 추출.
    *   **디폴트 값**: 가장 최신(숫자가 큰) 회차 파일을 자동 선택.
*   **리그 필터 (League Filter)**
    *   **위치**: 회차 선택기 우측.
    *   **기능**: 선택된 회차에 포함된 리그 목록 제공 및 필터링.
    *   **구성**: 리그 이미지 + 리그명 리스트 (추후 고도화 예정).

### 2.2 우측 패널 (Right Panel - Review)
*   **회차 복기 통계 (Round Review Stats)**
    *   해당 회차의 전체적인 배당 흐름과 결과를 요약.
    *   **주요 지표**:
        *   **정배 (Favorites) 적중 횟수/비율**
        *   **역배 (Underdogs) 적중 횟수/비율**
        *   **무승부 비율**
    *   **로직 (Business Logic)**:
        *   Java OOP 스타일의 객체 지향 설계 적용.
        *   `Favorite`(정배), `Underdog`(역배) 객체를 통해 배당 차이 및 결과 판별 로직 캡슐화.

### 2.3 중앙 메인 패널 (Main Content - Result Table)
*   **테이블 구성**: 회차별 상세 경기 데이터 표시.
*   **컬럼 정의 (Columns)**:
    1.  **회차** (Round)
    2.  **경기번호** (Match No)
    3.  **날짜 및 시간** (Date & Time)
    4.  **리그명** (League)
    5.  **홈팀** (Home)
    6.  **원정팀** (Away)
    7.  **유형** (Type)
    8.  **배당 (국내)** (Domestic Odds)
        *   승 (Home Win)
        *   무 (Draw)
        *   패 (Away Win)
    9.  **절삭치 (Cutoff/Difference)**
        *   계산식: `국내 배당 - 해외 배당` (승/무/패 각각 계산)
        *   표시: 양수/음수에 따른 시각적 구분(색상 등).
    10. **결과** (Result)
        *   스코어 (Score)
        *   경기 결과 (Match Result: 승/무/패)
*   **스타일링 (Visual Feedback)**:
    *   **결과 배당 컬럼 강조**: 실제 경기 결과(승/무/패)에 해당하는 배당 셀의 배경색 변경 (적중확인 용이성).

## 3. 데이터 및 로직 (Data & Logic)

### 3.1 데이터 소스
*   **경로**: `/data/crawled/betinfo/`
*   **파일 포맷**: `betinfo_proto_rate_{YYYY}{RRR}.csv` (CSV 포맷)

### 3.2 핵심 로직 (Calculation)
*   **절삭치 계산**:
    *   `HomeDiff` = `HomeOdds(Domestic)` - `HomeOdds(Overseas)`
    *   `DrawDiff` = `DrawOdds(Domestic)` - `DrawOdds(Overseas)`
    *   `AwayDiff` = `AwayOdds(Domestic)` - `AwayOdds(Overseas)`
*   **정배/역배 판별**:
    *   배당률 기준 가장 낮은 배당을 '정배'로 정의.
    *   결과와 비교하여 적중 여부 판단.

## 4. 구현 단계 (Implementation Steps)
1.  **파일 리더 구현**: CSV 파일 파싱 및 객체 변환 유틸리티.
2.  **도메인 모델 설계**: `Match`, `Odds`, `RoundStats` 클래스 (OOP).
3.  **UI 컴포넌트 개발**:
    *   `ArchiveDashboard`: 메인 컨테이너.
    *   `RoundSelector`: 회차 검색/선택.
    *   `ReviewPanel`: 통계 표시.
    *   `ResultTable`: 데이터 그리드.

## 5. Java 백엔드 설계 (Java Backend Architecture)

데이터 처리와 비즈니스 로직은 **Java Backend**에서 전담하며, 객체 지향 프로그래밍(OOP) 원칙과 관심사의 분리(Separation of Concerns)를 따릅니다.

### 5.1 아키텍처 계층 (Layers)
| 계층 (Layer) | 역할 (Role) | 패키지 (Package) |
| :--- | :--- | :--- |
| **Controller** | Electron의 요청을 받아 응답을 반환 (Endpoint) | `com.football.app.controller` |
| **Service** | 비즈니스 로직 실행 (통계 계산, 데이터 조합) | `com.football.app.service` |
| **Domain (Model)** | 핵심 데이터 구조 및 비즈니스 행위 (OOP) | `com.football.app.domain` |
| **Repository** | 데이터 접근 (CSV 파일 읽기/쓰기) | `com.football.app.repository` |

### 5.2 주요 도메인 모델 (Key Domain Models)
*   **`Match`**: 하나의 경기 정보를 담는 핵심 객체.
    *   `Odds`: 배당 정보를 담는 값 객체 (Value Object).
    *   `MatchResult`: 경기 결과(스코어, 승패)를 담는 객체.
    *   `calculateCutoff(Domestic, Overseas)`: 절삭치 계산 행동 포함.
*   **`BettingOdds`**: 승/무/패 배당률을 캡슐화. 정배/역배 판단 로직 포함.
    *   `boolean isFavorite()`
    *   `boolean isUnderdog()`
*   **`RoundStats`**: 특정 회차의 통계를 계산하는 객체.
    *   `calculateWinRate()`
    *   `countFavorites()`

### 5.3 데이터 흐름 (Data Flow)
1.  **Electron**: `ipcRenderer.invoke('get-archive-data', round)` 요청.
2.  **Java Controller**: 요청 수신 → `ArchiveService.getRoundData(round)` 호출.
3.  **Java Service**:
    *   `CsvRepository`를 통해 CSV 로드.
    *   `List<Match>` 배당 절삭치 계산 및 정배/역배 판정 (`Match` 객체 내부 로직).
    *   `RoundStats`를 생성하여 통계 집계.
4.  **Java Controller**: `ArchiveDataDto` (DTO 패턴)로 변환하여 Electron에 반환.
