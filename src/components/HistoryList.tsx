import { useMemo, useState } from 'react';
import type { DiaryEntry } from '../lib/diaryStorage';
import { emotionThemes } from '../lib/emotions';

type HistoryListProps = {
  entries: DiaryEntry[];
  filePath: string;
  selectedEntryId: string;
  onSaveFile: () => void;
  onSelect: (entry: DiaryEntry) => void;
};

const listDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});

const oneDayMs = 24 * 60 * 60 * 1000;

function getRecentBoundary(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime() - oneDayMs * 6;
}

function getDateBoundary(value: string, endOfDay = false): number | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date.getTime();
}

function matchesDateRange(entry: DiaryEntry, startDate: string, endDate: string): boolean {
  const startBoundary = getDateBoundary(startDate);
  const endBoundary = getDateBoundary(endDate, true);

  return (!startBoundary || entry.date >= startBoundary) && (!endBoundary || entry.date <= endBoundary);
}

function renderEntry(entry: DiaryEntry, selectedEntryId: string, onSelect: (entry: DiaryEntry) => void) {
  const theme = emotionThemes[entry.emotion];
  const preview = entry.text.trim() || '아직 적힌 내용이 없습니다.';

  return (
    <li key={entry.id}>
      <button
        className="history-item"
        data-selected={entry.id === selectedEntryId}
        onClick={() => onSelect(entry)}
        type="button"
      >
        <span aria-hidden="true" className="history-face" style={{ color: theme.text }}>
          {theme.face}
        </span>
        <span>
          <strong>{listDateFormatter.format(new Date(entry.date))}</strong>
          <small>{preview}</small>
        </span>
      </button>
    </li>
  );
}

export function HistoryList({ entries, filePath, selectedEntryId, onSaveFile, onSelect }: HistoryListProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const recentBoundary = useMemo(() => getRecentBoundary(), []);
  const recentEntries = useMemo(() => entries.filter((entry) => entry.date >= recentBoundary), [entries, recentBoundary]);
  const olderEntries = useMemo(() => entries.filter((entry) => entry.date < recentBoundary), [entries, recentBoundary]);
  const hasDateRange = startDate.length > 0 || endDate.length > 0;
  const searchResults = useMemo(
    () => olderEntries.filter((entry) => matchesDateRange(entry, startDate, endDate)),
    [olderEntries, startDate, endDate],
  );

  return (
    <aside className="history" aria-label="과거 일기">
      <div className="history-header">
        <h2>최근 7일 기록</h2>
        <button className="file-save-button" onClick={onSaveFile} type="button">
          프로젝트 파일 저장
        </button>
      </div>
      <p className="file-location">{filePath}에 자동 저장됩니다.</p>
      {recentEntries.length === 0 ? (
        <p className="empty-history">아직 남겨진 기록이 없습니다.</p>
      ) : (
        <ul>{recentEntries.map((entry) => renderEntry(entry, selectedEntryId, onSelect))}</ul>
      )}
      <div className="history-range">
        <span>이전 기록 기간 검색</span>
        <input
          aria-label="검색 시작일"
          onChange={(event) => setStartDate(event.target.value)}
          type="date"
          value={startDate}
        />
        <input
          aria-label="검색 종료일"
          onChange={(event) => setEndDate(event.target.value)}
          type="date"
          value={endDate}
        />
      </div>
      {hasDateRange && (
        searchResults.length > 0 ? (
          <ul>{searchResults.map((entry) => renderEntry(entry, selectedEntryId, onSelect))}</ul>
        ) : (
          <p className="empty-history">해당 기간의 이전 기록이 없습니다.</p>
        )
      )}
    </aside>
  );
}
