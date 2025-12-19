# Proto Box 구현 현황 (2025-12-17 기준)

## 📁 프로젝트 구조

```
footballBet/
├── java-app/                    # 백엔드 (Java)
│   └── src/main/java/
│       └── com/footballbet/
│           └── parser/          # CSV 파싱 로직
├── electron-app/                # 프론트엔드 (Electron + React)
│   └── src/
│       ├── domain/              # 도메인 계층 (DDD)
│       ├── components/          # UI 컴포넌트
│       ├── pages/               # 페이지 컴포넌트
│       └── types.ts             # DTO 타입 정의
├── data/                        # CSV 데이터 파일
└── docs/                        # 문서
```

---

## 🔧 백엔드 (Java)

### 구현 완료
| 컴포넌트 | 경로 | 역할 | 상태 |
|---------|------|------|------|
| **CSV Parser** | `java-app/src/main/java/com/footballbet/parser/` | 프로토 데이터 CSV 파싱 | ✅ |
| **Data Model** | `java-app/src/main/java/com/footballbet/model/` | Match, Odds, Result 모델 | ✅ |
| **JSON Exporter** | `java-app/src/main/java/com/footballbet/exporter/` | 파싱 결과를 JSON으로 변환 | ✅ |

### 향후 추가 예정
| 기능 | 설명 | 우선순위 |
|------|------|---------|
| **데이터 검증** | CSV 데이터 무결성 검사 | 중간 |
| **통계 계산** | 리그별/팀별 통계 사전 계산 | 낮음 |
| **캐싱** | 파싱 결과 캐싱으로 성능 개선 | 낮음 |

---

## 💻 프론트엔드 (Electron + React)

### A. 도메인 계층 (Domain Layer)

#### 구현 완료

| 디렉토리/파일 | 역할 | 설명 |
|-------------|------|------|
| **`domain/models/`** | 도메인 모델 | DDD 패턴 적용 |
| `├─ Match.ts` | 경기 집합 루트 | 경기 전체 정보를 담는 엔티티 |
| `├─ MatchInfo.ts` | 경기 기본 정보 | 회차, 번호, 일시, 리그, 팀 |
| `├─ MatchOdds.ts` | 배당 정보 | 승/무/패 배당률 |
| `└─ MatchResult.ts` | 경기 결과 | 스코어, 결과, 결과 배당 |
| **`domain/mappers/`** | 매퍼 | DTO ↔ Domain 변환 |
| `└─ MatchMapper.ts` | Match 매퍼 | DTO를 도메인 객체로 변환 |
| **`domain/design/`** | 디자인 시스템 | UI 일관성 유지 |
| `├─ theme.ts` | 테마 정의 | VS Code Dark+ 색상, 타이포그래피, 밀도 |
| `├─ layout.ts` | 레이아웃 상수 | Sidebar/Topbar 크기 |
| `└─ tokens.ts` | 디자인 토큰 | Spacing, Border, Shadow, Transition |
| **`domain/logic/`** | 비즈니스 로직 | 도메인 규칙 |
| `└─ SignalLogic.ts` | Signal 판단 로직 | 정배 붕괴/역배 적중 판단 |

#### 향후 추가 예정

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| **도메인 서비스** | 복잡한 비즈니스 로직 분리 | 중간 |
| **밸류 오브젝트** | 배당, 스코어 등을 VO로 | 낮음 |
| **도메인 이벤트** | 경기 결과 변경 이벤트 | 낮음 |

---

### B. 컴포넌트 계층 (Component Layer)

#### 구현 완료

| 디렉토리/파일 | 역할 | 설명 |
|-------------|------|------|
| **`components/layout/`** | 레이아웃 컴포넌트 | 앱 구조 |
| `├─ AppLayout.tsx` | 메인 레이아웃 | Sidebar + Topbar + Content |
| `├─ Sidebar.tsx` | 사이드바 | 내비게이션 메뉴 |
| `└─ Topbar.tsx` | 탑바 | 통계, 검색, Signal/Density 토글 |
| **`components/common/`** | 공통 컴포넌트 | 재사용 가능 |
| `└─ StatusUI.tsx` | 상태 UI | Loading, Error, NoData |

