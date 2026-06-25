# Vibe Diary

하루의 끝, 오직 당신의 감정과 생각에만 집중하는 공간.

Vibe Diary는 복잡한 기능과 불필요한 장식을 걷어낸 미니멀 감성 일기장입니다. 사용자는 그날의 감정을 하나 고르고, 짧은 생각을 적는 핵심 경험에만 집중할 수 있습니다. 감정에 따라 화면의 색감이 부드럽게 바뀌며, 작성 중인 내용은 별도의 저장 버튼 없이 자동으로 보관됩니다.

## 핵심 가치

- **미니멀리즘**: 일기를 쓰는 데 필요한 요소만 남깁니다.
- **감성적 경험**: 선택한 감정이 앱 전체 분위기에 자연스럽게 반영됩니다.
- **직관성**: 감정 선택, 글쓰기, 과거 기록 조회가 한 화면에서 이어집니다.

## 주요 기능

- 오늘의 감정을 5가지 상태 중 선택할 수 있습니다.
- 감정에 따라 배경색과 텍스트 색상이 부드럽게 전환됩니다.
- 텍스트 입력 후 300ms debounce를 거쳐 자동 저장됩니다.
- 모든 데이터는 서버 없이 브라우저 `localStorage`에 저장됩니다.
- 과거 일기 목록에서 날짜, 감정 아이콘, 일부 내용을 미리 볼 수 있습니다.
- 목록에서 특정 일기를 선택하면 전체 내용을 다시 읽고 수정할 수 있습니다.

## 감정 테마

| 감정 | 배경색 | 텍스트 색상 |
| --- | --- | --- |
| happy | `#FFFBEB` | `#F59E0B` |
| sad | `#EFF6FF` | `#3B82F6` |
| calm | `#F0FDF4` | `#16A34A` |
| angry | `#FEF2F2` | `#EF4444` |
| neutral | `#F9FAFB` | `#6B7280` |

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 안내되는 로컬 주소로 접속하면 앱을 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

### 테스트

```bash
npm run test -- --run
```

### 린트

```bash
npm run lint
```

## 프로젝트 구조

```text
src/
  components/
    DiaryEditor.tsx
    EmotionPicker.tsx
    HistoryList.tsx
  lib/
    diaryStorage.ts
    emotions.ts
  App.tsx
  main.tsx
  styles.css
tests/
  features/
    diary/
      DiaryEditor.spec.tsx
docs/
  configuration.md
```

## 데이터 저장 방식

일기 데이터는 `localStorage`의 `vibeDiaryData` 키에 저장됩니다.

```ts
type DiaryEntry = {
  id: string;
  date: number;
  emotion: 'happy' | 'sad' | 'calm' | 'angry' | 'neutral';
  text: string;
};
```

예시:

```json
[
  {
    "id": "2026-06-25",
    "date": 1782392400000,
    "emotion": "calm",
    "text": "조용하고 괜찮은 하루였다."
  }
]
```

## 기술 스택

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Feather Icons
