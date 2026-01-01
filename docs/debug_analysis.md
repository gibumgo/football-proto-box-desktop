# 2026년 01월 01일 Flashscore 디스커버리 오류 분석 및 시나리오

현재 "검색 결과 없음" 및 오류가 지속되는 상황에 대해, 단순한 코드 문제가 아닌 **환경 및 통합 관점**에서의 분석 시나리오입니다.

## 1. 현재 상황 요약

- **현상**: Electron 앱에서 국가 선택 시 목록이 뜨지 않고 오류 또는 빈 결과가 반환됨.
- **특이사항**: 터미널에서 직접 파이썬 스크립트를 실행(`python3 main.py ...`)했을 때는 정상 작동함(Step 192 확인).
- **결론**: 파이썬 로직 자체(크롤링 코드)는 정상이지만, **Electron이 파이썬을 실행하는 과정**에서 문제가 발생하고 있습니다.

---

## 2. 발생 가능한 원인 시나리오

### 시나리오 A: 파이썬 실행 경로(Environment) 불일치 (가장 유력)
사용자의 터미널과 Electron 앱이 바라보는 `python3`가 서로 다를 수 있습니다.

- **터미널**: 사용자가 설정한 가상 환경(venv)이나 Homebrew로 설치한 최신 Python (`/opt/homebrew/bin/python3`)을 사용. 라이브러리가 모두 설치되어 있음.
- **Electron 앱**: 시스템 기본 Python (`/usr/bin/python3`)을 호출할 수 있음. 여기에는 `selenium`, `beautifulsoup4` 등의 라이브러리가 설치되어 있지 않아 실행 즉시 실패함.
- **증상**: 앱 로그에는 "ModuleNotFoundError"가 찍히거나, 아무 반응 없이 종료됨.

### 시나리오 B: IPC 데이터 파싱 실패
파이썬은 데이터를 보냈지만, Electron이 이를 인식하지 못하는 경우입니다.

- **원인**: 파이썬이 출력할 때 `IPC_DATA:` 접두어 앞에 다른 로그나 공백이 섞여 있거나, 인코딩 문제(한글 깨짐)로 인해 JSON 파싱이 실패했을 수 있습니다.
- **증상**: 파이썬은 정상 종료(Exit Code 0)되지만, Electron은 "데이터 없음"으로 판단함.

### 시나리오 C: 타임아웃 (Silent Timeout)
디스커버리 과정이 Electron이 기다려주는 시간(30초)보다 오래 걸리는 경우입니다.

- **원인**: 백그라운드에서 브라우저(Chrome/Firefox)를 띄우는 데 시간이 오래 걸리거나, 네트워크가 느려서 30초 내에 응답을 못 줌.
- **증상**: 30초 후 "Discovery timed out" 에러가 발생하며 강제 종료됨.

---

## 3. 검증 및 해결 방법 (Next Steps)

가장 유력한 **시나리오 A (파이썬 경로 문제)**부터 확인해야 합니다.

### 1단계: 파이썬 경로 강제 지정 (`main.ts`)
Electron이 시스템 파이썬 대신, 라이브러리가 설치된 정확한 파이썬 경로를 쓰도록 수정합니다.

```typescript
// Electron main process (pythonRunner.ts) 예시
this.pythonPath = '/Users/m1/.pyenv/shims/python3'; // 또는 which python3 결과
```

### 2단계: 디버그 로그 확인 (`TerminalWindow`)
Electron 앱 내의 터미널 창에 파이썬이 뱉는 에러 로그(stderr)가 실제로 찍히는지 확인합니다. 만약 "Module 'request' not found" 같은 에러가 보인다면 100% 경로 문제입니다.

### 3단계: IPC 메시지 포맷 단순화
파이썬 쪽에서 `print()`로 찍는 정보들이 IPC 메시지를 방해하지 않는지 확인하고, `IPCMessenger`가 순수한 JSON 문자열만 보내도록 점검합니다.