#### 향후 추가 예정

| 컴포넌트 | 설명 | 우선순위 |
|---------|------|---------|
| **Modal** | 경기 상세 팝업 | 높음 |
| **Dropdown** | 리그/팀 선택 드롭다운 | 높음 |
| **DatePicker** | 날짜 범위 선택 | 중간 |
| **Slider** | 배당 구간 슬라이더 | 중간 |
| **Card** | 팀별 보기 카드 | 중간 |
| **Chart** | 재사용 가능한 차트 래퍼 | 낮음 |

---

### C. 페이지 계층 (Page Layer)

#### 구현 완료

| 페이지 | 파일 | 현재 기능 | 상태 |
|-------|------|----------|------|
| **Dashboard** | `pages/Dashboard.tsx` | • 통계 카드 (전체 경기, 승률, 무승부율, 패율)<br>• 리그별 분포 Bar Chart<br>• 결과 분포 Pie Chart | ✅ |
| **Matches** | `pages/Matches.tsx` | • 기본 테이블 (회차, 번호, 일시, 리그, 팀, 배당, 결과)<br>• 결과 네온 효과 (승=그린, 무=옐로우, 패=레드)<br>• 적중 배당 강조 (네온 시안)<br>• Signal 모드 (정배 붕괴/역배 적중) | ✅ |

#### 향후 추가 예정

| 페이지 | 주요 기능 | 우선순위 |
|-------|----------|---------|
| **Team View** | • 팀 검색<br>• Timeline Card View<br>• 스파크라인 차트<br>• 배당 추이 | 높음 |
| **Odds View** | • 배당 구간 슬라이더<br>• 승/무/패 분포 차트<br>• 리그별 분포<br>• 기대값 계산 | 높음 |
| **League View** | • 리그 선택<br>• 리그 통계<br>• 날짜별 그룹화<br>• 무승부 경고 | 중간 |
| **Odds Calculator** | • 단일/조합 배당 계산<br>• 기대값(EV) 계산<br>• 켈리 기준 | 중간 |
| **Win Rate Simulator** | • 가설 설정 UI<br>• 시뮬레이션 엔진<br>• 결과 시각화<br>• 백테스팅 | 높음 ⭐ |
| **Settings** | • 테마 설정<br>• 밀도/Signal 기본값<br>• 데이터 소스 설정 | 낮음 |

---

## 📊 현재 구현 상태 요약

### A. 백엔드 (Java)

| 항목 | 완료 | 진행 중 | 미착수 |
|------|------|---------|--------|
| CSV 파싱 | ✅ | - | - |
| JSON 변환 | ✅ | - | - |
| 데이터 검증 | - | - | ☐ |
| 통계 계산 | - | - | ☐ |

**완료율**: 100% (핵심 기능)

---

### B. 프론트엔드 - 도메인 계층

| 항목 | 완료 | 진행 중 | 미착수 |
|------|------|---------|--------|
| 도메인 모델 | ✅ | - | - |
| 매퍼 | ✅ | - | - |
| 디자인 시스템 | ✅ | - | - |
| 비즈니스 로직 | ✅ | - | - |
| 도메인 서비스 | - | - | ☐ |

**완료율**: 80%

---

### C. 프론트엔드 - 컴포넌트 계층

| 항목 | 완료 | 진행 중 | 미착수 |
|------|------|---------|--------|
| 레이아웃 | ✅ | - | - |
| 공통 컴포넌트 (기본) | ✅ | - | - |
| Modal | - | - | ☐ |
| Dropdown | - | - | ☐ |
| DatePicker | - | - | ☐ |
| Slider | - | - | ☐ |
| Card | - | - | ☐ |

