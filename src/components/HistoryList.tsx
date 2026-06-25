import type { DiaryEntry } from '../lib/diaryStorage';
import { emotionThemes } from '../lib/emotions';

type HistoryListProps = {
  entries: DiaryEntry[];
  selectedEntryId: string;
  onSelect: (entry: DiaryEntry) => void;
};

const listDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});

export function HistoryList({ entries, selectedEntryId, onSelect }: HistoryListProps) {
  return (
    <aside className="history" aria-label="과거 일기">
      <h2>지난 기록</h2>
      {entries.length === 0 ? (
        <p className="empty-history">아직 남겨진 기록이 없습니다.</p>
      ) : (
        <ul>
          {entries.map((entry) => {
            const theme = emotionThemes[entry.emotion];
            const Icon = theme.Icon;
            const preview = entry.text.trim() || '아직 적힌 내용이 없습니다.';

            return (
              <li key={entry.id}>
                <button
                  className="history-item"
                  data-selected={entry.id === selectedEntryId}
                  onClick={() => onSelect(entry)}
                  type="button"
                >
                  <Icon aria-hidden="true" color={theme.text} size={24} strokeWidth={1.8} />
                  <span>
                    <strong>{listDateFormatter.format(new Date(entry.date))}</strong>
                    <small>{preview}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
