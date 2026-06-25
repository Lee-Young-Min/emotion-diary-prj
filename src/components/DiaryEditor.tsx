import { EmotionPicker } from './EmotionPicker';
import type { DiaryEntry } from '../lib/diaryStorage';
import type { Emotion } from '../lib/emotions';
import { emotionThemes } from '../lib/emotions';

type DiaryEditorProps = {
  entry: DiaryEntry;
  onChange: (entry: DiaryEntry) => void;
};

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

export function DiaryEditor({ entry, onChange }: DiaryEditorProps) {
  const selectedTheme = emotionThemes[entry.emotion];

  function updateEmotion(emotion: Emotion): void {
    onChange({ ...entry, emotion });
  }

  function updateText(text: string): void {
    onChange({ ...entry, text });
  }

  return (
    <section className="diary-editor" aria-label="일기 작성">
      <p className="diary-date">{dateFormatter.format(new Date(entry.date))}</p>
      <EmotionPicker selectedEmotion={entry.emotion} onSelect={updateEmotion} />
      <textarea
        aria-label="오늘의 생각"
        className="diary-textarea"
        onChange={(event) => updateText(event.target.value)}
        placeholder="오늘 마음에 남은 생각을 적어보세요."
        spellCheck="false"
        style={{ color: selectedTheme.text }}
        value={entry.text}
      />
      <p className="save-state">자동 저장됨</p>
    </section>
  );
}
