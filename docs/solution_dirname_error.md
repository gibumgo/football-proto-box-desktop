# 🛠️ `__dirname` 오류 해결 및 컨텍스트 리포트

**날짜:** 2026년 01월 01일
**문제 파일:** `electron-app/src/main/pythonRunner.ts`
**관련 설정:** `electron-app/tsconfig.json`, `tsconfig.electron.json`

---

## 1. � 배경 및 맥락 (Context History)

이 문제는 단순한 문법 오류가 아니라, **Flashscore 크롤러 연동 디버깅**이라는 더 큰 작업의 일환으로 발생했습니다.

### 1단계: 초기 문제 (Flashscore 디스커버리 실패)
- **증상**: Electron 앱에서 Flashscore 국가/리그 검색 시 결과가 반환되지 않음.
- **분석 결과**: 터미널에서 Python 스크립트 직접 실행 시에는 정상 작동함. 따라서 Electron이 Python을 실행하는 **환경(Environment)이나 경로 설정**의 문제로 판단.

### 2단계: 해결 시도 (PythonRunner 개선)
- **접근**: 불확실한 상대 경로 실행 방식을 개선하기 위해, `PythonRunner.ts`에서 `__dirname`을 사용하여 Python 스크립트의 **절대 경로**를 명시적으로 지정하고자 함.
- **코드 변경 의도**:
  ```typescript
  // 상대 경로 대신
  this.mainScriptPath = path.resolve(__dirname, '../../../python-crawler/main.py');
  ```

### 3단계: 장벽 발생 (TypeScript 설정 오류)
- **오류 발생**: 코드를 수정하자마자 IDE에서 빨간 줄 발생.
  1. `'child_process' 모듈을 찾을 수 없습니다.`
  2. `'__dirname' 이름을 찾을 수 없습니다.`
- **의미**: TypeScript 컴파일러가 이 파일을 Node.js(Electron Main) 파일이 아닌, 브라우저(Frontend) 파일로 잘못 인식하고 있음을 시사.

---

## 2. 🚨 발생한 문제 (The Specific Error)

### 오류 내용
```typescript
'__dirname' 이름을 찾을 수 없습니다. @[/.../pythonRunner.ts]
```

### 원인 분석 (Root Cause)
프로젝트의 **TypeScript 설정 구조(Composition)**가 끊어져 있었습니다.

1.  **설정 분리**: 프로젝트는 `Frontend(App)`와 `Backend(Electron)` 설정을 별도 파일로 관리 중.
    - `tsconfig.app.json`: Frontend용 (`src/main` 제외)
    - `tsconfig.electron.json`: Electron Main용 (`src/main` 포함, CommonJS/Node 환경)
2.  **연결 누락**: 
    - IDE는 최상위 `tsconfig.json`을 기준으로 동작합니다.
    - 하지만 최상위 설정의 `references` 목록에 **`tsconfig.electron.json`이 빠져 있었습니다.**
3.  **결과**: IDE는 `src/main`의 파일들에 어떤 설정을 적용할지 몰라 기본값(또는 Frontend 설정)을 적용했고, 그 결과 Node.js 전역 변수인 `__dirname`을 인식하지 못했습니다.

---

## 3. ✅ 해결 방법 (The Fix)

`electron-app/tsconfig.json` 파일에 누락된 참조를 추가하여 연결 고리를 복구했습니다.

**수정된 `electron-app/tsconfig.json`:**
```json
{
  "files": [],
  "compilerOptions": { ... },
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.electron.json" }  // 👈 [추가됨] Main Process 설정 연결
  ]
}
```

---

## 4. 🎯 결론 (Conclusion)

- **설정 정상화**: 이제 `src/main` 디렉토리 내의 파일들은 올바르게 Node.js/Electron 환경으로 인식됩니다.
- **디버깅 재개 가능**: 환경 설정 문제가 해결되었으므로, 원래 목표였던 **'Flashscore 디스커버리 기능의 Python 경로 문제'**를 해결하기 위한 코드 수정(`__dirname` 활용 등)을 계속 진행할 수 있습니다.
