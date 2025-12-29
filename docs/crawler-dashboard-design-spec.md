# 🎨 크롤러 대시보드 하이브리드 디자인 스펙 v3
**전략(Strategy)**: 네온 오퍼레이터(Visual) + 플로팅 컨트롤 타워(Structure)

## v2에서의 변경 사항
- **복구**: 사이드 패널 (컨트롤 타워).
- **수정**: 고정형 사이드바 -> 플로팅 패널 (분리 및 강조).
- **비주얼**: 강력한 테두리와 그림자가 적용된 글래스모피즘(Glassmorphism).

## 1. 디자인 정체성 (Design Identity)
- **비주얼 테마**: `High Contrast(고대비)`, `Cyberpunk(사이버펑크)`, `Developer Tool(개발자 도구)`
- **구조적 테마**: `Independent Modules(독립 모듈)`, `Floating Layout(부유형 레이아웃)`
- **핵심 가치**: 독립적으로 존재하는 데이터를 제어하는 '부유하는(Floating)' 컨트롤 타워.

## 2. 레이아웃 구조 (Floating)

```
[ Window Background: Deep Void (#050505) ]

   Gap (16px)
   │
┌──┴──┐  ┌───────────────────────────────────────────┐
│     │  │ [HEADER] Dashboard View / Status          │
│ F   │  ├───────────────────────────────────────────┤
│ L   │  │                                           │
│ O   │  │ [MAIN MONITORING AREA - Floating]         │
│ A   │  │                                           │
│ T   │  │ ┌───────────────────────────────────────┐ │
│ N   │  │ │ [Metric Cards Grid]                   │ │
│ G   │  │ └───────────────────────────────────────┘ │
│     │  │                                           │
│ P   │  │ ┌───────────────────────────────────────┐ │
│ A   │  │ │ [Terminal Window (Resizable)]         │ │
│ N   │  │ │ > Logs...                             │ │
│ L   │  │ └───────────────────────────────────────┘ │
│     │  │                                           │
└─────┘  └───────────────────────────────────────────┘
```

### 2.1. 플로팅 컨트롤 패널 (좌측)
- **형태(Geometry)**: `너비 340px`, `둥근 모서리`, `마진 16px`.
- **스타일(Style)**:
    - 배경: `rgba(10, 15, 20, 0.8)` + `Blur 10px`
    - 테두리: `1px solid NEON_CYAN (Active)`
    - 그림자: `0 4px 20px rgba(0,0,0,0.5)`
- **기능(Function)**: 크롤러 실행/정지 및 설정 제어. 완전히 독립된 '리모컨' 같은 느낌을 줍니다.

### 2.2. 메인 대시보드 (우측)
- **형태(Geometry)**: `Flex 1` (나머지 공간 채움), `둥근 모서리`.
- **스타일(Style)**:
    - 배경: `BG_PANEL` (불투명)
    - 테두리: `1px solid BORDER_DEFAULT`
- **기능(Function)**: 데이터 시각화 및 로그 모니터링에 집중.

## 3. 컬러 시스템: [The Neon Palette]
(기존 v1 팔레트 유지)
- **`NEON_CYAN`**: 주요 액션 (Primary Action)
- **`NEON_GREEN`**: 상태 양호 / 실행 중 (Status OK / Running)
- **`NEON_RED`**: 에러 / 정지 (Error / Stop)
