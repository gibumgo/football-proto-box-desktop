# 🧭 Crawler Dashboard UX/UI Strategy & Design Doc
Date: 2026-01-01

## 1. 목적 및 초기 설계 의도 (Purpose & Initial Intent)

### 🎯 핵심 목적 (Core Purpose)
이 페이지는 **"신뢰할 수 있는 데이터 파이프라인의 제어 센터"**입니다.
단순히 버튼을 누르는 곳이 아니라, **복잡한 크롤링 작업을 정밀하게 설정하고, 안정적으로 실행하며, 그 결과를 실시간으로 확신할 수 있는 공간**이어야 합니다.

### 🏗️ 초기 설계 원칙 (Design Principles)
1.  **Transparency (투명성)**: 크롤러가 지금 무엇을 하고 있는지(로그, 터미널) 숨기지 않고 날것 그대로 보여줍니다.
2.  **Modularity (모듈화)**: Betinfo, Flashscore 등 서로 다른 소스를 하나의 통일된 인터페이스로 제어합니다.
3.  **Efficiency (효율성)**: 반복적인 작업(매일 최신 데이터 수집)을 최소한의 클릭으로 수행합니다.

---

## 2. 사용자 페르소나 (User Persona)

### 👤 "The Data Engineer Bettor" (데이터 엔지니어링 베터)
*   **성향**: 꼼꼼하고 분석적입니다. 데이터의 무결성을 중요시합니다.
*   **니즈 (Needs)**:
    *   "내가 설정한 대로 정확히 긁어오고 있는가?"
    *   "에러가 발생하면 즉시 알 수 있는가?"
    *   "수집된 데이터가 어디에 저장되는지 명확한가?"
*   **통증 포인트 (Pain Points)**:
    *   불확실한 진행 표시기(Spinner만 돌아가는 것).
    *   너무 많은 클릭이 필요한 설정 과정.
    *   화면 여기저기 흩어진 정보로 인한 피로감.

---

## 3. UI 플로우 (User Flow)

사용자의 작업 흐름은 **"Cyclic Execution Flow (순환 실행 흐름)"**입니다.

### Phase 1: Configuration (설정)
*   **Action**: 상단 탭에서 사이트 선택 -> 저장 경로 확인 -> 세부 옵션(리그, 연도) 조정.
*   **Mental Model**: "오늘의 작업 목표 설정"

### Phase 2: Execution (실행)
*   **Action**: 'Start' 버튼 클릭.
*   **Mental Model**: "엔진 점화"

### Phase 3: Monitoring (관제)
*   **Action**: 터미널 로그 확인, 진행률(Progress Bar) 관찰, 수집 속도(Metrics) 체크.
*   **Mental Model**: "비행 상태 점검"

### Phase 4: Verification (검증)
*   **Action**: 작업 완료 알림 -> 저장된 파일 열기(Open Folder).
*   **Mental Model**: "수확물 확인"

---

## 4. 시선 분산도 (Visual Hierarchy & Eye Tracking)

### 🚨 현재의 문제점 (The "Scattered" Experience)
현재(또는 개선 전) 레이아웃은 시선을 **위-아래-중앙**으로 과도하게 분산시킵니다.

1.  **Top (저장 경로)**: ❌ 시선이 가장 먼저 닿지만, 매번 바꿀 필요가 없는 정보가 너무 큽니다. (Attention Waste)
2.  **Center (설정 폼)**: ✅ 사용자가 가장 집중해야 할 곳.
3.  **Bottom (실행 버튼)**: ❌ 설정 후 시선을 급격히 아래로 내려야 합니다.
4.  **Bottom Right (로그)**: ⚠️ 실행 중에는 시선이 이곳에 고정되어야 하는데, 설정 폼과 거리가 멉니다.

### ✨ 개선 목표: "F-Pattern" or "Z-Pattern"
시선이 자연스럽게 흐르도록 유도해야 합니다.

*   **Zone 1 (Top Left -> Right)**: 탭 선택 및 현재 상태 확인 (Navigation).
*   **Zone 2 (Center)**: 옵션 설정 (Interaction).
*   **Zone 3 (Center Bottom or Right)**: 실행 버튼 (Action). **설정 바로 옆이나 아래**가 가장 이상적입니다.
*   **Zone 4 (Bottom Area)**: 실행 후 시선이 머무는 곳. (Monitoring). 실행 버튼을 누른 후 자연스럽게 시선이 떨어지는 곳에 터미널이 있어야 합니다.

### 💡 전략적 배치 제안
*   **Action Proximity**: `Start` 버튼은 `Form`의 끝부분에 인접해야 합니다.
*   **Contextual Feedback**: 로그 창은 항상 보이기보다, 실행 시 강조되는 것이 좋습니다(Dynamic Layout).
