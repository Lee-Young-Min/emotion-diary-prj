# 영민의 Vibe Diary

하루의 끝, 오직 영민의 감정과 생각에만 집중하는 공간.

Vibe Diary는 복잡한 기능과 불필요한 장식을 걷어낸 미니멀 감성 일기장입니다. 사용자는 그날의 감정을 하나 고르고, 짧은 생각을 적는 핵심 경험에만 집중할 수 있습니다. 감정에 따라 화면의 색감이 부드럽게 바뀌며, 작성 중인 내용은 별도의 저장 버튼 없이 프로젝트 폴더의 로컬 JSON 파일에 자동 보관됩니다.

## 핵심 가치

- **미니멀리즘**: 일기를 쓰는 데 필요한 요소만 남깁니다.
- **감성적 경험**: 선택한 감정이 앱 전체 분위기에 자연스럽게 반영됩니다.
- **직관성**: 감정 선택, 글쓰기, 과거 기록 조회가 한 화면에서 이어집니다.

## 주요 기능

- 오늘의 감정을 5가지 표정 이모지와 한글 라벨로 선택할 수 있습니다.
- 감정에 따라 배경색과 텍스트 색상이 부드럽게 전환됩니다.
- 텍스트 입력 후 300ms debounce를 거쳐 자동 저장됩니다.
- 기록은 프로젝트 폴더의 `data/vibeDiaryData.json` 파일에 자동 저장됩니다.
- 기존 브라우저 `localStorage` 기록이 있으면 실행 시 프로젝트 파일과 병합됩니다.
- 최신 7일 기록을 기본으로 보여줍니다.
- 7일보다 오래된 기록은 시작일과 종료일을 입력해 기간 검색으로 확인할 수 있습니다.
- 과거 일기 목록에서 날짜, 감정 표정, 일부 내용을 미리 볼 수 있습니다.
- 목록에서 특정 일기를 선택하면 전체 내용을 다시 읽고 수정할 수 있습니다.

## 감정 테마

| 감정 | 표정 | 배경색 | 텍스트 색상 |
| --- | --- | --- | --- |
| happy | 😊 기쁨 | `#FFFBEB` | `#F59E0B` |
| sad | 😢 슬픔 | `#EFF6FF` | `#3B82F6` |
| calm | 😌 평온 | `#F0FDF4` | `#16A34A` |
| angry | 😠 화남 | `#FEF2F2` | `#EF4444` |
| neutral | 😐 보통 | `#F9FAFB` | `#6B7280` |

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 안내되는 로컬 주소로 접속하면 앱을 확인할 수 있습니다. 개발 서버는 `/api/diary` 로컬 API를 제공하며, 이 API가 프로젝트 폴더의 `data/vibeDiaryData.json` 파일을 읽고 씁니다.

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
data/
  vibeDiaryData.json  # 앱 실행 중 자동 생성, Git에는 커밋하지 않음
tests/
  features/
    diary/
      DiaryEditor.spec.tsx
docs/
  configuration.md
```

## 데이터 저장 방식

일기 데이터는 프로젝트 폴더의 `data/vibeDiaryData.json` 파일에 저장됩니다. 이 파일은 개인 기록을 담기 때문에 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

브라우저 `localStorage`의 `vibeDiaryData` 키는 이전 버전 기록을 보존하기 위한 보조 저장소로만 사용됩니다. 앱 실행 시 프로젝트 파일과 `localStorage` 기록을 병합하고, 이후 변경 사항은 `data/vibeDiaryData.json`에 자동 저장됩니다.

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
