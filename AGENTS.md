# 리포지토리 가이드라인
Emotion Diary는 깔끔한 TypeScript/React 스택으로 감정 기록 경험을 제공하는 것을 목표로 합니다. 아래 지침을 따르면 신규 기여자도 빠르고 안전하게 반복 작업을 진행할 수 있습니다.

## 프로젝트 구조 및 모듈 구성
애플리케이션 코드는 모두 `src/`에 배치합니다. 기능 단위 작업은 `src/features/<feature-name>`(예: `src/features/diary`), 공용 UI는 `src/components`, 재사용 가능 유틸리티는 `src/lib`, 전역 상태는 `src/state`에 둡니다. 실행 트리를 `tests/` 안에 그대로 반영해(`tests/features/diary/DiaryEditor.spec.tsx`) 테스트 탐색을 간단히 유지합니다. 정적 자산(아이콘, 카피, 샘플 기록)은 `public/assets`, 장문의 문서와 다이어그램은 `docs/`에 배치하고, 구조가 바뀌면 루트 `README.md`를 갱신하십시오.

## 빌드·테스트·개발 명령어
프로젝트 스캐폴드가 추가되면 `package.json`에 npm 스크립트를 정의합니다.
- `npm install`: 의존성을 설치합니다.
- `npm run dev`: Vite 개발 서버를 열고 핫 리로드를 제공합니다.
- `npm run build`: 프로덕션 번들을 `dist/`로 생성합니다.
- `npm run lint`: ESLint와 Prettier 검사를 실행합니다.
- `npm run format`: Prettier를 적용해 스테이징된 파일을 정렬합니다.

## 코딩 스타일 및 네이밍 규칙
TypeScript는 strict 모드로 사용합니다. 들여쓰기는 두 칸을 기본으로 하고, 파일당 React 컴포넌트는 하나로 제한합니다. 컴포넌트는 파스칼 케이스(`DiaryEditor.tsx`), 함수는 카멜 케이스, 환경 변수는 대문자 스네이크 케이스를 따릅니다. 새 훅은 `src/hooks/useX.ts`에 배치합니다. PR을 열기 전에 `npm run lint`를 실행하고 `.prettierrc`가 구성되어 있는지 확인하십시오.

## 테스트 가이드라인
Vitest와 React Testing Library를 사용합니다. 단위 테스트 파일은 `*.spec.ts` 또는 `*.spec.tsx`로 명명하고, 통합 테스트는 `tests/integration/`에 둡니다. 분기 커버리지는 최소 85% 이상을 유지하고 `npm run test -- --coverage`로 확인합니다. 스냅샷 테스트는 `tests/snapshots/`에 저장하며, UI 변경이 의도적일 때 `npm run test:update`로 새로 생성합니다.

## 커밋 및 풀 리퀘스트 가이드라인
Git 히스토리에서 보이는 것처럼 Conventional Commits를 따릅니다(예: `chore: initialize repository`). 메시지는 명확한 스코프를 유지합니다(`feat: add mood timeline reducer`). 모든 PR에는 간결한 설명, 연관 이슈 링크(예: `Closes #12`), 테스트 메모, UI 변경 시 스크린샷 또는 녹화본을 첨부합니다. CI가 통과한 후 리뷰를 요청하고, 위험 요소는 댓글로 메모해 리뷰어가 빠르게 파악하도록 돕습니다.

## 환경 및 구성 관리
비공개 비밀 값은 `.env.local`에 저장하고 필요한 키는 `.env.example`에 문서화합니다. 실제 자격 증명은 절대 커밋하지 마십시오. 새로운 설정 플래그를 도입할 때는 `docs/configuration.md`에 목적을 기록하고, 팀원이 환경을 준비하는 데 필요한 값을 안내하십시오.

# 프로젝트 가이드라인: 미니멀리즘 감성 일기장 (Vibe Diary)

## 1. 프로젝트 개요
- 이 프로젝트는 사용자의 감정에 따라 UI가 동적으로 변하는 미니멀한 웹 일기장입니다.
- 핵심 가치는 '단순함'과 '감성적 경험'입니다. 모든 기능은 이 원칙을 따라야 합니다.
- 데이터는 서버 없이 `localStorage`에만 저장합니다.

## 2. 디자인 시스템
- **아이콘 라이브러리:** `Feather Icons`만 사용해주세요. 아이콘 크기는 24px을 기본으로 합니다.
- **폰트:** 'Pretendard' 웹 폰트를 사용해주세요. 본문 16px, 날짜 14px 입니다.
- **애니메이션:** 모든 색상 및 테마 변경은 `transition: all 0.5s ease-in-out;` CSS 속성을 적용하여 부드럽게 표현해주세요.

## 3. 감정 테마 규칙 (매우 중요!)
- 사용자가 감정을 선택하면, 아래 규칙에 따라 앱 전체의 배경색과 텍스트 색상을 변경해야 합니다.
- `happy`: 배경 `#FFFBEB`, 텍스트 `#F59E0B`
- `sad`: 배경 `#EFF6FF`, 텍스트 `#3B82F6`
- `calm`: 배경 `#F0FDF4`, 텍스트 `#16A34A`
- `angry`: 배경 `#FEF2F2`, 텍스트 `#EF4444`
- `neutral`: 배경 `#F9FAFB`, 텍스트 `#6B7280`

## 4. 컴포넌트 구조
- `src/components/` 폴더에 컴포넌트를 만들어주세요.
- `EmotionPicker.tsx`: 5개의 감정 아이콘을 표시하고 선택 이벤트를 처리합니다.
- `DiaryEditor.tsx`: 날짜 표시, `EmotionPicker`, 텍스트 입력을 포함하는 메인 편집기입니다.
- `HistoryList.tsx`: 과거 일기 목록을 표시하는 컴포넌트입니다.

## 5. 데이터 구조
- `localStorage`에 `vibeDiaryData` 라는 키로 데이터를 저장해주세요.
- 데이터 형식은 아래와 같은 객체 배열입니다.
  `{ id: "YYYY-MM-DD", date: number, emotion: string, text: string }`
- 일기는 300ms `debounce`를 적용하여 자동 저장해주세요.
