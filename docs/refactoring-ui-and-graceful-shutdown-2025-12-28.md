# 🛠️ Implementation & Refactoring Log (2025-12-28)

본 문서는 Electron UI 개편 및 Python 크롤러의 Graceful Shutdown 기능을 구현하는 과정에서의 기술적 문제 해결과 리팩토링 내용을 기록합니다.

## 1. UI/UX 전면 리팩토링 (React/Electron)

### 🚨 문제 상황 (Problem)
- **고정 레이아웃의 한계**: `width: 35%` 또는 고정 픽셀(`px`) 사용으로 인해 창 크기 조절 시 UI가 깨지거나 여백이 낭비됨.
- **스타일 부조화**: 과도한 이모티콘 사용으로 인해 전문적인 개발 도구보다는 장난감 같은 인상을 줌.
- **복잡한 설정 접근**: 중요도가 낮은 고급 설정들이 탭(Tab) 뒤에 숨겨져 있어 직관적이지 않거나, 반대로 너무 많은 공간을 차지함.

### 💡 해결 및 리팩토링 (Solution & Refactoring)

#### 1. 반응형 레이아웃 도입 (`CrawlerDashboard.tsx`)
- **Flexbox & Grid 적용**:
    - 좌측 패널(Control): `flex: 0 0 320px`, `maxWidth: 360px`로 컨텐츠 좁아짐 방지.
    - 우측 패널(Data/Logs): `flex: 1`로 남은 공간 자동 채움.
    - 카드 그리드: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` 사용하여 창 너비에 따라 카드 배열 자동 조정.

#### 2. 아코디언 설정 패널 (`CrawlerControlPanel.tsx`)
- **공간 효율화**: 자주 쓰지 않는 'Headless', 'Timeout' 등은 아코디언 메뉴(`▼`)로 숨김 처리.
- **상태 보존**: 컴포넌트 언마운트가 아닌 `display` 제어 또는 조건부 렌더링으로 상태 유지.

#### 3. 디자인 시스템 정제 (`DataInventoryCard.tsx` 등)
- **No Emojis**: 텍스트 가독성을 저해하는 이모티콘 제거.
- **Visual Signals**: 텍스트 대신 `Status Dot`(●)의 색상(`NEON_GREEN`, `NEON_RED`)으로 상태 표현.
- **Input 최적화**: 입력 필드의 너비를 콘텐츠 길이에 맞게 최적화하여 시각적 피로도 감소.

---

## 2. Python Graceful Shutdown 구현

### 🚨 문제 상황 (Problem)
- **Zombie Process**: Electron 앱에서 "중지" 버튼을 누르거나 앱을 종료하면, Python 프로세스는 죽지만 **Chrome 브라우저 창은 그대로 떠 있는 현상** 발생.
- **원인 분석**:
    - Python `try-finally` 블록의 `driver.quit()`은 정상 종료 시에는 실행되지만, 외부(`kill`, `SIGTERM`)에 의한 강제 종료 시에는 실행이 보장되지 않음.
    - Controller 내부에서 `driver`를 지역 변수로 선언하여 외부에서 접근하거나 제어할 방법이 없음.

### 💡 해결 및 리팩토링 (Solution & Refactoring)

#### 1. Controller 구조 변경 (Member Variable Promotion)
`driver` 객체의 생명주기를 외부에서 제어할 수 있도록 클래스 멤버 변수로 승격시켰습니다.

**Before (`cli_betinfo_controller.py`):**
```python
def run(self, args):
    driver = ChromeDriverFactory.create()  # Local variable
    # ...
    # 외부에서 driver에 접근 불가 -> 강제 종료 시 quit() 호출 불가
```

**After (`cli_betinfo_controller.py`):**
```python
def __init__(self, ...):
    self.driver = None  # Instance variable

def run(self, args):
    self.driver = ChromeDriverFactory.create()
    # ...

def stop(self):
    """External Shutdown Hook"""
    if self.driver:
        self.driver.quit()
        self.driver = None
```

#### 2. Signal Handling 추가 (`main.py`)
운영체제(Electron)로부터 오는 종료 신호를 감지하여 `stop()` 메서드를 호출하는 중개 로직을 구현했습니다.

`active_controller` 전역 변수를 도입하여 현재 어떤 컨트롤러가 실행 중인지 추적합니다.

```python
import signal

# 현재 실행 중인 컨트롤러 추적
active_controller = None

def signal_handler(signum, frame):
    """SIGINT, SIGTERM 시그널 수신 시 실행"""
    IPCMessenger.log(f"Received signal {signum}. Shutting down...", level="INFO")
    
    # 실행 중인 컨트롤러가 있다면 안전하게 정지(브라우저 종료 포함)
    if active_controller and hasattr(active_controller, 'stop'):
        active_controller.stop()
        
    sys.exit(0)

# 핸들러 등록
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)
```

### ✨ 최종 결과
- Electron에서 **[Stop]** 클릭 → `SIGTERM` 전송 → Python `signal_handler` 동작 → `active_controller.stop()` 실행 → **Chrome 브라우저 종료** (`driver.quit()`) → Python 프로세스 종료.
- 리소스 누수(메모리, 좀비 프로세스) 없이 깔끔하게 종료됨.