**완료율**: 30%

---

### D. 프론트엔드 - 페이지 계층

| 페이지 | 완료 | 진행 중 | 미착수 |
|--------|------|---------|--------|
| Dashboard | ✅ | - | - |
| Matches (기본) | ✅ | - | - |
| Matches (고급) | - | - | ☐ |
| Team View | - | - | ☐ |
| Odds View | - | - | ☐ |
| League View | - | - | ☐ |
| Odds Calculator | - | - | ☐ |
| Win Rate Simulator | - | - | ☐ |
| Settings | - | - | ☐ |

**완료율**: 22% (2/9)

---

## 🎯 전체 프로젝트 진행률

| 영역 | 완료율 | 비고 |
|------|--------|------|
| **백엔드** | 100% | 핵심 기능 완료 |
| **도메인 계층** | 80% | DDD 리팩토링 완료 |
| **컴포넌트 계층** | 30% | 레이아웃 완료, 공통 컴포넌트 필요 |
| **페이지 계층** | 22% | 기본 페이지만 구현 |
| **전체** | **약 40%** | 기초 인프라 완성 |

---

## 📝 폴더별 객체 의미 정리

### `/domain/models/` - 도메인 모델
> **역할**: 비즈니스 핵심 개념을 코드로 표현  
> **원칙**: 불변성, 캡슐화, 비즈니스 규칙 포함

- `Match`: 경기 전체를 대표하는 집합 루트 (Aggregate Root)
- `MatchInfo`: 경기 메타데이터 (회차, 팀, 리그 등)
- `MatchOdds`: 배당 정보 (승/무/패)
- `MatchResult`: 경기 결과 (스코어, 결과)

### `/domain/mappers/` - 매퍼
> **역할**: 외부 데이터(DTO)를 도메인 객체로 변환  
> **원칙**: 단방향 변환, 검증 로직 포함

- `MatchMapper`: DTO → Match 도메인 객체

### `/domain/design/` - 디자인 시스템
> **역할**: UI 일관성 유지, 디자인 토큰 중앙 관리  
> **원칙**: Single Source of Truth

- `theme.ts`: 색상, 타이포그래피, 밀도
- `layout.ts`: 레이아웃 크기
- `tokens.ts`: Spacing, Border, Shadow 등

### `/domain/logic/` - 비즈니스 로직
> **역할**: 도메인 규칙, 계산 로직  
> **원칙**: 순수 함수, 테스트 가능

- `SignalLogic.ts`: 정배 붕괴/역배 적중 판단

### `/components/layout/` - 레이아웃 컴포넌트
> **역할**: 앱 전체 구조 정의  
> **원칙**: 재사용 가능, Props로 제어

- `AppLayout`: 메인 레이아웃 래퍼
- `Sidebar`: 내비게이션
- `Topbar`: 전역 필터 & 액션

### `/components/common/` - 공통 컴포넌트
> **역할**: 재사용 가능한 UI 요소  
> **원칙**: 단일 책임, Props 기반

- `StatusUI`: Loading, Error, NoData 상태 표시

### `/pages/` - 페이지 컴포넌트
> **역할**: 라우트별 화면 구성  
> **원칙**: 컴포넌트 조합, 비즈니스 로직 분리

- `Dashboard`: 전체 요약 대시보드
- `Matches`: 경기 목록 & 분석

---

## 🚀 다음 단계 (우선순위 높음)

1. **AG Grid 재적용** (Matches 페이지 고도화)
2. **팀 검색 기능** (Topbar 검색창)
3. **필터 시스템** (날짜, 리그, 타입)
4. **공통 컴포넌트 개발** (Modal, Dropdown, DatePicker)
5. **승률 시뮬레이터 시작** (가설 설정 UI)

---

**작성일**: 2025-12-17  
**작성자**: Antigravity AI  
**버전**: v0.1.0 Alpha
